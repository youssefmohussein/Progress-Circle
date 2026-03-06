import api from './client';

export const assignmentsAPI = {
    getAll: () => api.get('/assignments'),
    create: (data) => api.post('/assignments', data),
    update: (id, data) => api.put(`/assignments/${id}`, data),
    delete: (id) => api.delete(`/assignments/${id}`),
};
