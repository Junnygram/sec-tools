export interface DNSRecord {
  type: string;
  name: string;
  value: string;
  ttl?: number;
}

export interface DNSResult {
  domain: string;
  records: DNSRecord[];
  error?: string;
}

export async function performDNSLookup(domain: string): Promise<DNSResult> {
  try {
    const response = await fetch(`http://localhost:8080/dns?domain=${encodeURIComponent(domain)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data as DNSResult;
  } catch (error) {
    console.error('Error performing DNS lookup:', error);
    return {
      domain,
      records: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}