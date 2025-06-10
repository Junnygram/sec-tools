// ResultsList.tsx

import React from 'react';
import { CheckResult } from '../component/lib/usernameChecker';
import { ResultCard } from './ResultCard';
import { SkeletonCard } from './SkeletonCard';


interface ResultsListProps {
  results: CheckResult[];
  isLoading: boolean;
}



export const ResultsList = ({ results, isLoading }: ResultsListProps) => {
  if (isLoading) {
    return (
      <div className='flex flex-col items-center'>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!results.length) {
    return null;
  }

  return (
    <div className='flex flex-col items-center '>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {results.map((result, index) => (
          <ResultCard key={index} result={result} />
        ))}
      </div>
    </div>
  );
};
