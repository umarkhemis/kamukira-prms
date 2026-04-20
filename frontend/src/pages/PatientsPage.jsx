import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, UserPlus, Users, X } from 'lucide-react';
import { patientService } from '../services/patientService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PatientForm from '../components/patients/PatientForm';
import Icon from '../components/common/Icon';
import { formatDate, calculateAge } from '../utils/helpers';

function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [count, setCount] = useState(0);

  const loadPatients = useCallback((searchTerm = '') => {
    setLoading(true);
    patientService.getAll({ search: searchTerm, page_size: 20 })
      .then((res) => {
        setPatients(res.data.results || res.data);
        setCount(res.data.count || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadPatients(search);
  };

  const handlePatientCreated = () => {
    setShowForm(false);
    loadPatients(search);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Patients ({count})</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Icon icon={UserPlus} size="sm" />
          Register Patient
        </button>
      </div>

      {showForm && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Register New Patient</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-slate-700" aria-label="Close registration form">
              <Icon icon={X} size="sm" />
            </button>
          </div>
          <PatientForm onSuccess={handlePatientCreated} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <input
            type="text"
            className="form-input flex-1"
            placeholder="Search by name, patient ID, phone, or village..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn-primary">Search</button>
          {search && (
            <button type="button" onClick={() => { setSearch(''); loadPatients(); }} className="btn-secondary">
              Clear
            </button>
          )}
        </form>

        {loading ? (
          <LoadingSpinner />
        ) : patients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="table-head">Patient ID</th>
                  <th className="table-head">Name</th>
                  <th className="table-head">Gender</th>
                  <th className="table-head">Age</th>
                  <th className="table-head">Phone</th>
                  <th className="table-head">Village</th>
                  <th className="table-head">Registered</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.id} className="table-row">
                    <td className="py-2 font-mono text-xs text-primary-600">{p.patient_id}</td>
                    <td className="py-2 font-medium">{p.full_name}</td>
                    <td className="py-2">
                      <span className={`badge ${p.gender === 'M' ? 'badge-info' : 'badge-success'}`}>
                        {p.gender === 'M' ? 'Male' : p.gender === 'F' ? 'Female' : 'Other'}
                      </span>
                    </td>
                    <td className="py-2">{p.age ?? calculateAge(p.date_of_birth)}</td>
                    <td className="py-2">{p.phone_number}</td>
                    <td className="py-2">{p.village}</td>
                    <td className="py-2 text-gray-400">{formatDate(p.registration_date)}</td>
                    <td className="py-2">
                      <Link
                        to={`/patients/${p.id}`}
                        className="text-primary-700 hover:underline text-xs font-medium inline-flex items-center gap-1"
                      >
                        View <Icon icon={ArrowRight} size="xs" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            <Icon icon={Users} size="2xl" className="mx-auto text-slate-400" />
            <p className="mt-3">No patients found</p>
            <button onClick={() => setShowForm(true)} className="mt-3 btn-primary">
              <Icon icon={UserPlus} size="sm" />
              Register First Patient
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientsPage;
