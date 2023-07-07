export const getYoutubeVideoURL = async (artist: string, songTitle: string) => {
  const YOUTUBE_WATCH_URL = 'https://www.youtube.com/watch?v=';
  const apiKey = process.env.YOUTUBE_API_KEY;

  const response = await fetch(
    `https://youtube.googleapis.com/youtube/v3/search?maxResults=1&order=relevance&q=${artist} - ${songTitle}&key=${apiKey}`
  );

  if (response.ok) {
    const { items: [video] } = await response.json();
    const { id: { videoId } } = video;

    return YOUTUBE_WATCH_URL + videoId;
  }

  return null;
};
