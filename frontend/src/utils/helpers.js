export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-UG', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('en-UG', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export const calculateAge = (dob) => {
  if (!dob) return '-';
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

export const getStatusBadgeClass = (status) => {
  const map = {
    waiting: 'badge-warning',
    in_progress: 'badge-info',
    completed: 'badge-success',
    referred: 'badge-danger',
    pending: 'badge-warning',
  };
  return map[status] || 'badge-info';
};
