/* eslint-disable require-jsdoc */
import { Timestamp } from 'firebase-admin/firestore';

export class Song {
  title: string;
  artists: string;
  startDate: Timestamp;
  endDate: Timestamp;
  posted: boolean;

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

  static fromJson(json: {
    title: string;
    artists: string;
    startDate: string;
    endDate: string;
    posted: boolean
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
