interface Song {
  id: string;
  startDate: FirebaseFirestore.Timestamp;
  endDate: FirebaseFirestore.Timestamp;
  artists: string;
  title: string;
  posted: boolean;
}

const mapSongData = (doc: FirebaseFirestore.QueryDocumentSnapshot): Song => {
  const data = doc.data() as {
    startDate: FirebaseFirestore.Timestamp;
    endDate: FirebaseFirestore.Timestamp;
    artists: string;
    title: string;
    posted: boolean;
  };
  return { id: doc.id, ...data };
};

const extractMonthAndDay = (date: Date) => ({
  month: date.getMonth() + 1,
  day: date.getDate(),
});

const isDateInRange = (today: Date, startDate: Date, endDate: Date): boolean => {
  const { month: todayMonth, day: todayDay } = extractMonthAndDay(today);
  const { month: startMonth, day: startDay } = extractMonthAndDay(startDate);
  const { month: endMonth, day: endDay } = extractMonthAndDay(endDate);

  const isAfterStart =
    todayMonth > startMonth ||
    (todayMonth === startMonth && todayDay >= startDay);

  const isBeforeEnd =
    todayMonth < endMonth ||
    (todayMonth === endMonth && todayDay <= endDay);

  return isAfterStart && isBeforeEnd;
};

const filterSongsByDate = (songs: Song[], today: Date): Song[] => {
  return songs.filter((song) => {
    const startDate = song.startDate.toDate();
    const endDate = song.endDate.toDate();
    return isDateInRange(today, startDate, endDate);
  });
};

const selectRandomSong = (songs: Song[]): Song => {
  const randomIndex = Math.floor(Math.random() * songs.length);
  return songs[randomIndex];
};

export const getSongForToday = async (
  irishNumberOnes: FirebaseFirestore.CollectionReference
): Promise<{ id: string; year: number; artists: string; title: string } | null> => {
  try {
    const today = new Date();

    const numberOneSnapshot = await irishNumberOnes
      .where('posted', '==', false)
      .get();

    if (numberOneSnapshot.empty) return null;

    const songs = numberOneSnapshot.docs.map(mapSongData) as Song[];
    const matchingSongs = filterSongsByDate(songs, today);

    if (matchingSongs.length === 0) {
      return null;
    }

    const selectedSong = selectRandomSong(matchingSongs);
    const year = selectedSong.startDate.toDate().getFullYear();

    return {
      id: selectedSong.id,
      year,
      artists: selectedSong.artists,
      title: selectedSong.title,
    };
  } catch (error) {
    console.error('Error fetching song for today:', error);
    return null;
  }
};
