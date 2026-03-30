// Unminify candlestick.
export const unminifyCandlestick = (data) => {
    const splitData = data.values.split('-');
    return {
        timestamp: data.timestamp,
        low: Number(splitData[0]),
        open: Number(splitData[1]),
        close: Number(splitData[2]),
        high: Number(splitData[3])
    };
};