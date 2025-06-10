'use client'
import React, { useState } from 'react';
import { AlertTriangle, Shield, Check, X, ExternalLink, Search, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { SearchInput } from '../SearchInput';

interface PhishingResult {
  safe: boolean;
  score: number; // 0-100, higher means more risky
  reasons: string[];
  databaseMatches?: string[];
  domainAge?: string;
  error?: string;
}

const PhishingDetector = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PhishingResult | null>(null);
  const [showIcons, setShowIcons] = useState<boolean>(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => setShowIcons(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    setLoading(true);
    
    try {
      // First try with POST method
      try {
        const response = await fetch('http://localhost:8080/phishing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        });
        
        if (response.ok) {
          const data = await response.json();
          setResult(data);
          return;
        }
      } catch (postError) {
        console.error('POST request failed, trying GET:', postError);
      }
      
      // If POST fails, try with GET method
      const getResponse = await fetch(`http://localhost:8080/phishing?url=${encodeURIComponent(url)}`);
      
      if (!getResponse.ok) {
        throw new Error(`HTTP error! Status: ${getResponse.status}`);
      }
      
      const data = await getResponse.json();
      setResult(data);
    } catch (error) {
      console.error('Error checking URL:', error);
      setResult({
        safe: false,
        score: 100,
        reasons: ['Error processing request'],
        error: 'Failed to analyze URL. Please ensure the backend server is running.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Floating icons animation variants
  const iconsContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const iconVariant = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Text reveal animation
  const textReveal = {
    hidden: { opacity: 0, y: -20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    })
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div 
          className="absolute rounded-full bg-red-500/5 w-96 h-96 top-1/4 -left-48"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        <motion.div 
          className="absolute rounded-full bg-red-500/10 w-64 h-64 bottom-1/4 -right-32"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2] 
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2
          }}
        />
      </div>

      <div className="container px-4 py-12 mx-auto flex-1 flex flex-col relative z-10 h-full">
        <motion.div
          className="text-center mb-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
        >
          <motion.h1 
            className="text-5xl font-extrabold tracking-tight lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500"
            custom={0}
            variants={textReveal}
          >
            Phishing URL Detector
          </motion.h1>
          <motion.p 
            className="mt-4 text-xl text-muted-foreground"
            custom={1}
            variants={textReveal}
          >
            Analyze URLs for phishing indicators and protect yourself from online scams
          </motion.p>

          {/* Animated icon row */}
          {showIcons && (
            <motion.div 
              className="flex justify-center gap-8 mt-6"
              variants={iconsContainer}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={iconVariant} className="flex flex-col items-center">
                <div className="p-3 bg-red-500/10 rounded-full mb-2">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <span className="text-sm">Detection</span>
              </motion.div>
              <motion.div variants={iconVariant} className="flex flex-col items-center">
                <div className="p-3 bg-orange-500/10 rounded-full mb-2">
                  <Shield className="w-6 h-6 text-orange-500" />
                </div>
                <span className="text-sm">Protection</span>
              </motion.div>
              <motion.div variants={iconVariant} className="flex flex-col items-center">
                <div className="p-3 bg-yellow-500/10 rounded-full mb-2">
                  <Search className="w-6 h-6 text-yellow-500" />
                </div>
                <span className="text-sm">Analysis</span>
              </motion.div>
              <motion.div variants={iconVariant} className="flex flex-col items-center">
                <div className="p-3 bg-red-500/10 rounded-full mb-2">
                  <ExternalLink className="w-6 h-6 text-red-500" />
                </div>
                <span className="text-sm">URL Check</span>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Search box with enhanced animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.6, 
            duration: 0.8,
            type: "spring",
            damping: 12
          }}
          className="w-full max-w-2xl mx-auto"
        >
          <div className="mb-8">
            <SearchInput
              onSearch={(query) => {
                setUrl(query);
                handleSubmit(new Event('submit') as any);
              }}
              isLoading={loading}
              placeholder="Enter a URL to check (e.g., https://example.com)"
              buttonText="Check URL"
              buttonColor="red"
              inputType="url"
            />
          </div>
        </motion.div>

        {/* Results section */}
        <motion.div
          className="flex-1 overflow-y-auto mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center mt-12"
            >
              <motion.div 
                className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              />
            </motion.div>
          ) : result ? (
            <PhishingResultComponent result={result} />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-12 max-w-3xl mx-auto"
            >
              <h2 className="text-2xl font-bold mb-6">What is Phishing?</h2>
              
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">Online Deception</h3>
                  <p className="text-muted-foreground">
                    Phishing is a type of cyber attack where attackers disguise themselves as trustworthy entities to steal 
                    sensitive information such as usernames, passwords, credit card details, or other personal data.
                  </p>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">Common Phishing Indicators</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Suspicious domain names that mimic legitimate websites</li>
                    <li>URLs with unusual characters or excessive subdomains</li>
                    <li>Recently registered domains (less than 30 days old)</li>
                    <li>Use of URL shorteners to hide the actual destination</li>
                    <li>HTTP instead of HTTPS (lack of encryption)</li>
                    <li>Poor grammar, spelling errors, or unprofessional design</li>
                  </ul>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">How to Use This Tool</h3>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Enter a suspicious URL in the search box above</li>
                    <li>Click the "Check URL" button</li>
                    <li>Review the detailed analysis and risk assessment</li>
                    <li>Take appropriate action based on the results</li>
                  </ol>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Animated footer */}
      <motion.footer 
        className="relative z-10 text-center text-muted-foreground py-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <p>
          <motion.span
            animate={{ 
              color: ['#888', '#666', '#888'],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
            className="font-medium"
          >
            Phishing URL Detector
          </motion.span> &copy; {new Date().getFullYear()}
        </p>
      </motion.footer>
    </div>
  );
};

const PhishingResultComponent: React.FC<{ result: PhishingResult }> = ({ result }) => {
  if (result.error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border border-red-200 rounded-lg p-6"
      >
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
          <h3 className="text-lg font-semibold text-red-700">Error</h3>
        </div>
        <p className="text-red-600">{result.error}</p>
      </motion.div>
    );
  }

  const getRiskLevel = (score: number) => {
    if (score < 20) return { text: 'Low Risk', color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' };
    if (score < 60) return { text: 'Medium Risk', color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    return { text: 'High Risk', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' };
  };

  const risk = getRiskLevel(result.score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
    >
      <div className={`p-6 rounded-lg mb-6 ${risk.bg} ${risk.border}`}>
        <div className="flex items-center mb-4">
          {result.safe ? (
            <Shield className="h-8 w-8 text-green-500 mr-3" />
          ) : (
            <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
          )}
          <div>
            <h3 className={`text-xl font-bold ${result.safe ? 'text-green-700' : 'text-red-700'}`}>
              {result.safe ? 'Safe URL' : 'Potentially Malicious URL'}
            </h3>
            <p className={result.safe ? 'text-green-600' : 'text-red-600'}>
              Risk Level: {risk.text}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                result.score < 20 ? 'bg-green-500' : 
                result.score < 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`} 
              style={{ width: `${result.score}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>Safe</span>
            <span>Risk Score: {result.score}/100</span>
          </div>
        </div>
      </div>

      {/* Analysis Details */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Analysis Details</h3>
        
        <div className="space-y-4">
          {result.reasons.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Detected Issues:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {result.reasons.map((reason, index) => (
                  <li key={index} className="text-red-600">{reason}</li>
                ))}
              </ul>
            </div>
          )}
          
          {result.databaseMatches && result.databaseMatches.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Database Matches:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {result.databaseMatches.map((db, index) => (
                  <li key={index} className="text-red-600">Found in {db}</li>
                ))}
              </ul>
            </div>
          )}
          
          {result.domainAge && (
            <div>
              <h4 className="font-medium mb-2">Domain Age:</h4>
              <p>{result.domainAge}</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="font-medium mb-2">Recommendations:</h4>
          <ul className="list-disc pl-5 space-y-2">
            {result.safe ? (
              <li className="text-green-600">This URL appears to be safe to visit.</li>
            ) : (
              <>
                <li className="text-red-600">Avoid visiting this URL as it may be attempting to steal your information.</li>
                <li className="text-red-600">Do not enter any personal information if you've already visited this site.</li>
                <li className="text-red-600">Report this URL to your organization's security team if applicable.</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default PhishingDetector;