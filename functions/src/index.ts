import {onRequest} from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import * as admin from 'firebase-admin';
import {DocumentData} from 'firebase-admin/firestore';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// Initialize firebase
admin.initializeApp();
const irishNumberOnes = admin.firestore().collection('ireland-number-ones');

export const helloWorld = onRequest((request, response) => {
  logger.info('Hello logs!', {structuredData: true});
  response.send('Hello from Firebase!');
});

export const checkSongs = onRequest(async (request, response) => {
  const numberOneSnapShot = await irishNumberOnes
    .where('artists', '==', 'vince').get();

  let songData: DocumentData;

  numberOneSnapShot.forEach((element) => {
    songData = element.data();
  });

  response.send(songData);
});

export const checkYoutube = onRequest(async (request, response) => {
  console.log('');

  response.send('Hello Dude!');
});

// export const populate = onRequest(async (request, response) => {

//   console.log(noughties);

//   response.send(noughties);
// });
