'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { ScanResult } from './lib/portScanner';
import { Server, AlertCircle, Clock, Wifi, Lock, Unlock } from 'lucide-react';

interface PortResultProps {
  result: ScanResult | null;
}

export const PortResult: React.FC<PortResultProps> = ({ result }) => {
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

  // Count open ports
  const openPorts = result.ports.filter(p => p.state === 'open').length;
  
  // Group ports by state
  const portsByState = {
    open: result.ports.filter(p => p.state === 'open'),
    closed: result.ports.filter(p => p.state === 'closed'),
    filtered: result.ports.filter(p => p.state === 'filtered')
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
    >
      <div className="flex items-center mb-6">
        <Server className="h-6 w-6 text-primary mr-2" />
        <h2 className="text-2xl font-bold">Port Scan Results for {result.host}</h2>
      </div>
      
      {/* Scan Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Wifi className="h-5 w-5 text-primary mr-2" />
            <div className="text-sm text-muted-foreground">Host IP</div>
          </div>
          <div className="font-medium text-lg">{result.ip}</div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Clock className="h-5 w-5 text-primary mr-2" />
            <div className="text-sm text-muted-foreground">Scan Duration</div>
          </div>
          <div className="font-medium text-lg">{result.duration}</div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center mb-2">
            {openPorts > 0 ? (
              <Unlock className="h-5 w-5 text-yellow-500 mr-2" />
            ) : (
              <Lock className="h-5 w-5 text-green-500 mr-2" />
            )}
            <div className="text-sm text-muted-foreground">Open Ports</div>
          </div>
          <div className={`font-medium text-lg ${openPorts > 0 ? 'text-yellow-500' : 'text-green-500'}`}>
            {openPorts} found
          </div>
        </div>
      </motion.div>
      
      {/* Open Ports */}
      {portsByState.open.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Unlock className="h-5 w-5 text-yellow-500 mr-2" />
            Open Ports
            <span className="ml-3 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
              {portsByState.open.length}
            </span>
          </h3>
          
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Port</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Service</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {portsByState.open.map((port, index) => (
                  <motion.tr 
                    key={port.port}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: 1,
                      transition: { delay: 0.4 + (index * 0.05) }
                    }}
                  >
                    <td className="px-4 py-3 text-sm font-medium">{port.port}</td>
                    <td className="px-4 py-3 text-sm">{port.service}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        {port.state}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
      
      {/* Closed/Filtered Ports Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
      >
        {portsByState.closed.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Lock className="h-5 w-5 text-green-500 mr-2" />
              <h4 className="font-medium">Closed Ports</h4>
              <span className="ml-3 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                {portsByState.closed.length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              These ports are not accepting connections.
            </p>
          </div>
        )}
        
        {portsByState.filtered.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Server className="h-5 w-5 text-blue-500 mr-2" />
              <h4 className="font-medium">Filtered Ports</h4>
              <span className="ml-3 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                {portsByState.filtered.length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              These ports may be blocked by a firewall or filtered.
            </p>
          </div>
        )}
      </motion.div>
      
      {/* Security Recommendations */}
      {portsByState.open.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-blue-700 mb-3">Security Recommendations</h3>
          <ul className="list-disc list-inside space-y-2 text-blue-600">
            <li>Consider closing unnecessary open ports to reduce attack surface</li>
            <li>Ensure services running on open ports are up-to-date and properly configured</li>
            <li>Use firewalls to restrict access to sensitive services</li>
            <li>Regularly scan for open ports to maintain security posture</li>
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
};