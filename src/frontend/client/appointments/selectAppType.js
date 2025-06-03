import React, { useEffect, useState } from 'react';
import './selectAppType.css';

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
        const filtered = data.filter(s => s.tip.toLowerCase() === 'appointment type');
        setServices(filtered);
      });
  }, [formData.clinicId, token]);

  const handleServiceSelect = (serviceId) => {
    setFormData({ ...formData, selectedService: serviceId });
  };

  if (!formData.clinicId) return null;

  return (
    <div className="step-section-appType">
      <h3 className="section-title-appType">Appointment Type</h3>
      <p className="section-subtitle-appType">Step 3 of 7</p>

      <div className="service-grid-appType">
        {services.map((s) => (
          <div
            key={s.ID}
            className={`service-card-appType ${formData.selectedService === s.ID ? 'selected' : ''}`}
            onClick={() => handleServiceSelect(s.ID)}
          >
            <div className="service-header-appType">
              <h4 className="service-title-appType">{s.denumire}</h4>
              <span className="service-price-appType">{s.pret} RON</span>
            </div>
            <p className="service-desc-appType">{s.descriere}</p>
            <p className="service-duration-appType">Duration: {s.durata} minutes</p>
          </div>
        ))}
      </div>

      <div className="nav-buttons-split-appType">
        <button className="btn-outline-appType" onClick={onBack}>← Previous</button>
        <button className="btn-next-appType" onClick={onNext} disabled={!formData.selectedService}>
          Next →
        </button>
      </div>
    </div>
  );
};

export default StepSelectService;
