import api from './client';

export const scheduleAPI = {
    getAll: () => api.get('/schedule'),
    create: (data) => api.post('/schedule', data),
    update: (id, data) => api.put(`/schedule/${id}`, data),
    delete: (id) => api.delete(`/schedule/${id}`),
};
