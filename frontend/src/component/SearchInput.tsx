'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  placeholder: string;
  buttonText: string;
  buttonColor: string;
  inputType?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  isLoading,
  placeholder,
  buttonText,
  buttonColor,
  inputType = 'text',
}) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!query.trim()) {
      setError('Please enter a value');
      return;
    }

    setError('');
    onSearch(query.trim());
  };

  // Determine button color classes
  const getColorClasses = () => {
    switch (buttonColor) {
      case 'primary':
        return 'bg-indigo hover:bg-indigo/90';
      case 'secondary':
        return 'bg-teal-500 hover:bg-teal/20';
      case 'blue':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'green':
        return 'bg-green-500 hover:bg-green-600';
      case 'purple':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'red':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-primary hover:bg-primary/90';
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type={inputType}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className={`w-full px-4 py-3 rounded-lg border ${
                error ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-${
                buttonColor === 'primary' ? 'primary' : buttonColor
              } focus:border-transparent bg-background`}
              disabled={isLoading}
            />
          </div>

          <motion.button
            type="submit"
            className={`${getColorClasses()} text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
                <Search className="ml-2 h-5 w-5" />
              </>
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
      </form>
    </div>
  );
};
