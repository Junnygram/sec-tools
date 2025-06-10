package ssl

import (
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"net"
	"strings"
	"time"
)

// CertificateInfo represents SSL certificate information
type CertificateInfo struct {
	Subject            string    `json:"subject"`
	Issuer             string    `json:"issuer"`
	SerialNumber       string    `json:"serialNumber"`
	Version            int       `json:"version"`
	IsCA               bool      `json:"isCA"`
	NotBefore          time.Time `json:"notBefore"`
	NotAfter           time.Time `json:"notAfter"`
	DaysUntilExpiry    int       `json:"daysUntilExpiry"`
	DNSNames           []string  `json:"dnsNames"`
	SignatureAlgorithm string    `json:"signatureAlgorithm"`
}

// SSLResult represents the result of an SSL certificate check
type SSLResult struct {
	Domain      string           `json:"domain"`
	Valid       bool             `json:"valid"`
	Certificate CertificateInfo  `json:"certificate"`
	ChainCerts  []CertificateInfo `json:"chainCerts"`
	Error       string           `json:"error,omitempty"`
}

// CheckSSL checks the SSL certificate for the specified domain
func CheckSSL(domain string) SSLResult {
	result := SSLResult{
		Domain: domain,
		Valid:  false,
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

	// Configure TLS connection
	dialer := &net.Dialer{
		Timeout: 10 * time.Second,
	}

	conn, err := tls.DialWithDialer(dialer, "tcp", domain+":443", &tls.Config{
		InsecureSkipVerify: true, // We're checking the cert ourselves
	})

	if err != nil {
		result.Error = fmt.Sprintf("Failed to connect: %s", err.Error())
		return result
	}
	defer conn.Close()

	// Get certificate chain
	certs := conn.ConnectionState().PeerCertificates
	if len(certs) == 0 {
		result.Error = "No certificates found"
		return result
	}

	// Process the leaf certificate (the server's certificate)
	cert := certs[0]
	now := time.Now()
	
	// Check if certificate is valid for the domain
	result.Valid = validateCertificateForDomain(cert, domain)

	// Extract certificate information
	result.Certificate = extractCertificateInfo(cert, now)

	// Extract chain certificates information
	for i := 1; i < len(certs); i++ {
		chainCert := extractCertificateInfo(certs[i], now)
		result.ChainCerts = append(result.ChainCerts, chainCert)
	}

	return result
}

// validateCertificateForDomain checks if the certificate is valid for the given domain
func validateCertificateForDomain(cert *x509.Certificate, domain string) bool {
	// Check if the certificate has expired
	now := time.Now()
	if now.Before(cert.NotBefore) || now.After(cert.NotAfter) {
		return false
	}

	// Check if the domain matches any of the certificate's DNS names
	if cert.Subject.CommonName == domain {
		return true
	}

	for _, dnsName := range cert.DNSNames {
		if matchDomain(dnsName, domain) {
			return true
		}
	}

	return false
}

// matchDomain checks if a domain matches a certificate DNS name, including wildcard matches
func matchDomain(pattern, domain string) bool {
	if pattern == domain {
		return true
	}

	// Handle wildcard certificates
	if strings.HasPrefix(pattern, "*.") {
		patternParts := strings.Split(pattern, ".")
		domainParts := strings.Split(domain, ".")

		// Wildcard only matches one level
		if len(patternParts) != len(domainParts) {
			return false
		}

		// Skip the first part (the wildcard) and compare the rest
		for i := 1; i < len(patternParts); i++ {
			if patternParts[i] != domainParts[i] {
				return false
			}
		}

		return true
	}

	return false
}

// extractCertificateInfo extracts information from an x509 certificate
func extractCertificateInfo(cert *x509.Certificate, now time.Time) CertificateInfo {
	daysUntilExpiry := int(cert.NotAfter.Sub(now).Hours() / 24)

	return CertificateInfo{
		Subject:            cert.Subject.CommonName,
		Issuer:             cert.Issuer.CommonName,
		SerialNumber:       cert.SerialNumber.String(),
		Version:            cert.Version,
		IsCA:               cert.IsCA,
		NotBefore:          cert.NotBefore,
		NotAfter:           cert.NotAfter,
		DaysUntilExpiry:    daysUntilExpiry,
		DNSNames:           cert.DNSNames,
		SignatureAlgorithm: cert.SignatureAlgorithm.String(),
	}
}