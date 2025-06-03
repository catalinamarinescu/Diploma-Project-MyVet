import React, { useEffect, useState } from 'react';
import './selectVet.css';

const StepSelectMedic = ({ formData, setFormData, onNext, onBack }) => {
  const [medici, setMedici] = useState([]);
  const token = localStorage.getItem('myvet_token');

  useEffect(() => {
    if (!formData.clinicId || !formData.selectedService) return;

    const servicii = [formData.selectedService, ...formData.selectedExtras];
    fetch(`http://localhost:5000/api/client/clinic/${formData.clinicId}/medici?servicii=${servicii.join(',')}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setMedici);
  }, [formData]);

  const handleMedicSelect = (medicId) => {
    setFormData({ ...formData, medicId });
  };

  return (
    <div className="step-section-doctor">
      <h3 className="section-title-doctor">Select Doctor</h3>
      <p className="section-subtitle-doctor">Step 5 of 7</p>

      <div className="doctor-grid">
        {medici.map(medic => (
          <div
            key={medic.ID}
            className={`doctor-card ${formData.medicId === medic.ID ? 'selected' : ''}`}
            onClick={() => handleMedicSelect(medic.ID)}
          >
            <div className="doctor-avatar-wrapper">
              <img
                src={medic.POZA ? `http://localhost:5000/${medic.POZA}` : '/default-doctor.png'}
                alt={medic.FULL_NAME}
                className="doctor-avatar"
              />
            </div>
            <div className="doctor-info">
              <h4 className="doctor-name">{medic.FULL_NAME}</h4>
              <p className="doctor-role">{medic.TIP_ANGAJAT}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="nav-buttons-split-doctor">
        <button className="btn-outline-doctor" onClick={onBack}>← Previous</button>
        <button className="btn-next-doctor" onClick={onNext} disabled={!formData.medicId}>
          Next →
        </button>
      </div>
    </div>
  );
};

export default StepSelectMedic;
