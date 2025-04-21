'use client';

import React from 'react';
import ApifyTester from '@/components/ApifyTester';
import Navbar from '@/components/Navbar';

export default function TestPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">API Test Page</h1>
          <p className="mt-3 text-lg text-gray-600">
            Use this page to test the Apify API integration directly
          </p>
        </div>
        
        <ApifyTester />
        
        <div className="mt-12 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Troubleshooting Guide</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">1. Direct API Call</h3>
              <p className="text-sm text-gray-600">
                Tests the direct connection to Apify API. This will show you the raw response structure 
                which can help identify where the dataset ID is located.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">2. Dataset Fetch</h3>
              <p className="text-sm text-gray-600">
                If you already have a dataset ID (from a previous run or from the Apify console),
                you can test fetching and parsing that dataset directly.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">3. Full Integration</h3>
              <p className="text-sm text-gray-600">
                Tests the entire flow from starting a scraper to retrieving and processing results.
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> If you see "No dataset ID returned" errors, check the response 
                from the Direct API Call mode to understand the structure and update the apify.ts file accordingly.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 p-6 bg-yellow-50 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-yellow-800">Known API Limitations</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-yellow-800">Instagram Scraping Restrictions</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Instagram has implemented strict measures to prevent scraping their platform. The Apify
                actors may return "Empty or private data" errors for many hashtags, especially:
              </p>
              <ul className="list-disc list-inside text-sm text-yellow-700 mt-2 space-y-1">
                <li>Less popular hashtags with limited content</li>
                <li>Hashtags with restricted or sensitive content</li>
                <li>Hashtags with special characters</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-yellow-800">Best Practices</h3>
              <p className="text-sm text-yellow-700 mt-1">
                For testing, try these popular hashtags which are more likely to work:
              </p>
              <ul className="mt-2 space-y-1">
                <li className="px-2 py-1 bg-white rounded inline-block mr-2 text-sm">#travel</li>
                <li className="px-2 py-1 bg-white rounded inline-block mr-2 text-sm">#food</li>
                <li className="px-2 py-1 bg-white rounded inline-block mr-2 text-sm">#fitness</li>
                <li className="px-2 py-1 bg-white rounded inline-block mr-2 text-sm">#photography</li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-md">
              <p className="text-sm font-medium">
                Note: Even with the improved error handling, you may still encounter "Empty or private data" 
                errors due to Instagram's scraping prevention measures. This is a limitation of using 
                third-party scraping tools with platforms that actively discourage scraping.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 