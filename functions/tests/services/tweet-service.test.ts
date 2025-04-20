import { composeTweet } from '../../src/services/tweet-service';
import { getYoutubeVideoURL } from '../../src/services/youtube-service';
import { vi } from 'vitest';

vi.mock('../../src/services/youtube-service', () => ({
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
