'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';

interface DomainSearchProps {
  onSearch: (domain: string) => void;
  isLoading: boolean;
  buttonText?: string;
  placeholder?: string;
}

export const DomainSearch: React.FC<DomainSearchProps> = ({ 
  onSearch, 
  isLoading, 
  buttonText = 'Lookup Information',
  placeholder = 'Enter a domain name (e.g., example.com)'
}) => {
  const [domain, setDomain] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!domain.trim()) {
      setError('Please enter a domain name');
      return;
    }
    
    // Check if it looks like a domain
    if (!domain.includes('.')) {
      setError('Please enter a valid domain (e.g., example.com)');
      return;
    }
    
    setError('');
    onSearch(domain.trim());
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder={placeholder}
            className={`w-full px-4 py-3 pl-12 rounded-lg border ${
              error ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background`}
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          
          {/* Mobile-friendly search button - always visible */}
          <motion.button
            type="submit"
            className="absolute inset-y-0 right-0 px-4 bg-primary text-white rounded-r-lg flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Search className="h-5 w-5" />
            )}
          </motion.button>
        </div>
        
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm mt-1"
          >
            {error}
          </motion.p>
        )}
        
        {/* Main search button - visible on all devices */}
        <motion.button
          type="submit"
          className="mt-3 w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              <span>Searching...</span>
            </div>
          ) : (
            <>
              <span>{buttonText}</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
};