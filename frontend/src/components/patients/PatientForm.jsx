import React, { useState } from 'react';
import { patientService } from '../../services/patientService';
import { GENDER_OPTIONS, BLOOD_GROUPS } from '../../utils/constants';

const INITIAL_FORM = {
  first_name: '', last_name: '', date_of_birth: '', gender: 'M',
  blood_group: '', national_id: '', phone_number: '', email: '',
  address: '', village: '', sub_county: '', district: 'Kasese',
  next_of_kin_name: '', next_of_kin_phone: '', next_of_kin_relationship: '',
  allergies: '', chronic_conditions: '',
};

function PatientForm({ onSuccess, onCancel }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await patientService.create(form);
      onSuccess?.();
    } catch (err) {
      setErrors(err.response?.data || { non_field_errors: 'Failed to register patient.' });
    } finally {
      setLoading(false);
    }
  };

  const field = (name, label, type = 'text', required = false) => (
    <div>
      <label className="form-label">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        required={required}
        className={`form-input ${errors[name] ? 'border-red-400' : ''}`}
      />
      {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.non_field_errors && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {errors.non_field_errors}
        </div>
      )}

      <div>
        <h4 className="font-medium text-gray-700 mb-3">Personal Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('first_name', 'First Name', 'text', true)}
          {field('last_name', 'Last Name', 'text', true)}
          {field('date_of_birth', 'Date of Birth', 'date', true)}
          <div>
            <label className="form-label">Gender <span className="text-red-500">*</span></label>
            <select name="gender" value={form.gender} onChange={handleChange} className="form-input" required>
              {GENDER_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Blood Group</label>
            <select name="blood_group" value={form.blood_group} onChange={handleChange} className="form-input">
              <option value="">Unknown</option>
              {BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          {field('national_id', 'National ID')}
          {field('phone_number', 'Phone Number', 'tel', true)}
          {field('email', 'Email', 'email')}
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-700 mb-3">Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="form-label">Address <span className="text-red-500">*</span></label>
            <textarea name="address" value={form.address} onChange={handleChange} required className="form-input" rows={2} />
          </div>
          {field('village', 'Village', 'text', true)}
          {field('sub_county', 'Sub County', 'text', true)}
          {field('district', 'District', 'text', true)}
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-700 mb-3">Next of Kin</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {field('next_of_kin_name', 'Name', 'text', true)}
          {field('next_of_kin_phone', 'Phone', 'tel', true)}
          {field('next_of_kin_relationship', 'Relationship', 'text', true)}
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-700 mb-3">Medical History</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Allergies</label>
            <textarea name="allergies" value={form.allergies} onChange={handleChange} className="form-input" rows={2} />
          </div>
          <div>
            <label className="form-label">Chronic Conditions</label>
            <textarea name="chronic_conditions" value={form.chronic_conditions} onChange={handleChange} className="form-input" rows={2} />
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        {onCancel && <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>}
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Registering...' : 'Register Patient'}
        </button>
      </div>
    </form>
  );
}

export default PatientForm;
