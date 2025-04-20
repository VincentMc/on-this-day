import { Song } from '../../src/models/song';
import { Timestamp } from 'firebase-admin/firestore';

describe('Song Model', () => {
  it('should correctly initialize a Song instance using the constructor', () => {
    const title = 'Song Title';
    const artists = 'Artist Name';
    const startDate = '2023-01-01';
    const endDate = '2023-01-07';
    const posted = false;

    const song = new Song(title, artists, startDate, endDate, posted);

    expect(song.title).toBe(title);
    expect(song.artists).toBe(artists);
    expect(song.startDate).toEqual(Timestamp.fromDate(new Date(startDate)));
    expect(song.endDate).toEqual(Timestamp.fromDate(new Date(endDate)));
    expect(song.posted).toBe(posted);
  });

  it('should correctly create a Song instance from JSON using fromJson', () => {
    const json = {
      title: 'Song Title',
      artists: 'Artist Name',
      startDate: '2023-01-01',
      endDate: '2023-01-07',
      posted: true,
    };

    const song = Song.fromJson(json);

    expect(song.title).toBe(json.title);
    expect(song.artists).toBe(json.artists);
    expect(song.startDate).toEqual(Timestamp.fromDate(new Date(json.startDate)));
    expect(song.endDate).toEqual(Timestamp.fromDate(new Date(json.endDate)));
    expect(song.posted).toBe(json.posted);
  });
});
