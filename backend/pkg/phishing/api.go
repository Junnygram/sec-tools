package phishing

import (
	"encoding/json"
	"net/http"
)

// HandlePhishingCheck is an HTTP handler for the phishing check API
func HandlePhishingCheck(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Handle preflight OPTIONS request
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Check if it's a GET or POST request
	var urlToCheck string
	
	if r.Method == http.MethodGet {
		// For GET requests, get the URL from the query parameter
		urlToCheck = r.URL.Query().Get("url")
	} else if r.Method == http.MethodPost {
		// For POST requests, decode the JSON body
		var req Request
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request format", http.StatusBadRequest)
			return
		}
		urlToCheck = req.URL
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Check if URL is provided
	if urlToCheck == "" {
		http.Error(w, "URL is required", http.StatusBadRequest)
		return
	}

	// Analyze the URL
	result, err := AnalyzeURL(urlToCheck)
	if err != nil {
		http.Error(w, "Error analyzing URL: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the result as JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}