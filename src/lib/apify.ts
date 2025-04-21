interface ApifyRunResponse {
  id: string;
  actId: string;
  actRunId: string;
  status: string;
  statusMessage: string;
  defaultDatasetId: string;
  // Add more properties as needed
}

interface ApifyDatasetItemResponse {
  data: any[];
}

import { SocialMediaPost } from './types';

// Error fields that might be returned by Apify
export interface ApifyErrorResponse {
  error?: string;
  errorDescription?: string;
}

export type Platform = 'instagram' | 'tiktok';

// --- Direct Env Check --- 
console.log("[apify.ts top-level] NEXT_PUBLIC_APIFY_ACTOR_ID_INSTAGRAM:", process.env.NEXT_PUBLIC_APIFY_ACTOR_ID_INSTAGRAM);
console.log("[apify.ts top-level] NEXT_PUBLIC_APIFY_ACTOR_ID_TIKTOK:", process.env.NEXT_PUBLIC_APIFY_ACTOR_ID_TIKTOK);
// --- End Direct Env Check ---

// Function to run an Apify task to scrape social media
export async function runSocialMediaScraper(hashtag: string, platform: Platform): Promise<string> {
  // --- Direct Env Check inside function --- 
  console.log("[runSocialMediaScraper] NEXT_PUBLIC_APIFY_ACTOR_ID_INSTAGRAM:", process.env.NEXT_PUBLIC_APIFY_ACTOR_ID_INSTAGRAM);
  console.log("[runSocialMediaScraper] NEXT_PUBLIC_APIFY_ACTOR_ID_TIKTOK:", process.env.NEXT_PUBLIC_APIFY_ACTOR_ID_TIKTOK);
  // --- End Direct Env Check ---
  
  const apiKey = process.env.NEXT_PUBLIC_APIFY_KEY || '';
  const apiBaseUrl = process.env.NEXT_PUBLIC_APIFY_API_BASE_URL || 'https://api.apify.com';
  
  const actorId = platform === 'instagram' 
    ? process.env.NEXT_PUBLIC_APIFY_ACTOR_ID_INSTAGRAM 
    : process.env.NEXT_PUBLIC_APIFY_ACTOR_ID_TIKTOK;
  
  if (!actorId) {
    throw new Error(`Actor ID for ${platform} not found`);
  }

  console.log(`Starting ${platform} scraper for hashtag: ${hashtag}`);
  console.log(`Using actor ID: ${actorId}`);

  // Create the appropriate input for each platform
  const cleanHashtag = hashtag.replace('#', '').trim();
  
  // Specific input format for each platform
  const input = platform === 'instagram' 
    ? {
        // Original Instagram input format (for shu8hvrXbJbY3Eb9W)
        searchType: "hashtag",
        resultsType: "posts",
        resultsLimit: 3, // Reduced from 10 to 3 to save costs
        maxRequestsPerCrawl: 5, // Limit the total number of API requests
        maxConcurrency: 1, // Reduce concurrency to prevent excessive requests
        hashtags: [cleanHashtag],
        search: cleanHashtag
      }
    : {
        // TikTok specific format
        hashtags: [cleanHashtag],
        resultsPerPage: 3, // Reduced from 10 to 3
        maxRequestsPerCrawl: 5, // Limit the total number of API requests
        shouldDownloadVideos: false,
        shouldDownloadCovers: false,
        proxyCountryCode: "None"
      };

  console.log(`Using input format for ${platform}:`, JSON.stringify(input));

  // Step 1: Start the actor run
  const startRunResponse = await fetch(`${apiBaseUrl}/v2/acts/${actorId}/runs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(input),
  });

  if (!startRunResponse.ok) {
    const errorText = await startRunResponse.text();
    console.error('Apify API Error:', errorText);
    throw new Error(`Failed to start Apify task: ${startRunResponse.statusText}`);
  }

  const responseData = await startRunResponse.json();
  console.log('Apify run started:', responseData);
  
  // Check if response is wrapped in a data object
  const data = responseData.data || responseData;
  
  // Extract the run ID and dataset ID
  const runId = data.id;
  if (!runId) {
    console.error('No run ID returned in the response:', data);
    throw new Error('No run ID returned from Apify');
  }
  
  let datasetId = data.defaultDatasetId;
  console.log(`Run started with ID: ${runId}, initial dataset ID: ${datasetId || 'not available yet'}`);
  
  // Step 2: Poll for completion
  console.log('Waiting for actor run to complete...');
  const maxAttempts = 60; // Reduced from 60 to 30 (30 * 2 seconds = 60 seconds max wait)
  let attempts = 0;
  let runFinished = false;
  let runInfo;
  
  while (!runFinished && attempts < maxAttempts) {
    attempts++;
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between polls
    
    console.log(`Checking run status (attempt ${attempts}/${maxAttempts})...`);
    const statusResponse = await fetch(`${apiBaseUrl}/v2/acts/${actorId}/runs/${runId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      }
    });
    
    if (!statusResponse.ok) {
      console.warn(`Failed to check run status: ${statusResponse.statusText}`);
      continue;
    }
    
    runInfo = await statusResponse.json();
    const runData = runInfo.data || runInfo;
    console.log(`Run status: ${runData.status}`);
    
    // Check if run is finished
    if (['SUCCEEDED', 'FINISHED', 'FAILED', 'ABORTED', 'TIMED_OUT'].includes(runData.status)) {
      runFinished = true;
      console.log('Run completed with status:', runData.status);
      
      if (['FAILED', 'ABORTED', 'TIMED_OUT'].includes(runData.status)) {
        // Try to get more details about the failure
        let detailedError = `Apify run failed with status: ${runData.status}`;
        try {
          const finalStatusResponse = await fetch(`${apiBaseUrl}/v2/acts/${actorId}/runs/${runId}`, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
          });
          if (finalStatusResponse.ok) {
            const finalRunInfo = await finalStatusResponse.json();
            const finalRunData = finalRunInfo.data || finalRunInfo;
            console.error("Failed Run Details:", finalRunData);
            // Look for common error fields
            const message = finalRunData.statusMessage || finalRunData.errorMessage || JSON.stringify(finalRunData);
            detailedError = `Apify run failed with status ${runData.status}: ${message}`;
          } else {
            console.warn("Could not fetch final failed run details.");
          }
        } catch (fetchError) {
          console.warn("Error fetching final failed run details:", fetchError);
        }
        throw new Error(detailedError);
      }
      
      // Update dataset ID if it wasn't available initially
      if (!datasetId && runData.defaultDatasetId) {
        datasetId = runData.defaultDatasetId;
      }
    }
  }
  
  if (!runFinished) {
    throw new Error('Apify run timed out while waiting for completion');
  }
  
  // Make sure we have a dataset ID
  if (!datasetId) {
    // Try to extract it from the run info
    const runData = runInfo?.data || runInfo;
    if (runData?.defaultDatasetId) {
      datasetId = runData.defaultDatasetId;
    } else {
      throw new Error('No dataset ID found after run completion');
    }
  }
  
  console.log(`Run completed, using dataset ID: ${datasetId}`);
  return datasetId;
}

