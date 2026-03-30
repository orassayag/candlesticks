const config = require('../config/config');
const { CacheService } = require('../services/CacheService');
const historicalData = new CacheService(config.cacheExpirationSeconds); // Create a new cache service instance to store all the candlesticks historical data.
module.exports = historicalData;