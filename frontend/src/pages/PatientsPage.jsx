
import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { patientService } from '../services/patientService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { calculateAge } from '../utils/helpers';
import { PencilSquareIcon, EyeIcon } from '@heroicons/react/24/outline';

function PatientAvatar({ name }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const colors = [
    'bg-blue-100 text-blue-700',
    'bg-green-100 text-green-700',
    'bg-purple-100 text-purple-700',
    'bg-yellow-100 text-yellow-700',
    'bg-pink-100 text-pink-700',
  ];
  const color = colors[initials.charCodeAt(0) % colors.length];
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${color}`}>
      {initials}
    </div>
  );
}

function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  const loadPatients = useCallback((searchTerm = '') => {
    setLoading(true);
    patientService.getAll({ search: searchTerm, page_size: 20 })
      .then((res) => {
        setPatients(res.data.results || res.data);
        setCount(res.data.count || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadPatients(); }, [loadPatients]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadPatients(search);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Patients ({count})</h2>
        <Link to="/patients/register" className="btn-primary">
          + Register Patient
        </Link>
      </div>

      <div className="card">
        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <input
            type="text"
            className="form-input flex-1"
            placeholder="Search by name, patient ID, phone, or village..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn-primary">Search</button>
          {search && (
            <button type="button" onClick={() => { setSearch(''); loadPatients(); }} className="btn-secondary">
              Clear
            </button>
          )}
        </form>

        {loading ? (
          <LoadingSpinner />
        ) : patients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 font-medium text-gray-600">Patient ID</th>
                  <th className="text-left py-2 font-medium text-gray-600">Name</th>
                  <th className="text-left py-2 font-medium text-gray-600">Gender</th>
                  <th className="text-left py-2 font-medium text-gray-600">Age</th>
                  <th className="text-left py-2 font-medium text-gray-600">Phone</th>
                  <th className="text-left py-2 font-medium text-gray-600">Village</th>
                  <th className="text-left py-2 font-medium text-gray-600">Status</th>
                  <th className="text-left py-2 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 font-mono text-xs text-primary-600">{p.patient_id}</td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <PatientAvatar name={`${p.first_name} ${p.last_name}`} />
                        <span className="font-medium">{p.first_name} {p.last_name}</span>
                      </div>
                    </td>
                    <td className="py-2">{p.gender === 'M' ? 'Male' : p.gender === 'F' ? 'Female' : 'Other'}</td>
                    <td className="py-2">{p.age ?? calculateAge(p.date_of_birth)} yrs</td>
                    <td className="py-2 text-gray-600">{p.phone_number}</td>
                    <td className="py-2 text-gray-600">{p.village}</td>
                    <td className="py-2">
                      <span className={`badge ${p.is_active ? 'badge-success' : 'badge-danger'}`}>
                        {p.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-2">
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/patients/${p.id}`}
                          className="p-1.5 rounded text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                          title="View record"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/patients/${p.id}/edit`}
                          className="p-1.5 rounded text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          title="Edit patient"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg font-medium">No patients found</p>
            <p className="text-sm mt-1">
              {search ? 'Try a different search term' : 'Register the first patient to get started'}
            </p>
            {!search && (
              <Link to="/patients/register" className="mt-4 inline-block btn-primary">
                Register First Patient
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientsPage;























// import React, { useEffect, useState, useCallback } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { patientService } from '../services/patientService';
// import LoadingSpinner from '../components/common/LoadingSpinner';
// import PatientForm from '../components/patients/PatientForm';
// import { formatDate, calculateAge } from '../utils/helpers';

// function PatientsPage() {
//   const [patients, setPatients] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
//   const [showForm, setShowForm] = useState(false);
//   const [count, setCount] = useState(0);
//   const navigate = useNavigate();

//   const loadPatients = useCallback((searchTerm = '') => {
//     setLoading(true);
//     patientService.getAll({ search: searchTerm, page_size: 20 })
//       .then((res) => {
//         setPatients(res.data.results || res.data);
//         setCount(res.data.count || 0);
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   useEffect(() => {
//     loadPatients();
//   }, [loadPatients]);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     loadPatients(search);
//   };

//   const handlePatientCreated = () => {
//     setShowForm(false);
//     loadPatients(search);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl font-bold text-gray-900">Patients ({count})</h2>
//         <button onClick={() => navigate('/patients/register')} className="btn-primary">
//           + Register Patient
//         </button>
//       </div>

//       {showForm && (
//         <div className="card">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold">Register New Patient</h3>
//             <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
//           </div>
//           <PatientForm onSuccess={handlePatientCreated} onCancel={() => setShowForm(false)} />
//         </div>
//       )}

//       <div className="card">
//         <form onSubmit={handleSearch} className="flex gap-3 mb-6">
//           <input
//             type="text"
//             className="form-input flex-1"
//             placeholder="Search by name, patient ID, phone, or village..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           <button type="submit" className="btn-primary">Search</button>
//           {search && (
//             <button type="button" onClick={() => { setSearch(''); loadPatients(); }} className="btn-secondary">
//               Clear
//             </button>
//           )}
//         </form>

//         {loading ? (
//           <LoadingSpinner />
//         ) : patients.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-gray-100">
//                   <th className="text-left py-2 font-medium text-gray-600">Patient ID</th>
//                   <th className="text-left py-2 font-medium text-gray-600">Name</th>
//                   <th className="text-left py-2 font-medium text-gray-600">Gender</th>
//                   <th className="text-left py-2 font-medium text-gray-600">Age</th>
//                   <th className="text-left py-2 font-medium text-gray-600">Phone</th>
//                   <th className="text-left py-2 font-medium text-gray-600">Village</th>
//                   <th className="text-left py-2 font-medium text-gray-600">Registered</th>
//                   <th className="text-left py-2 font-medium text-gray-600">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {patients.map((p) => (
//                   <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
//                     <td className="py-2 font-mono text-xs text-primary-600">{p.patient_id}</td>
//                     <td className="py-2 font-medium">{p.full_name}</td>
//                     <td className="py-2">
//                       <span className={`badge ${p.gender === 'M' ? 'badge-info' : 'badge-success'}`}>
//                         {p.gender === 'M' ? 'Male' : p.gender === 'F' ? 'Female' : 'Other'}
//                       </span>
//                     </td>
//                     <td className="py-2">{p.age ?? calculateAge(p.date_of_birth)}</td>
//                     <td className="py-2">{p.phone_number}</td>
//                     <td className="py-2">{p.village}</td>
//                     <td className="py-2 text-gray-400">{formatDate(p.registration_date)}</td>
//                     <td className="py-2">
//                       <Link
//                         to={`/patients/${p.id}`}
//                         className="text-primary-600 hover:underline text-xs font-medium"
//                       >
//                         View →
//                       </Link>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="text-center py-12 text-gray-400">
//             <span className="text-5xl">👥</span>
//             <p className="mt-3">No patients found</p>
//             <button onClick={() => setShowForm(true)} className="mt-3 btn-primary">
//               Register First Patient
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default PatientsPage;
