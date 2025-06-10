'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { WhoisResult as WhoisResultType } from './lib/whoisLookup';
import { Calendar, Globe, Server, Shield, Clock, AlertCircle } from 'lucide-react';

interface WhoisResultProps {
  result: WhoisResultType | null;
}

export const WhoisResult: React.FC<WhoisResultProps> = ({ result }) => {
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

  const resultItems = [
    { 
      icon: <Globe className="h-5 w-5 text-primary" />, 
      label: "Domain", 
      value: result.domain 
    },
    { 
      icon: <Shield className="h-5 w-5 text-primary" />, 
      label: "Registrar", 
      value: result.registrar || "Not available" 
    },
    { 
      icon: <Calendar className="h-5 w-5 text-primary" />, 
      label: "Registration Date", 
      value: result.registrationDate || "Not available" 
    },
    { 
      icon: <Clock className="h-5 w-5 text-primary" />, 
      label: "Expiration Date", 
      value: result.expirationDate || "Not available" 
    },
    { 
      icon: <Server className="h-5 w-5 text-primary" />, 
      label: "Name Servers", 
      value: result.nameServers || "Not available" 
    },
    { 
      icon: <Shield className="h-5 w-5 text-primary" />, 
      label: "Status", 
      value: result.status || "Not available" 
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
    >
      <h2 className="text-2xl font-bold mb-6">WHOIS Information for {result.domain}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {resultItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: index * 0.1 }
            }}
            className="bg-card border border-border rounded-lg p-4"
          >
            <div className="flex items-center mb-2">
              {item.icon}
              <h3 className="ml-2 font-medium text-muted-foreground">{item.label}</h3>
            </div>
            <p className="text-lg font-semibold break-words">{item.value}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: { delay: 0.6 }
        }}
        className="mt-8"
      >
        <h3 className="text-xl font-semibold mb-3">Raw WHOIS Data</h3>
        <div className="bg-muted rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm whitespace-pre-wrap">{result.raw || "No raw data available"}</pre>
        </div>
      </motion.div>
    </motion.div>
  );
};