const environment = process.env.NODE_ENV || 'development';
const config = require(`./config/config`);
const port = process.env.PORT || config.port;
const winston = require('winston');
const express = require('express');
const app = express();
require('./startup/logging')();
require('./startup/general')(app);
const { initDataCreator, reCalculateCandlesticks } = require('./startup/dataHandler');
const server  = require('http').createServer(app);
const io = require('socket.io')(server);
initDataCreator(app);

// Listen to the server.
server.listen(port, () => {
    winston.info(`Listening to express server port ${port}...`);
    winston.info(`Server on ${environment} environment...`);
    const { initSocket, createSendDataInterval } = require('./startup/websocket');
    initSocket(io);
    createSendDataInterval(app, io);
    require('./startup/routes')(app, io, {
        createSendDataInterval:  createSendDataInterval,
        reCalculateCandlesticks: reCalculateCandlesticks
    });
});

module.exports = server;