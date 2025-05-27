import React, { useEffect, useState } from 'react';
import './selectPet.css';

const StepSelectService = ({ formData, setFormData, onNext, onBack }) => {
  const token = localStorage.getItem('myvet_token');
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (!formData.clinicId) return;
    fetch(`http://localhost:5000/api/client/clinic/${formData.clinicId}/servicii`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        // Filter only appointment-type services (e.g., TIP_SERVICIU === 'appointment')
        const filtered = data.filter(s => s.tip.toLowerCase() === 'appointment type');
        setServices(filtered);
      });
  }, [formData.clinicId, token]);

  const handleServiceSelect = (serviceId) => {
    setFormData({ ...formData, selectedService: serviceId });
  };

  if (!formData.clinicId) return null;

  return (
    <div className="step-section">
      <h3>Select Appointment Type</h3>
      <p>Step 3 of 6</p>
      <div className="card-container">
        {services.map((s) => (
          <div
            key={s.ID}
            className={`card service-card ${formData.selectedService === s.ID ? 'selected' : ''}`}
            onClick={() => handleServiceSelect(s.ID)}
          >
            <h4>{s.denumire}</h4>
            <p>{s.pret} RON • {s.durata} min</p>
          </div>
        ))}
      </div>
      <div className="appointment-buttons">
        <button onClick={onBack}>Prev</button>
        <button onClick={onNext} disabled={!formData.selectedService}>Next</button>
      </div>
    </div>
  );
};

export default StepSelectService;
