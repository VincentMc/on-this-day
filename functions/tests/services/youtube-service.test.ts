import { getYoutubeVideoURL } from '../../src/services/youtube-service';
import { vi } from 'vitest';

describe('getYoutubeVideoURL', () => {
  const YOUTUBE_API_KEY = 'test-api-key';
  const YOUTUBE_WATCH_URL = 'https://www.youtube.com/watch?v=';
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
    process.env.YOUTUBE_API_KEY = YOUTUBE_API_KEY;
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllGlobals();
  });

  it('should return a YouTube video URL when a video is found', async () => {
    const mockResponse = {
      items: [
        {
          id: {
            videoId: 'testVideoId',
          },
        },
      ],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await getYoutubeVideoURL('Artist Name', 'Song Title');
    expect(result).toBe(`${YOUTUBE_WATCH_URL}testVideoId`);
    expect(mockFetch).toHaveBeenCalledWith(
      `https://youtube.googleapis.com/youtube/v3/search?maxResults=1&order=relevance&relevanceLanguage=en&q=Artist Name Song Title&key=${YOUTUBE_API_KEY}`
    );
  });

  it('should log an error if the API request fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => null);

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const result = await getYoutubeVideoURL('Artist Name', 'Song Title');

    expect(result).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'YouTube API request failed with status: 500'
    );

    consoleErrorSpy.mockRestore();
  });
});
