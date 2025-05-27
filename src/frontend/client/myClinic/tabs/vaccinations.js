import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './vaccinations.css';

const ClientVaccinationTab = ({ petId, clinicId }) => {
  const [vaccines, setVaccines] = useState([]);
  const token = localStorage.getItem('myvet_token');

  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/client/pet/${petId}/vaccinations?clinicId=${clinicId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setVaccines(data);
      } catch (err) {
        console.error('Vaccination fetch error:', err);
      }
    };

    fetchVaccines();
  }, [petId]);

  const getStatus = (dueDate) => {
    if (!dueDate) return 'Unknown';
    const today = new Date();
    const due = new Date(dueDate);
    return due < today ? 'Overdue' : 'Up to Date';
  };

  return (
    <div className="vaccination-tab">
      <h3>Vaccination Records</h3>
      <table className="vaccination-table">
        <thead>
          <tr>
            <th>Vaccine</th>
            <th>Date Administered</th>
            <th>Next Due Date</th>
            <th>Provider</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {vaccines.map((v, idx) => (
            <tr key={idx}>
              <td><strong>{v.VACCINE_NAME}</strong></td>
              <td>{new Date(v.DATE_ADMINISTERED).toLocaleDateString()}</td>
              <td>{new Date(v.NEXT_DUE_DATE).toLocaleDateString()}</td>
              <td>Animal Care Clinic</td>
              <td>
                <span className={`status-badge ${v.STATUS === 'Overdue' ? 'overdue' : 'up-to-date'}`}>
                  {v.STATUS}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="vaccination-note">
        <span>💉</span> Keep vaccinations up to date to protect your pet's health
      </div>
    </div>
  );
};

export default ClientVaccinationTab;
