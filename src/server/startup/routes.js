const { validateNewInterval, validateTimestamp } = require('../utils/validateUtils');

// Define all routes of the express app.
module.exports = (app, io, functions) => {

    // Update the interval candlesticks and return data to send the client.
    app.post('/api/data/updateInterval', async (req, res) => {

        // Validate the new interval parameter from the client.
        const validationResult = validateNewInterval(req.query.interval);
        if (validationResult) {
            return res.status(400).send(validationResult);
        }

        // Update the interval parameter.
        app.set('intervalSendDataRate', Math.floor(Number(req.query.interval)));

        // Restart the interval
        functions.createSendDataInterval(app, io);

        // Recalculate candlestick to send the client.
        const newCandlesticks = functions.reCalculateCandlesticks(app);
        if (!newCandlesticks) {
            return res.status(400).send('No data available');
        }

        return res.status(200).send(newCandlesticks);

    });

    // Get
    app.get('/api/data/getHistoryData', async (req, res) => {

        // Validate the from timestamp parameter from the client.
        const validationResult = validateTimestamp(req.query.timestamp);
        if (validationResult) {
            return res.status(400).send(validationResult);
        }

        // Recalculate candlestick to send the client.
        const newCandlesticks = functions.reCalculateCandlesticks(app, Number(req.query.timestamp));
        if (!newCandlesticks) {
            return res.status(400).send('No data available');
        }

        return res.status(200).send(newCandlesticks);
    });
};