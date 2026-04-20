import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Activity, ClipboardList, FlaskConical, Home, Pill, ShieldUser, Stethoscope, Users } from 'lucide-react';
import Icon from './Icon';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/patients', label: 'Patients', icon: Users },
  { to: '/visits', label: 'Visits', icon: Stethoscope },
  { to: '/prescriptions', label: 'Prescriptions', icon: Pill },
  { to: '/lab', label: 'Laboratory', icon: FlaskConical },
  { to: '/reports', label: 'Reports', icon: Activity },
  { to: '/staff', label: 'Staff', icon: ShieldUser, adminOnly: true },
];

function Sidebar() {
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);

  const filteredItems = navItems.filter(
    (item) => !item.adminOnly || user?.role === 'admin' || user?.is_superuser
  );

  if (!sidebarOpen) return null;

  return (
    <aside className="w-64 bg-primary-900 text-white flex flex-col">
      <div className="p-4 border-b border-primary-700/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-700/60 flex items-center justify-center">
            <Icon icon={ClipboardList} size="xl" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Kamukira HCIV</h2>
            <p className="text-xs text-primary-100/80">Patient Records System</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 py-4 space-y-1">
        {filteredItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-100/95 hover:bg-primary-800'
              }`
            }
          >
            <Icon icon={item.icon} size="md" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-primary-700/70 text-xs text-primary-100/70">
        © 2024 Kamukira HCIV
      </div>
    </aside>
  );
}

export default Sidebar;
