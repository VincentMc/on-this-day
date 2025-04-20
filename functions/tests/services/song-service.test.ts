import { getSongForToday } from '../../src/services/song-service';
import { vi } from 'vitest';

describe('getSongForToday', () => {
  const mockCollection = {
    where: vi.fn().mockReturnThis(),
    get: vi.fn(),
  };

  it('should return a song if a matching song is found', async () => {
    const mockSnapshot = {
      empty: false,
      docs: [
        {
          id: 'song1',
          data: () => ({
            startDate: { toDate: () => new Date('2000-01-01') },
            endDate: { toDate: () => new Date('2000-12-31') },
            artists: 'Artist Name',
            title: 'Song Title',
          }),
        },
      ],
    };

    mockCollection.get.mockResolvedValueOnce(mockSnapshot);

    const result = await getSongForToday(mockCollection as any);

    expect(result).toEqual({
      id: 'song1',
      year: 2000,
      artists: 'Artist Name',
      title: 'Song Title',
    });
  });

  it('should return null if no matching song is found', async () => {
    const mockSnapshot = { empty: true, docs: [] };
    mockCollection.get.mockResolvedValueOnce(mockSnapshot);

    const result = await getSongForToday(mockCollection as any);

    expect(result).toBeNull();
  });
});
