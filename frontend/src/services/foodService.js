import api from './api';

export const getFoods = (params = {}) => api.get('/foods', { params }).then((res) => res.data);
export const getFoodById = (id) => api.get(`/foods/${id}`).then((res) => res.data);
export const createFood = (payload) => api.post('/foods', payload).then((res) => res.data);
export const updateFood = (id, payload) => api.put(`/foods/${id}`, payload).then((res) => res.data);
export const deleteFood = (id) => api.delete(`/foods/${id}`).then((res) => res.data);
