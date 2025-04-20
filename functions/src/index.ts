import * as dotenv from 'dotenv';
import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { TwitterApi } from 'twitter-api-v2';
import { composeTweet } from './services/tweet-service';
import { getSongForToday } from './services/song-service';

dotenv.config();

const {
  TWITTER_CLIENT_ID,
  TWITTER_CLIENT_SECRET,
  CALLBACK_URL,
} = process.env;

const twitterClient = new TwitterApi({
  clientId: TWITTER_CLIENT_ID,
  clientSecret: TWITTER_CLIENT_SECRET,
});

admin.initializeApp();

const authTokesnDbRef = admin.firestore().doc('tokens/twitter-auth');
const irishNumberOnes = admin.firestore().collection('ireland-number-ones');

export const auth = onRequest(async (request, response) => {
  const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(
    CALLBACK_URL,
    { scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'] }
  );

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

  await authTokesnDbRef.set({ accessToken, refreshToken });

  response.sendStatus(200);
});

export const tweet = onRequest(async (request, response) => {
  const { refreshToken } = (await authTokesnDbRef.get()).data();

  const {
    client: refreshedClient,
    accessToken,
    refreshToken: newRefreshToken,
  } = await twitterClient.refreshOAuth2Token(refreshToken);

  await authTokesnDbRef.set({ accessToken, refreshToken: newRefreshToken });

  const song = await getSongForToday(irishNumberOnes);

  if (!song) {
    response.status(200).send('No song found for today');
    return;
  }
  const { year, id, artists, title } = song;

  const tweet = await composeTweet(
    artists,
    title,
    year
  );

  if (tweet) {
    const { data } = await refreshedClient.v2.tweet(tweet);

    await irishNumberOnes.doc(id).update({ posted: true });

    response.status(200).send(data);
    return;
  }

  response.status(200).send('No valid tweet to send');
});

export const getSong = onRequest(async (request, response) => {
  try {
    const song = await getSongForToday(irishNumberOnes);

    if (!song) {
      response.status(404).send('No songs found for today');
      return;
    }

    response.status(200).send(song);
  } catch (error) {
    console.error('Error retrieving songs:', error);
    response.status(500).send('Internal Server Error');
  }
});
