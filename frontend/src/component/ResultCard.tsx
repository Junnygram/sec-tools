// ResultCard.tsx

import React from 'react';
import { CheckResult } from '../component/lib/usernameChecker';
import { Check, X, HelpCircle } from 'lucide-react';
import { cn } from '../component/lib/utils';
import Link from 'next/link';

interface ResultCardProps {
  result: CheckResult;
}

export const ResultCard= ({ result }: ResultCardProps) => {
  const getStatusIcon = () => {
    if (result.status === 'available') {
      return <Check className="h-6 w-6 text-available" />;
    } else {
      return <X className="h-6 w-6 text-unavailable" />;
    // } else {
    //   return <HelpCircle className="h-6 w-6 text-unknown" />;
    }
  };

  const getStatusText = () => {
    if (result.status === 'available') {
      return "Available";
      // } else if (result.status === 'unavailable') {
      //   return "taken";
      // }
    }
     else   {
          return "taken";
        }
      }

  const getBorderColor = () => {
    if (result.status === 'available') {
      return "border-green-500";
    } else if (result.status === 'unavailable') {
      return "border-red-500";
    } else {
      return "border-amber-500";
    }
  };
  

  return (
    <div className={cn("transition-all hover:shadow-md border rounded-md ", getBorderColor())}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
           
              {getStatusIcon()}
            </div>
            <div>
              <h3 className="font-medium">{result.platform.name}</h3>
              <Link target="_blank"  href= {result.url} className="text-sm text-blue-800  text-muted-foreground truncate">
                {result.url}
              </Link>
            </div>
          </div>
          <div
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              result.status === 'available' ? "bg-green-100 text-green-800" :
              result.status === 'unavailable' ? "bg-red-100 text-red-800" :
              "bg-amber-100 text-amber-800"
            )}
          >
            {getStatusText()}
          </div>
        </div>
      </div>
    </div>
  );
};
