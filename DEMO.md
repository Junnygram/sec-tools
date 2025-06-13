# Security Tools Suite - Complete Workflow Guide

## Introduction for Beginners

This document explains how our Security Tools Suite works, specifically designed for those new to Go (backend) and Next.js (frontend). I'll explain not just what each tool does, but why I made specific implementation choices that make this project ideal for beginners to understand and extend.

## Project Architecture Overview

I chose a clean separation between frontend and backend for several reasons:

1. **Learning Separation of Concerns**: This architecture teaches beginners how to properly separate UI logic from business logic
2. **Independent Development**: Frontend and backend teams can work independently
3. **Technology-Specific Optimization**: Each part uses the best tools for its job

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  Next.js        │ ───────▶│  Go API         │ ───────▶│  External       │
│  Frontend       │ ◀─────── │  Backend        │ ◀─────── │  Services       │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

## Why Go for Backend?

I chose Go for the backend because:

1. **Simple Syntax**: Go has minimal syntax, making it easier for beginners to learn
2. **Built-in Concurrency**: Go's goroutines make it easy to implement parallel operations (crucial for security tools)
3. **Strong Standard Library**: Most of our security tools use Go's standard library, reducing external dependencies
4. **Compiled Binary**: Results in a single executable that's easy to deploy

## Why Next.js for Frontend?

I chose Next.js because:

1. **React Foundation**: Built on React, which has excellent documentation for beginners
2. **File-Based Routing**: Each tool gets its own page file, making the structure intuitive
3. **Server-Side Rendering**: Improves initial load performance
4. **API Routes**: Could be used for simple backend functionality if needed

## Detailed Workflow Explanations

### 1. Username Checker Tool

#### Frontend (Next.js) Implementation

