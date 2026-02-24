import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { reportService } from '../services/reportService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDateTime } from '../utils/helpers';
import {
  UsersIcon,
  BuildingOffice2Icon,
  MagnifyingGlassIcon,
  BeakerIcon,
  PlusIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

function StatCard({ title, value, Icon, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    red: 'bg-red-50 text-red-600 border-red-100',
  };
  return (
    <div className={`card border ${colors[color] || colors.blue}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-1">{value ?? '-'}</p>
        </div>
        <Icon className="w-10 h-10 opacity-60" />
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
        <StatCard title="Total Patients" value={data?.total_patients} Icon={UsersIcon} color="blue" />
        <StatCard title="Today's Visits" value={data?.today_visits} Icon={BuildingOffice2Icon} color="green" />
        <StatCard title="Pending Lab Tests" value={data?.pending_labs} Icon={MagnifyingGlassIcon} color="yellow" />
        <StatCard title="Pending Prescriptions" value={data?.pending_prescriptions} Icon={BeakerIcon} color="red" />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Visits</h3>
          <Link to="/visits" className="text-primary-600 text-sm hover:underline">View all →</Link>
        </div>
        {data?.recent_visits?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 font-medium text-gray-600">Visit No.</th>
                  <th className="text-left py-2 font-medium text-gray-600">Patient</th>
                  <th className="text-left py-2 font-medium text-gray-600">Type</th>
                  <th className="text-left py-2 font-medium text-gray-600">Date</th>
                  <th className="text-left py-2 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_visits.map((visit) => (
                  <tr key={visit.id} className="border-b border-gray-50 hover:bg-gray-50">
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
        <Link to="/patients/register" className="card hover:shadow-md transition-shadow text-center cursor-pointer">
          <PlusIcon className="w-10 h-10 mx-auto text-primary-600" />
          <p className="mt-2 font-medium text-gray-700">Register Patient</p>
        </Link>
        <Link to="/visits" className="card hover:shadow-md transition-shadow text-center cursor-pointer">
          <ClipboardDocumentListIcon className="w-10 h-10 mx-auto text-primary-600" />
          <p className="mt-2 font-medium text-gray-700">New Visit</p>
        </Link>
        <Link to="/reports" className="card hover:shadow-md transition-shadow text-center cursor-pointer">
          <ChartBarIcon className="w-10 h-10 mx-auto text-primary-600" />
          <p className="mt-2 font-medium text-gray-700">View Reports</p>
        </Link>
      </div>
    </div>
  );
}

export default DashboardPage;
