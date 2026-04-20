import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, ClipboardPlus, ClipboardSignature, FlaskConical, Pill, Stethoscope, Users } from 'lucide-react';
import { reportService } from '../services/reportService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Icon from '../components/common/Icon';
import { formatDateTime } from '../utils/helpers';

function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: 'bg-primary-50 text-primary-700 border-primary-100',
    green: 'bg-green-50 text-green-700 border-green-100',
    yellow: 'bg-amber-50 text-amber-700 border-amber-100',
    red: 'bg-red-50 text-red-700 border-red-100',
  };
  return (
    <div className={`card border ${colors[color] || colors.blue} p-5`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-85">{title}</p>
          <p className="text-3xl font-bold mt-1">{value ?? '-'}</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-white/70 border border-white flex items-center justify-center">
          <Icon icon={icon} size="xl" />
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportService.getDashboard()
      .then((res) => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <span className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-UG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Patients" value={data?.total_patients} icon={Users} color="blue" />
        <StatCard title="Today's Visits" value={data?.today_visits} icon={Stethoscope} color="green" />
        <StatCard title="Pending Lab Tests" value={data?.pending_labs} icon={FlaskConical} color="yellow" />
        <StatCard title="Pending Prescriptions" value={data?.pending_prescriptions} icon={Pill} color="red" />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Visits</h3>
          <Link to="/visits" className="text-primary-700 text-sm hover:underline inline-flex items-center gap-1">
            View all <Icon icon={ArrowRight} size="xs" />
          </Link>
        </div>
        {data?.recent_visits?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="table-head">Visit No.</th>
                  <th className="table-head">Patient</th>
                  <th className="table-head">Type</th>
                  <th className="table-head">Date</th>
                  <th className="table-head">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_visits.map((visit) => (
                  <tr key={visit.id} className="table-row">
                    <td className="py-2 font-mono text-xs">{visit.visit_number}</td>
                    <td className="py-2">{visit.patient_name}</td>
                    <td className="py-2 capitalize">{visit.visit_type}</td>
                    <td className="py-2">{formatDateTime(visit.visit_date)}</td>
                    <td className="py-2">
                      <span className={`badge ${
                        visit.status === 'completed' ? 'badge-success' :
                        visit.status === 'in_progress' ? 'badge-info' :
                        visit.status === 'referred' ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {visit.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">No visits today</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/patients/new" className="card hover:shadow-md transition-shadow text-center cursor-pointer">
          <Icon icon={ClipboardPlus} size="2xl" className="mx-auto text-primary-700" />
          <p className="mt-3 font-medium text-slate-700">Register Patient</p>
        </Link>
        <Link to="/visits" className="card hover:shadow-md transition-shadow text-center cursor-pointer">
          <Icon icon={ClipboardSignature} size="2xl" className="mx-auto text-primary-700" />
          <p className="mt-3 font-medium text-slate-700">New Visit</p>
        </Link>
        <Link to="/reports" className="card hover:shadow-md transition-shadow text-center cursor-pointer">
          <Icon icon={Activity} size="2xl" className="mx-auto text-primary-700" />
          <p className="mt-3 font-medium text-slate-700">View Reports</p>
        </Link>
      </div>
    </div>
  );
}

export default DashboardPage;
