import axios from 'axios';

const API_URL = '/api/calendar';

export const calendarAPI = {
    getEvents: (start, end) => axios.get(`${API_URL}?start=${start}&end=${end}`),
    createBlock: (data) => axios.post(`${API_URL}/blocks`, data),
    deleteBlock: (id) => axios.delete(`${API_URL}/blocks/${id}`),
};
