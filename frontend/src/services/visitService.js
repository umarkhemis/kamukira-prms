import api from './api';

export const visitService = {
  getAll: (params) => api.get('/visits/', { params }),
  getById: (id) => api.get(`/visits/${id}/`),
  create: (data) => api.post('/visits/', data),
  update: (id, data) => api.put(`/visits/${id}/`, data),
  addDiagnosis: (visitId, data) => api.post(`/visits/${visitId}/diagnoses/`, data),
};

export default visitService;
