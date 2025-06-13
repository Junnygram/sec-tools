package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/Junnygram/sec-tools/pkg/dns"
	"github.com/Junnygram/sec-tools/pkg/phishing"
	"github.com/Junnygram/sec-tools/pkg/port"
	"github.com/Junnygram/sec-tools/pkg/ssl"
	"github.com/Junnygram/sec-tools/pkg/username"
	"github.com/Junnygram/sec-tools/pkg/whois"
)

func main() {
	http.HandleFunc("/check", handleCheckUsername)
	http.HandleFunc("/whois", handleWhoisLookup)
	http.HandleFunc("/dns", handleDNSLookup)
	http.HandleFunc("/ssl", handleSSLCheck)
	http.HandleFunc("/port", handlePortScan)
	http.HandleFunc("/phishing", handlePhishingCheck)

	port := ":8080"
	log.Printf("🚀 Starting server on %s\n", port)
	log.Fatal(http.ListenAndServe(port, nil))
}

// setCorsHeaders sets CORS headers for all responses
func setCorsHeaders(w http.ResponseWriter) {

	w.Header().Set("Access-Control-Allow-Origin", "44.196.112.117")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

// handleOptionsRequest handles preflight OPTIONS requests
func handleOptionsRequest(w http.ResponseWriter, r *http.Request) bool {
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return true
	}
	return false
}

func handleCheckUsername(w http.ResponseWriter, r *http.Request) {
	setCorsHeaders(w)

	if handleOptionsRequest(w, r) {
		return
	}

	user := r.URL.Query().Get("user")
	if user == "" {
		http.Error(w, "Missing 'user' query param", http.StatusBadRequest)
		return
	}

	results := username.CheckAllPlatforms(user)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}

func handleWhoisLookup(w http.ResponseWriter, r *http.Request) {
	setCorsHeaders(w)

	if handleOptionsRequest(w, r) {
		return
	}

	domain := r.URL.Query().Get("domain")
	if domain == "" {
		http.Error(w, "Missing 'domain' query param", http.StatusBadRequest)
		return
	}

	result := whois.LookupDomain(domain)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func handleDNSLookup(w http.ResponseWriter, r *http.Request) {
	setCorsHeaders(w)

	if handleOptionsRequest(w, r) {
		return
	}

	domain := r.URL.Query().Get("domain")
	if domain == "" {
		http.Error(w, "Missing 'domain' query param", http.StatusBadRequest)
		return
	}

	result := dns.LookupDNS(domain)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func handleSSLCheck(w http.ResponseWriter, r *http.Request) {
	setCorsHeaders(w)

	if handleOptionsRequest(w, r) {
		return
	}

	domain := r.URL.Query().Get("domain")
	if domain == "" {
		http.Error(w, "Missing 'domain' query param", http.StatusBadRequest)
		return
	}

	result := ssl.CheckSSL(domain)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func handlePortScan(w http.ResponseWriter, r *http.Request) {
	setCorsHeaders(w)

	if handleOptionsRequest(w, r) {
		return
	}

	host := r.URL.Query().Get("host")
	if host == "" {
		http.Error(w, "Missing 'host' query param", http.StatusBadRequest)
		return
	}

	// Parse optional parameters
	portsParam := r.URL.Query().Get("ports")
	timeoutParam := r.URL.Query().Get("timeout")

	var ports []int
	if portsParam != "" {
		portStrings := strings.Split(portsParam, ",")
		for _, portStr := range portStrings {
			if p, err := strconv.Atoi(portStr); err == nil && p > 0 && p < 65536 {
				ports = append(ports, p)
			}
		}
	}

	timeout := 2 * time.Second
	if timeoutParam != "" {
		if t, err := strconv.Atoi(timeoutParam); err == nil && t > 0 && t <= 10 {
			timeout = time.Duration(t) * time.Second
		}
	}

	var result port.ScanResult
	if len(ports) > 0 {
		result = port.ScanPorts(host, ports, timeout)
	} else {
		result = port.ScanDefaultPorts(host)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func handlePhishingCheck(w http.ResponseWriter, r *http.Request) {
	setCorsHeaders(w)

	if handleOptionsRequest(w, r) {
		return
	}

	// Use the handler from the phishing package
	phishing.HandlePhishingCheck(w, r)
}
