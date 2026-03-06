import api from './client';

export const learningAPI = {
    getAll: () => api.get('/learning'),
    create: (data) => api.post('/learning', data),
    update: (id, data) => api.put(`/learning/${id}`, data),
    delete: (id) => api.delete(`/learning/${id}`),
};
