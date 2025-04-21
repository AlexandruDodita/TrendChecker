import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TrendCheck - Social Media Trend Analyzer',
  description: 'Analyze Instagram and TikTok trends using hashtags',
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