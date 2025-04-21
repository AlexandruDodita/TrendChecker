import { NextResponse } from 'next/server';
import { runSocialMediaScraper, getDatasetResults, normalizeData } from '@/lib/apify';

// Increasing timeout for server route to allow for longer API calls
export const maxDuration = 120; // 2 minutes timeout

export async function GET(request: Request) {
  try {
    // Extract hashtag and platform from URL params
    const { searchParams } = new URL(request.url);
    const hashtag = searchParams.get('hashtag') || 'travel';
    const platform = (searchParams.get('platform') || 'instagram') as 'instagram' | 'tiktok';
    const mode = searchParams.get('mode') || 'full'; // 'full', 'direct', 'dataset'
    
    console.log(`API route: Testing ${platform} scraper for hashtag: #${hashtag}, mode: ${mode}`);
    
    if (mode === 'direct') {
      // Make a direct API call to Apify to test the response format
      const apiKey = process.env.NEXT_PUBLIC_APIFY_KEY || '';
      const apiBaseUrl = process.env.NEXT_PUBLIC_APIFY_API_BASE_URL || 'https://api.apify.com';
      
      const actorId = platform === 'instagram' 
        ? process.env.NEXT_PUBLIC_APIFY_ACTOR_ID_INSTAGRAM 
        : process.env.NEXT_PUBLIC_APIFY_ACTOR_ID_TIKTOK;
        
      console.log(`Making direct API call to Apify actor ${actorId}`);
      
      const cleanHashtag = hashtag.replace('#', '').trim();
      
      // Specific input format for each platform (in direct mode)
      const input = platform === 'instagram' 
        ? {
            // Original Instagram input format (for shu8hvrXbJbY3Eb9W)
            searchType: "hashtag",
            resultsType: "posts",
            resultsLimit: 5,
            hashtags: [cleanHashtag],
            search: cleanHashtag
          }
        : {
            // TikTok specific format
            hashtags: [cleanHashtag],
            resultsPerPage: 5,
            shouldDownloadVideos: false,
            shouldDownloadCovers: false,
            proxyCountryCode: "None"
          };
      
      const response = await fetch(`${apiBaseUrl}/v2/acts/${actorId}/runs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(input),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json({ 
          success: false, 
          error: `API responded with status ${response.status}: ${errorText}`
        }, { status: response.status });
      }
      
      const data = await response.json();
      return NextResponse.json({ 
        success: true, 
        message: 'Direct API call successful',
        rawResponse: data
      });
    } else if (mode === 'dataset') {
      // Test fetching from an existing dataset
      const datasetId = searchParams.get('datasetId');
      if (!datasetId) {
        return NextResponse.json({ 
          success: false, 
          error: 'No datasetId provided' 
        }, { status: 400 });
      }
      
      const results = await getDatasetResults(datasetId);
      const normalizedResults = normalizeData(results, platform);
      
      return NextResponse.json({
        success: true,
        message: `Successfully retrieved ${results.length} items from dataset`,
        datasetId,
        resultsCount: results.length,
        normalizedCount: normalizedResults.length,
        sampleResults: normalizedResults.slice(0, 2),
      });
    } else if (mode === 'status') {
      // Check the status of a run
      const runId = searchParams.get('runId');
      if (!runId) {
        return NextResponse.json({ 
          success: false, 
          error: 'No runId provided' 
        }, { status: 400 });
      }
      
      const apiKey = process.env.NEXT_PUBLIC_APIFY_KEY || '';
      const apiBaseUrl = process.env.NEXT_PUBLIC_APIFY_API_BASE_URL || 'https://api.apify.com';
      const actorId = platform === 'instagram' 
        ? process.env.NEXT_PUBLIC_APIFY_ACTOR_ID_INSTAGRAM 
        : process.env.NEXT_PUBLIC_APIFY_ACTOR_ID_TIKTOK;
      
      const response = await fetch(`${apiBaseUrl}/v2/acts/${actorId}/runs/${runId}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json({ 
          success: false, 
          error: `API responded with status ${response.status}: ${errorText}`
        }, { status: response.status });
      }
      
      const data = await response.json();
      return NextResponse.json({ 
        success: true, 
        message: 'Status check successful',
        runStatus: data
      });
    } else {
      // Run the full flow (default)
      // Run the scraper
      const datasetId = await runSocialMediaScraper(hashtag, platform);
      
      // Get results
      const results = await getDatasetResults(datasetId);
      
      // Normalize the data
      const normalizedResults = normalizeData(results, platform);
      
      // Return the results
      return NextResponse.json({
        success: true,
        message: 'Full test successful',
        datasetId,
        resultsCount: results.length,
        normalizedCount: normalizedResults.length,
        sampleResults: normalizedResults.slice(0, 2),
      });
    }
  } catch (error) {
    console.error('API test route error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }, 
      { status: 500 }
    );
  }
} 