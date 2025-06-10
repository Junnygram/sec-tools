export interface WhoisResult {
  domain: string;
  raw: string;
  registrar: string;
  registrationDate: string;
  expirationDate: string;
  nameServers: string;
  status: string;
  error?: string;
}

export async function performWhoisLookup(domain: string): Promise<WhoisResult> {
  try {
    const response = await fetch(`http://localhost:8080/whois?domain=${encodeURIComponent(domain)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data as WhoisResult;
  } catch (error) {
    console.error('Error performing WHOIS lookup:', error);
    return {
      domain,
      raw: '',
      registrar: '',
      registrationDate: '',
      expirationDate: '',
      nameServers: '',
      status: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}