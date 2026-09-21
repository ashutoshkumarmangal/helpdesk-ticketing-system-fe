import api from './client'

export const getUsers = () => api.get('/users').then((res) => res.data)

export const getAgents = () => api.get('/users/agents').then((res) => res.data)

export const updateUserRole = (id, role) =>
  api.put(`/users/${id}/role`, { role }).then((res) => res.data)

export const updateUserStatus = (id, isActive) =>
  api.put(`/users/${id}/status`, { isActive }).then((res) => res.data)