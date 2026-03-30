const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const error = require('../middleware/error');
const historicalData = require('../data/historicalData');

// Define all settings of the express app.
module.exports = (app) => {

    // Cors.
    app.use(cors());
    app.options('*', cors());

    // Parsers.
    app.use(express.json());
    app.use(bodyParser.json());

    // Middlewares.
    app.use(error);

    // Dynamic variables.
    app.set('intervalId', null); // Will hold the id of the sending data to client interval.
    app.set('intervalStartCreateTimestamp', 0); // Milliseconds timestamp of the first data created.
    app.set('intervalSendDataRate', 10); // Interval of sending data in seconds.
    app.set('historicalData', historicalData);
};