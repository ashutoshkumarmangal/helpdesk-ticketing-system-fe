import api from './client'

export const getNotifications = () => api.get('/notifications').then((res) => res.data)

export const getUnreadCount = () =>
  api.get('/notifications/unread-count').then((res) => res.data)

export const markNotificationRead = (id) =>
  api.put(`/notifications/${id}/read`).then((res) => res.data)