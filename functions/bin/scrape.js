import wiki from "wikipedia";
import fs from 'fs';

const VALID_QUOTES_COUNT = 2;

const selectedYear = 2000;

const page = await wiki.page(
  "List_of_number-one_singles_of_" + selectedYear + "_(Ireland)"
);

const tables = await page.tables();
const rawSinglesData = tables[0];

let previousNumberOne = null;
let sanitizedChartData = []

const nthIndexOf = (str, char, n) => {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === char) {
      count++;
      if (count === n) {
        return i;
      }
    }
  }
  return -1;
}

// Due to how messy and inconsistent the song titles returned from wikipedia can be 
// we need to do some sanitization
function adaptSingleData(single) {
  let {
    artist,
    // Later years renames the artist columns to artist(s)
    'artist(s)': artists,
    issueDate,
    song, 
  } = previousNumberOne;


  if(song.includes('"')) {
    const quotesCount = song.split('"').length - 1;

    if(quotesCount >= 2) {
      const index = nthIndexOf(song, '"', VALID_QUOTES_COUNT);

      // Slice bad data from end of title
      const quotedSongTitle = song.slice(0, index + 1);
      // Remove any remaining quotes
      song = quotedSongTitle.replace(/['"]+/g, '');
      // Remove paranthesis
      song = song.replace(/ *\([^)]*\) */g, "");
    }
  }

  const sanitizedSingle = {
    title: song,
    artists: artist ? artist.replace(/ *\([^)]*\) */g, "") : artists.replace(/ *\([^)]*\) */g, ""),
    startDate: issueDate + ' ' + selectedYear,
    endDate: single.issueDate + ' ' + selectedYear,
    posted: false,
  };

  previousNumberOne = single;
  return sanitizedSingle;
}

rawSinglesData.filter((single, index) => {
  // set previousNumberOne on first index 
  if (index === 0) { previousNumberOne = single };
  if (previousNumberOne.issueDate === single.issueDate) return;

  if (single.song !== undefined ) {
    const sanitizedSingle = adaptSingleData(single);

    sanitizedChartData.push(sanitizedSingle);
  };
});

const jsonContent = JSON.stringify(sanitizedChartData)

fs.writeFile("./bin/data/" + selectedYear + ".json", jsonContent, 'utf8', function (err) {
  if (err) {
      return console.log(err);
  }

  console.log("The file was saved!");
}); 
