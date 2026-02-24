import React, { useEffect, useState } from 'react';
import { visitService } from '../../services/visitService';
import { patientService } from '../../services/patientService';
import { VISIT_TYPES } from '../../utils/constants';

function VisitForm({ onSuccess, onCancel }) {
  const [form, setForm] = useState({
    patient: '', visit_type: 'outpatient', chief_complaint: '',
    weight: '', height: '', temperature: '', blood_pressure_systolic: '',
    blood_pressure_diastolic: '', pulse_rate: '', respiratory_rate: '',
    oxygen_saturation: '', notes: '',
  });
  const [patients, setPatients] = useState([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (patientSearch.length >= 2) {
      patientService.getAll({ search: patientSearch })
        .then((res) => setPatients(res.data.results || res.data))
        .catch(console.error);
    }
  }, [patientSearch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(form).filter(([, v]) => v !== '')
      );
      await visitService.create(payload);
      onSuccess?.();
    } catch (err) {
      setErrors(err.response?.data || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Patient <span className="text-red-500">*</span></label>
          <input
            type="text"
            className="form-input mb-1"
            placeholder="Search patient..."
            value={patientSearch}
            onChange={(e) => setPatientSearch(e.target.value)}
          />
          {patients.length > 0 && !form.patient && (
            <div className="border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
              {patients.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                  onClick={() => {
                    setForm({ ...form, patient: p.id });
                    setPatientSearch(`${p.full_name} (${p.patient_id})`);
                    setPatients([]);
                  }}
                >
                  <span className="font-medium">{p.full_name}</span>{' '}
                  <span className="text-gray-400 font-mono text-xs">{p.patient_id}</span>
                </button>
              ))}
            </div>
          )}
          {errors.patient && <p className="text-xs text-red-500">{errors.patient}</p>}
        </div>

        <div>
          <label className="form-label">Visit Type</label>
          <select
            className="form-input"
            value={form.visit_type}
            onChange={(e) => setForm({ ...form, visit_type: e.target.value })}
          >
            {VISIT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="form-label">Chief Complaint <span className="text-red-500">*</span></label>
          <textarea
            className="form-input"
            rows={2}
            value={form.chief_complaint}
            onChange={(e) => setForm({ ...form, chief_complaint: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-700 mb-3">Vitals (optional)</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ['weight', 'Weight (kg)'], ['height', 'Height (cm)'],
            ['temperature', 'Temp (°C)'], ['pulse_rate', 'Pulse (bpm)'],
            ['blood_pressure_systolic', 'BP Systolic'], ['blood_pressure_diastolic', 'BP Diastolic'],
            ['respiratory_rate', 'Resp. Rate'], ['oxygen_saturation', 'O2 Sat (%)'],
          ].map(([name, label]) => (
            <div key={name}>
              <label className="form-label text-xs">{label}</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={form[name]}
                onChange={(e) => setForm({ ...form, [name]: e.target.value })}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="form-label">Notes</label>
        <textarea
          className="form-input"
          rows={2}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </div>

      <div className="flex gap-3 justify-end">
        {onCancel && <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>}
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Creating...' : 'Create Visit'}
        </button>
      </div>
    </form>
  );
}

export default VisitForm;
