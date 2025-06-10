export interface PortInfo {
  port: number;
  state: string;
  service: string;
}

export interface ScanResult {
  host: string;
  ip: string;
  ports: PortInfo[];
  duration: string;
  error?: string;
}

export async function scanPorts(host: string, ports?: number[], timeout?: number): Promise<ScanResult> {
  try {
    let url = `http://localhost:8080/port?host=${encodeURIComponent(host)}`;
    
    if (ports && ports.length > 0) {
      url += `&ports=${ports.join(',')}`;
    }
    
    if (timeout && timeout > 0) {
      url += `&timeout=${timeout}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data as ScanResult;
  } catch (error) {
    console.error('Error scanning ports:', error);
    return {
      host,
      ip: '',
      ports: [],
      duration: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}