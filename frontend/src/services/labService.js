import api from './api';

export const labService = {
  getTests: () => api.get('/lab/tests/'),
  getRequests: (params) => api.get('/lab/requests/', { params }),
  createRequest: (data) => api.post('/lab/requests/', data),
  submitResult: (id, data) => api.put(`/lab/requests/${id}/result/`, data),
};

export default labService;
