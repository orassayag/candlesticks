// Minify candlestick.
const minifyCandlestick = (data) => {
    return {
        timestamp: data.timestamp,
        values: `${data.low}-${data.open}-${data.close}-${data.high}`
    };
};

// Unminify candlestick.
const unminifyCandlestick = (data) => {
    const splitData = data.values.split('-');
    return {
        timestamp: data.timestamp,
        low: Number(splitData[0]),
        open: Number(splitData[1]),
        close: Number(splitData[2]),
        high: Number(splitData[3])
    };
};

// Calculate last process timestamp if first time only.
const calculateLastProcessTimestamp = (data) => {
    let lastProcessedTimestamp = data.lastProcessedTimestamp;
    if (lastProcessedTimestamp === 0) {
        if (data.historyData !== null && data.historyData.length > 0) {
            lastProcessedTimestamp = Math.floor(parseInt(data.historyData[0].timestamp, 10) / data.intervalSendDataRate);
            lastProcessedTimestamp = lastProcessedTimestamp * data.intervalSendDataRate;
            lastProcessedTimestamp = lastProcessedTimestamp - 1; // Fix for first time only.
        }
    }
    return lastProcessedTimestamp;
};

module.exports = {
    calculateLastProcessTimestamp: calculateLastProcessTimestamp,
    minifyCandlestick: minifyCandlestick,
    unminifyCandlestick: unminifyCandlestick
};