const YOUTUBE_WATCH_URL = 'https://www.youtube.com/watch?v=';
const YOUTUBE_API_BASE_URL = 'https://youtube.googleapis.com/youtube/v3/search';
const DEFAULT_QUERY_PARAMS = '?maxResults=1&order=relevance&relevanceLanguage=en&q=';

export const getYoutubeVideoURL = async (artist: string, songTitle: string) => {
  const apiKey = process.env.YOUTUBE_API_KEY;

  const response = await fetch(
    `${YOUTUBE_API_BASE_URL}${DEFAULT_QUERY_PARAMS}${artist} - ${songTitle}&key=${apiKey}`
  );

  if (response.ok) {
    const { items: [video] } = await response.json();
    const { id: { videoId } } = video;

    return YOUTUBE_WATCH_URL + videoId;
  }

  console.error(`YouTube API request failed with status: ${response.status}`);
  return null;
};
