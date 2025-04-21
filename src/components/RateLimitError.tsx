import React from 'react';
import { RateLimitResult } from '@/lib/rateLimiter';

interface RateLimitErrorProps {
  rateLimitResult: RateLimitResult;
}

export default function RateLimitError({ rateLimitResult }: RateLimitErrorProps) {
  // Format reset time
  const resetTime = rateLimitResult.reset.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const resetDate = rateLimitResult.reset.toLocaleDateString([], {
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-yellow-500 p-4">
        <h3 className="text-lg font-medium text-white">Rate Limit Reached</h3>
      </div>
      
      <div className="p-6">
        <div className="text-gray-800 mb-4">
          <p className="font-medium text-lg mb-2">Daily request limit exceeded</p>
          <p className="text-gray-600">
            You have reached your limit of {rateLimitResult.limit} trend analyses per day. 
            This helps us keep our service running smoothly for everyone.
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md text-sm mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Daily limit:</span>
            <span className="font-medium">{rateLimitResult.limit} requests</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Remaining:</span>
            <span className="font-medium">{rateLimitResult.remaining} requests</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Resets at:</span>
            <span className="font-medium">{resetTime} on {resetDate}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-500">
          Please try again after your limit resets. Thank you for understanding.
        </p>
      </div>
    </div>
  );
} 