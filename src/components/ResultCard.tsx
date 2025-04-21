import React from 'react';
import { SocialMediaPost } from '@/lib/types';

interface ResultCardProps {
  hashtag: string;
  platform: string;
  stats: {
    totalPosts: number;
    avgLikes: number;
    avgComments: number;
    topHashtags: { tag: string; count: number }[];
  };
  posts: SocialMediaPost[];
}

export default function ResultCard({ hashtag, platform, stats, posts }: ResultCardProps) {
  // Check if we have metadata information from the API
  const hasMetadata = posts.length > 0 && posts[0]?.metadata;
  const metadata = hasMetadata ? posts[0].metadata : null;
  
  // Separate info post from sample posts if metadata exists
  const infoPost = hasMetadata ? posts[0] : null;
  const samplePosts = hasMetadata ? posts.slice(1) : posts;

  return (
    <article className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
      <header className="bg-gradient-to-r from-primary to-blue-600 p-6 text-white">
        <h2 className="text-3xl font-bold">Results for {hashtag}</h2>
        <p className="text-sm opacity-80 mt-1">Platform: {platform.charAt(0).toUpperCase() + platform.slice(1)}</p>
      </header>

      <div className="p-6">
        {/* Metadata section if available */}
        {metadata && (
          <section aria-labelledby="hashtag-info-heading" className="mb-8 bg-blue-50 p-4 rounded-lg">
            <h3 id="hashtag-info-heading" className="text-xl font-semibold text-primary mb-4">Hashtag Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {metadata.postCount !== undefined && (
                <div className="bg-white p-3 rounded-md shadow-sm border border-gray-200">
                  <span className="block text-2xl font-bold text-primary">{metadata.postCount.toLocaleString()}</span>
                  <span className="text-sm text-gray-600">Total Posts</span>
                </div>
              )}
              {metadata.postsPerDay !== undefined && (
                <div className="bg-white p-3 rounded-md shadow-sm border border-gray-200">
                  <span className="block text-2xl font-bold text-primary">{metadata.postsPerDay}</span>
                  <span className="text-sm text-gray-600">Avg Posts/Day</span>
                </div>
              )}
              {metadata.difficulty && (
                <div className="bg-white p-3 rounded-md shadow-sm border border-gray-200">
                  <span className="block text-2xl font-bold text-primary">{metadata.difficulty}</span>
                  <span className="text-sm text-gray-600">Competition</span>
                </div>
              )}
              {metadata.averageLikes !== undefined && metadata.averageLikes > 0 && (
                <div className="bg-white p-3 rounded-md shadow-sm border border-gray-200">
                  <span className="block text-2xl font-bold text-primary">{metadata.averageLikes.toLocaleString()}</span>
                  <span className="text-sm text-gray-600">Avg Likes/Post</span>
                </div>
              )}
              {metadata.averageComments !== undefined && metadata.averageComments > 0 && (
                <div className="bg-white p-3 rounded-md shadow-sm border border-gray-200">
                  <span className="block text-2xl font-bold text-primary">{metadata.averageComments.toLocaleString()}</span>
                  <span className="text-sm text-gray-600">Avg Comments/Post</span>
                </div>
              )}
              {metadata.engagement && (
                <div className="bg-white p-3 rounded-md shadow-sm border border-gray-200">
                  <span className="block text-2xl font-bold text-primary">{metadata.engagement}</span>
                  <span className="text-sm text-gray-600">Engagement Rate</span>
                </div>
              )}
            </div>
            
            {metadata.related && metadata.related.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-blue-800 mb-2">Related Hashtags</h4>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-blue-100/50 rounded border border-blue-200">
                  {metadata.related.map((tag, index) => {
                    const hashtagText = typeof tag === 'string' 
                      ? tag.replace('#', '') 
                      : tag.hash ? tag.hash.replace('#', '') : '';
                    
                    return hashtagText ? (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm whitespace-nowrap shadow-sm">
                        #{hashtagText}
                        {typeof tag === 'object' && tag.info && <small className="ml-1 opacity-70">({tag.info})</small>}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Overall Stats section - removed as stats are now in metadata section */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <span className="block text-3xl font-bold text-primary">{stats.totalPosts}</span>
            <span className="text-sm text-gray-600">Total Posts</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <span className="block text-3xl font-bold text-primary">{stats.avgLikes.toLocaleString()}</span>
            <span className="text-sm text-gray-600">Average Likes</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <span className="block text-3xl font-bold text-primary">{stats.avgComments.toLocaleString()}</span>
            <span className="text-sm text-gray-600">Average Comments</span>
          </div>
        </div> */}

        {/* Top Related Hashtags from Caption Analysis - removed as it's redundant with metadata */}
        {/* {stats.topHashtags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Top Related Hashtags</h3>
            <div className="flex flex-wrap gap-2">
              {stats.topHashtags.map((item, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  #{item.tag.replace('#', '')} ({item.count})
                </span>
              ))}
            </div>
          </div>
        )} */}

        {samplePosts.length > 0 && (
          <section aria-labelledby="recent-posts-heading" className="mt-8">
            <h3 id="recent-posts-heading" className="text-xl font-semibold text-gray-900 mb-4">Sample Posts for {hashtag}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {samplePosts.map((post, index) => (
                <div key={index} className="border rounded-lg overflow-hidden shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
                  {post.imageUrl && !post.imageUrl.includes('placeholder') && (
                    <div className="h-48 overflow-hidden bg-gray-100">
                      <img 
                        src={post.imageUrl} 
                        alt={`Instagram post for ${hashtag} by ${post.username}: ${post.caption?.substring(0, 50)}...` || `Instagram post ${index + 1} for ${hashtag}`}
                        className="w-full h-full object-cover"
                        loading="lazy" // Lazy load images
                      />
                    </div>
                  )}
                  <div className="p-3">
                    <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-700 hover:text-primary hover:underline">@{post.username}</a>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 h-8">{post.caption || 'No caption available'}</p>
                    <div className="flex justify-between mt-2 text-xs text-gray-600 border-t pt-2 border-gray-100">
                      <span>❤️ {post.likes?.toLocaleString() || 'N/A'}</span>
                      <span>💬 {post.comments?.toLocaleString() || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
 