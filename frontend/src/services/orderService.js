import api from './api';

export const placeOrder = (payload) => api.post('/orders', payload).then((res) => res.data);
export const getMyOrders = () => api.get('/orders/my-orders').then((res) => res.data);
export const getAllOrders = () => api.get('/orders').then((res) => res.data);
export const getOrderById = (id) => api.get(`/orders/${id}`).then((res) => res.data);
export const updateOrderStatus = (id, status) =>
  api.put(`/orders/${id}/status`, { status }).then((res) => res.data);
