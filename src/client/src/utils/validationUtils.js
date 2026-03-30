import moment from 'moment';
import { unminifyCandlestick } from './textUtils';

// Validate the data from the server.
export const validateCandlestick = (newCandlestick) => {
    const result = {
        isValid: true,
        candlestick: null
    };

    if (!newCandlestick) {
        result.isValid = false;
        return result;
    }

    if (!newCandlestick.timestamp || !newCandlestick.values) {
        result.isValid = false;
        return result;
    }

    const candlestick = unminifyCandlestick(newCandlestick);

    // Check for all 5 parameters' existence.
    if (Object.keys(candlestick).length !== 5) {
        result.isValid = false;
        return result;
    }

    // Check that the data are numbers only.
    const notNumbers = Object.values(candlestick).filter(value => isNaN(value));
    if (notNumbers.length > 0) {
        result.isValid = false;
        return result;
    }

    result.candlestick = candlestick;
    return result;
};

// Validate the timestamp from the server.
export const validateTimeFromServer = (intervalStartCreateTimestamp) => {

    // Validate for number.
    if (!intervalStartCreateTimestamp || isNaN(intervalStartCreateTimestamp)) {
        return false;
    }

    // Validate as timestamp.
    if (!moment.unix(intervalStartCreateTimestamp).isValid()) {
        return false;
    }

    return true;
};