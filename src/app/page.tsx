'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import InputForm from '@/components/InputForm';
import ResultCard from '@/components/ResultCard';
import useTrendAnalysis from '@/hooks/useTrendAnalysis';
import { Platform } from '@/lib/apify';
import ErrorMessage from '@/components/ErrorMessage';
import RateLimitError from '@/components/RateLimitError';
import { checkRateLimit, RateLimitResult } from '@/lib/rateLimiter';
import Image from 'next/image';

export default function Home() {
  const { loading, error, posts, stats, analyzeTrend } = useTrendAnalysis();
  const [currentHashtag, setCurrentHashtag] = useState('');
  // TikTok functionality disabled for production
  const [currentPlatform] = useState<Platform>('instagram');
  const [showResults, setShowResults] = useState(false);
  const [rateLimitResult, setRateLimitResult] = useState<RateLimitResult | null>(null);
  
  // Generate a stable user identifier - in production you would use
  // something more reliable like an actual user ID or stable session ID
  const [userId, setUserId] = useState('');
  useEffect(() => {
    // Generate a simple user identifier based on browser fingerprint
    // This is not perfect but works for demonstration
    const generateUserId = () => {
      const userAgent = navigator.userAgent;
      const screenInfo = `${window.screen.width}x${window.screen.height}`;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const fingerprint = `${userAgent}|${screenInfo}|${timezone}`;
      
      // Create a simple hash
      let hash = 0;
      for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return `user_${Math.abs(hash)}`;
    };
    
    if (!userId) {
      setUserId(generateUserId());
    }
  }, [userId]);

  const handleSubmit = async (hashtag: string, platform: Platform) => {
    setCurrentHashtag(hashtag);
    
    // Check rate limit before making the request
    if (userId) {
      const result = await checkRateLimit(userId);
      
      if (!result.success) {
        // User has exceeded rate limit
        setRateLimitResult(result);
        return;
      }
      
      // Reset rate limit error if previously shown
      setRateLimitResult(null);
    }
    
    // Proceed with the API request
    await analyzeTrend(hashtag, platform);
    setShowResults(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section aria-labelledby="hero-heading" className="text-center mb-16 relative">
          <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-5">
            <div className="w-96 h-96 rounded-full bg-primary blur-3xl"></div>
          </div>
          <h1 id="hero-heading" className="text-5xl font-bold text-gray-900 mb-4">
            <span className="text-primary">Trend</span>Check
          </h1>
          <p className="mt-3 text-xl text-gray-600 max-w-2xl mx-auto">
            Analyze Instagram hashtag trends and gain valuable insights for your marketing strategy
          </p>
          <div className="flex justify-center mt-6 space-x-4">
            <div className="flex items-center text-gray-700 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm-1-5a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm-3-2a1 1 0 011-1h7a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Instant Analysis
            </div>
            <div className="flex items-center text-gray-700 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h3a1 1 0 011 1v3a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L6 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L9 10.586l3.293-3.293A1 1 0 0112 7z" clipRule="evenodd" />
              </svg>
              Trending Insights
            </div>
            <div className="flex items-center text-gray-700 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Marketing Suggestions
            </div>
          </div>
        </section>
        
        <section aria-labelledby="input-form-heading" className="bg-white shadow-xl rounded-2xl p-6 lg:p-8 mb-12 border border-gray-100">
          <h2 id="input-form-heading" className="sr-only">Hashtag Input Form</h2> {/* Screen reader only heading */}
          <InputForm onSubmit={handleSubmit} isLoading={loading} />
        </section>
        
        {/* Rate limit error */}
        {rateLimitResult && !rateLimitResult.success && (
          <div className="mt-6">
            <RateLimitError rateLimitResult={rateLimitResult} />
          </div>
        )}
        
        {/* API error */}
        {error && !rateLimitResult && (
          <div className="mt-6">
            <ErrorMessage error={error} hashtag={currentHashtag} />
          </div>
        )}
        
        {loading && !error && !rateLimitResult && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Analyzing hashtag trends...</p>
          </div>
        )}
        
        {showResults && !loading && !error && !rateLimitResult && posts.length > 0 && (
          <section aria-labelledby="results-heading" className="mt-12">
            <h2 id="results-heading" className="sr-only">Analysis Results for {currentHashtag}</h2> {/* Screen reader only heading */}
            <ResultCard 
              hashtag={currentHashtag}
              platform={currentPlatform}
              stats={stats}
              posts={posts}
            />
          </section>
        )}
        
        {/* Google AdSense Space */}
        {showResults && !loading && !error && posts.length > 0 && (
          <aside aria-label="Advertisement" className="mt-16 mb-8 mx-auto">
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">ADVERTISEMENT</h3>
              </div>
              <div className="flex items-center justify-center bg-gray-50 p-2">
                {/* AdSense Placeholder - Replace with actual AdSense code */}
                <div className="bg-gray-100 w-full h-32 sm:h-40 md:h-48 lg:h-64 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">Google AdSense - Replace with your ad code</p>
                </div>
              </div>
            </div>
          </aside>
        )}
        
        {/* Features Section */}
        <section id="features" aria-labelledby="features-heading" className="py-12 scroll-mt-20">
          <div className="text-center mb-12">
            <h2 id="features-heading" className="text-3xl font-bold text-gray-900">Why Use TrendCheck?</h2>
            <p className="mt-3 text-gray-600">Get valuable insights for your social media marketing strategy</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Trend Analysis</h3>
              <p className="text-gray-600">Discover which hashtags are trending and how they perform over time.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Engagement Metrics</h3>
              <p className="text-gray-600">Get detailed engagement stats to improve your content strategy.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Audience Insights</h3>
              <p className="text-gray-600">Understand your audience better with related hashtag suggestions.</p>
            </div>
          </div>
        </section>
      </div>
      
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold">TrendCheck</h2>
              <p className="text-gray-400 text-sm mt-1">Social Media Trend Analysis</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">About</a>
              <a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a>
              <a href="#" className="text-gray-300 hover:text-white">Terms of Service</a>
              <a href="#" className="text-gray-300 hover:text-white">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} TrendCheck. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
} 