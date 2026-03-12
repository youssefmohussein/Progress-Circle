import client from './client';

export const adminAPI = {
    getStats: () => client.get('/admin/stats'),
    getUsers: () => client.get('/admin/users'),
    updateUser: (id, data) => client.put(`/admin/users/${id}`, data),
    getSettings: () => client.get('/admin/settings'),
    updateSettings: (data) => client.put('/admin/settings', data),
    rewardAll: (data) => client.post('/reward-all', data),
    resetPoints: (id) => client.put(`/admin/users/${id}/reset-points`),
    deleteUser: (id) => client.delete(`/admin/users/${id}`),
};
