import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut, Menu, UserRound } from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import { toggleSidebar } from '../../store/slices/uiSlice';
import Icon from './Icon';

function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-white/95 backdrop-blur border-b border-slate-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label="Toggle sidebar"
          >
            <Icon icon={Menu} />
          </button>
          <h1 className="text-lg font-semibold text-slate-900">Kamukira HCIV PRMS</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 text-sm text-slate-600">
            <Icon icon={UserRound} size="sm" className="text-slate-500" />
            {user?.first_name} {user?.last_name}
          </span>
          <span className="badge badge-info capitalize">{user?.role?.replace('_', ' ')}</span>
          <button
            onClick={handleLogout}
            className="btn-secondary text-sm !px-3 !py-1.5 !border-red-200 !text-red-700 hover:!bg-red-50"
          >
            <Icon icon={LogOut} size="sm" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
