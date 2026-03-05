import client from './client';

export const adminAPI = {
    getStats: () => client.get('/admin/stats'),
    getUsers: () => client.get('/admin/users'),
    resetPoints: (id) => client.put(`/admin/users/${id}/reset-points`),
    deleteUser: (id) => client.delete(`/admin/users/${id}`),
};
