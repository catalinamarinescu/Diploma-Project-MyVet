import React, { useEffect, useState } from 'react';
import './selectPet.css';

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
    <div className="step-section">
      <h3>Select Doctor</h3>
      <p>Step 5 of 6</p>

      <div className="card-container">
        {medici.map(medic => (
          <div
            key={medic.ID}
            className={`card medic-card ${formData.medicId === medic.ID ? 'selected' : ''}`}
            onClick={() => handleMedicSelect(medic.ID)}
          >
            <h4>{medic.FULL_NAME}</h4>
            <p>{medic.TIP_ANGAJAT}</p>
          </div>
        ))}
      </div>

      <div className="appointment-buttons">
        <button onClick={onBack}>Prev</button>
        <button onClick={onNext} disabled={!formData.medicId}>Next</button>
      </div>
    </div>
  );
};

export default StepSelectMedic;
