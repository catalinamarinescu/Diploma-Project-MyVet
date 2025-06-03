import React, { useEffect, useState } from 'react';
import './selectClinic.css';

const StepSelectClinic = ({ formData, setFormData, onNext, onBack }) => {
  const token = localStorage.getItem('myvet_token');
  const [clinics, setClinics] = useState([]);
  const [petName, setPetName] = useState('');

  useEffect(() => {
    if (!formData.petId) return;
    fetch(`http://localhost:5000/api/client/pets/${formData.petId}/clinics`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setClinics);

     fetch('http://localhost:5000/api/client/pets', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((pets) => {
        const selectedPet = pets.find((p) => p.ID === formData.petId);
        if (selectedPet) setPetName(selectedPet.NUME);
      });
 
  }, [formData.petId, token]);

  const handleClinicSelect = (clinicId) => {
    setFormData({ ...formData, clinicId });
  };

  return (
    <div className="step-section-clinic">
      <h3 className="section-title-clinic">Choose Clinic</h3>
      <p className="section-subtitle-clinic">Step 2 of 7</p>
      <p className="clinic-hint-app">Available clinics for <strong>{petName}</strong>:</p>

      <div className="clinic-card-container-app">
        {clinics.map((clinic) => (
          <div
            key={clinic.ID_CLINICA || clinic.ID}
            className={`clinic-tile-app ${formData.clinicId === (clinic.ID_CLINICA || clinic.ID) ? 'selected' : ''}`}
            onClick={() => handleClinicSelect(clinic.ID_CLINICA || clinic.ID)}
          >
            <div className="clinic-avatar-wrapper">
              <img
                src={clinic.imagine ? `http://localhost:5000/${clinic.imagine}` : '/default-clinic.png'}
                alt={clinic.NUME}
                className="clinic-avatar-app"
              />
            </div>
            <div className="clinic-content-app">
              <h4 className="clinic-name-app">{clinic.NUME || clinic.NAME}</h4>
              <p className="clinic-info-app"><i className="fa fa-map-marker"></i> {clinic.ADRESA || clinic.ADDRESS}</p>
              <p className="clinic-info-app"><i className="fa fa-envelope"></i> {clinic.EMAIL || clinic.PHONE}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="nav-buttons-split-app1">
        <button className="btn-outline-app1" onClick={onBack}>← Previous</button>
        <button
          className="btn-next-app1"
          onClick={onNext}
          disabled={!formData.clinicId}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default StepSelectClinic;
