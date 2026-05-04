import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, LogIn } from 'lucide-react';
import { login } from '../store/slices/authSlice';
import Icon from '../components/common/Icon';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ username: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800 to-primary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">
            <Icon icon={ClipboardList} size="2xl" className="text-white" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-white">Kamukira HCIV</h1>
          <p className="text-primary-100/80 mt-2">Patient Records Management System</p>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Sign In</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-input"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                autoComplete="username"
              />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Icon icon={LogIn} size="sm" />
                  Sign In
                </>
              )}
            </button>
          </form>
          {/* <p className="mt-4 text-xs text-gray-400 text-center">
            Default admin: admin / Admin@1234
          </p> */}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
