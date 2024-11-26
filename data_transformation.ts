interface DatePlayData {
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

function isRadioStationData(input: any): input is RadioStationData {
    return input && input.id && input.name && input.tracks &&
    typeof(input.id) == 'number' && typeof(input.name) == 'string';
}

function tallyDailyPlaycount(playcountData: { [trackName: string] : number }): number {
    let playcounts = 0;

    for (const trackName in playcountData) {
        playcounts += playcountData[trackName];
    }

    return playcounts;
}

function generateDailyTooltip(playcountData: { [trackName: string] : number }): string {
    let tooltip = '';

    for (const trackName in playcountData) {
        tooltip += trackName + '(' + String(playcountData[trackName]) + '),';
    }

    return tooltip;
}

function generatePlaycountData(rawData: unknown): DatePlayData[] {
    if (!Array.isArray(rawData)) {
        throw new TypeError('Invalid radio station data');
    }

    let dateDictionary: { [date: string]: { [trackName: string] : number } } = {};

    for (const datapoint of rawData) {
        if (!isRadioStationData(datapoint)) {
            throw new TypeError('Invalid radio station data');
        }

        for (const track of datapoint.tracks) {
            if (track.timestp in dateDictionary) {
                if (track.trackName in dateDictionary[track.timestp]) {
                    dateDictionary[track.timestp][track.trackName] += 1;
                } else {
                    dateDictionary[track.timestp][track.trackName] = 1;
                }
            } else {
                dateDictionary[track.timestp] = { [track.trackName]: 1};
            }
        }
    }

    let output: DatePlayData[] = [];

    for (const date in dateDictionary) {
        const datapoint: DatePlayData = {
            x: date,
            y: tallyDailyPlaycount(dateDictionary[date]),
            tooltip: generateDailyTooltip(dateDictionary[date])
        };

        output.push(datapoint);
    }

    return output;
}

// Test cases
console.log(JSON.stringify(generatePlaycountData([
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
])));