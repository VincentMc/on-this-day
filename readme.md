# On This Day - Irish Number One Songs Bot

A bot that tweets the number one songs in Ireland on this day across the last 30 years. Songs are stored in Firestore, and number ones are tweeted daily.

---

## Features

- **Tweet Irish Number One Songs**: Automatically tweets the number one song on this day in history.
- **Firestore Integration**: Stores and retrieves chart data from Firestore.
- **YouTube Integration**: Includes a YouTube video link for the song in the tweet.
- **Firebase Functions**: Uses Firebase Cloud Functions for serverless execution.

---

## Prerequisites

- **Node.js**: Version 18 or higher.
- **Firebase CLI**: Install via `npm install -g firebase-tools`.
- **YouTube API Key**: Required for fetching YouTube video URLs.
- **Twitter API Credentials**: Required for tweeting.

---

## Setup

1. Clone the repository:

```
git clone https://github.com/your-username/on-this-day.git
cd on-this-day/functions
```

2. Install dependencies:

```
yarn install
```

3. Set up environment variables:

Create a `.env` file in the `functions` directory and add the following variables:

```env
YOUTUBE_API_KEY=your_youtube_api_key
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET_KEY=your_twitter_api_secret_key
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
```

4. Deploy Firebase Functions:

```bash
firebase deploy --only functions
```

5. Schedule the bot:

Use Firebase's Cloud Scheduler to trigger the bot daily. Set up a cron job in the Firebase Console to call the deployed function.
