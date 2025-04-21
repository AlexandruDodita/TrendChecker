import React from 'react';
import { SocialMediaPost } from '@/lib/apify';

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
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-primary p-6 text-white">
        <h2 className="text-2xl font-bold">Results for {hashtag}</h2>
        <p className="text-sm opacity-80">Platform: {platform.charAt(0).toUpperCase() + platform.slice(1)}</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        </div>

        {stats.topHashtags.length > 0 && (
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
        )}

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Posts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.slice(0, 6).map((post, index) => (
              <div key={index} className="border rounded-lg overflow-hidden shadow-sm">
                {post.imageUrl && (
                  <div className="h-48 overflow-hidden">
                    <img src={post.imageUrl} alt={post.caption || 'Post'} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-700">@{post.username}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{post.caption}</p>
                  <div className="flex justify-between mt-2 text-xs text-gray-600">
                    <span>❤️ {post.likes?.toLocaleString() || 'N/A'}</span>
                    <span>💬 {post.comments?.toLocaleString() || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
