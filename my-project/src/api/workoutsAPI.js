import api from './client';

export const workoutsAPI = {
    getAll: () => api.get('/workouts'),
    create: (data) => api.post('/workouts', data),
    update: (id, data) => api.put(`/workouts/${id}`, data),
    delete: (id) => api.delete(`/workouts/${id}`),
};
