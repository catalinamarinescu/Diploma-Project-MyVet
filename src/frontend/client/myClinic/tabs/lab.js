import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './lab.css';

const ClientLabTab = ({ petId }) => {
     const {clinicId} = useParams();
  const [results, setResults] = useState([]);
  const token = localStorage.getItem('myvet_token');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/client/pet/${petId}/lab-results?clinicId=${clinicId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error('Lab results fetch error:', err);
      }
    };

    fetchResults();
  }, [petId]);

  return (
    <div className="lab-tab">
      <h3>Lab Results</h3>
      {results.map(result => (
        <div key={result.ID} className="lab-card">
          <div className="lab-card-header">
            <div>
              <h4>{result.NAME}</h4>
              <p>{new Date(result.TEST_DATE).toLocaleDateString()} • Animal Care Clinic</p>
            </div>
            <span className={`lab-status ${result.STATUS === 'Normal' ? 'normal' : 'abnormal'}`}>
              {result.STATUS}
            </span>
          </div>
          <div className="lab-notes">
            <strong>Notes</strong>
            <p>{result.SUMMARY || 'No notes available.'}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientLabTab;
