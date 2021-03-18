import React, { Component, Fragment } from 'react';
import socketIOClient from 'socket.io-client';
import Chart from 'react-google-charts';
import settings from '../../settings/settings';
import * as dataUtils from '../../utils/dataUtils';
import * as api from '../../api/routes/candlestick';
import { Select, Loader, Button } from '../../components/UI';
import '../Candlestick/Candlestick.less';

// Implement by reference from https://react-google-charts.com/candleStick-chart
// General logic idea from https://stackoverflow.com/questions/2860444/calculating-intraday-candlesticks-by-time-intervals

class Candlestick extends Component {

    state = {
        errorMessage: null,
        updateChart: false,
        currentInterval: 10,
        connectionStatus: false,
        intervalsOptions: [],
        dataReceivedCount: 0,
        historyTimestamp: null,
        displayData: [
            ['time', 'low', 'open', 'close', 'high'] // Default categories for the Google plug.
        ]
    }

    maxCandlesticksDisplay = 20;
    socket = socketIOClient(settings.api_base_url);

    constructor(props) {
        super(props);

        this.handleLatestCandlesticksClick = this.handleLatestCandlesticksClick.bind(this);
    }

    componentDidMount() {
        this.socket.on('connection', () => {
            // Notify the user that he is now connected to the server.
            this.setState({ connectionStatus: true });
        });

        this.socket.on('disconnect', () => {
            // Notify the user that he is now disconnected from the server.
            this.setState({ connectionStatus: false });
        });

        // When receiving fresh data, handle it.
        this.socket.on('newData', (data) => this.updateData(data));
    }

    // Handle latest candlesticks button click.
    handleLatestCandlesticksClick = async () => {

        let { displayData, historyTimestamp } = this.state;

        // Display a loader to the user.
        this.setState({ updateChart: true });

        // Get new candlesticks to display from the server.
        const newDisplayData = await api.getHistoryData(historyTimestamp);

        if (!newDisplayData || !newDisplayData.data || newDisplayData.data.length === 0) {
            this.displayError();
            return;
        }

        // Parse all new candlesticks for the Google plug.
        const displayDataNewCandlesticks = newDisplayData.data.map(c => {
            return dataUtils.createCandlestickDisplay(c);
        });

        // Remove all old candlesticks.
        displayData.splice(1);

        // Check if there is a need to remove an old candlestick to make place on the chart for a new one.
        if (displayDataNewCandlesticks.length > this.maxCandlesticksDisplay) {
            displayDataNewCandlesticks.splice(0, this.maxCandlesticksDisplay);
        }

        // Update the state.
        this.setState({
            updateChart: false,
            displayData: [...displayData, ...displayDataNewCandlesticks]
        });
    }

    // Handle change interval on the dropdown menu.
    handleChangeIntervalTime = async (e) => {

        // Display a loader to the user.
        this.setState({ updateChart: true });

        const newInterval = Number(e.target.value);

        // Get new candlesticks to display from the server.
        const newDisplayData = await api.updateInterval(newInterval);

        if (!newDisplayData || !newDisplayData.data || newDisplayData.data.length === 0) {
            this.displayError();
            return;
        }

        let { displayData } = this.state;

        // Parse all new candlesticks for the Google plug.
        const displayDataNewCandlesticks = newDisplayData.data.map(c => {
            return dataUtils.createCandlestickDisplay(c);
        });

        // Remove all old candlesticks.
        displayData.splice(1);

        // Check if there is a need to remove an old candlestick to make place on the chart for a new one.
        if (displayDataNewCandlesticks.length > this.maxCandlesticksDisplay) {
            displayDataNewCandlesticks.splice(0, this.maxCandlesticksDisplay);
        }

        // Update the state.
        this.setState({
            updateChart: false,
            currentInterval: newInterval,
            displayData: [...displayData, ...displayDataNewCandlesticks]
        });
    }

    // Handle fresh data from the server.
    updateData(data) {
        const { displayData, dataReceivedCount } = this.state;

        // Create new candlestick data to insert the state.
        const displayDataNewCandlestick = dataUtils.createCandlestickDisplay(data.newCandlestick);
        if (!displayDataNewCandlestick) {
            this.displayError();
            return;
        }

        // Calculate interval options to display on the dropdown menu.
        const displayIntervalsOptions = dataUtils.createIntervalOptions(data.intervalStartCreateTimestamp);

        let tempDisplayData = [...displayData];

        // Check if there is a need to remove an old candlestick to make place on the chart for a new one.
        if (displayData.length > this.maxCandlesticksDisplay) {
            tempDisplayData.splice(1, 1);
        }

        // Update the state.
        this.setState({
            dataReceivedCount: dataReceivedCount + 1,
            historyTimestamp: data.intervalStartCreateTimestamp,
            intervalsOptions: displayIntervalsOptions ? displayIntervalsOptions : [],
            displayData: [...tempDisplayData, displayDataNewCandlestick]
        });
    }

    // Display error label.
    displayError() {
        this.setState(prevState => ({
            updateChart: false,
            displayData: prevState.displayData.splice(1, 1),
            errorMessage: 'Invalid data from server'
        }));
    }

    render() {
        const { displayData, currentInterval, connectionStatus, intervalsOptions,
            updateChart, dataReceivedCount, errorMessage } = this.state;
        const displayLatest = dataReceivedCount > 30;
        return (
            <div className="container">
                <div className={`label ${connectionStatus ? 'connected' : 'disconnected'}`}>Connection status: {connectionStatus ? 'Connected' : 'Disconnected'}</div>
                {(updateChart || displayData.length === 1) && <Loader />}
                {(!updateChart && displayData.length > 1) &&
                    <Fragment>
                        <div className={`control-panel${!displayLatest ? ' single' : ''}`}>
                            {displayLatest &&
                                <div className="row margin">
                                    <Button onClick={this.handleLatestCandlesticksClick} text="Get latest 20 candlesticks" />
                                </div>
                            }
                            <div className="row">
                                <Select intervalsOptions={intervalsOptions} onChange={this.handleChangeIntervalTime} currentInterval={currentInterval} />
                            </div>
                        </div>
                        <Chart
                            width={'100%'}
                            height={350}
                            chartType='CandlestickChart'
                            loader={<Loader />}
                            data={displayData}
                            options={{
                                legend: 'none',
                                candlestick: {
                                    fallingColor: { strokeWidth: 0, fill: '#a52714' }, // Red.
                                    risingColor: { strokeWidth: 0, fill: '#0f9d58' } // Green.
                                }
                            }}
                            rootProps={{ 'data-testid': '2' }}
                        />
                    </Fragment>
                }
                {errorMessage && <div className="label error">{errorMessage}</div>}
            </div>
        );
    }
}

export default Candlestick;