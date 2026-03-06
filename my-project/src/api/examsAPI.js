import api from './client';

export const examsAPI = {
    getAll: () => api.get('/exams'),
    create: (data) => api.post('/exams', data),
    update: (id, data) => api.put(`/exams/${id}`, data),
    delete: (id) => api.delete(`/exams/${id}`),
};
