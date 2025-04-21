'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import InputForm from '@/components/InputForm';
import ResultCard from '@/components/ResultCard';
import useTrendAnalysis from '@/hooks/useTrendAnalysis';
import { Platform } from '@/lib/apify';
import ErrorMessage from '@/components/ErrorMessage';

export default function Home() {
  const { loading, error, posts, stats, analyzeTrend } = useTrendAnalysis();
  const [currentHashtag, setCurrentHashtag] = useState('');
  const [currentPlatform, setCurrentPlatform] = useState<Platform>('instagram');
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = async (hashtag: string, platform: Platform) => {
    setCurrentHashtag(hashtag);
    setCurrentPlatform(platform);
    
    await analyzeTrend(hashtag, platform);
    setShowResults(true);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Social Media Trend Analyzer</h1>
          <p className="mt-3 text-lg text-gray-600">
            Enter a hashtag to analyze trends on Instagram or TikTok
          </p>
        </div>
        
        <InputForm onSubmit={handleSubmit} isLoading={loading} />
        
        {error && (
          <div className="mt-6">
            <ErrorMessage error={error} hashtag={currentHashtag} />
          </div>
        )}
        
        {showResults && !loading && !error && posts.length > 0 && (
          <div className="mt-12">
            <ResultCard 
              hashtag={currentHashtag}
              platform={currentPlatform}
              stats={stats}
              posts={posts}
            />
          </div>
        )}
      </div>
    </main>
  );
} 