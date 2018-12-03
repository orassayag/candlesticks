const EventEmitter = require('events');
const config = require('../config/config');
const randomNumberEmitter = new EventEmitter();
const { createCandlestick } = require('../utils/dataUtils');
const { calculateLastProcessTimestamp } = require('../utils/textUtils');
let lastProcessedTimestamp = 0;

const initSocket = (io) => {

    io.on('connection', (socket) => {

        // Once connected, send alert to the client.
        socket.emit('connection', true);

        socket.on('start', () => {

            // Send the new data to the client.
            randomNumberEmitter.on('newData', (data) => {
                socket.emit('newData', data);
            });
        });

    });

    io.on('disconnect', (socket) => {

        // Once disconnect, send alert to the client.
        socket.emit('disconnect', true);
    });
};

// Create data to send the client.
const createDataToSend = (app, io, intervalSendDataRate) => {

    const historicalData = app.get('historicalData');
    const dataArray = historicalData.get('candlesticks');

    // In the first run, calculate the lastProcessedTimestamp.
    lastProcessedTimestamp = calculateLastProcessTimestamp({
        lastProcessedTimestamp: lastProcessedTimestamp,
        historyData: dataArray,
        intervalSendDataRate: intervalSendDataRate
    });

    const newCandlestick = createCandlestick({
        dataArray: dataArray,
        fromTimestamp: lastProcessedTimestamp + 1,
        candleWidth: config.intervalCreateDataRate,
        isLive: true
    });

    lastProcessedTimestamp = lastProcessedTimestamp + intervalSendDataRate;

    // When the candlestick is ready, send relevant data to event emitter.
    io.emit('newData', {
        intervalStartCreateTimestamp: app.get('intervalStartCreateTimestamp'),
        newCandlestick: newCandlestick
    });
};

// Remove old interval if exists and create new one.
const createSendDataInterval = (app, io) => {
    let intervalId = app.get('intervalId');
    const intervalSendDataRate = app.get('intervalSendDataRate');

    if (intervalId) {
        clearInterval(intervalId);
    }

    intervalId = setInterval(() => {
        createDataToSend(app, io, intervalSendDataRate);
    }, intervalSendDataRate * 1000);

    app.set('intervalId', intervalId);
};

module.exports = {
    initSocket: initSocket,
    createSendDataInterval: createSendDataInterval
};