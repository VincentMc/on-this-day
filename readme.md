# On This Day

A bot that tweets the number one songs in Ireland on this day across the last 30 years. Songs are stored in Firestore.

---

## Features

- **Tweet Irish Number One Songs**: Automatically tweets the number one song on this day in history.
- **Firestore Integration**: Stores and retrieves chart data from Firestore.
- **YouTube Integration**: Includes a YouTube video link for the song in the tweet.
- **Google Cloud Functions**: Uses Firebase Cloud Functions for serverless execution.
- **Cloud Scheduler**: Automatically triggers the bot daily to post tweets.

---

## Dependencies

### **Google Cloud Functions**

This project uses Firebase Cloud Functions to handle serverless execution. The bot logic, including fetching songs, composing tweets, and posting to Twitter, is implemented as HTTP-triggered functions. These functions are deployed to Google Cloud and can be triggered via HTTP requests or Cloud Scheduler.

### **Cloud Firestore**

Firestore is used as the database to store and retrieve historical chart data. Each song entry includes details like the title, artist, start and end dates, and whether it has already been tweeted. Firestore provides a scalable and serverless NoSQL database for this project.

### **Cloud Scheduler**

Cloud Scheduler is used to automate the daily execution of the bot. It triggers the Firebase function responsible for tweeting the number one song for the day. This ensures the bot runs consistently without manual intervention.

Configured seperately read more here: https://cloud.google.com/scheduler/docs

### **YouTube API**

The YouTube API is used to fetch video links for the songs, which are included in the tweets. This enhances the tweet content by providing a direct link to the song's video.

### **Twitter API**

The Twitter API is used to authenticate the bot and post tweets. It handles OAuth2 authentication and provides the functionality to post tweets programmatically.

---

## Prerequisites

- **Node.js**: Version 18 or higher.
- **Firebase CLI**: Install via `npm install -g firebase-tools`.
- **YouTube API Key**: Required for fetching YouTube video URLs.
- **Twitter API Credentials**: Required for tweeting.
- **Google Cloud Project**: Ensure you have a Google Cloud project with Firestore, Cloud Functions, and Cloud Scheduler enabled.

---

## Setup

1. Clone the repository:

```bash
git clone https://github.com/VincentMc/on-this-day.git
cd on-this-day/functions
```

2. Install Dependencies:

```bash
yarn install
```

3. Set up environment variables:
   Create a `.env` file in the `functions` directory and add the following variables:

```bash
YOUTUBE_API_KEY=your_youtube_api_key
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
CALLBACK_URL=your_twitter_callback_url
```

4. Deploy Firebase Functions:

```bash
firebase deploy --only functions
```

5. Configure Cloud Scheduler:
   - Set up a Cloud Scheduler job in your Google Cloud project to trigger the bot's function daily.
   - Use the HTTP trigger URL of the deployed function.

---

## Usage

Once deployed, the bot will automatically:

1. Fetch the number one song for the current day from Firestore.
2. Compose a tweet with the song details and a YouTube link.
3. Post the tweet using the Twitter API.

You can also manually trigger the bot using the Firebase CLI or the HTTP trigger URL.

---

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. Unit tests are included to ensure the functionality of the bot's components, such as composing tweets and interacting with external APIs.

### Running Tests

To run the tests, use the following command:

```bash
yarn test
```

### Watching Tests

To run tests in watch mode, use:

```bash
yarn test:watch
```

### Test Coverage

To generate a test coverage report, run:

```bash
yarn test:coverage
```

The coverage report will be available in the `coverage/` directory.

### Writing Tests

Test files are located in the `tests` directory and follow the naming convention `*.test.ts`. Ensure new features are covered by appropriate unit tests.
