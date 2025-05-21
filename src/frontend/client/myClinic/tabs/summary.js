// SummaryTab.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './summary.css';

const SummaryTab = ({ petId }) => {
  const [summary, setSummary] = useState(null);
   const {clinicId} = useParams();
  const token = localStorage.getItem('myvet_token');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/client/pet/${petId}/medical-record?clinicId=${clinicId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error('Eroare la preluarea datelor:', err);
      }
    };

    if (petId) fetchSummary();
  }, [petId, token]);

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
      </div>
    </div>
  );
};

export default SummaryTab;
