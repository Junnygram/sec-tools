'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { SSLResult as SSLResultType } from './lib/sslChecker';
import { Shield, Calendar, AlertCircle, Check, X, Clock, FileText, Award, Globe } from 'lucide-react';

interface SSLResultProps {
  result: SSLResultType | null;
}

export const SSLResult: React.FC<SSLResultProps> = ({ result }) => {
  if (!result) return null;

  if (result.error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border border-red-200 rounded-lg p-6 mt-6"
      >
        <div className="flex items-center mb-4">
          <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
          <h3 className="text-lg font-semibold text-red-700">Error</h3>
        </div>
        <p className="text-red-600">{result.error}</p>
      </motion.div>
    );
  }

  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
    >
      <div className="flex items-center mb-6">
        <Shield className="h-6 w-6 text-primary mr-2" />
        <h2 className="text-2xl font-bold">SSL Certificate for {result.domain}</h2>
      </div>
      
      {/* Certificate Status */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className={`p-6 rounded-lg mb-8 flex items-center ${
          result.valid 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}
      >
        {result.valid ? (
          <Check className="h-8 w-8 text-green-500 mr-3" />
        ) : (
          <X className="h-8 w-8 text-red-500 mr-3" />
        )}
        <div>
          <h3 className={`text-lg font-semibold ${result.valid ? 'text-green-700' : 'text-red-700'}`}>
            {result.valid ? 'Valid Certificate' : 'Invalid Certificate'}
          </h3>
          <p className={result.valid ? 'text-green-600' : 'text-red-600'}>
            {result.valid 
              ? `The SSL certificate for ${result.domain} is valid and trusted.` 
              : `The SSL certificate for ${result.domain} is not valid or not trusted.`
            }
          </p>
        </div>
      </motion.div>
      
      {/* Certificate Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FileText className="h-5 w-5 text-primary mr-2" />
          Certificate Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">Subject</div>
            <div className="font-medium break-all">{result.certificate.subject}</div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">Issuer</div>
            <div className="font-medium break-all">{result.certificate.issuer}</div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">Valid From</div>
            <div className="font-medium">{formatDate(result.certificate.notBefore)}</div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">Valid Until</div>
            <div className="font-medium">{formatDate(result.certificate.notAfter)}</div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">Days Until Expiry</div>
            <div className={`font-medium ${
              result.certificate.daysUntilExpiry < 30 
                ? 'text-red-500' 
                : result.certificate.daysUntilExpiry < 90 
                  ? 'text-yellow-500' 
                  : 'text-green-500'
            }`}>
              {result.certificate.daysUntilExpiry} days
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">Signature Algorithm</div>
            <div className="font-medium">{result.certificate.signatureAlgorithm}</div>
          </div>
        </div>
      </motion.div>
      
      {/* DNS Names */}
      {result.certificate.dnsNames && result.certificate.dnsNames.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Globe className="h-5 w-5 text-primary mr-2" />
            Domain Names
          </h3>
          
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              {result.certificate.dnsNames.map((name, index) => (
                <div 
                  key={index}
                  className="bg-muted px-3 py-1 rounded-full text-sm"
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Certificate Chain */}
      {result.chainCerts && result.chainCerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Award className="h-5 w-5 text-primary mr-2" />
            Certificate Chain
          </h3>
          
          <div className="space-y-4">
            {result.chainCerts.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + (index * 0.1) }}
                className="bg-card border border-border rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">{cert.subject}</div>
                  {cert.isCA && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Certificate Authority
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Issued by: {cert.issuer}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};