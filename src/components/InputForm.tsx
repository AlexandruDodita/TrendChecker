import React, { useState } from 'react';
import { Platform } from '@/lib/apify';

interface InputFormProps {
  onSubmit: (hashtag: string, platform: Platform) => void;
  isLoading: boolean;
}

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [hashtag, setHashtag] = useState('');
  const [platform, setPlatform] = useState<Platform>('instagram');

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
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Analyze Social Media Trends</h2>
      
      <div className="mb-4">
        <label htmlFor="hashtag" className="block text-sm font-medium text-gray-700 mb-1">
          Enter Hashtag
        </label>
        <input
          type="text"
          id="hashtag"
          value={hashtag}
          onChange={(e) => setHashtag(e.target.value)}
          placeholder="#fitness"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Platform
        </label>
        <div className="flex space-x-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="instagram"
              name="platform"
              checked={platform === 'instagram'}
              onChange={() => setPlatform('instagram')}
              className="h-4 w-4 text-primary focus:ring-primary"
            />
            <label htmlFor="instagram" className="ml-2 text-sm text-gray-700">
              Instagram
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="tiktok"
              name="platform"
              checked={platform === 'tiktok'}
              onChange={() => setPlatform('tiktok')}
              className="h-4 w-4 text-primary focus:ring-primary"
            />
            <label htmlFor="tiktok" className="ml-2 text-sm text-gray-700">
              TikTok
            </label>
          </div>
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isLoading || !hashtag.trim()}
        className={`w-full py-2 px-4 rounded-md text-white text-sm font-medium 
          ${isLoading || !hashtag.trim() 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-primary hover:bg-blue-600'}`}
      >
        {isLoading ? 'Analyzing...' : 'Analyze Trend'}
      </button>
    </form>
  );
} 