```jsx
// Simplified version of what happens in the frontend
function UserChecker() {
  const [username, setUsername] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  
  async function checkUsername() {
    setLoading(true);
    try {
      // Simple fetch API call - easy for beginners to understand
      const response = await fetch(`/api/username?username=${username}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div>
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
      <button onClick={checkUsername} disabled={loading}>Check</button>
      {loading && <p>Checking username availability...</p>}
      {results && (
        <div>
          {/* Display results in a simple list */}
          <h2>Results:</h2>
          <ul>
            {Object.entries(results).map(([platform, available]) => (
              <li key={platform}>
                {platform}: {available ? 'Available' : 'Taken'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

**Why I did it this way:**
- Used React hooks (useState) for simple state management - no complex state libraries needed for beginners
- Simple fetch API instead of axios or other libraries to reduce dependencies
- Clear loading states to provide feedback to users
- Straightforward rendering of results

#### Backend (Go) Implementation

```go
// Simplified version of the username checker backend
func UsernameHandler(w http.ResponseWriter, r *http.Request) {
    // Simple query parameter extraction
    username := r.URL.Query().Get("username")
    if username == "" {
        http.Error(w, "Username parameter is required", http.StatusBadRequest)
        return
    }
    
    // Create a map to store results
    results := make(map[string]bool)
    
    // Use a WaitGroup to handle concurrent checks
    var wg sync.WaitGroup
    
    // Mutex to safely update the results map from multiple goroutines
    var mu sync.Mutex
    
    // List of platforms to check
    platforms := []string{"github", "twitter", "instagram", "facebook"}
    
    // Check each platform concurrently
    for _, platform := range platforms {
        wg.Add(1)
        // Launch a goroutine for each platform check
        go func(p string) {
            defer wg.Done()
            
            // Check if username is available on this platform
            available := checkUsernameOnPlatform(username, p)
            
            // Safely update the results map
            mu.Lock()
            results[p] = available
            mu.Unlock()
        }(platform)
    }
    
    // Wait for all checks to complete
    wg.Wait()
    
    // Return results as JSON
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(results)
}
```

**Why I did it this way:**
- Used standard `net/http` package instead of frameworks to keep it simple for beginners
- Implemented concurrency with goroutines and WaitGroup - teaching a fundamental Go concept
- Used mutex for safe concurrent access to the shared map - important concurrency pattern to learn
- Simple JSON response encoding using the standard library

### 2. WHOIS Lookup Tool

#### Frontend (Next.js) Implementation

```jsx
// Simplified version of what happens in the frontend
function WhoisLookup() {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  
  async function lookupDomain() {
    setLoading(true);
    try {
      const response = await fetch(`/api/whois?domain=${domain}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div>
      <input value={domain} onChange={(e) => setDomain(e.target.value)} />
      <button onClick={lookupDomain} disabled={loading}>Lookup</button>
      {loading && <p>Looking up domain information...</p>}
      {results && (
        <div>
          <h2>Domain Information:</h2>
          <div className="result-card">
            <p><strong>Registrar:</strong> {results.registrar}</p>
            <p><strong>Creation Date:</strong> {results.creationDate}</p>
            <p><strong>Expiration Date:</strong> {results.expirationDate}</p>
            <p><strong>Name Servers:</strong></p>
            <ul>
              {results.nameServers.map(ns => <li key={ns}>{ns}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
```

**Why I did it this way:**
- Consistent pattern with other tools for familiarity
- Simple form with controlled input for domain entry
- Structured display of WHOIS information in a card layout
- Error handling pattern that beginners can easily understand

#### Backend (Go) Implementation

```go
// Simplified version of the WHOIS lookup backend
func WhoisHandler(w http.ResponseWriter, r *http.Request) {
    domain := r.URL.Query().Get("domain")
    if domain == "" {
        http.Error(w, "Domain parameter is required", http.StatusBadRequest)
        return
    }
    
    // Check cache first to avoid unnecessary WHOIS queries
    if cachedData := whoisCache.Get(domain); cachedData != nil {
        w.Header().Set("Content-Type", "application/json")
        w.Header().Set("X-Cache", "HIT")
        json.NewEncoder(w).Encode(cachedData)
        return
    }
    
    // Determine the appropriate WHOIS server based on TLD
    server := determineWhoisServer(domain)
    
    // Connect to WHOIS server
    conn, err := net.DialTimeout("tcp", server+":43", 5*time.Second)
    if err != nil {
        http.Error(w, "Failed to connect to WHOIS server", http.StatusInternalServerError)
        return
    }
    defer conn.Close()
    
    // Send query
    conn.Write([]byte(domain + "\r\n"))
    
    // Read response
    buffer := new(bytes.Buffer)
    buffer.ReadFrom(conn)
    response := buffer.String()
    
    // Parse the response into structured data
    data := parseWhoisResponse(response)
    
    // Cache the result with appropriate TTL
    ttl := calculateTTL(data.ExpirationDate)
    whoisCache.Set(domain, data, ttl)
    
    // Return the data
    w.Header().Set("Content-Type", "application/json")
    w.Header().Set("X-Cache", "MISS")
    json.NewEncoder(w).Encode(data)
}
```

**Why I did it this way:**
- Implemented caching to reduce unnecessary WHOIS queries (teaching resource optimization)
- Used net.DialTimeout for connection with timeout to prevent hanging
- Simple TCP connection to port 43 (standard WHOIS port) - teaching networking fundamentals

### 3. DNS Lookup Tool

#### Frontend (Next.js) Implementation

```jsx
function DNSLookup() {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  
  async function lookupDNS() {
    setLoading(true);
    try {
      const response = await fetch(`/api/dns?domain=${domain}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div>
      <input value={domain} onChange={(e) => setDomain(e.target.value)} />
      <button onClick={lookupDNS} disabled={loading}>Lookup DNS</button>
      {loading && <p>Looking up DNS records...</p>}
      {results && (
        <div>
          <h2>DNS Records for {results.domain}</h2>
          
          {results.aRecords.length > 0 && (
            <div className="record-section">
              <h3>A Records (IPv4)</h3>
              <ul>
                {results.aRecords.map((record, i) => (
                  <li key={i}>{record}</li>
                ))}
              </ul>
            </div>
          )}
          
          {results.mxRecords.length > 0 && (
            <div className="record-section">
              <h3>MX Records (Mail)</h3>
              <ul>
                {results.mxRecords.map((record, i) => (
                  <li key={i}>
                    {record.host} (Priority: {record.priority})
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Additional record types displayed similarly */}
        </div>
      )}
    </div>
  );
}
```

**Why I did it this way:**
- Organized display of different DNS record types in collapsible sections
- Clear visual hierarchy for different record types
- Conditional rendering to only show sections with data
- Consistent UI pattern with other tools

#### Backend (Go) Implementation

```go
func DNSHandler(w http.ResponseWriter, r *http.Request) {
    domain := r.URL.Query().Get("domain")
    if domain == "" {
        http.Error(w, "Domain parameter is required", http.StatusBadRequest)
        return
    }
    
    result := DNSResult{
        Domain: domain,
    }
    
    // Look up A records (IPv4)
    if ips, err := net.LookupIP(domain); err == nil {
        for _, ip := range ips {
            if ipv4 := ip.To4(); ipv4 != nil {
                result.ARecords = append(result.ARecords, ipv4.String())
            }
        }
    }
    
    // Look up AAAA records (IPv6)
    if ips, err := net.LookupIP(domain); err == nil {
        for _, ip := range ips {
            if ipv4 := ip.To4(); ipv4 == nil {
                result.AAAARecords = append(result.AAAARecords, ip.String())
            }
        }
    }
    
    // Look up MX records
    if mxs, err := net.LookupMX(domain); err == nil {
        for _, mx := range mxs {
            result.MXRecords = append(result.MXRecords, MXRecord{
                Host:     mx.Host,
                Priority: int(mx.Pref),
            })
        }
    }
    
    // Additional record lookups (TXT, NS, CNAME)
    // ...
    
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(result)
}
```

**Why I did it this way:**
- Used Go's net package for DNS lookups - standard library approach
- Handled each record type separately for clarity
- Graceful error handling for each lookup type
- Structured response for easy frontend consumption

### 4. SSL Certificate Checker Tool

#### Frontend (Next.js) Implementation

```jsx
function SSLChecker() {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  
  async function checkSSL() {
    setLoading(true);
    try {
      const response = await fetch(`/api/ssl?domain=${domain}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div>
      <input value={domain} onChange={(e) => setDomain(e.target.value)} />
      <button onClick={checkSSL} disabled={loading}>Check SSL</button>
      {loading && <p>Checking SSL certificate...</p>}
      {results && (
        <div>
          <h2>SSL Certificate for {results.domain}</h2>
          <div className={`status-badge ${results.valid ? 'valid' : 'invalid'}`}>
            {results.valid ? 'Valid' : 'Invalid'}
          </div>
          
          <div className="certificate-details">
            <p><strong>Issuer:</strong> {results.issuer}</p>
            <p><strong>Valid From:</strong> {new Date(results.notBefore).toLocaleString()}</p>
            <p><strong>Valid Until:</strong> {new Date(results.notAfter).toLocaleString()}</p>
            <p><strong>Days Remaining:</strong> {results.daysRemaining}</p>
            <p><strong>TLS Version:</strong> {results.version}</p>
            <p><strong>Cipher Suite:</strong> {results.cipherSuite}</p>
            
            {results.subjectAltNames.length > 0 && (
              <>
                <p><strong>Subject Alternative Names:</strong></p>
                <ul>
                  {results.subjectAltNames.map((name, i) => (
                    <li key={i}>{name}</li>
                  ))}
                </ul>
              </>
            )}
            
            {results.error && (
              <div className="error-message">
                <p><strong>Error:</strong> {results.error}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

**Why I did it this way:**
- Visual status indicator for certificate validity
- Formatted dates for better readability
- Comprehensive display of certificate details
- Error handling with clear user feedback

#### Backend (Go) Implementation

```go
func SSLHandler(w http.ResponseWriter, r *http.Request) {
    domain := r.URL.Query().Get("domain")
    if domain == "" {
        http.Error(w, "Domain parameter is required", http.StatusBadRequest)
        return
    }
    
    // Ensure domain has port specified
    if !strings.Contains(domain, ":") {
        domain = domain + ":443"
    }
    
    // Configure TLS connection
    config := &tls.Config{
        InsecureSkipVerify: true, // We'll verify manually
    }
    
    // Connect to the server
    conn, err := tls.Dial("tcp", domain, config)
    if err != nil {
        // Return error but in a structured format
        result := SSLResult{
            Domain: strings.Split(domain, ":")[0],
            Valid:  false,
            Error:  "Failed to connect: " + err.Error(),
        }
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(result)
        return
    }
    defer conn.Close()
    
    // Get certificate information
    certs := conn.ConnectionState().PeerCertificates
    if len(certs) == 0 {
        result := SSLResult{
            Domain: strings.Split(domain, ":")[0],
            Valid:  false,
            Error:  "No certificates found",
        }
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(result)
        return
    }
    
    cert := certs[0] // Use the leaf certificate
    
    // Extract certificate details
    result := SSLResult{
        Domain:          strings.Split(domain, ":")[0],
        Issuer:          cert.Issuer.CommonName,
        Subject:         cert.Subject.CommonName,
        NotBefore:       cert.NotBefore,
        NotAfter:        cert.NotAfter,
        DaysRemaining:   int(time.Until(cert.NotAfter).Hours() / 24),
        SubjectAltNames: cert.DNSNames,
        CipherSuite:     tls.CipherSuiteName(conn.ConnectionState().CipherSuite),
        Version:         tlsVersionToString(conn.ConnectionState().Version),
    }
    
    // Verify certificate
    opts := x509.VerifyOptions{
        DNSName: strings.Split(domain, ":")[0],
        Roots:   nil, // Use system root CA pool
    }
    if _, err := cert.Verify(opts); err == nil {
        result.Valid = true
    } else {
        result.Valid = false
        result.Error = "Certificate validation failed: " + err.Error()
    }
    
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(result)
}
```

**Why I did it this way:**
- Used crypto/tls package for secure connections
- Manual certificate verification to provide detailed information
- Calculated days remaining until expiration for easy monitoring
- Extracted comprehensive certificate details
- Structured error handling for frontend display

### 5. Port Scanner Tool

#### Frontend (Next.js) Implementation

```jsx
function PortScanner() {
  const [host, setHost] = useState('');
  const [customPorts, setCustomPorts] = useState('');
  const [useCustomPorts, setUseCustomPorts] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  
  async function scanPorts() {
    setLoading(true);
    try {
      let url = `/api/port?host=${host}`;
      if (useCustomPorts && customPorts) {
        url += `&ports=${customPorts}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div>
      <div className="input-group">
        <input 
          value={host} 
          onChange={(e) => setHost(e.target.value)} 
          placeholder="Enter hostname or IP"
        />
        
        <div className="checkbox-group">
          <input 
            type="checkbox" 
            id="custom-ports" 
            checked={useCustomPorts} 
            onChange={(e) => setUseCustomPorts(e.target.checked)} 
          />
          <label htmlFor="custom-ports">Use custom ports</label>
        </div>
        
        {useCustomPorts && (
          <input 
            value={customPorts} 
            onChange={(e) => setCustomPorts(e.target.value)} 
            placeholder="Enter ports (e.g., 80,443,8080)" 
          />
        )}
        
        <button onClick={scanPorts} disabled={loading}>
          {loading ? 'Scanning...' : 'Scan Ports'}
        </button>
      </div>
      
      {loading && <p>Scanning ports, please wait...</p>}
      
      {results && (
        <div className="results">
          <h2>Scan Results for {results.host}</h2>
          <p>Scan completed in {results.scanTime.toFixed(2)} seconds</p>
          
          <div className="open-ports">
            <h3>Open Ports ({results.openPorts.length})</h3>
            {results.openPorts.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Port</th>
                    <th>Service</th>
                    <th>Response Time</th>
                  </tr>
                </thead>
                <tbody>
                  {results.openPorts.map((port) => (
                    <tr key={port.port}>
                      <td>{port.port}</td>
                      <td>{port.service}</td>
                      <td>{port.responseTime.toFixed(3)}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No open ports found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

**Why I did it this way:**
- Option for custom port selection or default common ports
- Tabular display of scan results for better readability
- Performance metrics (scan time, response time)
- Clear visual separation between open and closed ports

#### Backend (Go) Implementation

```go
func PortScanHandler(w http.ResponseWriter, r *http.Request) {
    host := r.URL.Query().Get("host")
    if host == "" {
        http.Error(w, "Host parameter is required", http.StatusBadRequest)
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
    
    // Start the scan
    startTime := time.Now()
    
    var result ScanResult
    if len(ports) > 0 {
        result = scanSpecificPorts(host, ports, timeout)
    } else {
        result = scanCommonPorts(host, timeout)
    }
    
    result.ScanTime = time.Since(startTime).Seconds()
    
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(result)
}

func scanPort(host string, port int, timeout time.Duration) (PortInfo, error) {
    info := PortInfo{
        Port:    port,
        Service: getServiceName(port),
    }
    
    startTime := time.Now()
    address := fmt.Sprintf("%s:%d", host, port)
    conn, err := net.DialTimeout("tcp", address, timeout)
    
    if err != nil {
        if strings.Contains(err.Error(), "refused") {
            info.Status = "closed"
            return info, nil
        }
        info.Status = "filtered"
        return info, err
    }
    
    defer conn.Close()
    info.Status = "open"
    info.ResponseTime = time.Since(startTime).Seconds()
    
    return info, nil
}
```

**Why I did it this way:**
- Flexible parameter handling for custom port lists
- Configurable timeout for different network conditions
- Concurrent scanning using goroutines (in the actual implementation)
- Detailed port information including service names
- Performance metrics for both overall scan and individual ports

### 6. Phishing Detector Tool

#### Frontend (Next.js) Implementation

```jsx
function PhishingDetector() {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  
  async function analyzeUrl() {
    setLoading(true);
    try {
      const response = await fetch('/api/phishing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  
  function getRiskColor(risk) {
    switch (risk) {
      case 'Low': return 'green';
      case 'Medium': return 'orange';
      case 'High': return 'red';
      case 'Critical': return 'darkred';
      default: return 'gray';
    }
  }
  
  return (
    <div>
      <div className="input-group">
        <input 
          value={url} 
          onChange={(e) => setUrl(e.target.value)} 
          placeholder="Enter URL to analyze" 
        />
        <button onClick={analyzeUrl} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze URL'}
        </button>
      </div>
      
      {loading && <p>Analyzing URL for phishing indicators...</p>}
      
      {results && (
        <div className="results">
          <h2>Phishing Analysis for {results.url}</h2>
          
          <div className="risk-score" style={{ backgroundColor: getRiskColor(results.risk) }}>
            <h3>Risk Level: {results.risk}</h3>
            <div className="score-bar">
              <div 
                className="score-fill" 
                style={{ width: `${results.score}%` }}
              />
            </div>
            <p>Score: {results.score.toFixed(1)}%</p>
          </div>
          
          <div className="checks">
            <h3>Security Checks</h3>
            <table>
              <thead>
                <tr>
                  <th>Check</th>
                  <th>Result</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {results.checks.map((check, i) => (
                  <tr key={i} className={check.result ? 'failed' : 'passed'}>
                    <td>{check.name}</td>
                    <td>{check.result ? '⚠️ Failed' : '✅ Passed'}</td>
                    <td>{check.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {results.redirectChain && results.redirectChain.length > 0 && (
            <div className="redirect-chain">
              <h3>Redirect Chain</h3>
              <ol>
                {results.redirectChain.map((url, i) => (
                  <li key={i}>{url}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

**Why I did it this way:**
- Visual risk indicator with color coding
- Detailed breakdown of security checks
- Clear pass/fail indicators for each check
- Visualization of redirect chains for URL obfuscation detection

#### Backend (Go) Implementation

```go
func PhishingHandler(w http.ResponseWriter, r *http.Request) {
    // Set CORS headers
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
    
    // Handle preflight request
    if r.Method == "OPTIONS" {
        w.WriteHeader(http.StatusOK)
        return
    }
    
    // Only accept POST requests
    if r.Method != "POST" {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }
    
    // Parse request body
    var request struct {
        URL string `json:"url"`
    }
    
    if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
        http.Error(w, "Invalid request body", http.StatusBadRequest)
        return
    }
    
    if request.URL == "" {
        http.Error(w, "URL is required", http.StatusBadRequest)
        return
    }
    
    // Analyze the URL
    result := AnalyzeURL(request.URL)
    
    // Return the result
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(result)
}

func AnalyzeURL(url string) PhishingResult {
    result := PhishingResult{
        URL:    url,
        Checks: []Check{},
    }
    
    // Perform various checks
    checks := []Check{
        checkSuspiciousURLPatterns(url),
        checkHTTPS(url),
        checkDomainAge(url),
        checkRedirects(url, &result),
        checkBlacklists(url),
        // Additional checks...
    }
    
    result.Checks = checks
    
    // Calculate overall score
    var totalScore float64
    var totalWeight float64
    
    for _, check := range checks {
        if check.Result {
            totalScore += check.Weight
        }
        totalWeight += check.Weight
    }
    
    if totalWeight > 0 {
        result.Score = totalScore / totalWeight * 100
    }
    
    // Determine risk level
    switch {
    case result.Score < 20:
        result.Risk = "Low"
    case result.Score < 50:
        result.Risk = "Medium"
    case result.Score < 80:
        result.Risk = "High"
    default:
        result.Risk = "Critical"
    }
    
    return result
}
```

**Why I did it this way:**
- POST endpoint for URL analysis (better for longer URLs)
- Multiple security checks with weighted scoring
- Redirect chain tracking for URL obfuscation detection
- Risk level categorization based on score
- Detailed check results for frontend display

## Backend API Endpoints and Data Flow

### 1. Username Checker Endpoint
- **Endpoint**: `/check?user={username}`
- **HTTP Method**: GET
- **Flow**:
  1. User submits a username from the frontend
  2. Request reaches the `handleCheckUsername` function in main.go
  3. The function calls `username.CheckAllPlatforms(user)` from the username package
  4. For each platform in the predefined list (Instagram, X, Facebook, etc.):
     - An HTTP GET request is made to the platform URL with the username
     - Response status code is analyzed (404 indicates username is available)
     - Results are collected in a CheckResult struct
  5. All results are combined into a JSON array and returned to the frontend
  6. Frontend displays availability status for each platform

### 2. WHOIS Lookup Endpoint
- **Endpoint**: `/whois?domain={domain}`
- **HTTP Method**: GET
- **Flow**:
  1. User enters a domain name in the frontend
  2. Request reaches the `handleWhoisLookup` function in main.go
  3. The function calls `whois.LookupDomain(domain)` from the whois package
  4. The whois package:
     - Determines the appropriate WHOIS server for the domain's TLD
     - Opens a TCP connection to the WHOIS server on port 43
     - Sends the domain query and receives the raw WHOIS data
     - Parses the raw data into structured information (registrar, dates, nameservers)
  5. Structured WHOIS data is returned as JSON to the frontend
  6. Frontend displays the domain registration details

### 3. DNS Lookup Endpoint
- **Endpoint**: `/dns?domain={domain}`
- **HTTP Method**: GET
- **Flow**:
  1. User submits a domain for DNS lookup
  2. Request reaches the `handleDNSLookup` function in main.go
  3. The function calls `dns.LookupDNS(domain)` from the dns package
  4. The dns package:
     - Uses Go's net package to query different DNS record types:
       - A records (IPv4 addresses)
       - AAAA records (IPv6 addresses)
       - MX records (mail servers)
       - NS records (name servers)
       - TXT records (text information)
       - CNAME records (canonical names)
     - Collects all records into a structured response
  5. DNS records are returned as JSON to the frontend
  6. Frontend displays the different record types and values

### 4. SSL Certificate Checker Endpoint
- **Endpoint**: `/ssl?domain={domain}`
- **HTTP Method**: GET
- **Flow**:
  1. User enters a domain for SSL certificate checking
  2. Request reaches the `handleSSLCheck` function in main.go
  3. The function calls `ssl.CheckSSL(domain)` from the ssl package
  4. The ssl package:
     - Establishes a TLS connection to the domain
     - Retrieves the server's certificate chain
     - Validates the certificate against trusted roots
     - Extracts certificate details (issuer, validity dates, SAN)
     - Checks for common SSL issues (expiration, weak ciphers)
  5. Certificate information and validation results are returned as JSON
  6. Frontend displays certificate details and security status

### 5. Port Scanner Endpoint
- **Endpoint**: `/port?host={host}&ports={ports}&timeout={timeout}`
- **HTTP Method**: GET
- **Flow**:
  1. User submits a host to scan with optional port list and timeout
  2. Request reaches the `handlePortScan` function in main.go
  3. The function parses optional parameters:
     - `ports`: Comma-separated list of ports to scan (e.g., "80,443,8080")
     - `timeout`: Scan timeout in seconds (default: 2)
  4. Based on parameters, it calls either:
     - `port.ScanPorts(host, ports, timeout)` for specific ports
     - `port.ScanDefaultPorts(host)` for common ports
  5. The port package:
     - Creates a goroutine for each port to enable concurrent scanning
     - Attempts to establish a TCP connection to each port
     - Records whether the connection succeeded (port open) or failed (port closed)
     - Collects results with port numbers, status, and service names
  6. Scan results are returned as JSON to the frontend
  7. Frontend displays open, closed, and filtered ports with service information

### 6. Phishing Detection Endpoint
- **Endpoint**: `/phishing`
- **HTTP Method**: POST
- **Flow**:
  1. User submits a URL for phishing analysis
  2. Request reaches the `handlePhishingCheck` function in main.go
  3. The function delegates to `phishing.HandlePhishingCheck(w, r)`
  4. The phishing package:
     - Extracts the URL from the request body
     - Performs multiple checks:
       - Domain age check
       - SSL certificate validation
       - Suspicious URL patterns detection
       - Redirect chain analysis
       - Content analysis for phishing indicators
     - Calculates a risk score based on all checks
  5. Analysis results and risk score are returned as JSON
  6. Frontend displays the risk assessment and detailed analysis

## CI/CD Workflow

The project uses GitHub Actions for continuous integration and deployment:

### Infrastructure Workflow (`infrastructure.yml`)

1. **Trigger**: Changes to Terraform files or manual workflow dispatch
2. **Steps**:
   - Initialize Terraform with S3 backend
   - Validate Terraform configuration
   - Plan infrastructure changes
   - Configure AWS credentials
   - Setup SSH key in AWS
   - Apply Terraform changes to create/update EC2 instance
   - Output EC2 information for deployment

### Deployment Workflow (`deployment.yml`)

1. **Trigger**: Changes to frontend, backend, or Docker Compose files
2. **Steps**:
   - Checkout code from repository
   - Build Docker images locally
   - Install Trivy security scanner
   - Scan frontend and backend images for vulnerabilities
   - Generate and email security scan reports
   - Configure SSH access to EC2 instance
   - Deploy application to EC2:
     - Clone repository on EC2
     - Build and start Docker containers
     - Output application URLswork programming basics
- Added X-Cache header to show beginners how HTTP headers can provide metadata

### 3. DNS Lookup Tool

#### Frontend (Next.js) Implementation

```jsx
// Simplified version of what happens in the frontend
function DNSLookup() {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('A');
  
  async function lookupDNS() {
    setLoading(true);
    try {
      const response = await fetch(`/api/dns?domain=${domain}`);
      const data = await response.json();
      setResults(data);
      // Set active tab to first available record type
      const firstAvailableType = Object.keys(data).find(type => data[type].length > 0) || 'A';
      setActiveTab(firstAvailableType);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div>
      <input value={domain} onChange={(e) => setDomain(e.target.value)} />
      <button onClick={lookupDNS} disabled={loading}>Lookup</button>
      
      {loading && <p>Looking up DNS records...</p>}
      
      {results && (
        <div>
          <div className="tabs">
            {Object.keys(results).map(recordType => (
              <button 
                key={recordType}
                className={activeTab === recordType ? 'active' : ''}
                onClick={() => setActiveTab(recordType)}
              >
                {recordType} ({results[recordType].length})
              </button>
            ))}
          </div>
          
          <div className="tab-content">
            <h3>{activeTab} Records</h3>
            <ul>
              {results[activeTab]?.map((record, index) => (
                <li key={index}>{record}</li>
              ))}
            </ul>
            {results[activeTab]?.length === 0 && <p>No records found</p>}
          </div>
        </div>
      )}
    </div>
  );
}
```

**Why I did it this way:**
- Added a tabbed interface to organize different DNS record types
- Used conditional rendering to show appropriate content based on selected tab
- Automatically selects the first tab with data for better UX
- Shows record counts in tab buttons for quick overview

#### Backend (Go) Implementation

```go
// Simplified version of the DNS lookup backend
func DNSHandler(w http.ResponseWriter, r *http.Request) {
    domain := r.URL.Query().Get("domain")
    if domain == "" {
        http.Error(w, "Domain parameter is required", http.StatusBadRequest)
        return
    }
    
    // Create a map to store different record types
    results := make(map[string][]string)
    
    // Use a WaitGroup to handle concurrent lookups
    var wg sync.WaitGroup
    
    // Mutex to safely update the results map
    var mu sync.Mutex
    
    // Define record types to look up
    recordTypes := []string{"A", "AAAA", "MX", "TXT", "NS", "CNAME", "SOA"}
    
    // Look up each record type concurrently
    for _, recordType := range recordTypes {
        wg.Add(1)
        go func(rt string) {
            defer wg.Done()
            
            var records []string
            var err error
            
            // Different lookup functions based on record type
            switch rt {
            case "A":
                ips, err := net.LookupIP(domain)
                if err == nil {
                    for _, ip := range ips {
                        if ip.To4() != nil {
                            records = append(records, ip.String())
                        }
                    }
                }
            case "AAAA":
                ips, err := net.LookupIP(domain)
                if err == nil {
                    for _, ip := range ips {
                        if ip.To4() == nil {
                            records = append(records, ip.String())
                        }
                    }
                }
            case "MX":
                mxs, err := net.LookupMX(domain)
                if err == nil {
                    for _, mx := range mxs {
                        records = append(records, fmt.Sprintf("%s (priority: %d)", mx.Host, mx.Pref))
                    }
                }
            // Additional cases for other record types...
            }
            
            // Store the results
            mu.Lock()
            results[rt] = records
            mu.Unlock()
        }(recordType)
    }
    
    // Wait for all lookups to complete
    wg.Wait()
    
    // Return the results
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(results)
}
```

**Why I did it this way:**
- Used Go's standard net package for DNS lookups - no external dependencies
- Implemented concurrent lookups with goroutines for better performance
- Used a type switch to handle different record types appropriately
- Structured the response as a map of record types to arrays of records

### 4. SSL Certificate Checker

#### Why This Approach Works for Beginners

For the SSL Certificate Checker and other tools, I followed similar patterns but with tool-specific logic. Here's why this approach is beginner-friendly:

1. **Consistent Patterns**: All tools follow the same basic structure:
   - Frontend: Form input → API call → Display results
   - Backend: Validate input → Process request → Return structured response

2. **Progressive Complexity**: Tools increase in complexity gradually:
   - Username checker: Basic concurrent API calls
   - WHOIS lookup: Network connections and response parsing
   - DNS lookup: Multiple record types and tabbed interface
   - SSL checker: TLS connections and certificate analysis
   - Port scanner: Advanced concurrency with worker pools
   - Phishing detector: Complex analysis algorithms

3. **Focused Learning**: Each tool teaches specific concepts:
   - Concurrency with goroutines and WaitGroups
   - Network programming with TCP connections
   - Error handling and fallback strategies
   - Data parsing and structured responses
   - UI patterns for displaying complex data

## Deployment Architecture

I chose a simple deployment architecture to make it easy for beginners to understand and deploy:

```
┌─────────────────┐
│                 │
│  EC2 Instance   │
│                 │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│  Docker Compose │
│                 │
└─────────────────┘
        │
        ├────────────────┐
        │                │
        ▼                ▼
┌─────────────┐  ┌─────────────┐
│  Frontend   │  │  Backend    │
│  Container  │  │  Container  │
└─────────────┘  └─────────────┘
```

**Why I did it this way:**
- Single EC2 instance: Simple to manage for beginners
- Docker Compose: Easy orchestration without Kubernetes complexity
- Separate containers: Maintains separation of concerns
- Terraform for infrastructure: Teaches IaC concepts without overwhelming complexity

## CI/CD Pipeline Explanation

I designed the CI/CD pipeline to be straightforward while teaching important DevOps concepts:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Git Push   │────▶│  Run Tests  │────▶│  Build      │────▶│  Deploy to  │
│             │     │             │     │  Containers │     │  EC2        │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                              │
                                              ▼
                                        ┌─────────────┐
                                        │  Security   │
                                        │  Scan       │
                                        └─────────────┘
```

**Why I did it this way:**
- GitHub Actions: Free, integrated with GitHub, and easy to configure
- Simple workflow files: Easy to understand and modify
- Security scanning: Introduces security concepts without complex tooling
- Email notifications: Simple way to monitor deployment status

## Beginner Tips for Extending This Project

1. **Start with frontend modifications**:
   - Add new UI components to existing tools
   - Improve the styling and user experience
   - Add result filtering or sorting options

2. **Then try backend enhancements**:
   - Add caching to endpoints that don't have it
   - Implement rate limiting to prevent abuse
   - Add more detailed error responses

3. **Finally, add new tools**:
   - Follow the existing patterns for consistency
   - Start with simple tools and gradually increase complexity
   - Reuse components and functions from existing tools

## Common Beginner Challenges and Solutions

1. **Challenge**: Understanding Go's concurrency model
   **Solution**: Start with simple goroutines and gradually add complexity

2. **Challenge**: Managing state in React components
   **Solution**: Use the useState hook for simple state before moving to context or Redux

3. **Challenge**: Handling API errors
   **Solution**: Implement consistent error handling patterns across all components

4. **Challenge**: Deploying the application
   **Solution**: Follow the step-by-step deployment guide in the README

## Conclusion

This project was designed with beginners in mind, providing a gradual learning curve while building something useful. The consistent patterns across tools make it easy to understand and extend, while the separation of frontend and backend teaches important architectural concepts.

By following the workflows described in this document, beginners can understand not just how the application works, but why it was built this way, and how they can extend it with their own features.