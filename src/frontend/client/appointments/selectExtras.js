import React, { useEffect, useState } from 'react';
import './selectPet.css';

const StepSelectExtras = ({ formData, setFormData, onNext, onBack }) => {
  const token = localStorage.getItem('myvet_token');
  const [extras, setExtras] = useState([]);

  useEffect(() => {
    if (!formData.clinicId) return;
    fetch(`http://localhost:5000/api/client/clinic/${formData.clinicId}/servicii`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        // Filter services that are NOT appointment type
        const filtered = data.filter(s => s.tip.toLowerCase() !== 'appointment type');
        setExtras(filtered);
      });
  }, [formData.clinicId, token]);

  const handleExtraToggle = (id) => {
    const current = formData.selectedExtras;
    if (current.includes(id)) {
      setFormData({
        ...formData,
        selectedExtras: current.filter(x => x !== id)
      });
    } else {
      setFormData({
        ...formData,
        selectedExtras: [...current, id]
      });
    }
  };

  if (!formData.selectedService) return null;

  return (
    <div className="step-section">
      <h3>Select Extra Services</h3>
      <p>Step 4 of 6</p>

      <div className="card-container">
        {extras.map((s) => (
          <div
            key={s.ID}
            className={`card service-card ${formData.selectedExtras.includes(s.ID) ? 'selected' : ''}`}
            onClick={() => handleExtraToggle(s.ID)}
          >
            <h4>{s.denumire}</h4>
            <p>{s.pret} RON • {s.durata} min</p>
          </div>
        ))}
      </div>

      <div className="appointment-buttons">
        <button onClick={onBack}>Prev</button>
        <button onClick={onNext}>Next</button>
      </div>
    </div>
  );
};

export default StepSelectExtras;
