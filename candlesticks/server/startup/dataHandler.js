const moment = require('moment');
const config = require('../config/config');
const { createCandlestick } = require('../utils/dataUtils');
const { minifyCandlestick, calculateLastProcessTimestamp } = require('../utils/textUtils');

// Will create all the data.
const initDataCreator = (app) => {

    let lastProcessedTimestamp = 0;
    let tempHistoricalArray = [];

    // Save a candlestick into an array.
    const saveHistoricalData = (dataItem) => {
        const historicalData = app.get('historicalData');

        let historyData = historicalData.get('candlesticks');
        if (!historyData) {
            historyData = [];
        }
        historyData.push(dataItem);
        historicalData.set('candlesticks', historyData);
        app.set('historicalData', historicalData);
    };

    // Save the data in the historical data.
    const saveTempData = (data) => {
        // If the last process timestamp is different from the last one, create the candlestick from the temp array.
        if (lastProcessedTimestamp !== data.timestamp) {

            if (tempHistoricalArray.length > 0) {
                saveHistoricalData(createCandlestick({
                    dataArray: tempHistoricalArray,
                    fromTimestamp: lastProcessedTimestamp,
                    candleWidth: config.intervalCreateDataRate,
                    isLive: true
                }));
            }

            tempHistoricalArray = [];
            lastProcessedTimestamp = data.timestamp;
        }

        // Save data to the temp array.
        tempHistoricalArray.push(data.dataItem);
    };

    // Generate all the data.
    const createData = () => {
        let open, close = null;

        // Will hold all numbers of interval rounds.
        let tempNumbersArray = null;

        for (let i = 0; i < config.defaultEventRate; i++) {

            // Generate a random number.
            const number = Math.floor(Math.random() * Math.floor(config.maxRandomNumber));

            // Assign open & close variables.
            switch (i) {
                case 0:

                    // Init new array.
                    tempNumbersArray = [];

                    open = number;
                    break;
                case config.defaultEventRate - 1:
                    close = number;
                    break;
                default:
                    break;
            }

            // Push the number into a temp array.
            tempNumbersArray.push(number);
        }

        const timestamp = moment().unix();

        const intervalStartCreateTimestamp = app.get('intervalStartCreateTimestamp');

        // Set the first created timestamp.
        if (intervalStartCreateTimestamp === 0) {
            app.set('intervalStartCreateTimestamp', timestamp);
        }

        // Create the candlestick data.
        const dataItem = minifyCandlestick({
            timestamp: timestamp,
            low: Math.min(...tempNumbersArray),
            open: open,
            close: close,
            high: Math.max(...tempNumbersArray)
        });

        // Save the data in a temp array.
        saveTempData({
            timestamp: timestamp,
            dataItem: dataItem
        });
    };

    // Start creating data.
    setInterval(() => {
        createData();
    }, config.intervalCreateDataRate);
};

// Recalculate candlestick for the client according to the current interval and/or by specific timestamp period.
const reCalculateCandlesticks = (app, lastProcessedTimestamp = 0) => {

    const intervalSendDataRate = app.get('intervalSendDataRate');
    const historicalData = app.get('historicalData');
    let historyData = historicalData.get('candlesticks');

    // Calculate last process if first time only.
    lastProcessedTimestamp = calculateLastProcessTimestamp({
        lastProcessedTimestamp: lastProcessedTimestamp,
        historyData: historyData,
        intervalSendDataRate: intervalSendDataRate
    });

    const newCandlesticks = [];

    const fromTimestamp = historyData[historyData.length - 1].timestamp;

    // Loop from start to end and create new candlesticks.
    while (fromTimestamp > (lastProcessedTimestamp + intervalSendDataRate)) {

        // Create candlestick from last process and the interval.
        newCandlesticks.push(createCandlestick({
            dataArray: historyData,
            fromTimestamp: lastProcessedTimestamp,
            candleWidth: intervalSendDataRate,
            isLive: false
        }));

        lastProcessedTimestamp = lastProcessedTimestamp + intervalSendDataRate;
    }

    // Check if there is a need to remove an old candlestick.
    if (newCandlesticks.length > config.maxCandlesticksCountEmit) {
        newCandlesticks.splice(0, (newCandlesticks.length - config.maxCandlesticksCountEmit));
    }

    return newCandlesticks;
};

module.exports = {
    initDataCreator: initDataCreator,
    reCalculateCandlesticks: reCalculateCandlesticks
};