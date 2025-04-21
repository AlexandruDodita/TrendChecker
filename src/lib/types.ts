export type SocialMediaPost = {
  caption: string;
  likes: number;
  comments: number;
  url: string;
  imageUrl: string;
  username: string;
  timestamp: string;
  metadata?: {
    postCount?: number;
    postsPerDay?: number;
    difficulty?: string;
    related?: Array<string | { hash: string; info: string }>;
    engagement?: string;
    averageLikes?: number;
    averageComments?: number;
    [key: string]: any;
  };
}; 