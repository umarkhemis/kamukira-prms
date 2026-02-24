import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { patientService } from '../services/patientService';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const INITIAL_FORM = {
  first_name: '',
  last_name: '',
  date_of_birth: '',
  gender: '',
  blood_group: '',
  national_id: '',
  phone_number: '',
  email: '',
  address: '',
  village: '',
  sub_county: '',
  district: 'Kasese',
  next_of_kin_name: '',
  next_of_kin_phone: '',
  next_of_kin_relationship: '',
  allergies: '',
  chronic_conditions: '',
};

function FormField({ label, error, children, required }) {
  return (
    <div>
      <label className="form-label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
          <ExclamationTriangleIcon className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

function PatientRegistrationPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const isEditMode = Boolean(id);

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      patientService.getById(id)
        .then((res) => {
          const p = res.data;
          setForm({
            first_name: p.first_name || '',
            last_name: p.last_name || '',
            date_of_birth: p.date_of_birth || '',
            gender: p.gender || '',
            blood_group: p.blood_group || '',
            national_id: p.national_id || '',
            phone_number: p.phone_number || '',
            email: p.email || '',
            address: p.address || '',
            village: p.village || '',
            sub_county: p.sub_county || '',
            district: p.district || 'Kasese',
            next_of_kin_name: p.next_of_kin_name || '',
            next_of_kin_phone: p.next_of_kin_phone || '',
            next_of_kin_relationship: p.next_of_kin_relationship || '',
            allergies: p.allergies || '',
            chronic_conditions: p.chronic_conditions || '',
          });
        })
        .catch(() => setLoadError('Failed to load patient data.'));
    }
  }, [id, isEditMode]);

  const validate = () => {
    const e = {};
    if (!form.first_name.trim()) e.first_name = 'First name is required';
    if (!form.last_name.trim()) e.last_name = 'Last name is required';
    if (!form.date_of_birth) e.date_of_birth = 'Date of birth is required';
    if (!form.gender) e.gender = 'Gender is required';
    if (!form.phone_number.trim()) e.phone_number = 'Phone number is required';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.village.trim()) e.village = 'Village is required';
    if (!form.sub_county.trim()) e.sub_county = 'Sub-county is required';
    if (!form.next_of_kin_name.trim()) e.next_of_kin_name = 'Next of kin name is required';
    if (!form.next_of_kin_phone.trim()) e.next_of_kin_phone = 'Next of kin phone is required';
    if (!form.next_of_kin_relationship.trim()) e.next_of_kin_relationship = 'Relationship is required';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Enter a valid email address';
    }
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    setErrors({});
    try {
      let res;
      if (isEditMode) {
        res = await patientService.update(id, form);
        setSuccess({ message: 'Patient updated successfully!', patientId: res.data.patient_id });
      } else {
        res = await patientService.create({ ...form, registered_by: user?.id });
        setSuccess({ message: 'Patient registered successfully!', patientId: res.data.patient_id });
      }
    } catch (err) {
      const apiErrors = err.response?.data;
      if (apiErrors && typeof apiErrors === 'object') {
        setErrors(apiErrors);
      } else {
        setErrors({ non_field_errors: 'An error occurred. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loadError) {
    return (
      <div className="card text-center py-12">
        <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">{loadError}</p>
        <button onClick={() => navigate('/patients')} className="btn-secondary mt-4">
          Back to Patients
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="card text-center py-12 max-w-md mx-auto">
        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{success.message}</h2>
        <p className="text-gray-600 mb-2">
          Patient ID: <span className="font-mono font-bold text-primary-700">{success.patientId}</span>
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <button
            onClick={() => { setSuccess(null); setForm(INITIAL_FORM); }}
            className="btn-primary"
          >
            Register Another
          </button>
          <button onClick={() => navigate('/patients')} className="btn-secondary">
            View All Patients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit Patient' : 'Register New Patient'}
        </h2>
        <button onClick={() => navigate('/patients')} className="btn-secondary">
          Cancel
        </button>
      </div>

      {errors.non_field_errors && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {errors.non_field_errors}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="First Name" error={errors.first_name} required>
              <input
                type="text"
                name="first_name"
                className={`form-input ${errors.first_name ? 'border-red-400' : ''}`}
                value={form.first_name}
                onChange={handleChange}
              />
            </FormField>
            <FormField label="Last Name" error={errors.last_name} required>
              <input
                type="text"
                name="last_name"
                className={`form-input ${errors.last_name ? 'border-red-400' : ''}`}
                value={form.last_name}
                onChange={handleChange}
              />
            </FormField>
            <FormField label="Date of Birth" error={errors.date_of_birth} required>
              <input
                type="date"
                name="date_of_birth"
                className={`form-input ${errors.date_of_birth ? 'border-red-400' : ''}`}
                value={form.date_of_birth}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
              />
            </FormField>
            <FormField label="Gender" error={errors.gender} required>
              <select
                name="gender"
                className={`form-input ${errors.gender ? 'border-red-400' : ''}`}
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </FormField>
            <FormField label="Blood Group" error={errors.blood_group}>
              <select
                name="blood_group"
                className="form-input"
                value={form.blood_group}
                onChange={handleChange}
              >
                <option value="">Unknown</option>
                {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </FormField>
            <FormField label="National ID" error={errors.national_id}>
              <input
                type="text"
                name="national_id"
                className="form-input"
                value={form.national_id}
                onChange={handleChange}
                placeholder="CM00000000000001"
              />
            </FormField>
          </div>
        </div>

        {/* Contact Details */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
            Contact Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Phone Number" error={errors.phone_number} required>
              <input
                type="tel"
                name="phone_number"
                className={`form-input ${errors.phone_number ? 'border-red-400' : ''}`}
                value={form.phone_number}
                onChange={handleChange}
                placeholder="0771234567"
              />
            </FormField>
            <FormField label="Email Address" error={errors.email}>
              <input
                type="email"
                name="email"
                className={`form-input ${errors.email ? 'border-red-400' : ''}`}
                value={form.email}
                onChange={handleChange}
                placeholder="patient@example.com"
              />
            </FormField>
            <FormField label="Physical Address" error={errors.address} required>
              <textarea
                name="address"
                className={`form-input ${errors.address ? 'border-red-400' : ''}`}
                value={form.address}
                onChange={handleChange}
                rows={2}
                placeholder="Physical address"
              />
            </FormField>
          </div>
        </div>

        {/* Location */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
            Location
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Village" error={errors.village} required>
              <input
                type="text"
                name="village"
                className={`form-input ${errors.village ? 'border-red-400' : ''}`}
                value={form.village}
                onChange={handleChange}
              />
            </FormField>
            <FormField label="Sub-County" error={errors.sub_county} required>
              <input
                type="text"
                name="sub_county"
                className={`form-input ${errors.sub_county ? 'border-red-400' : ''}`}
                value={form.sub_county}
                onChange={handleChange}
              />
            </FormField>
            <FormField label="District" error={errors.district}>
              <input
                type="text"
                name="district"
                className="form-input"
                value={form.district}
                onChange={handleChange}
              />
            </FormField>
          </div>
        </div>

        {/* Next of Kin */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
            Next of Kin
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Full Name" error={errors.next_of_kin_name} required>
              <input
                type="text"
                name="next_of_kin_name"
                className={`form-input ${errors.next_of_kin_name ? 'border-red-400' : ''}`}
                value={form.next_of_kin_name}
                onChange={handleChange}
              />
            </FormField>
            <FormField label="Phone Number" error={errors.next_of_kin_phone} required>
              <input
                type="tel"
                name="next_of_kin_phone"
                className={`form-input ${errors.next_of_kin_phone ? 'border-red-400' : ''}`}
                value={form.next_of_kin_phone}
                onChange={handleChange}
              />
            </FormField>
            <FormField label="Relationship" error={errors.next_of_kin_relationship} required>
              <select
                name="next_of_kin_relationship"
                className={`form-input ${errors.next_of_kin_relationship ? 'border-red-400' : ''}`}
                value={form.next_of_kin_relationship}
                onChange={handleChange}
              >
                <option value="">Select relationship</option>
                {['Spouse','Parent','Sibling','Child','Guardian','Friend','Other'].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </FormField>
          </div>
        </div>

        {/* Medical History */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
            Medical History
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Known Allergies" error={errors.allergies}>
              <textarea
                name="allergies"
                className="form-input"
                value={form.allergies}
                onChange={handleChange}
                rows={3}
                placeholder="List any known allergies (e.g., Penicillin)"
              />
            </FormField>
            <FormField label="Chronic Conditions" error={errors.chronic_conditions}>
              <textarea
                name="chronic_conditions"
                className="form-input"
                value={form.chronic_conditions}
                onChange={handleChange}
                rows={3}
                placeholder="List any chronic conditions (e.g., Diabetes, Hypertension)"
              />
            </FormField>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 justify-end">
          <button
            type="button"
            onClick={() => navigate('/patients')}
            className="btn-secondary"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary min-w-[140px] flex items-center justify-center gap-2"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isEditMode ? 'Saving...' : 'Registering...'}
              </>
            ) : (
              isEditMode ? 'Save Changes' : 'Register Patient'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PatientRegistrationPage;
