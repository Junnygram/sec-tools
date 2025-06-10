'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { DNSResult as DNSResultType } from './lib/dnsLookup';
import { Globe, AlertCircle, Server } from 'lucide-react';

interface DNSResultProps {
  result: DNSResultType | null;
}

export const DNSResult: React.FC<DNSResultProps> = ({ result }) => {
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

  if (result.records.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6"
      >
        <div className="flex items-center mb-4">
          <AlertCircle className="h-6 w-6 text-yellow-500 mr-2" />
          <h3 className="text-lg font-semibold text-yellow-700">No Records Found</h3>
        </div>
        <p className="text-yellow-600">No DNS records were found for {result.domain}</p>
      </motion.div>
    );
  }

  // Group records by type
  const recordsByType: Record<string, typeof result.records> = {};
  result.records.forEach(record => {
    if (!recordsByType[record.type]) {
      recordsByType[record.type] = [];
    }
    recordsByType[record.type].push(record);
  });

  // Get record type color
  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case 'A': return 'bg-blue-100 text-blue-800';
      case 'AAAA': return 'bg-purple-100 text-purple-800';
      case 'CNAME': return 'bg-green-100 text-green-800';
      case 'MX': return 'bg-yellow-100 text-yellow-800';
      case 'TXT': return 'bg-pink-100 text-pink-800';
      case 'NS': return 'bg-indigo-100 text-indigo-800';
      case 'SOA': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
    >
      <div className="flex items-center mb-6">
        <Globe className="h-6 w-6 text-primary mr-2" />
        <h2 className="text-2xl font-bold">DNS Records for {result.domain}</h2>
      </div>
      
      {Object.entries(recordsByType).map(([type, records], typeIndex) => (
        <motion.div
          key={type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: { delay: typeIndex * 0.1 }
          }}
          className="mb-8"
        >
          <div className="flex items-center mb-3">
            <Server className="h-5 w-5 text-primary mr-2" />
            <h3 className="text-xl font-semibold">{type} Records</h3>
            <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${getRecordTypeColor(type)}`}>
              {records.length}
            </span>
          </div>
          
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {records.map((record, index) => (
                  <motion.tr 
                    key={`${record.type}-${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: 1,
                      transition: { delay: 0.2 + (index * 0.05) }
                    }}
                  >
                    <td className="px-4 py-3 text-sm">{record.name}</td>
                    <td className="px-4 py-3 text-sm font-mono break-all">{record.value}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};