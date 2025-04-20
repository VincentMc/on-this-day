import { Timestamp } from 'firebase-admin/firestore';

/**
 * Represents a song with metadata.
 */
export class Song {
  title: string;
  artists: string;
  startDate: Timestamp;
  endDate: Timestamp;
  posted: boolean;

  /**
   * Creates an instance of Song.
   * @param {string} title - The title of the song.
   * @param {string} artists - The artists of the song.
   * @param {string} startDate - The start date of the song's relevance.
   * @param {string} endDate - The end date of the song's relevance.
   * @param {boolean} posted - Whether the song has been posted.
   */
  constructor(
    title: string,
    artists: string,
    startDate: string,
    endDate: string,
    posted: boolean
  ) {
    this.title = title;
    this.artists = artists;
    this.startDate = Timestamp.fromDate(new Date(startDate));
    this.endDate = Timestamp.fromDate(new Date(endDate));
    this.posted = posted;
  }

  /**
   * Creates a Song instance from a JSON object.
   * @param {object} json - The JSON object containing song data.
   * @param {string} json.title - The title of the song.
   * @param {string} json.artists - The artists of the song.
   * @param {string} json.startDate - The start date of the song's relevance.
   * @param {string} json.endDate - The end date of the song's relevance.
   * @param {boolean} json.posted - Whether the song has been posted.
   * @return {Song} A new Song instance.
   */
  static fromJson(json: {
    title: string;
    artists: string;
    startDate: string;
    endDate: string;
    posted: boolean;
  }): Song {
    return new Song(
      json.title,
      json.artists,
      json.startDate,
      json.endDate,
      json.posted
    );
  }
}
