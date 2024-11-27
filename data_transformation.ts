// Output format
interface PlaycountGraphData {
  x: string,
  y: number,
  tooltip: string
}

interface TrackData {
  timestp: string,
  trackName: string
}

interface RadioStationData {
  id: number,
  name: string,
  tracks: TrackData[]
}

interface PlaycountData {
  [trackName: string]: number
}

function isTrackData(input: any): input is TrackData {
  return input && input.timestp && input.trackName &&
  typeof(input.timestp) == 'string' && typeof(input.trackName) == 'string'; 
}

function isRadioStationData(input: any): input is RadioStationData {
  return input && input.id && input.name && input.tracks &&
  typeof(input.id) == 'number' && typeof(input.name) == 'string' &&
  input.tracks.every(isTrackData);
}

function tallyDailyPlaycount(playcountData: PlaycountData): number {
  let playcount = 0;

  for (const trackName in playcountData) {
    playcount += playcountData[trackName];
  }

  return playcount;
}

function generateDailyTooltip(playcountData: PlaycountData): string {
  let tooltip = '';
  let playcountArray = Object.entries(playcountData);

  for (let i = 0; i < playcountArray.length; i++) {
    if(i == playcountArray.length - 1) {
      tooltip += playcountArray[i][0] + '(' + String(playcountArray[i][1]) + ')';
    } else {
      tooltip += playcountArray[i][0] + '(' + String(playcountArray[i][1]) + '), ';
    }
  }

  return tooltip;
}

function generateGraphData(rawData: unknown): PlaycountGraphData[] {
  if (!Array.isArray(rawData)) {
    throw new TypeError('Invalid radio station data');
  }

  let playcountsByDate: { [date: string]: PlaycountData } = {};
  for (const datapoint of rawData) {
    if (!isRadioStationData(datapoint)) {
      throw new TypeError('Invalid radio station data');
    }

    for (const track of datapoint.tracks) {
      if (track.timestp in playcountsByDate) {
        if (track.trackName in playcountsByDate[track.timestp]) {
          playcountsByDate[track.timestp][track.trackName] += 1;
        } else {
          playcountsByDate[track.timestp][track.trackName] = 1;
        }
      } else {
        playcountsByDate[track.timestp] = { [track.trackName]: 1};
      }
    }
  }

  let output: PlaycountGraphData[] = [];
  for (const date in playcountsByDate) {
    const datapoint: PlaycountGraphData = {
      x: date,
      y: tallyDailyPlaycount(playcountsByDate[date]),
      tooltip: generateDailyTooltip(playcountsByDate[date])
    };

    output.push(datapoint);
  }

  output.sort((e1, e2) => {
    return e1.x.localeCompare(e2.x);
  });

  return output;
}

// Test cases
console.log(JSON.stringify(generateGraphData([
  {
    id: 1293487,
    name: "KCRW",  // radio station callsign
    tracks: [{ timestp: "2021-04-08", trackName: "Peaches" }]
  },
  {
    id: 12923,
    name: "KQED",
    tracks: [
      { timestp: "2021-04-09", trackName: "Savage" },
      { timestp: "2021-04-09", trackName: "Savage (feat. Beyonce)" },
      { timestp: "2021-04-08", trackName: "Savage" },
      { timestp: "2021-04-08", trackName: "Savage" },
      { timestp: "2021-04-08", trackName: "Savage" }
    ]
  },
  {
    id: 4,
    name: "WNYC",
    tracks: [
      { timestp: "2021-04-09", trackName: "Captain Hook" },
      { timestp: "2021-04-08", trackName: "Captain Hook" },
      { timestp: "2021-04-07", trackName: "Captain Hook" }
    ]
  }
]), null, 2));

console.log(generateGraphData([])); // Expected output: []

console.log(generateGraphData({ "status": 400 })); // Expected output: throws TypeError