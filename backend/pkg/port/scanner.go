package port

import (
	"fmt"
	"net"
	"sort"
	"strings"
	"sync"
	"time"
)

// PortInfo represents information about a scanned port
type PortInfo struct {
	Port    int    `json:"port"`
	State   string `json:"state"` // "open", "closed", "filtered"
	Service string `json:"service"`
}

// ScanResult represents the result of a port scan
type ScanResult struct {
	Host     string     `json:"host"`
	IP       string     `json:"ip"`
	Ports    []PortInfo `json:"ports"`
	Duration string     `json:"duration"`
	Error    string     `json:"error,omitempty"`
}

// Common port to service mappings
var commonServices = map[int]string{
	20:   "FTP Data",
	21:   "FTP Control",
	22:   "SSH",
	23:   "Telnet",
	25:   "SMTP",
	53:   "DNS",
	80:   "HTTP",
	110:  "POP3",
	143:  "IMAP",
	443:  "HTTPS",
	465:  "SMTPS",
	587:  "SMTP Submission",
	993:  "IMAPS",
	995:  "POP3S",
	1433: "MSSQL",
	3306: "MySQL",
	3389: "RDP",
	5432: "PostgreSQL",
	6379: "Redis",
	8080: "HTTP Alternate",
	8443: "HTTPS Alternate",
	9000: "Prometheus",
	9090: "Prometheus",
	9200: "Elasticsearch",
	9300: "Elasticsearch",
	27017: "MongoDB",
}

// ScanPorts scans the specified ports on the host
func ScanPorts(host string, portsToScan []int, timeout time.Duration) ScanResult {
	startTime := time.Now()
	
	result := ScanResult{
		Host:  host,
		Ports: []PortInfo{},
	}

	// Basic validation
	if host == "" {
		result.Error = "Host cannot be empty"
		return result
	}

	// Remove protocol prefixes if present
	host = strings.TrimPrefix(host, "http://")
	host = strings.TrimPrefix(host, "https://")
	
	// Extract host from URL if needed
	if parts := strings.Split(host, "/"); len(parts) > 1 {
		host = parts[0]
	}

	// Resolve IP address
	ips, err := net.LookupIP(host)
	if err != nil || len(ips) == 0 {
		result.Error = fmt.Sprintf("Could not resolve host: %s", host)
		return result
	}

	// Use the first IP address
	result.IP = ips[0].String()

	// If no ports specified, use common ports
	if len(portsToScan) == 0 {
		portsToScan = []int{21, 22, 23, 25, 53, 80, 110, 143, 443, 465, 587, 993, 995, 3306, 3389, 5432, 8080, 8443}
	}

	// Limit the number of ports to scan for safety
	if len(portsToScan) > 1000 {
		portsToScan = portsToScan[:1000]
	}

	// Sort ports for consistent output
	sort.Ints(portsToScan)

	// Use a wait group to manage concurrency
	var wg sync.WaitGroup
	// Use a mutex to protect concurrent writes to the result
	var mutex sync.Mutex

	// Limit concurrency to avoid overwhelming the network
	semaphore := make(chan struct{}, 50)

	for _, port := range portsToScan {
		wg.Add(1)
		semaphore <- struct{}{} // Acquire semaphore

		go func(p int) {
			defer wg.Done()
			defer func() { <-semaphore }() // Release semaphore

			portInfo := scanPort(result.IP, p, timeout)
			
			mutex.Lock()
			result.Ports = append(result.Ports, portInfo)
			mutex.Unlock()
		}(port)
	}

	wg.Wait()

	// Sort results by port number
	sort.Slice(result.Ports, func(i, j int) bool {
		return result.Ports[i].Port < result.Ports[j].Port
	})

	result.Duration = time.Since(startTime).String()
	return result
}

// scanPort checks if a specific port is open
func scanPort(ip string, port int, timeout time.Duration) PortInfo {
	result := PortInfo{
		Port:    port,
		State:   "closed",
		Service: getServiceName(port),
	}

	address := fmt.Sprintf("%s:%d", ip, port)
	conn, err := net.DialTimeout("tcp", address, timeout)

	if err != nil {
		if strings.Contains(err.Error(), "refused") {
			result.State = "closed"
		} else {
			result.State = "filtered"
		}
		return result
	}

	defer conn.Close()
	result.State = "open"
	return result
}

// getServiceName returns the service name for a port
func getServiceName(port int) string {
	if service, ok := commonServices[port]; ok {
		return service
	}
	return "unknown"
}

// ScanDefaultPorts scans common ports on the host with a default timeout
func ScanDefaultPorts(host string) ScanResult {
	return ScanPorts(host, nil, 2*time.Second)
}