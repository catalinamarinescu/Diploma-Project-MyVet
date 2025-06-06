import React, { useEffect, useState } from 'react';
import './vaccinations.css';

const VaccinationTab = ({ petId }) => {
  const [vaccines, setVaccines] = useState([]);
  const [newVaccine, setNewVaccine] = useState({
    VACCINE_NAME: '',
    DATE_ADMINISTERED: '',
    NEXT_DUE_DATE: '',
    STATUS: 'Upcoming'
  });
  const token = localStorage.getItem('myvet_token');

  const fetchVaccines = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/clinic/pet/${petId}/vaccinations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setVaccines(data);
    } catch (err) {
      console.error('Eroare la fetch vaccinări:', err);
    }
  };

  useEffect(() => {
    fetchVaccines();
  }, [petId]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await fetch(`http://localhost:5000/api/clinic/vaccinations/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ STATUS: newStatus })
      });
      fetchVaccines();
    } catch (err) {
      console.error('Eroare la actualizare status:', err);
    }
  };

  const handleAddVaccination = async () => {
    try {
      await fetch(`http://localhost:5000/api/clinic/pet/${petId}/vaccinations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newVaccine)
      });
      setNewVaccine({ VACCINE_NAME: '', DATE_ADMINISTERED: '', NEXT_DUE_DATE: '', STATUS: 'Upcoming' });
      fetchVaccines();
    } catch (err) {
      console.error('Eroare la adăugare vaccin:', err);
    }
  };

  return (
    <div className="vaccination-tab">
      <div className="vaccination-header">
        <h3>Vaccination Records</h3>
      </div>

      <table className="vaccination-table">
        <thead>
          <tr>
            <th>Vaccine</th>
            <th>Date Administered</th>
            <th>Next Due Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {vaccines.map(v => (
            <tr key={v.ID}>
              <td><strong>{v.VACCINE_NAME}</strong></td>
              <td>{v.DATE_ADMINISTERED}</td>
              <td>{v.NEXT_DUE_DATE}</td>
              <td>
                <select
                  value={v.STATUS}
                  onChange={e => handleStatusChange(v.ID, e.target.value)}
                  className={`status-badge ${v.STATUS.toLowerCase()}`}
                >
                  <option value="Completed">Completed</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="add-vaccine-form">
        <input
          type="text"
          placeholder="Vaccine name"
          value={newVaccine.VACCINE_NAME}
          onChange={e => setNewVaccine({ ...newVaccine, VACCINE_NAME: e.target.value })}
        />
        <input
          type="date"
          value={newVaccine.DATE_ADMINISTERED}
          onChange={e => setNewVaccine({ ...newVaccine, DATE_ADMINISTERED: e.target.value })}
        />
        <input
          type="date"
          value={newVaccine.NEXT_DUE_DATE}
          onChange={e => setNewVaccine({ ...newVaccine, NEXT_DUE_DATE: e.target.value })}
        />
        <select
          value={newVaccine.STATUS}
          onChange={e => setNewVaccine({ ...newVaccine, STATUS: e.target.value })}
        >
          <option value="Upcoming">Upcoming</option>
          <option value="Completed">Completed</option>
          <option value="Overdue">Overdue</option>
        </select>
        <button className="add-btn" onClick={handleAddVaccination}>Add Vaccination</button>
      </div>
    </div>
  );
};

export default VaccinationTab;