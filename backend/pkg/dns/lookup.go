package dns

import (
	"fmt"
	"net"
	"strings"
)

// RecordType represents a DNS record type
type RecordType string

const (
	A     RecordType = "A"
	AAAA  RecordType = "AAAA"
	CNAME RecordType = "CNAME"
	MX    RecordType = "MX"
	TXT   RecordType = "TXT"
	NS    RecordType = "NS"
	SOA   RecordType = "SOA"
)

// DNSRecord represents a single DNS record
type DNSRecord struct {
	Type  RecordType `json:"type"`
	Name  string     `json:"name"`
	Value string     `json:"value"`
	TTL   uint32     `json:"ttl,omitempty"`
}

// DNSResult represents the result of a DNS lookup
type DNSResult struct {
	Domain  string      `json:"domain"`
	Records []DNSRecord `json:"records"`
	Error   string      `json:"error,omitempty"`
}

// LookupDNS performs DNS lookups for the specified domain
func LookupDNS(domain string) DNSResult {
	result := DNSResult{
		Domain:  domain,
		Records: []DNSRecord{},
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

	// A Records (IPv4)
	ips, err := net.LookupIP(domain)
	if err == nil {
		for _, ip := range ips {
			if ipv4 := ip.To4(); ipv4 != nil {
				result.Records = append(result.Records, DNSRecord{
					Type:  A,
					Name:  domain,
					Value: ipv4.String(),
				})
			}
		}
	}

	// AAAA Records (IPv6)
	for _, ip := range ips {
		if ipv4 := ip.To4(); ipv4 == nil {
			result.Records = append(result.Records, DNSRecord{
				Type:  AAAA,
				Name:  domain,
				Value: ip.String(),
			})
		}
	}

	// CNAME Records
	cname, err := net.LookupCNAME(domain)
	if err == nil && cname != domain+"." {
		result.Records = append(result.Records, DNSRecord{
			Type:  CNAME,
			Name:  domain,
			Value: strings.TrimSuffix(cname, "."),
		})
	}

	// MX Records
	mxRecords, err := net.LookupMX(domain)
	if err == nil {
		for _, mx := range mxRecords {
			result.Records = append(result.Records, DNSRecord{
				Type:  MX,
				Name:  domain,
				Value: fmt.Sprintf("%s (priority: %d)", strings.TrimSuffix(mx.Host, "."), mx.Pref),
			})
		}
	}

	// TXT Records
	txtRecords, err := net.LookupTXT(domain)
	if err == nil {
		for _, txt := range txtRecords {
			result.Records = append(result.Records, DNSRecord{
				Type:  TXT,
				Name:  domain,
				Value: txt,
			})
		}
	}

	// NS Records
	nsRecords, err := net.LookupNS(domain)
	if err == nil {
		for _, ns := range nsRecords {
			result.Records = append(result.Records, DNSRecord{
				Type:  NS,
				Name:  domain,
				Value: strings.TrimSuffix(ns.Host, "."),
			})
		}
	}

	// If no records were found, set an error
	if len(result.Records) == 0 {
		result.Error = "No DNS records found or error occurred during lookup"
	}

	return result
}