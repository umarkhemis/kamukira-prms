import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import Toast from './components/common/Toast';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import PatientDetailPage from './pages/PatientDetailPage';
import PatientRegistrationPage from './pages/PatientRegistrationPage';
import VisitsPage from './pages/VisitsPage';
import PrescriptionsPage from './pages/PrescriptionsPage';
import LabPage from './pages/LabPage';
import ReportsPage from './pages/ReportsPage';
import StaffPage from './pages/StaffPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Toast />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="patients/register" element={<PatientRegistrationPage />} />
            <Route path="patients/:id/edit" element={<PatientRegistrationPage />} />
            <Route path="patients/:id" element={<PatientDetailPage />} />
            <Route path="visits" element={<VisitsPage />} />
            <Route path="prescriptions" element={<PrescriptionsPage />} />
            <Route path="lab" element={<LabPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="staff" element={<StaffPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
