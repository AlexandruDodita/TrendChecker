import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TrendCheck - Instagram Hashtag Trend Analyzer | Social Media Insights',
  description: 'Analyze Instagram hashtag trends, check engagement metrics, and discover related hashtags to boost your social media strategy. Get instant insights with TrendCheck.',
  keywords: ['hashtag analyzer', 'instagram trends', 'social media analytics', 'hashtag tracking', 'engagement metrics', 'trend check', 'social media marketing'],
  robots: 'index, follow',
  openGraph: {
    title: 'TrendCheck - Instagram Hashtag Trend Analyzer',
    description: 'Get instant insights into Instagram hashtag performance and discover related trends.',
    type: 'website',
    url: 'YOUR_DEPLOYED_URL', // Replace with your actual deployed URL
    // Add an image URL for social sharing preview
    // images: [
    //   {
    //     url: 'YOUR_OG_IMAGE_URL', // Replace with your image URL
    //     width: 1200,
    //     height: 630,
    //     alt: 'TrendCheck Social Media Analyzer',
    //   },
    // ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrendCheck - Instagram Hashtag Trend Analyzer',
    description: 'Analyze Instagram hashtag performance and discover related trends instantly.',
    // Add your Twitter handle if you have one
    // creator: '@YourTwitterHandle',
    // Add an image URL for Twitter card preview
    // images: ['YOUR_TWITTER_IMAGE_URL'], // Replace with your image URL
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 