// Function to get results from a dataset
export async function getDatasetResults(datasetId: string): Promise<SocialMediaPost[]> {
  const apiKey = process.env.NEXT_PUBLIC_APIFY_KEY || '';
  const apiBaseUrl = process.env.NEXT_PUBLIC_APIFY_API_BASE_URL || 'https://api.apify.com';

  console.log(`Fetching results from dataset: ${datasetId}`);

  const response = await fetch(`${apiBaseUrl}/v2/datasets/${datasetId}/items`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Apify Dataset API Error:', errorText);
    throw new Error(`Failed to get dataset results: ${response.statusText}`);
  }

  const responseData = await response.json();
  console.log('Dataset response structure:', JSON.stringify(responseData).substring(0, 200) + '...');
  
  // Handle different response formats
  let items: any[] = [];
  
  if (Array.isArray(responseData)) {
    // If response is directly an array
    items = responseData;
  } else if (responseData.data && Array.isArray(responseData.data)) {
    // If response has data property that is an array
    items = responseData.data;
  } else if (responseData.data && responseData.data.items && Array.isArray(responseData.data.items)) {
    // If response has nested data.items that is an array
    items = responseData.data.items;
  } else {
    console.error('Unexpected response format:', responseData);
    throw new Error('Unexpected response format from Apify');
  }
  
  console.log(`Retrieved ${items.length} items from dataset`);
  return items as SocialMediaPost[];
}

