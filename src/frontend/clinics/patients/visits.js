import React, { useEffect, useState } from 'react';
import './visits.css';

const VisitTab = ({ petId }) => {
  const [visits, setVisits] = useState([]);
  const [form, setForm] = useState({
    title: '',
    date: '',
    diagnosis: '',
    treatment: ''
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

      setForm({ title: '', date: '', diagnosis: '', treatment: '' });
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
      treatment: visit.TREATMENT
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
      </div>

      <div className="visit-list">
        {visits.map(visit => (
          <div key={visit.ID} className="visit-card">
            <div className="visit-card-header">
              <div>
                <div className="visit-title">{visit.TITLE}</div>
                <div className="visit-date">{new Date(visit.VISIT_DATE).toLocaleDateString()}</div>
              </div>
              <button className="edit-icon" onClick={() => handleEdit(visit)}>✏️</button>
            </div>
            <div className="visit-section">
              <strong>Diagnosis</strong>
              <p>{visit.DIAGNOSIS}</p>
            </div>
            <div className="visit-section">
              <strong>Treatment</strong>
              <p>{visit.TREATMENT}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisitTab;