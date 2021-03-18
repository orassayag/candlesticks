const config = {
    port: 3000, // Server port.
    intervalCreateDataRate: 200, // Milliseconds.
    maxRandomNumber: 1000000, // Max number to random.
    defaultEventRate: 100, // Count of numbers to generate each interval.
    cacheExpirationSeconds: 60 * 60 * 1, // Cache for 1 hour.
    intervalRates: [10, 30, 60], // Interval rates in seconds.
    maxCandlesticksCountEmit: 20 // Max count of candlesticks to send to the client.
};

module.exports = config;