// Normalize data from different platforms to a common format
export function normalizeData(data: any[], platform: Platform): SocialMediaPost[] {
  // Check if data contains an error message
  if (data.length === 1 && data[0].error) {
    console.error('Apify returned an error:', data[0]);
    // Return an empty array but log the error
    return [];
  }
  
  if (platform === 'instagram') {
    // Handle Instagram data
    console.log('Instagram data sample:', JSON.stringify(data.slice(0, 1)));
    
    // Check if the response is a hashtag metadata response
    if (data.length > 0 && data[0].hasOwnProperty('name') && data[0].hasOwnProperty('postsCount')) {
      // This is metadata about hashtags, not posts
      console.log('Received hashtag metadata instead of posts');
      
      // See if there's a 'posts' array inside the hashtag object
      const firstItem = data[0];
      if (firstItem.posts && Array.isArray(firstItem.posts)) {
        console.log(`Found ${firstItem.posts.length} posts in the hashtag metadata`);
        return firstItem.posts.map((post: any) => ({
          caption: post.caption || post.text,
          likes: post.likesCount || post.likes || 0,
          comments: post.commentsCount || post.comments || 0,
          url: post.url || post.postUrl,
          imageUrl: post.imageUrl || post.thumbnailUrl || post.displayUrl,
          username: post.ownerUsername || post.username || post.author || 'Unknown',
          timestamp: post.timestamp || post.created || new Date().toISOString(),
        }));
      }
      
      // If we don't have posts, return the hashtag as a single post-like object
      // Collect all related hashtags from different categories
      const allRelatedTags = [
        ...(firstItem.related || []),
        ...(firstItem.average || []),
        ...(firstItem.rare || []),
        ...(firstItem.relatedFrequent || [])
      ];

      return [{
        caption: `#${firstItem.name} - ${firstItem.postsCount} posts`,
        likes: firstItem.averageLikes || 0,
        comments: firstItem.averageComments || 0,
        url: firstItem.url,
        imageUrl: '',
        username: firstItem.name,
        timestamp: new Date().toISOString(),
        metadata: {
          postCount: firstItem.postsCount,
          postsPerDay: firstItem.postsPerDay,
          difficulty: firstItem.difficulty,
          related: allRelatedTags.slice(0, 30) // Limit to 30 related tags to prevent UI overload
        }
      }];
    }
    
    // Standard post format
    return data.map(item => ({
      caption: item.caption,
      likes: item.likesCount,
      comments: item.commentsCount,
      url: item.url,
      imageUrl: item.imageUrl || item.thumbnailUrl,
      username: item.ownerUsername,
      timestamp: item.timestamp,
    }));
  } else {
    return data.map(item => ({
      caption: item.text || item.description,
      likes: item.likesCount || item.diggCount,
      comments: item.commentCount,
      url: item.webVideoUrl || item.url,
      imageUrl: item.thumbnailUrl || item.covers?.[0],
      username: item.authorMeta?.name || item.author,
      timestamp: item.createTime,
    }));
  }
} 