// UsernameSearch.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface UsernameSearchProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
}

export const UsernameSearch = ({
  onSearch,
  isLoading,
}: UsernameSearchProps) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!inputValue.trim()) {
      setError('Please enter a username');
      return;
    }

    setError('');
    onSearch(inputValue.trim());
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-sm text-muted-foreground mb-2 px-1">
        Enter the username to check
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-4 w-full">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a username"
          className="flex-1 w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          aria-label="Username input"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="sm:w-auto px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Checking...' : 'Check Availability'}
        </button>
      </form>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
