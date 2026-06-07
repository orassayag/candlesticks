# Setup and Usage Instructions

**Version**: 1.0.0
**Last Updated**: June 2026

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Available Commands](#available-commands)
4. [Configuration](#configuration)
5. [Application Features](#application-features)
6. [WebSocket Events](#websocket-events)
7. [API Endpoints](#api-endpoints)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)
10. [Extending the Application](#extending-the-application)
11. [Documentation](#documentation)
12. [External Resources](#external-resources)

## Initial Setup

### Prerequisites

#### System Requirements

- **Node.js**: Version 10 or higher
- **Package Manager**: npm or yarn
- **Browser**: Modern web browser (Chrome, Firefox, Safari, Edge)
- **Memory**: 2GB RAM minimum
- **Operating System**: Windows, macOS, or Linux

### Install Dependencies

**Server:**

1. Navigate to the server directory:
   ```bash
   cd candlesticks/server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

**Client:**

1. Navigate to the client directory:
   ```bash
   cd candlesticks/client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Available Commands

### Development Commands

**Server:**

```bash
# Start the server
npm start

# Run linting
npm run lint
```

**Client:**

```bash
# Start development server with hot-reload
npm start

# Run tests
npm test

# Run linting
npm run lint

# Build for production
npm run build
```

### Running Scripts

The application relies on the interaction between the server and the client. Ensure the server is running before starting the client.

1. **Start Server**: `cd server && npm start`
2. **Start Client**: `cd client && npm start`

## Setup Instructions

### Server Setup

1. Navigate to the server directory:

   ```bash
   cd candlesticks/server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   # or
   node index.js
   ```

4. Verify server is running:
   - You should see: `Listening to express server port 3000...`
   - Server will start generating random market data every 200ms

### Client Setup

1. Open a new terminal window

2. Navigate to the client directory:

   ```bash
   cd candlesticks/client
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the client:

   ```bash
   npm start
   ```

5. Browser will automatically open at `http://localhost:3001`

6. Wait 10 seconds for initial data collection before the first candlestick appears

## Configuration

### Server Configuration

Edit `candlesticks/server/config/config.js`:

- `port`: Server port (default: 3000)
- `intervalCreateDataRate`: Data generation frequency in milliseconds (default: 200ms)
- `maxRandomNumber`: Maximum random price value (default: 1,000,000)
- `defaultEventRate`: Number of price points per interval (default: 100)
- `cacheExpirationSeconds`: Historical data cache duration (default: 1 hour)
- `intervalRates`: Available candlestick intervals in seconds (default: [10, 30, 60])
- `maxCandlesticksCountEmit`: Maximum historical candlesticks to send (default: 20)

### Client Configuration

Edit `candlesticks/client/src/settings/settings.js`:

- `api_base_url`: Server URL (default: 'http://localhost:3000/')

## Application Features

### Real-Time Candlestick Generation

The application continuously generates candlestick data with:

- **Open**: First price in the interval
- **Close**: Last price in the interval
- **High**: Highest price in the interval
- **Low**: Lowest price in the interval

### Interval Selection

After 30 seconds of data collection:

- Change candlestick interval dynamically
- Choose between 10s, 30s, or 60s intervals
- Chart automatically recalculates and displays

### Historical Data

After collecting 30+ candlesticks:

- Access historical candlestick data
- View last 20 candlesticks
- Data is cached server-side for performance

## Development

### Running in Development Mode

**Server:**

```bash
cd candlesticks/server
npm start
```

**Client:**

```bash
cd candlesticks/client
npm start  # Runs with hot-reload
```

### Linting

**Server:**

```bash
cd candlesticks/server
npm run lint
```

**Client:**

```bash
cd candlesticks/client
npm run lint
```

### Building for Production

**Client:**

```bash
cd candlesticks/client
npm run build
```

This creates an optimized production build in the `build/` folder.

## File Structure

### Server Structure (`candlesticks/server/`)

```
server/
├── config/          # Configuration files
│   └── config.js    # Main configuration
├── data/            # Data storage
├── middleware/      # Express middleware
├── services/        # Business logic services
├── startup/         # Application initialization
│   ├── dataHandler.js   # Data generation and processing
│   ├── websocket.js     # WebSocket setup
│   ├── routes.js        # API routes
│   ├── logging.js       # Winston logger setup
│   └── general.js       # General middleware
├── utils/           # Utility functions
│   ├── dataUtils.js     # Data processing utilities
│   ├── textUtils.js     # Text formatting utilities
│   └── validateUtils.js # Validation utilities
└── index.js         # Entry point
```

### Client Structure (`candlesticks/client/`)

```
client/
├── public/          # Static assets
├── src/
│   ├── api/         # API communication
│   │   ├── api.js           # Axios configuration
│   │   └── routes/          # API endpoints
│   ├── components/  # React components
│   │   └── UI/              # UI components
│   ├── containers/  # Container components
│   ├── hoc/         # Higher-Order Components
│   ├── settings/    # Configuration
│   │   └── settings.js      # Client settings
│   ├── utils/       # Utility functions
│   │   ├── coreUtils.js     # Core utilities
│   │   ├── dataUtils.js     # Data processing
│   │   ├── textUtils.js     # Text formatting
│   │   └── validationUtils.js # Validation
│   └── index.js     # Entry point
├── config/          # Webpack configuration
└── scripts/         # Build scripts
```

## WebSocket Events

### Client → Server

- `start`: Initialize data streaming

### Server → Client

- `connection`: Connection established
- `disconnect`: Connection closed
- `newData`: New candlestick data
  ```javascript
  {
    intervalStartCreateTimestamp: number,
    newCandlestick: {
      timestamp: number,
      open: number,
      close: number,
      high: number,
      low: number
    }
  }
  ```

## API Endpoints

### GET `/api/candlesticks`

Retrieves historical candlestick data.

**Query Parameters:**

- `interval`: Candlestick interval in seconds (10, 30, or 60)

**Response:**

```javascript
{
  candlesticks: [
    {
      timestamp: number,
      open: number,
      close: number,
      high: number,
      low: number,
    },
  ];
}
```

### POST `/api/interval`

Updates the candlestick interval.

**Body:**

```javascript
{
  interval: number; // 10, 30, or 60 seconds
}
```

## Troubleshooting

### Port Already in Use

If port 3000 or 3001 is already in use:

**Server:**

```javascript
// Edit candlesticks/server/config/config.js
port: 3001; // Change to available port
```

**Client:**

```javascript
// Edit candlesticks/client/src/settings/settings.js
api_base_url: 'http://localhost:3001/'; // Match server port
```

### WebSocket Connection Failed

1. Verify server is running
2. Check server URL in client settings
3. Check browser console for errors
4. Disable browser extensions that may block WebSocket connections

### Data Not Appearing

1. Wait at least 10 seconds for initial data collection
2. Check browser console for errors
3. Verify server is generating data (check server logs)
4. Refresh the page and try again

### Build Errors

1. Delete `node_modules` folders
2. Delete `package-lock.json` files
3. Re-run `npm install` in both server and client directories
4. Ensure Node.js version compatibility

## Best Practices

- **Component Organization**: Keep React components small and focused on a single responsibility.
- **State Management**: Use React state for local component data and server-side logic for data processing.
- **WebSocket Efficiency**: Minimize the payload sent over WebSockets to reduce latency.
- **Code Consistency**: Follow the established ESLint rules to maintain a clean codebase.

## Notes

- The application generates random market data for demonstration purposes
- Data is not persisted and will be lost on server restart
- WebSocket connection is required for real-time updates
- Historical data is cached server-side for 1 hour
- Minimum 10 seconds of data required for first candlestick
- Chart updates automatically when interval changes

## Extending the Application

### Adding New Intervals

1. Update `intervalRates` in `server/config/config.js`.
2. Update the interval selection UI in `client/src/containers/Candlestick/Candlestick.jsx`.

### Customizing the Chart

1. Modify the Google Charts configuration in `client/src/containers/Candlestick/Candlestick.jsx`.
2. Update CSS in `client/src/containers/Candlestick/Candlestick.less`.

## Documentation

- **README.md**: Overview of the project, architecture, and features.
- **CHANGELOG.md**: History of changes and versions.
- **CONTRIBUTING.md**: Guidelines for contributing to the project.
- **LICENSE**: Legal information regarding project usage.

## External Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Socket.io Documentation](https://socket.io/docs/v4/)
- [Google Charts Gallery](https://developers.google.com/chart/interactive/docs/gallery/candlestickchart)

## Author

- **Or Assayag** - _Initial work_ - [orassayag](https://github.com/orassayag)
- Or Assayag <orassayag@gmail.com>
- GitHub: https://github.com/orassayag
- StackOverflow: https://stackoverflow.com/users/4442606/or-assayag?tab=profile
- LinkedIn: https://linkedin.com/in/orassayag
