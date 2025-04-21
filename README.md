# TrendCheck - Social Media Trend Analyzer

A micro SaaS app that analyzes Instagram and TikTok trends using Apify scrapers.

## Features

- Analyze hashtags on Instagram and TikTok
- View engagement metrics (likes, comments)
- See related trending hashtags
- Browse recent posts for a hashtag

## Tech Stack

- Next.js with TypeScript 
- TailwindCSS for styling
- Firebase (Firestore + Auth) for user data
- Apify API for social media data scraping

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
   - Rename `.env.example` to `.env` (if not already done)
   - Fill in your Firebase credentials in the `.env` file
   - Add your Apify key and actor IDs (already included for demo purposes)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Set up Authentication with Google provider and Anonymous login
3. Create a Firestore database
4. Add your Firebase config to the `.env` file

## Apify Setup

1. Create an account on [Apify](https://apify.com)
2. Get your API key from the Apify console
3. Find the actor IDs for Instagram and TikTok scrapers
4. Add these details to your `.env` file

### Apify Input Requirements

The app uses specific input formats for each Apify actor:

#### Instagram Actor Input (shu8hvrXbJbY3Eb9W - Default)
```json
{
  "searchType": "hashtag",
  "resultsType": "posts",
  "resultsLimit": 20,
  "hashtags": ["fitness"],
  "search": "fitness"
}
```

#### TikTok Actor Input
```json
{
  "hashtags": ["fitness"],
  "resultsPerPage": 20,
  "shouldDownloadVideos": false,
  "shouldDownloadCovers": false,
  "proxyCountryCode": "None"
}
```

If you're using different Apify actors, you may need to modify these input formats in `src/lib/apify.ts`.

## Using the Apify API Tester

The application includes a built-in API tester to help troubleshoot Apify integration. Access it at [http://localhost:3000/test](http://localhost:3000/test).

The tester provides four modes:

1. **Start Run** - Starts a new Apify actor run and returns the run ID
2. **Check Run Status** - Checks if a run has completed and if data is available
3. **Fetch Dataset** - Retrieves data from a dataset once a run is complete
4. **Full Integration** - Performs all steps automatically (may take longer)

### How to Use the Tester

1. Start a new run:
   - Select "Start Run" mode
   - Enter a hashtag and select platform
   - Click "Run Test"
   - Note the run ID in the response

2. Check run status:
   - Select "Check Run Status" mode
   - Input the run ID from the previous step
   - Click "Run Test"
   - Repeat until status shows "SUCCEEDED" or "FINISHED"

3. Fetch dataset:
   - Select "Fetch Dataset" mode
   - Input the dataset ID from the status response
   - Click "Run Test" to view the scraped data

This workflow helps isolate issues with the Apify API integration.

## Known Limitations

### Instagram & TikTok Scraping Restrictions

Both Instagram and TikTok actively work to prevent scraping of their platforms. You may encounter the following error message when using the application:

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

### Alternative Approaches

If you continue to face issues with the Apify scraping actors, consider these alternatives:

1. Use Instagram's official Graph API (requires business/creator account and app approval)
2. Try different scraping services that may have better access
3. Consider using a cache or database of previously scraped data as a fallback

## License

MIT 