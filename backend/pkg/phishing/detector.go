package phishing

import (
	"fmt"
	"math/rand"
	"net/url"
	"regexp"
	"strings"
	"time"
)

// Request represents the incoming request structure
type Request struct {
	URL string `json:"url"`
}

// Result represents the result of the phishing check
type Result struct {
	Safe            bool     `json:"safe"`
	Score           int      `json:"score"`
	Reasons         []string `json:"reasons"`
	DatabaseMatches []string `json:"databaseMatches,omitempty"`
	DomainAge       string   `json:"domainAge,omitempty"`
	Error           string   `json:"error,omitempty"`
}

// Initialize random seed
func init() {
	rand.Seed(time.Now().UnixNano())
}

// AnalyzeURL checks a URL for phishing indicators and returns a risk assessment
func AnalyzeURL(urlStr string) (Result, error) {
	result := Result{
		Safe:            true,
		Score:           0,
		Reasons:         []string{},
		DatabaseMatches: []string{},
	}

	// Parse the URL
	parsedURL, err := url.Parse(urlStr)
	if err != nil {
		return result, err
	}

	domain := parsedURL.Hostname()

	// Check 1: URL length
	if len(urlStr) > 100 {
		result.Reasons = append(result.Reasons, "Unusually long URL")
		result.Score += 10
	}

	// Check 2: Special characters in domain
	specialChars := regexp.MustCompile(`[^\w.-]`)
	if specialChars.MatchString(domain) {
		result.Reasons = append(result.Reasons, "Domain contains unusual characters")
		result.Score += 15
	}

	// Check 3: Number of subdomains
	subdomainCount := len(strings.Split(domain, ".")) - 2
	if subdomainCount > 3 {
		result.Reasons = append(result.Reasons, "Excessive number of subdomains")
		result.Score += 15
	}

	// Check 4: IP address as hostname
	ipRegex := regexp.MustCompile(`^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$`)
	if ipRegex.MatchString(domain) {
		result.Reasons = append(result.Reasons, "URL uses IP address instead of domain name")
		result.Score += 25
	}

	// Check 5: Check for common brands in URL (potential phishing)
	commonBrands := []string{"paypal", "apple", "microsoft", "amazon", "google", "facebook", "instagram"}
	for _, brand := range commonBrands {
		if strings.Contains(domain, brand) && !strings.HasSuffix(domain, "."+brand+".com") {
			result.Reasons = append(result.Reasons, "URL contains \""+brand+"\" but is not the official domain")
			result.Score += 20
			break
		}
	}

	// Check 6: Check for suspicious TLDs
	suspiciousTLDs := []string{"xyz", "top", "club", "online", "site", "info"}
	parts := strings.Split(domain, ".")
	if len(parts) > 0 {
		tld := parts[len(parts)-1]
		for _, suspiciousTLD := range suspiciousTLDs {
			if tld == suspiciousTLD {
				result.Reasons = append(result.Reasons, "URL uses potentially suspicious TLD (."+tld+")")
				result.Score += 10
				break
			}
		}
	}

	// Check 7: Check for URL shorteners
	shortenerDomains := []string{"bit.ly", "tinyurl.com", "goo.gl", "t.co", "is.gd", "cli.gs", "ow.ly"}
	for _, shortener := range shortenerDomains {
		if strings.Contains(domain, shortener) {
			result.Reasons = append(result.Reasons, "URL uses a URL shortening service which can hide the actual destination")
			result.Score += 15
			break
		}
	}

	// Check 8: Check for HTTP instead of HTTPS
	if parsedURL.Scheme == "http" {
		result.Reasons = append(result.Reasons, "URL uses insecure HTTP protocol instead of HTTPS")
		result.Score += 15
	}

	// Simulate domain age check
	randomAge := rand.Intn(1000)
	if randomAge <= 30 {
		result.DomainAge = fmt.Sprintf("%d days (recently registered)", randomAge)
		result.Reasons = append(result.Reasons, "Domain was registered very recently")
		result.Score += 20
	} else {
		result.DomainAge = fmt.Sprintf("%d months", randomAge/30)
	}

	// Simulate database check (for demo purposes)
	if result.Score > 50 {
		// Simulate a match in phishing databases
		databases := []string{"PhishTank", "Google Safe Browsing", "OpenPhish"}
		randomDB := databases[rand.Intn(len(databases))]
		result.DatabaseMatches = append(result.DatabaseMatches, randomDB)
		result.Reasons = append(result.Reasons, "URL found in "+randomDB+" database")
		result.Score += 30
	}

	// Determine if the URL is safe based on the score
	if result.Score >= 30 {
		result.Safe = false
	}

	return result, nil
}