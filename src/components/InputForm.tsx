import React, { useState } from 'react';
import { Platform } from '@/lib/apify';

interface InputFormProps {
  onSubmit: (hashtag: string, platform: Platform) => void;
  isLoading: boolean;
}

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [hashtag, setHashtag] = useState('');
  // Set Instagram as the only platform - TikTok disabled for production
  const [platform] = useState<Platform>('instagram');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hashtag.trim()) {
      // Ensure hashtag has the # prefix
      const formattedHashtag = hashtag.trim().startsWith('#') 
        ? hashtag.trim()
        : `#${hashtag.trim()}`;
      
      onSubmit(formattedHashtag, platform);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Start Your Hashtag Analysis</h2>
        <p className="mt-2 text-gray-600">Enter a hashtag below to discover Instagram trends and insights</p>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
        <div className="flex-1">
          <label htmlFor="hashtag" className="block text-sm font-medium text-gray-700 mb-2">
            Hashtag to Analyze
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-lg">#</span>
            </div>
            <input
              type="text"
              id="hashtag"
              value={hashtag.startsWith('#') ? hashtag.substring(1) : hashtag}
              onChange={(e) => setHashtag(e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`)}
              placeholder="fitness"
              className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-200"
              required
            />
          </div>
        </div>
        
        {/* Platform selector removed - TikTok disabled for production */}
        {/* <div className="md:w-64">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Platform
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div 
              className={`border rounded-lg p-3 flex items-center cursor-pointer transition duration-200 ${
                platform === 'instagram' 
                  ? 'border-primary bg-blue-50 text-primary' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setPlatform('instagram')}
            >
              <div className="mr-2">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </div>
              <span>Instagram</span>
            </div>
            <div 
              className={`border rounded-lg p-3 flex items-center cursor-pointer transition duration-200 ${
                platform === 'tiktok' 
                  ? 'border-primary bg-blue-50 text-primary' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setPlatform('tiktok')}
            >
              <div className="mr-2">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </div>
              <span>TikTok</span>
            </div>
          </div>
        </div> */}
        
        <div className="md:w-48">
          <button
            type="submit"
            disabled={isLoading || !hashtag.trim()}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center transition duration-200
              ${isLoading || !hashtag.trim() 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-primary hover:bg-blue-600 shadow-md hover:shadow-lg'}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Analyze Now
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        We respect your privacy - no personal data is stored during analysis
      </div>
    </form>
  );
} 