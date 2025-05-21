import React, { useEffect, useState } from 'react';
import './visits.css';
import { useParams } from 'react-router-dom';

const ClientVisitTab = ({ petId }) => {
  const {clinicId} = useParams();
  const [visits, setVisits] = useState([]);
  const token = localStorage.getItem('myvet_token');

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/client/pet/${petId}/visits?clinicId=${clinicId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setVisits(data);
      } catch (err) {
        console.error('Error fetching visits:', err);
      }
    };
    fetchVisits();
  }, [petId]);

  return (
    <div className="client-visits-container">
      <h3>Visit History</h3>
      {visits.length === 0 ? (
        <p>No visits found.</p>
      ) : (
        visits.map((visit, index) => (
          <div className="client-visit-card" key={index}>
            <h4>{visit.TITLE}</h4>
            <p className="visit-subtext">
              {new Date(visit.VISIT_DATE).toLocaleDateString()} • {visit.VETERINARIAN || 'Clinic'}
            </p>

            <div className="visit-section">
              <strong>Veterinarian</strong>
              <p>{visit.VETERINARIAN || 'Unknown'}</p>
            </div>

            <div className="visit-section">
              <strong>Diagnosis</strong>
              <p>{visit.DIAGNOSIS}</p>
            </div>

            <div className="visit-section">
              <strong>Notes</strong>
              <p>{visit.TREATMENT}</p>
            </div>

            <div className="visit-section">
              <strong>Follow-up</strong>
              <p>Annual checkup in 12 months</p> {/* Placeholder */}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ClientVisitTab;
