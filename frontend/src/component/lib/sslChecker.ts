export interface CertificateInfo {
  subject: string;
  issuer: string;
  serialNumber: string;
  version: number;
  isCA: boolean;
  notBefore: string;
  notAfter: string;
  daysUntilExpiry: number;
  dnsNames: string[];
  signatureAlgorithm: string;
}

export interface SSLResult {
  domain: string;
  valid: boolean;
  certificate: CertificateInfo;
  chainCerts: CertificateInfo[];
  error?: string;
}

export async function checkSSLCertificate(domain: string): Promise<SSLResult> {
  try {
    const response = await fetch(`http://localhost:8080/ssl?domain=${encodeURIComponent(domain)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data as SSLResult;
  } catch (error) {
    console.error('Error checking SSL certificate:', error);
    return {
      domain,
      valid: false,
      certificate: {
        subject: '',
        issuer: '',
        serialNumber: '',
        version: 0,
        isCA: false,
        notBefore: '',
        notAfter: '',
        daysUntilExpiry: 0,
        dnsNames: [],
        signatureAlgorithm: ''
      },
      chainCerts: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}