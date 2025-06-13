# Security Tools Suite - Implementation Guide

This document explains the exact implementation of the Security Tools Suite, focusing on how the backend code works and interacts with the frontend.

## Project Structure

```
sec-tools/
├── backend/
│   ├── cmd/
│   │   └── api/
│   │       └── main.go       # Main application entry point
│   └── pkg/
│       ├── username/         # Username checker package
│       ├── whois/            # WHOIS lookup package
│       ├── dns/              # DNS lookup package
│       ├── ssl/              # SSL certificate checker package
│       ├── port/             # Port scanner package
│       └── phishing/         # Phishing detector package
└── frontend/
    ├── public/               # Static assets
    └── src/
        ├── app/              # Next.js app directory
        │   ├── userchecker/  # Username checker page
        │   ├── whoislookup/  # WHOIS lookup page
        │   ├── dnslookup/    # DNS lookup page
        │   ├── sslchecker/   # SSL checker page
        │   └── portscanner/  # Port scanner page
        └── component/        # React components
            └── lib/          # Utility functions and services
```

## Backend Implementation

The backend is implemented in Go and follows a modular approach with separate packages for each security tool.

### Main Application (main.go)

The main.go file serves as the entry point for the backend API:

```go
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
```

### CORS Handling

All endpoints implement CORS headers to allow cross-origin requests:

```go
// setCorsHeaders sets CORS headers for all responses
func setCorsHeaders(w http.ResponseWriter) {
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
```

## API Endpoints Implementation

### 1. Username Checker Endpoint

```go
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
```

**Username Checker Implementation (pkg/username/check.go):**

```go
package username

import (
    "net/http"
)

type CheckResult struct {
    Platform string `json:"platform"`
    URL      string `json:"url"`
    Status   string `json:"status"`
    Code     int    `json:"code"`
}

var platforms = map[string]string{
    "Instagram": "https://www.instagram.com/",
    "X":         "https://twitter.com/",
    "Facebook":  "https://www.facebook.com/",
    "YouTube":   "https://www.youtube.com/user/",
    "Reddit":    "https://www.reddit.com/user/",
    "GitHub":    "https://www.github.com/",
    "Twitch":    "https://www.twitch.tv/",
    "Pinterest": "https://www.pinterest.com/",
    "TikTok":    "https://www.tiktok.com/@",
    "Flickr":    "https://www.flickr.com/photos/",
}

func CheckAllPlatforms(user string) []CheckResult {
    results := []CheckResult{}

    for platform, baseURL := range platforms {
        url := baseURL + user

        resp, err := http.Get(url)
        status := "unknown"
        code := 0

        if err == nil {
            defer resp.Body.Close()
            code = resp.StatusCode

            switch code {
            // case 200:
            //  status = "unavailable"
            case 404:
                status = "available"
            default:
                status = "unavailable"
            }
        }

        results = append(results, CheckResult{
            Platform: platform,
            URL:      url,
            Status:   status,
            Code:     code,
        })
    }

    return results
}
```

### 2. WHOIS Lookup Endpoint

```go
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
```

### 3. DNS Lookup Endpoint

```go
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
```

### 4. SSL Certificate Checker Endpoint

```go
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
```

### 5. Port Scanner Endpoint

```go
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
```

### 6. Phishing Detector Endpoint

```go
func handlePhishingCheck(w http.ResponseWriter, r *http.Request) {
    setCorsHeaders(w)

    if handleOptionsRequest(w, r) {
        return
    }

    // Use the handler from the phishing package
    phishing.HandlePhishingCheck(w, r)
}
```

## Data Flow

### 1. Username Checker Flow

1. User enters a username in the frontend
2. Frontend makes a GET request to `/check?user={username}`
3. `handleCheckUsername` function receives the request
4. Function extracts the username from the query parameters
5. Function calls `username.CheckAllPlatforms(user)`
6. For each platform in the predefined list:
   - An HTTP GET request is made to the platform URL with the username
   - Response status code is analyzed (404 indicates username is available)
   - Results are collected in a CheckResult struct
7. Results are returned as JSON to the frontend
8. Frontend displays availability status for each platform

### 2. WHOIS Lookup Flow

1. User enters a domain in the frontend
2. Frontend makes a GET request to `/whois?domain={domain}`
3. `handleWhoisLookup` function receives the request
4. Function extracts the domain from the query parameters
5. Function calls `whois.LookupDomain(domain)`
6. The whois package:
   - Connects to the appropriate WHOIS server
   - Sends the domain query
   - Parses the response into structured data
7. Results are returned as JSON to the frontend
8. Frontend displays the domain registration details

### 3. DNS Lookup Flow

1. User enters a domain in the frontend
2. Frontend makes a GET request to `/dns?domain={domain}`
3. `handleDNSLookup` function receives the request
4. Function extracts the domain from the query parameters
5. Function calls `dns.LookupDNS(domain)`
6. The dns package:
   - Performs lookups for different DNS record types
   - Collects all records into a structured response
7. Results are returned as JSON to the frontend
8. Frontend displays the different record types and values

### 4. SSL Certificate Checker Flow

1. User enters a domain in the frontend
2. Frontend makes a GET request to `/ssl?domain={domain}`
3. `handleSSLCheck` function receives the request
4. Function extracts the domain from the query parameters
5. Function calls `ssl.CheckSSL(domain)`
6. The ssl package:
   - Establishes a TLS connection to the domain
   - Retrieves and validates the certificate
   - Extracts certificate details
7. Results are returned as JSON to the frontend
8. Frontend displays certificate details and security status

### 5. Port Scanner Flow

1. User enters a host and optional parameters in the frontend
2. Frontend makes a GET request to `/port?host={host}&ports={ports}&timeout={timeout}`
3. `handlePortScan` function receives the request
4. Function extracts parameters and calls the appropriate scan function
5. The port package:
   - Scans the specified ports concurrently
   - Collects results with port status and service information
6. Results are returned as JSON to the frontend
7. Frontend displays open, closed, and filtered ports

### 6. Phishing Detector Flow

1. User enters a URL in the frontend
2. Frontend makes a POST request to `/phishing` with the URL in the request body
3. `handlePhishingCheck` function receives the request
4. Function delegates to `phishing.HandlePhishingCheck(w, r)`
5. The phishing package:
   - Analyzes the URL for phishing indicators
   - Calculates a risk score
6. Results are returned as JSON to the frontend
7. Frontend displays the risk assessment and detailed analysis

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:

### Deployment Workflow

1. **Checkout code** from the repository
2. **Configure AWS credentials** for deployment
3. **Setup SSH access** to the EC2 instance
4. **Verify Docker installation** on the GitHub Actions runner
5. **Install Trivy** security scanner
6. **Build Docker images** for scanning
7. **Scan images** for security vulnerabilities
8. **Send email notification** with scan reports
9. **Deploy to EC2** by:
   - Installing Docker and Docker Compose if needed
   - Cloning the repository
   - Building and starting the Docker containers
   - Displaying the application URLs

### Infrastructure Workflow

1. **Checkout code** from the repository
2. **Setup Terraform** for infrastructure management
3. **Initialize Terraform** with S3 backend
4. **Validate Terraform configuration**
5. **Plan infrastructure changes**
6. **Configure AWS credentials**
7. **Setup SSH key** in AWS
8. **Apply Terraform changes** to create/update EC2 instance
9. **Output EC2 information** for deployment

This workflow ensures that the application is securely deployed with proper vulnerability scanning and infrastructure management.