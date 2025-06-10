/**
 * Phishing URL Detector API client
 */

export interface PhishingResult {
  safe: boolean;
  score: number;
  reasons: string[];
  databaseMatches?: string[];
  domainAge?: string;
  error?: string;
}

/**
 * Analyzes a URL for phishing indicators
 * @param url The URL to analyze
 * @returns A promise that resolves to the phishing analysis result
 */
export async function analyzeURL(url: string): Promise<PhishingResult> {
  try {
    // For development with Next.js API route
    // const apiUrl = '/api/phishing-check';
    
    // For production with Go backend
    const apiUrl = 'http://localhost:8080/phishing';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing URL:', error);
    return {
      safe: false,
      score: 100,
      reasons: ['Error processing request'],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}