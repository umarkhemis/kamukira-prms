import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { patientService } from '../services/patientService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Icon from '../components/common/Icon';
import { formatDate, formatDateTime } from '../utils/helpers';

function PatientDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    patientService.getHistory(id)
      .then((res) => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!data) return <div className="card text-center text-gray-400 py-8">Patient not found</div>;

  const { patient, visits } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/patients" className="text-primary-700 hover:underline text-sm inline-flex items-center gap-1">
          <Icon icon={ArrowLeft} size="xs" /> Patients
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">Patient Record</h2>
      </div>

      <div className="card">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{patient.full_name}</h3>
            <p className="text-primary-600 font-mono">{patient.patient_id}</p>
          </div>
          <span className={`badge ${patient.is_active ? 'badge-success' : 'badge-danger'}`}>
            {patient.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><span className="text-gray-500">Age:</span> <span className="font-medium">{patient.age} years</span></div>
          <div><span className="text-gray-500">Gender:</span> <span className="font-medium">{patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other'}</span></div>
          <div><span className="text-gray-500">DOB:</span> <span className="font-medium">{formatDate(patient.date_of_birth)}</span></div>
          <div><span className="text-gray-500">Blood Group:</span> <span className="font-medium">{patient.blood_group || '-'}</span></div>
          <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{patient.phone_number}</span></div>
          <div><span className="text-gray-500">Village:</span> <span className="font-medium">{patient.village}</span></div>
          <div><span className="text-gray-500">District:</span> <span className="font-medium">{patient.district}</span></div>
          <div><span className="text-gray-500">Registered:</span> <span className="font-medium">{formatDate(patient.registration_date)}</span></div>
        </div>

        {patient.allergies && (
          <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
            <span className="text-red-600 font-medium text-sm inline-flex items-center gap-1"><Icon icon={AlertTriangle} size="xs" /> Allergies: </span>
            <span className="text-sm">{patient.allergies}</span>
          </div>
        )}

        {patient.chronic_conditions && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
            <span className="text-yellow-700 font-medium text-sm">Chronic Conditions: </span>
            <span className="text-sm">{patient.chronic_conditions}</span>
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Next of Kin</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div><span className="text-gray-500">Name:</span> <span className="font-medium">{patient.next_of_kin_name}</span></div>
          <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{patient.next_of_kin_phone}</span></div>
          <div><span className="text-gray-500">Relationship:</span> <span className="font-medium">{patient.next_of_kin_relationship}</span></div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Visit History ({visits?.length || 0})</h3>
        {visits?.length > 0 ? (
          <div className="space-y-4">
            {visits.map((visit) => (
              <div key={visit.id} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-sm text-primary-600">{visit.visit_number}</span>
                    <span className="ml-3 capitalize text-sm">{visit.visit_type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${
                      visit.status === 'completed' ? 'badge-success' :
                      visit.status === 'in_progress' ? 'badge-info' : 'badge-warning'
                    }`}>{visit.status}</span>
                    <span className="text-xs text-gray-400">{formatDateTime(visit.visit_date)}</span>
                  </div>
                </div>
                {visit.chief_complaint && (
                  <p className="mt-2 text-sm text-gray-600"><strong>Complaint:</strong> {visit.chief_complaint}</p>
                )}
                {visit.diagnoses?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-500 mb-1">Diagnoses:</p>
                    <div className="flex flex-wrap gap-1">
                      {visit.diagnoses.map((d) => (
                        <span key={d.id} className="badge badge-info text-xs">
                          {d.diagnosis_name} {d.icd_code ? `(${d.icd_code})` : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-6">No visits recorded</p>
        )}
      </div>
    </div>
  );
}

export default PatientDetailPage;
