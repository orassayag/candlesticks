import api from '../api';

// Handle the update of the interval selected by the user to get data from the server.
export const updateInterval = async (selectedInterval) => {
    let newDisplayData = null;
    try {
        newDisplayData = await api.post(`api/data/updateInterval?interval=${selectedInterval}`);
    } catch (err) {}
    return newDisplayData;
};

// Handle the latest data to get data from the server.
export const getHistoryData = async (historyTimestamp) => {
    let newDisplayData = null;
    try {
        newDisplayData = await api.get(`api/data/getHistoryData?timestamp=${historyTimestamp}`);
    } catch (err) {}
    return newDisplayData;
};