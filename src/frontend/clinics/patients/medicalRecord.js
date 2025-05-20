import React, { useEffect, useState } from 'react';
import './medicalRecord.css';
import VaccinationTab from './vaccinations'; // ajustează calea dacă e necesar
import VisitTab from './visits';
import LabResultsTab from './labResults';


const MedicalRecord = ({ petId, onClose }) => {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const token = localStorage.getItem('myvet_token');
  const [formData, setFormData] = useState({
    weight: '',
    sex: '',
    allergies: '',
    notes: ''
  });

  useEffect(() => {
    const fetchMedicalRecord = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/clinic/pet/${petId}/medical-record`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error('Failed to fetch medical record:', err);
      }
    };
    fetchMedicalRecord();
  }, [petId, token]);

  useEffect(() => {
    if (data) {
      setFormData({
        weight: data.WEIGHT_KG || '',
        sex: data.SEX || '',
        allergies: data.ALLERGIES || '',
        notes: data.NOTES || ''
      });
    }
  }, [data]);

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/clinic/pet/${petId}/medical-record`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          LAST_CHECKUP_DATE: new Date().toISOString().split('T')[0],
          WEIGHT_KG: formData.weight,
          SEX: formData.sex,
          ALLERGIES: formData.allergies,
          NOTES: formData.notes
        })
      });

      if (!res.ok) throw new Error('Eroare la salvare');
      alert('Fișa medicală a fost salvată cu succes!');
      onClose(); // închide modalul sau poți face un re-fetch dacă vrei
    } catch (err) {
      console.error(err);
      alert('Eroare la salvare');
    }
  };

  if (!data) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>&times;</button>

        <div className="modal-header">
          <h2>Medical File: {data.PET_NAME}</h2>
          <span className="badge healthy">Healthy</span>
          <p className="sub-info">
            Owner: {data.OWNER_NAME || 'N/A'} • Last checkup: {data.LAST_CHECKUP_DATE || 'N/A'}
          </p>
        </div>

        <div className="pet-summary">
          <div className="pet-image">
            {data.POZA ? <img src={`http://localhost:5000/${data.POZA}`} alt={data.PET_NAME} /> : '🐾'}
          </div>
          <div className="pet-info">
            <h3>{data.PET_NAME}</h3>
            <p>{data.TIP} • {data.RASA} • {data.VARSTA} years old</p>
            <p>Weight: {formData.weight || 'N/A'} kg</p>
          </div>
        </div>

        <div className="tabs">
          {['overview', 'visits', 'vaccinations', 'lab'].map(tab => (
            <button
              key={tab}
              className={activeTab === tab ? 'tab active' : 'tab'}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <>
              <div className="card">
                <h4>Weight (kg)</h4>
                <input
                  className="medical-input"
                  type="number"
                  value={formData.weight}
                  onChange={e => setFormData({ ...formData, weight: e.target.value })}
                />
              </div>

              <div className="card">
                <h4>Sex</h4>
                <select
                  className='medical-select'
                  value={formData.sex}
                  onChange={e => setFormData({ ...formData, sex: e.target.value })}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="card">
                <h4>Allergies</h4>
                <textarea
                  className='medica-textarea'
                  value={formData.allergies}
                  onChange={e => setFormData({ ...formData, allergies: e.target.value })}
                />
              </div>

              <div className="card">
                <h4>Notes</h4>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </>
          )}

          {activeTab === 'vaccinations' && (
            <VaccinationTab petId={petId} />
          )}


          {activeTab === 'visits' && (
            <VisitTab petId={petId} />
          )}

          {activeTab === 'lab' && (
            <LabResultsTab petId={petId} />
          )}
        </div>

        <div className="modal-actions">
          <button className="primary-btn" onClick={handleSave}>Save Medical Record</button>
          <button className="secondary-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecord;
