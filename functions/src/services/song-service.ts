const mapSongData = (doc: FirebaseFirestore.QueryDocumentSnapshot) => {
  const data = doc.data() as {
    startDate: FirebaseFirestore.Timestamp;
    endDate: FirebaseFirestore.Timestamp;
    artists: string;
    title: string;
  };
  return { id: doc.id, ...data };
};

const filterSongsByDate = (songs: any[], today: Date) => {
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  return songs.filter((song) => {
    const startDate = song.startDate.toDate();
    const endDate = song.endDate.toDate();

    const startMonth = startDate.getMonth() + 1;
    const startDay = startDate.getDate();

    const endMonth = endDate.getMonth() + 1;
    const endDay = endDate.getDate();

    const isAfterStart =
      todayMonth > startMonth ||
      (todayMonth === startMonth && todayDay >= startDay);
    const isBeforeEnd =
      todayMonth < endMonth ||
      (todayMonth === endMonth && todayDay <= endDay);

    return isAfterStart && isBeforeEnd;
  });
};

const selectRandomSong = (songs: any[]) => {
  const randomIndex = Math.floor(Math.random() * songs.length);
  return songs[randomIndex];
};

export const getSongForToday = async (irishNumberOnes: FirebaseFirestore.CollectionReference) => {
  const today = new Date();

  const numberOneSnapshot = await irishNumberOnes
    .where('posted', '==', false)
    .get();

  if (numberOneSnapshot.empty) return null;

  const songs = numberOneSnapshot.docs.map(mapSongData);
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
};
