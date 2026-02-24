import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { LockClosedIcon, UserPlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ROLE_CHOICES = [
  { value: 'admin', label: 'Administrator' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'nurse', label: 'Nurse' },
  { value: 'receptionist', label: 'Receptionist' },
  { value: 'lab_technician', label: 'Lab Technician' },
  { value: 'pharmacist', label: 'Pharmacist' },
];

const EMPTY_FORM = {
  first_name: '',
  last_name: '',
  username: '',
  email: '',
  role: '',
  department: '',
  employee_id: '',
  phone_number: '',
  password: '',
  password2: '',
};

function StaffPage() {
  const { user } = useSelector((state) => state.auth);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchStaff = () => {
    setLoading(true);
    api.get('/staff/')
      .then((res) => setStaff(res.data.results || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  if (user?.role !== 'admin' && !user?.is_superuser) {
    return (
      <div className="card text-center py-12 text-gray-400">
        <LockClosedIcon className="mx-auto h-12 w-12" />
        <p className="mt-3">Admin access required</p>
      </div>
    );
  }

  const openModal = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.first_name.trim()) newErrors.first_name = 'First name is required.';
    if (!form.last_name.trim()) newErrors.last_name = 'Last name is required.';
    if (!form.username.trim()) newErrors.username = 'Username is required.';
    if (!form.role) newErrors.role = 'Role is required.';
    if (!form.password) newErrors.password = 'Password is required.';
    if (!form.password2) newErrors.password2 = 'Please confirm the password.';
    if (form.password && form.password2 && form.password !== form.password2) {
      newErrors.password2 = 'Passwords do not match.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/staff/', form);
      toast.success(`Staff account created for ${form.first_name} ${form.last_name}`);
      closeModal();
      fetchStaff();
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        const apiErrors = {};
        Object.entries(data).forEach(([key, val]) => {
          apiErrors[key] = Array.isArray(val) ? val[0] : val;
        });
        setErrors(apiErrors);
      }
      toast.error('Failed to create staff account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Staff Management</h2>
        <button onClick={openModal} className="btn-primary flex items-center gap-2">
          <UserPlusIcon className="h-5 w-5" />
          Add Staff Member
        </button>
      </div>

      <div className="card">
        {loading ? <LoadingSpinner /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 font-medium text-gray-600">Name</th>
                  <th className="text-left py-2 font-medium text-gray-600">Username</th>
                  <th className="text-left py-2 font-medium text-gray-600">Role</th>
                  <th className="text-left py-2 font-medium text-gray-600">Department</th>
                  <th className="text-left py-2 font-medium text-gray-600">Employee ID</th>
                  <th className="text-left py-2 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s) => (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
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

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Create Staff Account</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">First Name <span className="text-red-500">*</span></label>
                  <input
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    className={`form-input ${errors.first_name ? 'border-red-500' : ''}`}
                  />
                  {errors.first_name && <p className="mt-1 text-xs text-red-500">{errors.first_name}</p>}
                </div>
                <div>
                  <label className="form-label">Last Name <span className="text-red-500">*</span></label>
                  <input
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    className={`form-input ${errors.last_name ? 'border-red-500' : ''}`}
                  />
                  {errors.last_name && <p className="mt-1 text-xs text-red-500">{errors.last_name}</p>}
                </div>
                <div>
                  <label className="form-label">Username <span className="text-red-500">*</span></label>
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className={`form-input ${errors.username ? 'border-red-500' : ''}`}
                  />
                  {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username}</p>}
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>
                <div>
                  <label className="form-label">Role <span className="text-red-500">*</span></label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className={`form-input ${errors.role ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select role…</option>
                    {ROLE_CHOICES.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                  {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role}</p>}
                </div>
                <div>
                  <label className="form-label">Department</label>
                  <input
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className={`form-input ${errors.department ? 'border-red-500' : ''}`}
                  />
                  {errors.department && <p className="mt-1 text-xs text-red-500">{errors.department}</p>}
                </div>
                <div>
                  <label className="form-label">Employee ID</label>
                  <input
                    name="employee_id"
                    value={form.employee_id}
                    onChange={handleChange}
                    className={`form-input ${errors.employee_id ? 'border-red-500' : ''}`}
                  />
                  {errors.employee_id && <p className="mt-1 text-xs text-red-500">{errors.employee_id}</p>}
                </div>
                <div>
                  <label className="form-label">Phone Number</label>
                  <input
                    name="phone_number"
                    value={form.phone_number}
                    onChange={handleChange}
                    className={`form-input ${errors.phone_number ? 'border-red-500' : ''}`}
                  />
                  {errors.phone_number && <p className="mt-1 text-xs text-red-500">{errors.phone_number}</p>}
                </div>
                <div>
                  <label className="form-label">Password <span className="text-red-500">*</span></label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className={`form-input ${errors.password ? 'border-red-500' : ''}`}
                  />
                  {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                </div>
                <div>
                  <label className="form-label">Confirm Password <span className="text-red-500">*</span></label>
                  <input
                    type="password"
                    name="password2"
                    value={form.password2}
                    onChange={handleChange}
                    className={`form-input ${errors.password2 ? 'border-red-500' : ''}`}
                  />
                  {errors.password2 && <p className="mt-1 text-xs text-red-500">{errors.password2}</p>}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
                  <UserPlusIcon className="h-4 w-4" />
                  {submitting ? 'Creating…' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffPage;
