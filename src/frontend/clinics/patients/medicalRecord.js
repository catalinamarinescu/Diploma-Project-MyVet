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
    notes: '',
    status: 'Healthy' 
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
        notes: data.NOTES || '',
        status: data.STATUS || 'Healthy' 
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
        NOTES: formData.notes,
        STATUS: formData.status
      })
    });

    if (!res.ok) throw new Error('Eroare la salvare');

    // 🔄 re-fetch updated data
    const updatedRes = await fetch(`http://localhost:5000/api/clinic/pet/${petId}/medical-record`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const updatedData = await updatedRes.json();
    setData(updatedData);
    setFormData(prev => ({
      ...prev,
      status: updatedData.STATUS || prev.status
    }));

    alert('Fișa medicală a fost salvată cu succes!');
    onClose();
  } catch (err) {
    console.error(err);
    alert('Eroare la salvare');
  }
};
  if (!data) return null;

  return (
    <div className="modal-overlay-md">
      <div className="modal-md">
        <button className="close-button-md" onClick={onClose}>&times;</button>

        <div className="modal-header-md">
          <h2>Medical File: {data.PET_NAME}</h2>
          <span className={`badge ${formData.status.toLowerCase()}`}>
            {formData.status}
          </span>
          <p className="sub-info-md">
            Owner: {data.OWNER_NAME || 'N/A'} • Last checkup: {data.LAST_CHECKUP_DATE || 'N/A'}
          </p>
        </div>

        <div className="pet-summary-md">
          <div className="pet-image-md">
            {data.POZA ? <img src={`http://localhost:5000/${data.POZA}`} alt={data.PET_NAME} /> : '🐾'}
          </div>
          <div className="pet-info-md">
            <h3>{data.PET_NAME}</h3>
            <p>{data.TIP} • {data.RASA} • {data.VARSTA} years old</p>
            <p>Weight: {formData.weight || 'N/A'} kg</p>
          </div>
        </div>

        <div className="tabs-md">
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

        <div className="tab-content-md">
          {activeTab === 'overview' && (
            <>
            <div className="card-md">
            <h4>Health Status</h4>
            <select
              className="medical-select-md"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Healthy">Healthy</option>
              <option value="Unhealthy">Unhealthy</option>
            </select>
          </div>
              <div className="card-md">
                <h4>Weight (kg)</h4>
                <input
                  className="medical-input-md"
                  type="number"
                  value={formData.weight}
                  onChange={e => setFormData({ ...formData, weight: e.target.value })}
                />
              </div>

              <div className="card-md">
                <h4>Sex</h4>
                <select
                  className='medical-select-md'
                  value={formData.sex}
                  onChange={e => setFormData({ ...formData, sex: e.target.value })}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="card-md">
                <h4>Allergies</h4>
                <textarea
                  className='medica-textarea-md'
                  value={formData.allergies}
                  onChange={e => setFormData({ ...formData, allergies: e.target.value })}
                />
              </div>

              <div className="card-md">
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

        <div className="modal-actions-md">
          <button className="primary-btn-md" onClick={handleSave}>Save Medical Record</button>
          <button className="secondary-btn-md" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecord;
