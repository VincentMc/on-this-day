import { getYoutubeVideoURL } from './get-youtube-video-url';

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
      `Feeling nostalgic? In ${year}, ${artists} ruled the charts with "${songTitle}". 🎤\n\n${youTubeVideoURL}\n\n${HASHTAGS}`,
      `Chart-topper alert! "${songTitle}" by ${artists} was number one on this day in ${year}. 🏆\n\n${youTubeVideoURL}\n\n${HASHTAGS}`,
    ];

    // Randomly select one of the tweet variations
    const randomIndex = Math.floor(Math.random() * tweetVariations.length);
    return tweetVariations[randomIndex];
  }

  return false;
};
