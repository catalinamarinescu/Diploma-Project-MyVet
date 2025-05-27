import React, { useEffect, useState } from 'react';
import './selectPet.css';

const StepSelectClinic = ({ formData, setFormData, onNext, onBack }) => {
  const token = localStorage.getItem('myvet_token');
  const [clinics, setClinics] = useState([]);

  useEffect(() => {
    if (!formData.petId) return;
    fetch(`http://localhost:5000/api/client/pets/${formData.petId}/clinics`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setClinics);
  }, [formData.petId, token]);

  const handleClinicSelect = (clinicId) => {
    setFormData({ ...formData, clinicId });
  };

  return (
    <div className="step-section">
      <h3>Choose Clinic</h3>
      <p>Step 2 of 6</p>

      <div className="card-container">
        {clinics.map((clinic) => (
          <div
            key={clinic.ID_CLINICA || clinic.ID}
            className={`card clinic-card ${formData.clinicId === (clinic.ID_CLINICA || clinic.ID) ? 'selected' : ''}`}
            onClick={() => handleClinicSelect(clinic.ID_CLINICA || clinic.ID)}
          >
            <h4>{clinic.NUME || clinic.NAME}</h4>
            <p><i className="fa fa-map-marker" /> {clinic.ADRESA || clinic.ADDRESS}</p>
            <p><i className="fa fa-envelope" /> {clinic.EMAIL}</p>
          </div>
        ))}
      </div>

      <div className="appointment-buttons">
        <button onClick={onBack}>Prev</button>
        <button onClick={onNext} disabled={!formData.clinicId}>Next</button>
      </div>
    </div>
  );
};

export default StepSelectClinic;
