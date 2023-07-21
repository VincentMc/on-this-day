import { getYoutubeVideoURL } from './get-youtube-video';

export const composeTweet = async (
  artist: string,
  songTitle: string,
  year: number
) => {
  // eslint-disable-next-line max-len
  const HASHTAGS = '#OnThisDay #SinglesChart #NumberOne #No1 #2FM #TodayFM #Ireland #Irish #IrishLife';
  const youTubeVideoURL = await getYoutubeVideoURL(artist, songTitle);

  if (youTubeVideoURL) {
    // eslint-disable-next-line max-len
    const tweet = `On this day ${year} || ${artist} - ${songTitle} || topped the charts. ☘️
      \n\n${youTubeVideoURL}\n\n${HASHTAGS}`;

    return tweet;
  }

  return false;
};
