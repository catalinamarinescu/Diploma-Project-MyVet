import React, { useEffect, useState } from 'react';
import './visits.css';

const VisitTab = ({ petId }) => {
  const [visits, setVisits] = useState([]);
  const [veterinarians, setVeterinarians] = useState([]);
  const [form, setForm] = useState({
    title: '',
    date: '',
    diagnosis: '',
    treatment: '',
    veterinarian: ''
  });
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem('myvet_token');

  useEffect(() => {
    fetchVisits();
  }, [petId]);

  const fetchVisits = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/clinic/pet/${petId}/visits`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setVisits(data);
    } catch (err) {
      console.error('Error fetching visits:', err);
    }
  };

  useEffect(() => {
  fetchVisits();
  fetchVeterinarians();
}, [petId]);

const fetchVeterinarians = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/clinic/angajati', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setVeterinarians(data);
  } catch (err) {
    console.error('Error fetching vets:', err);
  }
};


  const handleAddOrEditVisit = async () => {
    const method = editId ? 'PUT' : 'POST';
    const url = editId
      ? `http://localhost:5000/api/clinic/pet/${petId}/visits/${editId}`
      : `http://localhost:5000/api/clinic/pet/${petId}/visits`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error('Failed to save visit');

      setForm({ title: '', date: '', diagnosis: '', treatment: '' , veterinarian: ''});
      setEditId(null);
      fetchVisits();
    } catch (err) {
      console.error('Error saving visit:', err);
    }
  };

  const handleEdit = visit => {
    setForm({
      title: visit.TITLE,
      date: visit.VISIT_DATE.split('T')[0],
      diagnosis: visit.DIAGNOSIS,
      treatment: visit.TREATMENT,
      veterinarian: visit.VETERINARIAN || ''
    });

    setEditId(visit.ID);
  };

  return (
    <div className="visit-tab">
      <div className="visit-header">
        <h3>Visit History</h3>
        <button className="add-visit-btn" onClick={handleAddOrEditVisit}>
          {editId ? 'Update Visit' : '+ Add Visit'}
        </button>
      </div>

      <div className="visit-form">
        <input
          type="text"
          placeholder="Visit title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
        <input
          type="date"
          value={form.date}
          onChange={e => setForm({ ...form, date: e.target.value })}
        />
        <textarea
          placeholder="Diagnosis"
          value={form.diagnosis}
          onChange={e => setForm({ ...form, diagnosis: e.target.value })}
        />
        <textarea
          placeholder="Treatment"
          value={form.treatment}
          onChange={e => setForm({ ...form, treatment: e.target.value })}
        />
        <select
          value={form.veterinarian}
          onChange={e => setForm({ ...form, veterinarian: e.target.value })}
        >
          <option value="">Select Veterinarian</option>
          {veterinarians.map(vet => (
            <option key={vet.ID} value={vet.FULL_NAME}>
              {vet.FULL_NAME}
            </option>
          ))}
        </select>
      </div>

      <div className="visit-list">
        {visits.map(visit => (
          <div key={visit.ID} className="visit-card">
            <div className="visit-card-header">
              <div>
                <div className="visit-title">{visit.TITLE}</div>
                <div className="visit-date">{new Date(visit.VISIT_DATE).toLocaleDateString()}</div>
              </div>
              <button className="edit-icon" onClick={() => handleEdit(visit)}>Edit</button>
            </div>
            <div className="visit-section">
              <strong>Diagnosis</strong>
              <p>{visit.DIAGNOSIS}</p>
            </div>
            <div className="visit-section">
              <strong>Treatment</strong>
              <p>{visit.TREATMENT}</p>
            </div>
            <div className="visit-section">
            <strong>Veterinarian</strong>
            <p>{visit.VETERINARIAN}</p>
          </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisitTab;