import { getYoutubeVideoURL } from './get-youtube-video-url';

export const composeTweet = async (
  artists: string,
  songTitle: string,
  year: number
) => {
  const HASHTAGS =
    '#OnThisDay #SinglesChart #NumberOne #No1 ' +
    '#2FM #TodayFM #Ireland #Irish';
  const youTubeVideoURL = await getYoutubeVideoURL(artists, songTitle);

  if (youTubeVideoURL) {
    const tweet = `On this day ${year} - ${artists} - ${songTitle} - ` +
      `topped the charts. ☘️\n\n${youTubeVideoURL}\n\n${HASHTAGS}`;

    return tweet;
  }

  return false;
};
