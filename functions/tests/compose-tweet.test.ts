import { composeTweet } from '../src/compose-tweet';
import { getYoutubeVideoURL } from '../src/get-youtube-video-url';
import { vi } from 'vitest';

vi.mock('../src/get-youtube-video-url', () => ({
  getYoutubeVideoURL: vi.fn().mockResolvedValue('https://youtube.com/watch?v=test'),
}));

describe('composeTweet', () => {
  it('should return a valid tweet with a YouTube URL', async () => {
    const tweet = await composeTweet('Artist Name', 'Song Title', 2020);

    expect(tweet).toContain('2020');
    expect(tweet).toContain('Artist Name');
    expect(tweet).toContain('Song Title');
    expect(tweet).toContain('https://youtube.com/watch?v=test');
  });

  it('should return false if no YouTube URL is available', async () => {
    vi.mocked(getYoutubeVideoURL).mockResolvedValueOnce(null);

    const tweet = await composeTweet('Artist Name', 'Song Title', 2020);

    expect(tweet).toBe(false);
  });
});
