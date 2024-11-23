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
    typeof(input.int) == 'number' && typeof(input.name) == 'string';
}

function generatePlaycountData(rawData: unknown) {
    if (!Array.isArray(rawData)) {
        throw new TypeError('Invalid radio station data');
    }

    let dateDictionary: { [date: string]: { [trackName: string] : number } } = {};

    for (let datapoint of rawData) {
        if (!isRadioStationData(datapoint)) {
            throw new TypeError('Invalid radio station data');
        }

        for (let track of datapoint.tracks) {
        }
    }
}