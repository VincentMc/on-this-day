import * as dotenv from 'dotenv';
import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
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

export const tweet = onRequest(async (request, response) => {
  const { refreshToken } = (await authTokesnDbRef.get()).data();

  const {
    client: refreshedClient,
    accessToken,
    refreshToken: newRefreshToken,
  } = await twitterClient.refreshOAuth2Token(refreshToken);

  await authTokesnDbRef.set({ accessToken, refreshToken: newRefreshToken });

  const song = await getSongForToday();

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

const getSongForToday = async () => {
  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  const numberOneSnapshot = await irishNumberOnes
    .where('posted', '==', false)
    .get();

  if (numberOneSnapshot.empty) return null;

  const matchingSongs = numberOneSnapshot.docs
    .map((doc) => {
      const data = doc.data() as {
        startDate: FirebaseFirestore.Timestamp;
        endDate: FirebaseFirestore.Timestamp;
        artists: string;
        title: string;
      };
      return { id: doc.id, ...data };
    })
    .filter((song) => {
      const startDate = song.startDate.toDate();
      const endDate = song.endDate.toDate();

      const startMonth = startDate.getMonth() + 1;
      const startDay = startDate.getDate();

      const endMonth = endDate.getMonth() + 1;
      const endDay = endDate.getDate();

      const isAfterStart =
        todayMonth > startMonth ||
        (todayMonth === startMonth && todayDay >= startDay);
      const isBeforeEnd =
        todayMonth < endMonth ||
        (todayMonth === endMonth && todayDay <= endDay);

      return isAfterStart && isBeforeEnd;
    });

  if (matchingSongs.length === 0) {
    return null;
  }

  // Pick one song at random from the matching songs
  const randomIndex = Math.floor(Math.random() * matchingSongs.length);
  const selectedSong = matchingSongs[randomIndex];

  // Derive the year from the startDate of the selected song
  const year = selectedSong.startDate.toDate().getFullYear();

  return {
    id: selectedSong.id,
    year, // Include the derived year
    artists: selectedSong.artists,
    title: selectedSong.title,
  };
};

export const getSong = onRequest(async (request, response) => {
  try {
    const song = await getSongForToday();

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
