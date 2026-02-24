import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  HomeIcon,
  UsersIcon,
  BuildingOffice2Icon,
  BeakerIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', Icon: HomeIcon },
  { to: '/patients', label: 'Patients', Icon: UsersIcon },
  { to: '/visits', label: 'Visits', Icon: BuildingOffice2Icon },
  { to: '/prescriptions', label: 'Prescriptions', Icon: BeakerIcon },
  { to: '/lab', label: 'Laboratory', Icon: MagnifyingGlassIcon },
  { to: '/reports', label: 'Reports', Icon: ChartBarIcon },
  { to: '/staff', label: 'Staff', Icon: UserIcon, adminOnly: true },
];

function Sidebar() {
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);

  const filteredItems = navItems.filter(
    (item) => !item.adminOnly || user?.role === 'admin' || user?.is_superuser
  );

  if (!sidebarOpen) return null;

  return (
    <aside className="w-64 bg-primary-800 text-white flex flex-col">
      <div className="p-4 border-b border-primary-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary-700" fill="currentColor">
              <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm1 14h-2v-4H7v-2h4V6h2v4h4v2h-4v4z"/>
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-sm">Kamukira HCIV</h2>
            <p className="text-xs text-primary-300">Patient Records System</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 py-4">
        {filteredItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-primary-100 hover:bg-primary-700'
              }`
            }
          >
            <item.Icon className="w-5 h-5 flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-primary-700">
        {user && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-sm font-bold">
              {user.first_name?.[0]}{user.last_name?.[0]}
            </div>
            <div className="text-xs">
              <p className="font-medium text-white">{user.first_name} {user.last_name}</p>
              <p className="text-primary-300 capitalize">{user.role?.replace('_', ' ')}</p>
            </div>
          </div>
        )}
        <p className="text-xs text-primary-400">© 2024 Kamukira HCIV</p>
      </div>
    </aside>
  );
}

export default Sidebar;
