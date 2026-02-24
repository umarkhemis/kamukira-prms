import React, { useEffect, useState } from 'react';
import { prescriptionService } from '../services/prescriptionService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDateTime } from '../utils/helpers';

function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = () => {
    setLoading(true);
    const params = {};
    if (filter === 'pending') params.is_dispensed = false;
    if (filter === 'dispensed') params.is_dispensed = true;
    prescriptionService.getAll(params)
      .then((res) => setPrescriptions(res.data.results || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const handleDispense = async (id) => {
    try {
      await prescriptionService.dispense(id, {});
      load();
    } catch (err) {
      alert('Failed to dispense');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Prescriptions</h2>

      <div className="card">
        <div className="flex gap-3 mb-4">
          {[['', 'All'], ['pending', 'Pending'], ['dispensed', 'Dispensed']].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === v ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 font-medium text-gray-600">Medication</th>
                  <th className="text-left py-2 font-medium text-gray-600">Patient</th>
                  <th className="text-left py-2 font-medium text-gray-600">Dosage</th>
                  <th className="text-left py-2 font-medium text-gray-600">Qty</th>
                  <th className="text-left py-2 font-medium text-gray-600">Date</th>
                  <th className="text-left py-2 font-medium text-gray-600">Status</th>
                  <th className="text-left py-2 font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 font-medium">{p.medication_name}</td>
                    <td className="py-2">{p.patient_name}</td>
                    <td className="py-2">{p.dosage} — {p.frequency}</td>
                    <td className="py-2">{p.quantity_prescribed}</td>
                    <td className="py-2 text-gray-400 text-xs">{formatDateTime(p.prescribed_at)}</td>
                    <td className="py-2">
                      <span className={`badge ${p.is_dispensed ? 'badge-success' : 'badge-warning'}`}>
                        {p.is_dispensed ? 'Dispensed' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-2">
                      {!p.is_dispensed && (
                        <button
                          onClick={() => handleDispense(p.id)}
                          className="text-xs btn-primary py-1 px-2"
                        >
                          Dispense
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {prescriptions.length === 0 && (
              <p className="text-center py-8 text-gray-400">No prescriptions found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PrescriptionsPage;
