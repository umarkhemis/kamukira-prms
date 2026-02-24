import api from './api';

export const reportService = {
  getDashboard: () => api.get('/reports/dashboard/'),
  getVisitReport: (params) => api.get('/reports/visits/', { params }),
  getDiseaseReport: (params) => api.get('/reports/diseases/', { params }),
  getPatientDemographics: () => api.get('/reports/patients/'),
  getLabReport: (params) => api.get('/reports/lab/', { params }),
};

export default reportService;
