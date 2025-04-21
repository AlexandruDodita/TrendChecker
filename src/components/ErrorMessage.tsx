import React from 'react';

interface ErrorMessageProps {
  error: string;
  hashtag?: string;
}

export default function ErrorMessage({ error, hashtag }: ErrorMessageProps) {
  // Determine if this is an Apify "no_items" error
  const isNoItemsError = error.includes('Empty or private data');
  
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-red-600 p-4">
        <h3 className="text-lg font-medium text-white">Unable to Analyze Trend</h3>
      </div>
      
      <div className="p-6">
        <div className="text-red-800 mb-4">
          <p className="font-medium">Error Details:</p>
          <pre className="text-sm whitespace-pre-wrap break-words mt-1">{error}</pre>
        </div>
        
        {isNoItemsError && (
          <div className="bg-gray-50 p-4 rounded-md text-sm">
            <p className="font-medium mb-2">Possible reasons:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>The hashtag <span className="font-bold">{hashtag}</span> may have restricted content</li>
              <li>Instagram/TikTok has implemented new scraping prevention measures</li>
              <li>The hashtag may not exist or has very limited public content</li>
              <li>There may be temporary rate limiting on the API</li>
            </ul>
            
            <p className="mt-4 font-medium">Suggestions:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Try a more popular hashtag (e.g., #travel, #food, #fitness)</li>
              <li>Try again in a few minutes</li>
              <li>Make sure the hashtag doesn't contain special characters</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 