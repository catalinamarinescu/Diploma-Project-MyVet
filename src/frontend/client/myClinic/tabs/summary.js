import React, { useEffect, useState } from 'react';
import './summary.css';

const SummaryTab = ({ petId, clinicId }) => {
  const [summary, setSummary] = useState(null);
  const token = localStorage.getItem('myvet_token');

  useEffect(() => {
  const fetchSummary = async () => {
    if (!clinicId || !petId) {
      console.warn('❗ Lipsă clinicId sau petId', { clinicId, petId });
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/client/pet/${petId}/medical-record?clinicId=${clinicId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await res.json();
      console.log('📦 Summary data received:', data);
      setSummary(data);
    } catch (err) {
      console.error('❌ Eroare la fetch summary:', err);
    }
  };

  fetchSummary();
}, [petId, clinicId, token]);

  if (!summary) return <p className="loading-summary">Se încarcă fișa medicală...</p>;

  return (
    <div className="summary-tab">
      <div className="summary-card">
        <div className="summary-item">
          <strong>Allergies:</strong> {summary.ALLERGIES || 'None'}
        </div>
        <div className="summary-item">
          <strong>Notes:</strong> {summary.NOTES || 'No notes'}
        </div>
        <div className="summary-item">
          <strong>Sex:</strong> {summary.SEX || 'N/A'}
        </div>
        <div className="summary-item">
          <strong>Weight:</strong> {summary.WEIGHT_KG ? `${summary.WEIGHT_KG} kg` : 'N/A'}
        </div>
        <div className="summary-item">
          <strong>Status:</strong>{' '}
          <span
            className={`badge ${
              summary.STATUS === 'Unhealthy' ? 'unhealthy' : 'healthy'
            }`}
          >
            {summary.STATUS || 'Unknown'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SummaryTab;
