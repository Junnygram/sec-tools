'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SSLResult } from '../SSLResult';
import { checkSSLCertificate, SSLResult as SSLResultType } from '../lib/sslChecker';
import { Shield, Lock, CheckCircle, AlertTriangle } from 'lucide-react';
import { SearchInput } from '../SearchInput';

const SSLChecker = () => {
  const [domain, setDomain] = useState<string>('');
  const [result, setResult] = useState<SSLResultType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showIcons, setShowIcons] = useState<boolean>(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => setShowIcons(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = async (searchDomain: string) => {
    setIsLoading(true);
    setDomain(searchDomain);
    try {
      const data = await checkSSLCertificate(searchDomain);
      setResult(data);
    } catch (error) {
      console.error('Error checking SSL certificate:', error);
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
          className="absolute rounded-full bg-green-500/5 w-96 h-96 top-1/4 -left-48"
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
          className="absolute rounded-full bg-green-500/10 w-64 h-64 bottom-1/4 -right-32"
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
            className="text-5xl font-extrabold tracking-tight lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-green-700"
            custom={0}
            variants={textReveal}
          >
            SSL Certificate Checker
          </motion.h1>
          <motion.p 
            className="mt-4 text-xl text-muted-foreground"
            custom={1}
            variants={textReveal}
          >
            Verify SSL certificates and check for security issues
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
                <div className="p-3 bg-green-500/10 rounded-full mb-2">
                  <Shield className="w-6 h-6 text-green-500" />
                </div>
                <span className="text-sm">Security</span>
              </motion.div>
              <motion.div variants={iconVariant} className="flex flex-col items-center">
                <div className="p-3 bg-green-500/10 rounded-full mb-2">
                  <Lock className="w-6 h-6 text-green-500" />
                </div>
                <span className="text-sm">Encryption</span>
              </motion.div>
              <motion.div variants={iconVariant} className="flex flex-col items-center">
                <div className="p-3 bg-green-500/10 rounded-full mb-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <span className="text-sm">Validation</span>
              </motion.div>
              <motion.div variants={iconVariant} className="flex flex-col items-center">
                <div className="p-3 bg-green-500/10 rounded-full mb-2">
                  <AlertTriangle className="w-6 h-6 text-green-500" />
                </div>
                <span className="text-sm">Warnings</span>
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
            buttonText="Check SSL Certificate"
            placeholder="Enter a domain name (e.g., example.com)"
            buttonColor="green"
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
                className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              />
            </motion.div>
          ) : (
            <SSLResult result={result} />
          )}

          {/* Information section when no search has been performed */}
          {!domain && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-12 max-w-3xl mx-auto"
            >
              <h2 className="text-2xl font-bold mb-6">What is SSL?</h2>
              
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">Secure Sockets Layer</h3>
                  <p className="text-muted-foreground">
                    SSL (Secure Sockets Layer) and its successor TLS (Transport Layer Security) are protocols that provide 
                    secure communication over the internet. They encrypt data transmitted between web servers and browsers, 
                    ensuring that sensitive information remains private and integral.
                  </p>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">Why Check SSL Certificates?</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Verify that a website's connection is secure and encrypted</li>
                    <li>Check if certificates are valid and not expired</li>
                    <li>Identify potential security issues with certificate configuration</li>
                    <li>Ensure certificates are issued by trusted Certificate Authorities</li>
                    <li>Verify that certificates cover the correct domain names</li>
                  </ul>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">How to Use This Tool</h3>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Enter a domain name in the search box above (e.g., example.com)</li>
                    <li>Click the "Check SSL Certificate" button</li>
                    <li>View detailed information about the SSL certificate</li>
                    <li>Check the validity, expiration date, and security status</li>
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
            SSL Certificate Checker
          </motion.span> &copy; {new Date().getFullYear()}
        </p>
      </motion.footer>
    </div>
  );
};

export default SSLChecker;