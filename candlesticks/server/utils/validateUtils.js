const moment = require('moment');
const config = require('../config/config');

// Validate interval number.
const validateNewInterval = (newIntervalSeconds) => {

    // Validate the new interval parameter from the client.
    if (!newIntervalSeconds || isNaN(newIntervalSeconds)) {
        return 'Missing or invalid new interval parameter';
    }

    const numberNewIntervalSeconds = Math.floor(Number(newIntervalSeconds));

    // Check that the number of seconds is valid.
    const rateIndex = config.intervalRates.findIndex(i => i === numberNewIntervalSeconds);
    if (rateIndex < 0) {
        return 'Invalid new interval parameter';
    }

    // Check if there is data to display within the new interval time.
    if (moment.unix(config.intervalStartCreateTimestamp) < numberNewIntervalSeconds) {
        return 'No data available within the selected interval parameter';
    }

    return null;
};

// Validate timestamp seconds.
const validateTimestamp = (fromTimestamp) => {

    // Validate the fromTimestamp parameter from the client.
    if (!fromTimestamp || isNaN(fromTimestamp)) {
        return 'Missing or invalid fromTimestamp parameter';
    }

    // Check if there is data to display within the specific period.
    if (moment.unix(fromTimestamp) > moment.unix(config.intervalStartCreateTimestamp)) {
        return 'No data available within the selected period';
    }

    return null;
};

module.exports = {
    validateTimestamp: validateTimestamp,
    validateNewInterval: validateNewInterval
};