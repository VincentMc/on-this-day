import * as dotenv from 'dotenv';
import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { DocumentData } from 'firebase-admin/firestore';
import { TwitterApi } from 'twitter-api-v2';
import { composeTweet } from './compose-tweet';

dotenv.config();

const {
  TWITTER_CLIENT_ID,
  TWITTER_CLIENT_SECRET,
  CALLBACK_URL,
} = process.env;

// Initialise twitter client
const twitterClient = new TwitterApi({
  clientId: TWITTER_CLIENT_ID,
  clientSecret: TWITTER_CLIENT_SECRET,
});


// Initialize firebase
admin.initializeApp();

const authTokesnDbRef = admin.firestore().doc('tokens/twitter-auth');
const irishNumberOnes = admin.firestore().collection('ireland-number-ones');

export const auth = onRequest(async (request, response) => {
  const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(
    CALLBACK_URL,
    { scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'] }
  );

  console.log(url);
  console.log(codeVerifier);
  console.log(state);

  await authTokesnDbRef.set({ codeVerifier, state });

  response.redirect(url);
});

export const callback = onRequest(async (request, response) => {
  const { state, code } = request.query;

  const dbSnapshot = await authTokesnDbRef.get();
  const snapShotData = dbSnapshot.data();

  if (!snapShotData) {
    response.status(400).send('No data retreived');
  }

  const { codeVerifier, state: storedState } = snapShotData;

  if (state !== storedState) {
    response.status(400).send('Stored tokens didnt match');
  }

  const {
    accessToken,
    refreshToken,
  } = await twitterClient.loginWithOAuth2({
    code: `${code}`, codeVerifier, redirectUri: CALLBACK_URL,
  });

  // access and refresh tokens
  await authTokesnDbRef.set({ accessToken, refreshToken });

  response.sendStatus(200);
});

export const getSong = onRequest(async (request, response) => {
  const numberOneSnapShot = await irishNumberOnes
    .where('artists', '==', 'vince').get();

  let songData: DocumentData;

  numberOneSnapShot.forEach((element) => {
    songData = element.data();
  });

  response.send(songData);
});

export const tweet = onRequest(async (request, response) => {
  // Query firebase for list of songs that that were number one on todays date
  // That have not been posted before
  // Select one at random
  // Tweet it
  // Update that record to be posted so it will be excluded from future queries

  const { refreshToken } = (await authTokesnDbRef.get()).data();

  const {
    client: refreshedClient,
    accessToken,
    refreshToken: newRefreshToken,
  } = await twitterClient.refreshOAuth2Token(refreshToken);

  await authTokesnDbRef.set({ accessToken, refreshToken: newRefreshToken });

  const tweet = await composeTweet(
    'Flo Rida',
    'Whistle',
    2012
  );

  if (tweet) {
    const { data } = await refreshedClient.v2.tweet(tweet);

    response.status(200).send(data);
    return;
  }

  response.status(200).send('No valid tweet to send');
});
