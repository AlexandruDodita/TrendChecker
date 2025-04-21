import { useState } from 'react';
import { runSocialMediaScraper, getDatasetResults, normalizeData, Platform, SocialMediaPost } from '@/lib/apify';

export interface TrendAnalysisResult {
  posts: SocialMediaPost[];
  stats: {
    totalPosts: number;
    avgLikes: number;
    avgComments: number;
    topHashtags: { tag: string; count: number }[];
  };
  loading: boolean;
  error: string | null;
}

export default function useTrendAnalysis() {
  const [result, setResult] = useState<TrendAnalysisResult>({
    posts: [],
    stats: {
      totalPosts: 0,
      avgLikes: 0,
      avgComments: 0,
      topHashtags: [],
    },
    loading: false,
    error: null,
  });

  const analyzeTrend = async (hashtag: string, platform: Platform) => {
    try {
      console.log(`Analyzing trend for ${hashtag} on ${platform}`);
      setResult(prev => ({ ...prev, loading: true, error: null }));
      
      // Run the scraper
      const datasetId = await runSocialMediaScraper(hashtag, platform);
      console.log(`Successfully got dataset ID: ${datasetId}`);
      
      // Get the results
      const rawData = await getDatasetResults(datasetId);
      console.log(`Retrieved ${rawData.length} items from dataset`);
      
      // Check if the data contains an error message
      if (rawData.length === 1 && rawData[0].error) {
        const errorMessage = rawData[0].errorDescription || rawData[0].error || "No data available";
        throw new Error(`Apify error: ${errorMessage}`);
      }
      
      if (rawData.length === 0) {
        throw new Error(`No data found for hashtag ${hashtag} on ${platform}`);
      }
      
      // Normalize the data
      const posts = normalizeData(rawData, platform);
      console.log(`Normalized ${posts.length} posts`);
      
      if (posts.length === 0) {
        throw new Error(`Unable to process data for hashtag ${hashtag}. Instagram may be restricting access.`);
      }
      
      // Calculate stats
      const totalPosts = posts.length;
      const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
      const totalComments = posts.reduce((sum, post) => sum + (post.comments || 0), 0);
      const avgLikes = totalPosts > 0 ? Math.round(totalLikes / totalPosts) : 0;
      const avgComments = totalPosts > 0 ? Math.round(totalComments / totalPosts) : 0;
      
      // Extract hashtags from captions
      const hashtagRegex = /#(\w+)/g;
      const hashtagCounts: Record<string, number> = {};
      
      posts.forEach(post => {
        if (post.caption) {
          const matches = post.caption.match(hashtagRegex);
          if (matches) {
            matches.forEach(tag => {
              const cleanTag = tag.toLowerCase();
              hashtagCounts[cleanTag] = (hashtagCounts[cleanTag] || 0) + 1;
            });
          }
        }
      });
      
      // Get top hashtags
      const topHashtags = Object.entries(hashtagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      
      console.log('Analysis complete');
      setResult({
        posts,
        stats: {
          totalPosts,
          avgLikes,
          avgComments,
          topHashtags,
        },
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      setResult(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      }));
    }
  };

  return {
    ...result,
    analyzeTrend,
  };
} 