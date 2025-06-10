'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PortResult } from '../PortResult';
import { scanPorts, ScanResult } from '../lib/portScanner';
import { Server, Lock, Unlock, Shield } from 'lucide-react';
import { SearchInput } from '../SearchInput';

const PortScanner = () => {
  const [host, setHost] = useState<string>('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showIcons, setShowIcons] = useState<boolean>(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => setShowIcons(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = async (searchHost: string) => {
    setIsLoading(true);
    setHost(searchHost);
    try {
      // Scan common ports only
      const data = await scanPorts(searchHost);
      setResult(data);
    } catch (error) {
      console.error('Error scanning ports:', error);
    } finally {
      setIsLoading(false);
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
          className="absolute rounded-full bg-purple-500/5 w-96 h-96 top-1/4 -left-48"
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
          className="absolute rounded-full bg-purple-500/10 w-64 h-64 bottom-1/4 -right-32"
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
            className="text-5xl font-extrabold tracking-tight lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-700"
            custom={0}
            variants={textReveal}
          >
            Port Scanner
          </motion.h1>
          <motion.p 
            className="mt-4 text-xl text-muted-foreground"
            custom={1}
            variants={textReveal}
          >
            Scan for open ports and identify potential security vulnerabilities
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
                <div className="p-3 bg-purple-500/10 rounded-full mb-2">
                  <Server className="w-6 h-6 text-purple-500" />
                </div>
                <span className="text-sm">Servers</span>
              </motion.div>
              <motion.div variants={iconVariant} className="flex flex-col items-center">
                <div className="p-3 bg-purple-500/10 rounded-full mb-2">
                  <Lock className="w-6 h-6 text-purple-500" />
                </div>
                <span className="text-sm">Security</span>
              </motion.div>
              <motion.div variants={iconVariant} className="flex flex-col items-center">
                <div className="p-3 bg-purple-500/10 rounded-full mb-2">
                  <Unlock className="w-6 h-6 text-purple-500" />
                </div>
                <span className="text-sm">Open Ports</span>
              </motion.div>
              <motion.div variants={iconVariant} className="flex flex-col items-center">
                <div className="p-3 bg-purple-500/10 rounded-full mb-2">
                  <Shield className="w-6 h-6 text-purple-500" />
                </div>
                <span className="text-sm">Protection</span>
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
          <SearchInput 
            onSearch={handleSearch} 
            isLoading={isLoading}
            buttonText="Scan Ports"
            placeholder="Enter a domain or IP address (e.g., example.com)"
            buttonColor="purple"
          />
        </motion.div>

        {/* Results section */}
        <motion.div
          className="flex-1 overflow-y-auto mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center mt-12"
            >
              <motion.div 
                className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              />
            </motion.div>
          ) : (
            <PortResult result={result} />
          )}

          {/* Information section when no search has been performed */}
          {!host && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-12 max-w-3xl mx-auto"
            >
              <h2 className="text-2xl font-bold mb-6">What is a Port Scanner?</h2>
              
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">Network Port Scanning</h3>
                  <p className="text-muted-foreground">
                    A port scanner is a tool that checks for open ports on a server or network device. 
                    Open ports can indicate services that are running and potentially accessible from the internet.
                    Port scanning is an essential technique for security professionals to identify potential vulnerabilities.
                  </p>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">Common Port Numbers</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li><strong>Port 21</strong>: FTP (File Transfer Protocol)</li>
                    <li><strong>Port 22</strong>: SSH (Secure Shell)</li>
                    <li><strong>Port 25</strong>: SMTP (Simple Mail Transfer Protocol)</li>
                    <li><strong>Port 80</strong>: HTTP (Hypertext Transfer Protocol)</li>
                    <li><strong>Port 443</strong>: HTTPS (HTTP Secure)</li>
                    <li><strong>Port 3306</strong>: MySQL Database</li>
                    <li><strong>Port 3389</strong>: RDP (Remote Desktop Protocol)</li>
                  </ul>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <Shield className="h-5 w-5 text-red-500 mr-2" />
                    Important Security Notice
                  </h3>
                  <div className="text-muted-foreground">
                    <p className="mb-2">
                      This port scanner is provided for educational and security testing purposes only. 
                      Please use it responsibly and ethically.
                    </p>
                    <p className="font-medium">Only scan systems that you own or have explicit permission to scan.</p>
                  </div>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">How to Use This Tool</h3>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Enter a domain name or IP address in the search box above</li>
                    <li>Click the "Scan Ports" button</li>
                    <li>View the results showing open, closed, and filtered ports</li>
                    <li>Review security recommendations based on the scan results</li>
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
            Port Scanner
          </motion.span> &copy; {new Date().getFullYear()}
        </p>
      </motion.footer>
    </div>
  );
};

export default PortScanner;