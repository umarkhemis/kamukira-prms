import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/patients', label: 'Patients', icon: '👥' },
  { to: '/visits', label: 'Visits', icon: '🏥' },
  { to: '/prescriptions', label: 'Prescriptions', icon: '💊' },
  { to: '/lab', label: 'Laboratory', icon: '🔬' },
  { to: '/reports', label: 'Reports', icon: '📊' },
  { to: '/staff', label: 'Staff', icon: '👤', adminOnly: true },
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
          <span className="text-2xl">🏥</span>
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
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-primary-700 text-xs text-primary-300">
        © 2024 Kamukira HCIV
      </div>
    </aside>
  );
}

export default Sidebar;
