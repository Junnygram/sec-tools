package whois

import (
	"fmt"
	"io"
	"net"
	"strings"
	"time"
)

// WhoisResult represents the structured result of a WHOIS lookup
type WhoisResult struct {
	Domain            string `json:"domain"`
	Raw               string `json:"raw"`
	Registrar         string `json:"registrar"`
	RegistrationDate  string `json:"registrationDate"`
	ExpirationDate    string `json:"expirationDate"`
	NameServers       string `json:"nameServers"`
	Status            string `json:"status"`
	Error             string `json:"error,omitempty"`
}

// extractField extracts a field value from raw WHOIS data
func extractField(raw, fieldName string) string {
	lines := strings.Split(raw, "\n")
	for _, line := range lines {
		line = strings.TrimSpace(line)
		if strings.HasPrefix(strings.ToLower(line), strings.ToLower(fieldName)) {
			parts := strings.SplitN(line, ":", 2)
			if len(parts) == 2 {
				return strings.TrimSpace(parts[1])
			}
		}
	}
	return ""
}

// LookupDomain performs a WHOIS lookup for the specified domain
func LookupDomain(domain string) WhoisResult {
	result := WhoisResult{
		Domain: domain,
	}

	// Basic validation
	if domain == "" {
		result.Error = "Domain cannot be empty"
		return result
	}

	// Remove protocol prefixes if present
	domain = strings.TrimPrefix(domain, "http://")
	domain = strings.TrimPrefix(domain, "https://")
	
	// Extract domain from URL if needed
	if parts := strings.Split(domain, "/"); len(parts) > 1 {
		domain = parts[0]
	}

	// Remove www. prefix if present
	domain = strings.TrimPrefix(domain, "www.")

	// Determine WHOIS server based on TLD
	var whoisServer string
	if strings.HasSuffix(domain, ".com") || strings.HasSuffix(domain, ".net") || strings.HasSuffix(domain, ".edu") {
		whoisServer = "whois.verisign-grs.com"
	} else if strings.HasSuffix(domain, ".org") {
		whoisServer = "whois.pir.org"
	} else if strings.HasSuffix(domain, ".info") {
		whoisServer = "whois.afilias.net"
	} else if strings.HasSuffix(domain, ".io") {
		whoisServer = "whois.nic.io"
	} else if strings.HasSuffix(domain, ".co") {
		whoisServer = "whois.nic.co"
	} else if strings.HasSuffix(domain, ".ai") {
		whoisServer = "whois.nic.ai"
	} else if strings.HasSuffix(domain, ".dev") {
		whoisServer = "whois.nic.dev"
	} else {
		// Default to IANA for other TLDs
		whoisServer = "whois.iana.org"
	}

	// Connect to WHOIS server
	conn, err := net.DialTimeout("tcp", whoisServer+":43", 10*time.Second)
	if err != nil {
		result.Error = fmt.Sprintf("Failed to connect to WHOIS server: %s", err.Error())
		return result
	}
	defer conn.Close()

	// Send query
	conn.Write([]byte(domain + "\r\n"))

	// Read response
	buffer := make([]byte, 10240) // 10KB buffer
	n, err := conn.Read(buffer)
	if err != nil && err != io.EOF {
		result.Error = fmt.Sprintf("Failed to read WHOIS response: %s", err.Error())
		return result
	}

	rawData := string(buffer[:n])
	result.Raw = rawData

	// Extract common fields
	result.Registrar = extractField(rawData, "Registrar:")
	result.RegistrationDate = extractField(rawData, "Creation Date:")
	if result.RegistrationDate == "" {
		result.RegistrationDate = extractField(rawData, "Created Date:")
	}
	
	result.ExpirationDate = extractField(rawData, "Registry Expiry Date:")
	if result.ExpirationDate == "" {
		result.ExpirationDate = extractField(rawData, "Expiration Date:")
	}
	
	result.NameServers = extractField(rawData, "Name Server:")
	result.Status = extractField(rawData, "Domain Status:")

	// If we got referred to another WHOIS server, follow the referral
	if result.Registrar == "" && strings.Contains(rawData, "whois:") {
		referralServer := extractField(rawData, "whois:")
		if referralServer != "" {
			// Connect to referral server
			conn, err := net.DialTimeout("tcp", referralServer+":43", 10*time.Second)
			if err == nil {
				defer conn.Close()
				conn.Write([]byte(domain + "\r\n"))
				n, err := conn.Read(buffer)
				if err == nil || err == io.EOF {
					rawData = string(buffer[:n])
					result.Raw = rawData
					
					// Extract fields from referral response
					result.Registrar = extractField(rawData, "Registrar:")
					result.RegistrationDate = extractField(rawData, "Creation Date:")
					if result.RegistrationDate == "" {
						result.RegistrationDate = extractField(rawData, "Created Date:")
					}
					
					result.ExpirationDate = extractField(rawData, "Registry Expiry Date:")
					if result.ExpirationDate == "" {
						result.ExpirationDate = extractField(rawData, "Expiration Date:")
					}
					
					result.NameServers = extractField(rawData, "Name Server:")
					result.Status = extractField(rawData, "Domain Status:")
				}
			}
		}
	}

	return result
}