import { getYoutubeVideoURL } from './get-youtube-video';

export const composeTweet = async (
  artist: string,
  songTitle: string,
  year: number
) => {
  const HASHTAGS = '#onThisDay #numberOne #ireland #irish #singlesChart';
  const youTubeVideoURL = await getYoutubeVideoURL(artist, songTitle);

  if (youTubeVideoURL) {
    // eslint-disable-next-line max-len
    const tweet = `On this day ${year} ${artist} - ${songTitle} was No.1 in the charts.
      \n\n${youTubeVideoURL}\n\n${HASHTAGS}`;

    return tweet;
  }

  return false;
};
