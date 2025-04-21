# TrendCheck - Social Media Trend Analyzer

A micro SaaS app that analyzes Instagram hashtag trends using Apify scrapers.

## Features

- Analyze hashtags on Instagram
- View engagement metrics (likes, comments)
- See related trending hashtags
- Browse recent posts for a hashtag
- Rate limiting for API requests

## Tech Stack

- Next.js with TypeScript and static export
- TailwindCSS for styling
- Firebase for user data
- Apify API for social media data scraping
- Upstash Redis for rate limiting

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/trendcheck.git
cd trendcheck
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy the `.env.example` file to `.env` (see example below)
   - Fill in your Firebase credentials
   - Add your Apify key and actor IDs

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

6. To build the application:
```bash
npm run build
```

## Environment Variables

The application requires the following environment variables:

```
# Apify configuration
APIFY_KEY=your_apify_key
APIFY_API_BASE_URL=https://api.apify.com
APIFY_ACTOR_ID_TIKTOK=actor_id_for_tiktok
APIFY_ACTOR_ID_INSTAGRAM=actor_id_for_instagram

# Client-side access to Apify
NEXT_PUBLIC_APIFY_KEY=${APIFY_KEY}
NEXT_PUBLIC_APIFY_API_BASE_URL=${APIFY_API_BASE_URL}
NEXT_PUBLIC_APIFY_ACTOR_ID_TIKTOK=${APIFY_ACTOR_ID_TIKTOK}
NEXT_PUBLIC_APIFY_ACTOR_ID_INSTAGRAM=${APIFY_ACTOR_ID_INSTAGRAM}

# Upstash Redis for rate limiting
NEXT_PUBLIC_UPSTASH_REDIS_REST_URL=your_upstash_url
NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# Firebase config
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
```

### .env.example

Here's a sample `.env.example` file that you can copy and fill in with your own values:

```
# Apify configuration
APIFY_KEY=apify_api_XXXXXXXXXXXXXXXXXXXXXXXXXXXX
APIFY_API_BASE_URL=https://api.apify.com
APIFY_ACTOR_ID_TIKTOK=GdWCkxBtKWOsKjdch
APIFY_ACTOR_ID_INSTAGRAM=shu8hvrXbJbY3Eb9W

# Make these accessible to the client-side
NEXT_PUBLIC_APIFY_KEY=${APIFY_KEY}
NEXT_PUBLIC_APIFY_API_BASE_URL=${APIFY_API_BASE_URL}
NEXT_PUBLIC_APIFY_ACTOR_ID_TIKTOK=${APIFY_ACTOR_ID_TIKTOK}
NEXT_PUBLIC_APIFY_ACTOR_ID_INSTAGRAM=${APIFY_ACTOR_ID_INSTAGRAM}

# Upstash Redis for rate limiting
NEXT_PUBLIC_UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Firebase config
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnopqrstuv
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Apify Input Requirements

The app uses specific input formats for each Apify actor:

#### Instagram Actor Input
```json
{
  "searchType": "hashtag",
  "resultsType": "posts",
  "resultsLimit": 20,
  "hashtags": ["fitness"],
  "search": "fitness"
}
```

## Known Limitations

### Instagram Scraping Restrictions

Instagram actively works to prevent scraping of their platform. You may encounter the following error message when using the application:

```
Apify error: Empty or private data for provided input
```

This is a common response from the Apify actors and typically indicates:

- Instagram's anti-scraping measures are blocking the request
- The hashtag has limited public content or doesn't exist
- Content may be restricted or private
- Temporary rate limiting is in effect

### Recommendations

For testing and demos, try using very popular hashtags which are more likely to return results:
- #travel
- #food
- #fitness
- #photography
- #fashion

## License

MIT 