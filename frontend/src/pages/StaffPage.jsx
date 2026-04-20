import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ShieldAlert } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Icon from '../components/common/Icon';

function StaffPage() {
  const { user } = useSelector((state) => state.auth);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/staff/')
      .then((res) => setStaff(res.data.results || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (user?.role !== 'admin' && !user?.is_superuser) {
    return (
      <div className="card text-center py-12 text-gray-400">
        <Icon icon={ShieldAlert} size="2xl" className="mx-auto text-slate-400" />
        <p className="mt-3">Admin access required</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Staff Management</h2>
      </div>

      <div className="card">
        {loading ? <LoadingSpinner /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="table-head">Name</th>
                  <th className="table-head">Username</th>
                  <th className="table-head">Role</th>
                  <th className="table-head">Department</th>
                  <th className="table-head">Employee ID</th>
                  <th className="table-head">Status</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s) => (
                  <tr key={s.id} className="table-row">
                    <td className="py-2 font-medium">{s.first_name} {s.last_name}</td>
                    <td className="py-2 text-gray-600">@{s.username}</td>
                    <td className="py-2">
                      <span className="badge badge-info capitalize">{s.role?.replace('_', ' ')}</span>
                    </td>
                    <td className="py-2">{s.department || '-'}</td>
                    <td className="py-2 font-mono text-xs">{s.employee_id || '-'}</td>
                    <td className="py-2">
                      <span className={`badge ${s.is_active ? 'badge-success' : 'badge-danger'}`}>
                        {s.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {staff.length === 0 && (
              <p className="text-center py-8 text-gray-400">No staff found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffPage;
