import api from './client';

export const coursesAPI = {
    getAll: () => api.get('/courses'),
    create: (data) => api.post('/courses', data),
    update: (id, data) => api.put(`/courses/${id}`, data),
    delete: (id) => api.delete(`/courses/${id}`),
};
