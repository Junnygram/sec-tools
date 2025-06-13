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
	mux := http.NewServeMux()

	mux.HandleFunc("/check", handleCheckUsername)
	mux.HandleFunc("/whois", handleWhoisLookup)
	mux.HandleFunc("/dns", handleDNSLookup)
	mux.HandleFunc("/ssl", handleSSLCheck)
	mux.HandleFunc("/port", handlePortScan)
	mux.HandleFunc("/phishing", handlePhishingCheck)

	// ✅ Wrap all routes with CORS middleware
	wrappedMux := corsMiddleware(mux)

	port := ":8080"
	log.Printf("🚀 Starting server on %s\n", port)
	log.Fatal(http.ListenAndServe(port, wrappedMux))
}

// ✅ Global CORS Middleware
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		setCorsHeaders(w, r)

		// Handle preflight requests globally
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// ✅ Set CORS headers for allowed origins
func setCorsHeaders(w http.ResponseWriter, r *http.Request) {
	origin := r.Header.Get("Origin")
	allowedOrigins := map[string]bool{
		"http://localhost:3000":      true,
		"http://44.196.112.117:3000": true,
	}

	if allowedOrigins[origin] {
		w.Header().Set("Access-Control-Allow-Origin", origin)
	}

	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
}

// 🔍 Check username availability
func handleCheckUsername(w http.ResponseWriter, r *http.Request) {
	user := r.URL.Query().Get("user")
	if user == "" {
		http.Error(w, "Missing 'user' query param", http.StatusBadRequest)
		return
	}

	results := username.CheckAllPlatforms(user)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}

// 🌐 WHOIS lookup
func handleWhoisLookup(w http.ResponseWriter, r *http.Request) {
	domain := r.URL.Query().Get("domain")
	if domain == "" {
		http.Error(w, "Missing 'domain' query param", http.StatusBadRequest)
		return
	}

	result := whois.LookupDomain(domain)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

// 📡 DNS lookup
func handleDNSLookup(w http.ResponseWriter, r *http.Request) {
	domain := r.URL.Query().Get("domain")
	if domain == "" {
		http.Error(w, "Missing 'domain' query param", http.StatusBadRequest)
		return
	}

	result := dns.LookupDNS(domain)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

// 🔐 SSL/TLS check
func handleSSLCheck(w http.ResponseWriter, r *http.Request) {
	domain := r.URL.Query().Get("domain")
	if domain == "" {
		http.Error(w, "Missing 'domain' query param", http.StatusBadRequest)
		return
	}

	result := ssl.CheckSSL(domain)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

// 🔌 Port scanning
func handlePortScan(w http.ResponseWriter, r *http.Request) {
	host := r.URL.Query().Get("host")
	if host == "" {
		http.Error(w, "Missing 'host' query param", http.StatusBadRequest)
		return
	}

	portsParam := r.URL.Query().Get("ports")
	timeoutParam := r.URL.Query().Get("timeout")

	var ports []int
	if portsParam != "" {
		for _, portStr := range strings.Split(portsParam, ",") {
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

// 🧠 Phishing check
func handlePhishingCheck(w http.ResponseWriter, r *http.Request) {
	phishing.HandlePhishingCheck(w, r)
}
