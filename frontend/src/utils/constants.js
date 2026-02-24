export const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  RECEPTIONIST: 'receptionist',
  LAB_TECHNICIAN: 'lab_technician',
  PHARMACIST: 'pharmacist',
};

export const VISIT_STATUSES = {
  waiting: { label: 'Waiting', color: 'warning' },
  in_progress: { label: 'In Progress', color: 'info' },
  completed: { label: 'Completed', color: 'success' },
  referred: { label: 'Referred', color: 'danger' },
};

export const VISIT_TYPES = [
  { value: 'outpatient', label: 'Outpatient' },
  { value: 'inpatient', label: 'Inpatient' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'antenatal', label: 'Antenatal' },
  { value: 'immunization', label: 'Immunization' },
  { value: 'follow_up', label: 'Follow Up' },
];

export const GENDER_OPTIONS = [
  { value: 'M', label: 'Male' },
  { value: 'F', label: 'Female' },
  { value: 'O', label: 'Other' },
];

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
