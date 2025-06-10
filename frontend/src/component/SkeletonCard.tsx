
import React from 'react';

export const SkeletonCard= () => {
  return (
    <div className="transition-all  border rounded-md hover:shadow-md animate-pulse   ">
      <div className="p-4">
        <div className="flex items-center justify-between">
     
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 h-6 w-6 bg-gray-300 rounded-full" />
            <div className="space-y-1">
              <div className="h-4 w-24 bg-gray-300 rounded" />
              <div className="h-3 w-40 bg-gray-200 rounded" />
            </div>
          </div>
         
          <div className="h-6 w-20 bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  );
};


