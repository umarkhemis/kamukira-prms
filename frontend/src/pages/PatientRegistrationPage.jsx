import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { patientService } from '../services/patientService';
import {
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  HeartIcon,
  UsersIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

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

const SECTIONS = [
  { id: 'personal', label: 'Personal Information', icon: UserIcon },
  { id: 'contact', label: 'Contact Details', icon: PhoneIcon },
  { id: 'location', label: 'Location', icon: MapPinIcon },
  { id: 'kin', label: 'Next of Kin', icon: UsersIcon },
  { id: 'medical', label: 'Medical History', icon: HeartIcon },
];

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
      <ExclamationCircleIcon className="w-3 h-3" />
      {message}
    </p>
  );
}

function PatientRegistrationPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchingPatient, setFetchingPatient] = useState(isEdit);
  const [activeSection, setActiveSection] = useState('personal');
  const [successPatient, setSuccessPatient] = useState(null);

  useEffect(() => {
    if (isEdit) {
      setFetchingPatient(true);
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
        .catch(() => toast.error('Failed to load patient data'))
        .finally(() => setFetchingPatient(false));
    }
  }, [id, isEdit]);

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
    if (!form.district.trim()) e.district = 'District is required';
    if (!form.next_of_kin_name.trim()) e.next_of_kin_name = 'Next of kin name is required';
    if (!form.next_of_kin_phone.trim()) e.next_of_kin_phone = 'Next of kin phone is required';
    if (!form.next_of_kin_relationship.trim()) e.next_of_kin_relationship = 'Relationship is required';
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorSection = getSectionForField(Object.keys(validationErrors)[0]);
      if (firstErrorSection) setActiveSection(firstErrorSection);
      toast.error('Please fix the errors before submitting');
      return;
    }

    setLoading(true);
    try {
      let res;
      if (isEdit) {
        res = await patientService.update(id, form);
        toast.success('Patient record updated successfully');
        navigate(`/patients/${id}`);
      } else {
        res = await patientService.create(form);
        setSuccessPatient(res.data);
        toast.success(`Patient registered successfully — ID: ${res.data.patient_id}`);
      }
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        const apiErrors = {};
        Object.entries(data).forEach(([key, val]) => {
          apiErrors[key] = Array.isArray(val) ? val[0] : val;
        });
        setErrors(apiErrors);
        toast.error('Registration failed. Please check the form.');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getSectionForField = (field) => {
    const map = {
      first_name: 'personal', last_name: 'personal', date_of_birth: 'personal',
      gender: 'personal', blood_group: 'personal', national_id: 'personal',
      phone_number: 'contact', email: 'contact',
      address: 'location', village: 'location', sub_county: 'location', district: 'location',
      next_of_kin_name: 'kin', next_of_kin_phone: 'kin', next_of_kin_relationship: 'kin',
      allergies: 'medical', chronic_conditions: 'medical',
    };
    return map[field];
  };

  const inputClass = (field) =>
    `form-input ${errors[field] ? 'border-red-400 focus:ring-red-300 focus:border-red-400' : ''}`;

  if (fetchingPatient) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (successPatient) {
    return (
      <div className="max-w-lg mx-auto mt-12">
        <div className="card text-center py-10">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="w-9 h-9 text-green-600" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Patient Registered Successfully</h2>
          <p className="text-gray-500 text-sm mb-4">The patient has been added to the system.</p>
          <div className="inline-block bg-primary-50 border border-primary-200 rounded-lg px-6 py-3 mb-6">
            <p className="text-xs text-primary-500 uppercase tracking-wide font-medium">Patient ID</p>
            <p className="text-2xl font-bold text-primary-700 font-mono">{successPatient.patient_id}</p>
            <p className="text-sm text-gray-700 mt-1">{successPatient.first_name} {successPatient.last_name}</p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(`/patients/${successPatient.id}`)}
              className="btn-primary"
            >
              View Patient Record
            </button>
            <button
              onClick={() => { setForm(INITIAL_FORM); setSuccessPatient(null); setErrors({}); setActiveSection('personal'); }}
              className="btn-secondary"
            >
              Register Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/patients')}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Patient Record' : 'Register New Patient'}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {isEdit ? 'Update the patient information below' : 'Fill in all required fields to register a new patient'}
          </p>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          const hasError = Object.keys(errors).some((f) => getSectionForField(f) === section.id);
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-1 justify-center ${
                activeSection === section.id
                  ? 'bg-white text-primary-700 shadow-sm'
                  : hasError
                  ? 'text-red-500 hover:bg-white/60'
                  : 'text-gray-600 hover:bg-white/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{section.label}</span>
              {hasError && <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="card space-y-5">

          {activeSection === 'personal' && (
            <>
              <h3 className="text-base font-semibold text-gray-800 pb-2 border-b border-gray-100 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-primary-600" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">First Name <span className="text-red-500">*</span></label>
                  <input name="first_name" className={inputClass('first_name')} value={form.first_name} onChange={handleChange} placeholder="e.g. Sarah" />
                  <FieldError message={errors.first_name} />
                </div>
                <div>
                  <label className="form-label">Last Name <span className="text-red-500">*</span></label>
                  <input name="last_name" className={inputClass('last_name')} value={form.last_name} onChange={handleChange} placeholder="e.g. Namukasa" />
                  <FieldError message={errors.last_name} />
                </div>
                <div>
                  <label className="form-label">Date of Birth <span className="text-red-500">*</span></label>
                  <input type="date" name="date_of_birth" className={inputClass('date_of_birth')} value={form.date_of_birth} onChange={handleChange} max={new Date().toISOString().split('T')[0]} />
                  <FieldError message={errors.date_of_birth} />
                </div>
                <div>
                  <label className="form-label">Gender <span className="text-red-500">*</span></label>
                  <select name="gender" className={inputClass('gender')} value={form.gender} onChange={handleChange}>
                    <option value="">Select gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                  <FieldError message={errors.gender} />
                </div>
                <div>
                  <label className="form-label">Blood Group</label>
                  <select name="blood_group" className="form-input" value={form.blood_group} onChange={handleChange}>
                    <option value="">Unknown</option>
                    {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">National ID</label>
                  <input name="national_id" className="form-input" value={form.national_id} onChange={handleChange} placeholder="e.g. CM90100123456XXXX" />
                </div>
              </div>
            </>
          )}

          {activeSection === 'contact' && (
            <>
              <h3 className="text-base font-semibold text-gray-800 pb-2 border-b border-gray-100 flex items-center gap-2">
                <PhoneIcon className="w-5 h-5 text-primary-600" /> Contact Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Phone Number <span className="text-red-500">*</span></label>
                  <input name="phone_number" className={inputClass('phone_number')} value={form.phone_number} onChange={handleChange} placeholder="e.g. 0772123456" />
                  <FieldError message={errors.phone_number} />
                </div>
                <div>
                  <label className="form-label">Email Address</label>
                  <input type="email" name="email" className={inputClass('email')} value={form.email} onChange={handleChange} placeholder="e.g. patient@example.com" />
                  <FieldError message={errors.email} />
                </div>
              </div>
            </>
          )}

          {activeSection === 'location' && (
            <>
              <h3 className="text-base font-semibold text-gray-800 pb-2 border-b border-gray-100 flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-primary-600" /> Location
              </h3>
              <div>
                <label className="form-label">Physical Address <span className="text-red-500">*</span></label>
                <textarea name="address" className={inputClass('address')} rows={2} value={form.address} onChange={handleChange} placeholder="House number, street, area..." />
                <FieldError message={errors.address} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Village <span className="text-red-500">*</span></label>
                  <input name="village" className={inputClass('village')} value={form.village} onChange={handleChange} placeholder="e.g. Kichwamba" />
                  <FieldError message={errors.village} />
                </div>
                <div>
                  <label className="form-label">Sub-County <span className="text-red-500">*</span></label>
                  <input name="sub_county" className={inputClass('sub_county')} value={form.sub_county} onChange={handleChange} placeholder="e.g. Bugoye" />
                  <FieldError message={errors.sub_county} />
                </div>
                <div>
                  <label className="form-label">District <span className="text-red-500">*</span></label>
                  <input name="district" className={inputClass('district')} value={form.district} onChange={handleChange} placeholder="e.g. Kasese" />
                  <FieldError message={errors.district} />
                </div>
              </div>
            </>
          )}

          {activeSection === 'kin' && (
            <>
              <h3 className="text-base font-semibold text-gray-800 pb-2 border-b border-gray-100 flex items-center gap-2">
                <UsersIcon className="w-5 h-5 text-primary-600" /> Next of Kin
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Full Name <span className="text-red-500">*</span></label>
                  <input name="next_of_kin_name" className={inputClass('next_of_kin_name')} value={form.next_of_kin_name} onChange={handleChange} placeholder="e.g. John Tumusiime" />
                  <FieldError message={errors.next_of_kin_name} />
                </div>
                <div>
                  <label className="form-label">Phone Number <span className="text-red-500">*</span></label>
                  <input name="next_of_kin_phone" className={inputClass('next_of_kin_phone')} value={form.next_of_kin_phone} onChange={handleChange} placeholder="e.g. 0700123456" />
                  <FieldError message={errors.next_of_kin_phone} />
                </div>
                <div>
                  <label className="form-label">Relationship <span className="text-red-500">*</span></label>
                  <select name="next_of_kin_relationship" className={inputClass('next_of_kin_relationship')} value={form.next_of_kin_relationship} onChange={handleChange}>
                    <option value="">Select relationship</option>
                    {['Spouse','Parent','Child','Sibling','Grandparent','Uncle/Aunt','Friend','Guardian','Other'].map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <FieldError message={errors.next_of_kin_relationship} />
                </div>
              </div>
            </>
          )}

          {activeSection === 'medical' && (
            <>
              <h3 className="text-base font-semibold text-gray-800 pb-2 border-b border-gray-100 flex items-center gap-2">
                <HeartIcon className="w-5 h-5 text-primary-600" /> Medical History
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Known Allergies</label>
                  <p className="text-xs text-gray-400 mb-1">List any known drug or food allergies</p>
                  <textarea name="allergies" className="form-input" rows={3} value={form.allergies} onChange={handleChange} placeholder="e.g. Penicillin, Sulfonamides..." />
                </div>
                <div>
                  <label className="form-label">Chronic Conditions</label>
                  <p className="text-xs text-gray-400 mb-1">List any existing chronic or long-term medical conditions</p>
                  <textarea name="chronic_conditions" className="form-input" rows={3} value={form.chronic_conditions} onChange={handleChange} placeholder="e.g. Hypertension, Diabetes Type 2..." />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2">
            {SECTIONS.findIndex((s) => s.id === activeSection) > 0 && (
              <button
                type="button"
                onClick={() => {
                  const idx = SECTIONS.findIndex((s) => s.id === activeSection);
                  setActiveSection(SECTIONS[idx - 1].id);
                }}
                className="btn-secondary"
              >
                Previous
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => navigate('/patients')} className="btn-secondary">
              Cancel
            </button>

            {SECTIONS.findIndex((s) => s.id === activeSection) < SECTIONS.length - 1 ? (
              <button
                type="button"
                onClick={() => {
                  const idx = SECTIONS.findIndex((s) => s.id === activeSection);
                  setActiveSection(SECTIONS[idx + 1].id);
                }}
                className="btn-primary"
              >
                Next
              </button>
            ) : (
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 min-w-[140px] justify-center">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isEdit ? 'Saving...' : 'Registering...'}
                  </>
                ) : (
                  isEdit ? 'Save Changes' : 'Register Patient'
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default PatientRegistrationPage;