import * as admin from 'firebase-admin';
import * as data from '../data/all-years.json';
import { Song } from '../src/models/song';

admin.initializeApp();

const irishNumberOnes = admin.firestore().collection('ireland-number-ones');

const importData = async () => {
  try {
    for (const songJson of data) {
      const song = Song.fromJson(songJson);
      await irishNumberOnes.add({ ...song });
    }

    console.log(`Successfully imported ${data.length} records.`);
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    process.exit();
  }
};

importData();
