import React, { useEffect, useState } from 'react';
import { visitService } from '../services/visitService';
import { patientService } from '../services/patientService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import VisitForm from '../components/visits/VisitForm';
import { formatDateTime, getStatusBadgeClass } from '../utils/helpers';

function VisitsPage() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  const loadVisits = () => {
    setLoading(true);
    const params = {};
    if (statusFilter) params.status = statusFilter;
    visitService.getAll(params)
      .then((res) => setVisits(res.data.results || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadVisits(); }, [statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Visits</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">+ New Visit</button>
      </div>

      {showForm && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Create New Visit</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400">✕</button>
          </div>
          <VisitForm onSuccess={() => { setShowForm(false); loadVisits(); }} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div className="card">
        <div className="flex gap-3 mb-4">
          {['', 'waiting', 'in_progress', 'completed', 'referred'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                statusFilter === s ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s ? s.replace('_', ' ') : 'All'}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : visits.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 font-medium text-gray-600">Visit No.</th>
                  <th className="text-left py-2 font-medium text-gray-600">Patient</th>
                  <th className="text-left py-2 font-medium text-gray-600">Type</th>
                  <th className="text-left py-2 font-medium text-gray-600">Complaint</th>
                  <th className="text-left py-2 font-medium text-gray-600">Date</th>
                  <th className="text-left py-2 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {visits.map((v) => (
                  <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 font-mono text-xs">{v.visit_number}</td>
                    <td className="py-2 font-medium">{v.patient_name}</td>
                    <td className="py-2 capitalize">{v.visit_type}</td>
                    <td className="py-2 text-gray-600 max-w-xs truncate">{v.chief_complaint}</td>
                    <td className="py-2 text-gray-400 text-xs">{formatDateTime(v.visit_date)}</td>
                    <td className="py-2">
                      <span className={`badge ${getStatusBadgeClass(v.status)}`}>
                        {v.status?.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <span className="text-5xl">🏥</span>
            <p className="mt-3">No visits found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default VisitsPage;
