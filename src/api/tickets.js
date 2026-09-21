import api from './client'

export const getTickets = (params) => api.get('/tickets', { params }).then((res) => res.data)

export const getTicket = (id) => api.get(`/tickets/${id}`).then((res) => res.data)

export const createTicket = (data) => api.post('/tickets', data).then((res) => res.data)

export const updateTicket = (id, data) => api.put(`/tickets/${id}`, data).then((res) => res.data)

export const assignTicket = (id, agentId) =>
  api.put(`/tickets/${id}/assign`, { agentId }).then((res) => res.data)

export const updateTicketStatus = (id, status) =>
  api.put(`/tickets/${id}/status`, { status }).then((res) => res.data)

export const updateTicketPriority = (id, priority) =>
  api.put(`/tickets/${id}/priority`, { priority }).then((res) => res.data)

export const getComments = (ticketId) =>
  api.get(`/tickets/${ticketId}/comments`).then((res) => res.data)

export const addComment = (ticketId, content) =>
  api.post(`/tickets/${ticketId}/comments`, { content }).then((res) => res.data)