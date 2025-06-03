import React, { useEffect, useState } from 'react';
import './selectExtras.css';

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
    <div className="step-section-extra">
      <h3 className="section-title-extra">Select Extra Services</h3>
      <p className="section-subtitle-extra">Step 4 of 7</p>

      <div className="service-grid-extra">
        {extras.map((s) => (
          <div
            key={s.ID}
            className={`service-card-extra ${formData.selectedExtras.includes(s.ID) ? 'selected' : ''}`}
            onClick={() => handleExtraToggle(s.ID)}
          >
            <div className="service-header-extra">
              <h4 className="service-title-extra">{s.denumire}</h4>
              <span className="service-price-extra">{s.pret} RON</span>
            </div>
            <p className="service-desc-extra">{s.descriere}</p>
            <p className="service-duration-extra">Duration: {s.durata} minutes</p>
          </div>
        ))}
      </div>

      <div className="nav-buttons-split-extra">
        <button className="btn-outline-extra" onClick={onBack}>← Previous</button>
        <button className="btn-next-extra" onClick={onNext}>
          Next →
        </button>
      </div>
    </div>
  );
};

export default StepSelectExtras;
