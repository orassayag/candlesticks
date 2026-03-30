const moment = require('moment');
const { minifyCandlestick, unminifyCandlestick } = require('./textUtils');

// Calculate the relevant data and return new candlestick data to display.
const createCandlestick = (data) => {

    // Get the start index of the first point that is bigger than the last timestamp.
    const startIndex = data.dataArray.findIndex(i => i.timestamp >= data.fromTimestamp);

    // Assign the point variables.
    const startPoint = unminifyCandlestick(data.dataArray[startIndex]);
    let timestamp = startPoint.timestamp;
    let low = startPoint.low;
    const open = startPoint.open;
    let close = startPoint.close;
    let high = startPoint.high;

    // Loop on all the data and update the relevant parameters.
    for (let i = startIndex; i < data.dataArray.length; i++) {
        const dataPoint = unminifyCandlestick(data.dataArray[i]);

        // Check if has reached the limit of the timestamps, and if so, stop the loop.
        if (dataPoint.timestamp >= data.fromTimestamp + data.candleWidth) {
            break;
        }

        timestamp = dataPoint.timestamp + data.candleWidth;
        high = Math.max(high, dataPoint.high);
        low = Math.min(low, dataPoint.low);
        close = dataPoint.close;
    }

    return minifyCandlestick({
        timestamp: data.isLive ? moment().unix() : timestamp,
        low: low,
        open: open,
        close: close,
        high: high
    });
};

module.exports = {
    createCandlestick: createCandlestick
};