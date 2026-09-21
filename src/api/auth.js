import api from './client'

export const login = (credentials) => api.post('/auth/login', credentials).then((res) => res.data)

export const register = (user) => api.post('/auth/register', user).then((res) => res.data)