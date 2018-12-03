import moment from 'moment';
import { validateCandlestick, validateTimeFromServer } from './validationUtils';

// Parse data from the server to display on the Google chart.
export const createCandlestickDisplay = (newCandlestick) => {

    // Validate the new candlestick data.
    const result = validateCandlestick(newCandlestick);
    if (!result.isValid) {
        return null;
    }

    const candlestick = result.candlestick;
    const timestamp = candlestick.timestamp;

    // Remove original timestamp to fit the array indexes.
    delete candlestick.timestamp;

    // Refactor data to fit the Google chart.
    const displayDataNewCandlestick = [
        moment.unix(timestamp).format('mm:ss'),
        ...Object.values(candlestick)
    ];

    return displayDataNewCandlestick;
};

// Create interval options to display on the dropdown menu.
export const createIntervalOptions = (intervalStartCreateTimestamp) => {

    // Validate the new intervalStartCreateTimestamp parmeter.
    if (!validateTimeFromServer(intervalStartCreateTimestamp)) {
        return null;
    }

    // Calculate the number of seconds that the server creates the data.
    const serverWorkingTimeSeconds = moment.duration(moment().diff(moment.unix(intervalStartCreateTimestamp))).asSeconds();

    // Return only available data options.
    const ranges = [30, 60].filter(f => {
        return serverWorkingTimeSeconds >= f;
    });

    // Add the default interval.
    if (ranges.length > 0) {
        ranges.unshift(10);
    }

    return ranges;
};