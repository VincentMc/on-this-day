import { getYoutubeVideoURL } from './get-youtube-video-url';

export const composeTweet = async (
  artist: string,
  songTitle: string,
  year: number
) => {
  const HASHTAGS =
    '#OnThisDay #SinglesChart #NumberOne #No1 ' +
    '#2FM #TodayFM #Ireland #Irish #IrishLife';
  const youTubeVideoURL = await getYoutubeVideoURL(artist, songTitle);

  if (youTubeVideoURL) {
    const tweet = `On this day ${year} || ${artist} - ${songTitle} || ` +
      `topped the charts. ☘️\n\n${youTubeVideoURL}\n\n${HASHTAGS}`;

    return tweet;
  }

  return false;
};
