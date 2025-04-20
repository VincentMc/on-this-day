import { getYoutubeVideoURL } from './youtube-service';

const HASHTAGS =
  '#onthisday #singleschart #numberone #no1 ' +
  '#2fm #todayfm #ireland #eire';

export const composeTweet = async (
  artists: string,
  songTitle: string,
  year: number
) => {
  const youTubeVideoURL = await getYoutubeVideoURL(artists, songTitle);

  if (youTubeVideoURL) {
    const tweetVariations = [
      `On this day in ${year}, ${artists} hit number one with "${songTitle}". Relive the moment! ☘️\n\n${youTubeVideoURL}\n\n${HASHTAGS}`,
      `Throwback to ${year}! "${songTitle}" by ${artists} was topping the charts. 🎶\n\n${youTubeVideoURL}\n\n${HASHTAGS}`,
    ];

    const randomIndex = Math.floor(Math.random() * tweetVariations.length);
    return tweetVariations[randomIndex];
  }

  return false;
};
