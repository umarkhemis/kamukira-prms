import api from './api';

export const prescriptionService = {
  getAll: (params) => api.get('/prescriptions/', { params }),
  create: (data) => api.post('/prescriptions/', data),
  dispense: (id, data) => api.put(`/prescriptions/${id}/dispense/`, data),
  getMedications: (params) => api.get('/prescriptions/medications/', { params }),
};

export default prescriptionService;
