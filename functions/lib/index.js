"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkYoutube = exports.checkSongs = exports.helloWorld = void 0;
const https_1 = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
// Start writing functions
// https://firebase.google.com/docs/functions/typescript
// Initialize firebase
admin.initializeApp();
const irishNumberOnes = admin.firestore().collection('ireland-number-ones');
exports.helloWorld = (0, https_1.onRequest)((request, response) => {
    logger.info('Hello logs!', { structuredData: true });
    response.send('Hello from Firebase!');
});
exports.checkSongs = (0, https_1.onRequest)(async (request, response) => {
    const numberOneSnapShot = await irishNumberOnes
        .where('artists', '==', 'vince').get();
    let songData;
    numberOneSnapShot.forEach((element) => {
        songData = element.data();
    });
    response.send(songData);
});
exports.checkYoutube = (0, https_1.onRequest)(async (request, response) => {
    console.log('');
    response.send('Hello Dude!');
});
// export const populate = onRequest(async (request, response) => {
//   console.log(noughties);
//   response.send(noughties);
// });
//# sourceMappingURL=index.js.map