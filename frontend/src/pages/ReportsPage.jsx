import React, { useEffect, useState } from 'react';
import { reportService } from '../services/reportService';
import LoadingSpinner from '../components/common/LoadingSpinner';

function ReportsPage() {
  const [report, setReport] = useState(null);
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const load = () => {
    setLoading(true);
    const params = {};
    if (dateFrom) params.date_from = dateFrom;
    if (dateTo) params.date_to = dateTo;

    Promise.all([
      reportService.getVisitReport(params),
      reportService.getDiseaseReport(params),
      reportService.getPatientDemographics(),
    ])
      .then(([visits, dis, demo]) => {
        setReport({
          visits: visits.data.data,
          demographics: demo.data.data,
        });
        setDiseases(dis.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Reports</h2>

      <div className="card">
        <h3 className="font-semibold mb-3">Date Range</h3>
        <div className="flex gap-4 items-end">
          <div>
            <label className="form-label">From</label>
            <input type="date" className="form-input" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>
          <div>
            <label className="form-label">To</label>
            <input type="date" className="form-input" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
          <button onClick={load} className="btn-primary">Apply</button>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-semibold mb-4">Visit Summary</h3>
            <div className="text-3xl font-bold text-primary-600 mb-4">{report?.visits?.total ?? '-'} Total</div>
            <div className="space-y-2">
              {report?.visits?.by_type?.map((item) => (
                <div key={item.visit_type} className="flex justify-between text-sm">
                  <span className="capitalize text-gray-600">{item.visit_type}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4">Patient Demographics</h3>
            <div className="text-3xl font-bold text-green-600 mb-4">{report?.demographics?.total ?? '-'} Total</div>
            <div className="space-y-2">
              {report?.demographics?.by_gender?.map((item) => (
                <div key={item.gender} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.gender === 'M' ? 'Male' : item.gender === 'F' ? 'Female' : 'Other'}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card md:col-span-2">
            <h3 className="font-semibold mb-4">Top 10 Diagnoses</h3>
            {diseases.length > 0 ? (
              <div className="space-y-2">
                {diseases.map((d, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs flex items-center justify-center font-medium">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span>{d.diagnosis_name} {d.icd_code && <span className="text-gray-400">({d.icd_code})</span>}</span>
                        <span className="font-medium">{d.count}</span>
                      </div>
                      <div className="mt-1 h-1.5 bg-gray-100 rounded-full">
                        <div
                          className="h-full bg-primary-500 rounded-full"
                          style={{ width: `${(d.count / diseases[0].count) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4">No diagnoses data</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportsPage;
