import React, { useEffect, useState } from 'react';
import { labService } from '../services/labService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDateTime } from '../utils/helpers';

function LabPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [resultForm, setResultForm] = useState(null);

  const load = () => {
    setLoading(true);
    const params = filter ? { status: filter } : {};
    labService.getRequests(params)
      .then((res) => setRequests(res.data.results || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const handleSubmitResult = async (e) => {
    e.preventDefault();
    try {
      await labService.submitResult(resultForm.id, {
        result_value: resultForm.result_value,
        result_notes: resultForm.result_notes,
        is_abnormal: resultForm.is_abnormal,
      });
      setResultForm(null);
      load();
    } catch {
      alert('Failed to submit result');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Laboratory</h2>

      {resultForm && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Enter Result: {resultForm.test_name}</h3>
            <button onClick={() => setResultForm(null)} className="text-gray-400">✕</button>
          </div>
          <form onSubmit={handleSubmitResult} className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Result Value</label>
                <input
                  className="form-input"
                  value={resultForm.result_value || ''}
                  onChange={(e) => setResultForm({ ...resultForm, result_value: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  id="abnormal"
                  checked={resultForm.is_abnormal || false}
                  onChange={(e) => setResultForm({ ...resultForm, is_abnormal: e.target.checked })}
                />
                <label htmlFor="abnormal" className="text-sm font-medium text-red-600">Abnormal Result</label>
              </div>
            </div>
            <div>
              <label className="form-label">Notes</label>
              <textarea
                className="form-input"
                rows={2}
                value={resultForm.result_notes || ''}
                onChange={(e) => setResultForm({ ...resultForm, result_notes: e.target.value })}
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">Submit Result</button>
              <button type="button" onClick={() => setResultForm(null)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="flex gap-3 mb-4">
          {[['', 'All'], ['pending', 'Pending'], ['in_progress', 'In Progress'], ['completed', 'Completed']].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              className={`px-3 py-1 rounded-full text-sm ${filter === v ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}
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
                  <th className="text-left py-2 font-medium text-gray-600">Test</th>
                  <th className="text-left py-2 font-medium text-gray-600">Patient</th>
                  <th className="text-left py-2 font-medium text-gray-600">Urgency</th>
                  <th className="text-left py-2 font-medium text-gray-600">Result</th>
                  <th className="text-left py-2 font-medium text-gray-600">Date</th>
                  <th className="text-left py-2 font-medium text-gray-600">Status</th>
                  <th className="text-left py-2 font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 font-medium">{r.test_name}</td>
                    <td className="py-2">{r.patient_name}</td>
                    <td className="py-2">
                      <span className={`badge ${r.urgency === 'stat' ? 'badge-danger' : r.urgency === 'urgent' ? 'badge-warning' : 'badge-info'}`}>
                        {r.urgency}
                      </span>
                    </td>
                    <td className="py-2">
                      {r.result_value ? (
                        <span className={r.is_abnormal ? 'text-red-600 font-medium' : ''}>
                          {r.result_value} {r.is_abnormal && '⚠️'}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="py-2 text-xs text-gray-400">{formatDateTime(r.requested_at)}</td>
                    <td className="py-2">
                      <span className={`badge ${r.status === 'completed' ? 'badge-success' : r.status === 'in_progress' ? 'badge-info' : 'badge-warning'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-2">
                      {r.status !== 'completed' && (
                        <button
                          onClick={() => setResultForm({ ...r })}
                          className="text-xs btn-primary py-1 px-2"
                        >
                          Enter Result
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {requests.length === 0 && (
              <p className="text-center py-8 text-gray-400">No lab requests found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default LabPage;
