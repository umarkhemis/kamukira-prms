import React from 'react';

function ReportsDashboard({ data }) {
  return (
    <div className="space-y-4">
      {data && JSON.stringify(data, null, 2)}
    </div>
  );
}

export default ReportsDashboard;
