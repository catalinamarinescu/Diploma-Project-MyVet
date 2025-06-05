import React, { useState, useEffect } from 'react';
import "./confirm.css";

const StepConfirm = ({ formData, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [clinic, setClinic] = useState({});
  const [pet, setPet] = useState({});
  const [medic, setMedic] = useState({});
  const [serviceDetails, setServiceDetails] = useState([]);
  const token = localStorage.getItem('myvet_token');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [clinicRes, petRes, servRes, medicRes] = await Promise.all([
          fetch(`http://localhost:5000/api/client/clinics/${formData.clinicId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`http://localhost:5000/api/client/pets/${formData.petId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`http://localhost:5000/api/client/clinic/${formData.clinicId}/servicii`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`http://localhost:5000/api/client/angajati/${formData.medicId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
        ]);

        if (!clinicRes.ok || !petRes.ok || !servRes.ok || !medicRes.ok) {
          alert("Eroare la încărcarea datelor pentru confirmare.");
          return;
        }

        const clinicData = await clinicRes.json();
        const petData = await petRes.json();
        const services = await servRes.json();
        const medicData = await medicRes.json();

        const allServiceIds = [formData.selectedService, ...formData.selectedExtras];
        const selected = services.filter(s => allServiceIds.includes(s.ID));

        setClinic(clinicData);
        setPet(petData);
        setMedic(medicData);
        setServiceDetails(selected);
      } catch (err) {
        console.error("Eroare la încărcarea datelor de confirmare:", err);
      }
    };

    fetchAll();
  }, [formData, token]);

  const handleConfirm = async () => {
    setLoading(true);

    const payload = {
      id_pet: formData.petId,
      id_clinica: formData.clinicId,
      id_medic: formData.medicId,
      data_start: `${formData.date} ${formData.time}`,
      data_end: `${formData.date} ${formData.timeEnd}`,
      notite: formData.note || '',
      servicii: [formData.selectedService, ...formData.selectedExtras],
    };

    const res = await fetch(`http://localhost:5000/api/client/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert('Programare confirmată!');
      window.location.href = '/client/myappointments';
    } else {
      alert('A apărut o eroare la salvarea programării.');
    }

    setLoading(false);
  };

  return (
    <div className="step-section-confirm">
      <h3 className="section-title-confirm">Confirm Appointment</h3>
      <p className="section-subtitle-doctor">Step 7 of 7</p>

      <div className="confirm-summary">
        <div className="confirm-header">
          <div className="confirm-title">✓ Appointment Summary</div>
        </div>

        <div className="confirm-content">
          <div className="confirm-column">
            <h4>Pet Information</h4>
            <div className="pet-info-confirm">
              <img src={pet.POZA ? `http://localhost:5000/${pet.POZA}` : '/default-pet.png'} alt={pet.NUME} className="pet-confirm-avatar" />
              <div>
                <p className="pet-name-confirm">{pet.NUME}</p>
                <p className="pet-breed-confirm">{pet.RASA}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="appointment-details-confirm">
          <h4>Appointment Details</h4>

          <p>
            <img src="/imagini/building.png" alt="clinic" className="icon-inline" />
            <strong>{clinic.name || clinic.NUME}</strong>, {clinic.adresa || clinic.ADRESA}
          </p>

          <p>
            <img src="/imagini/stethoscope.png" alt="doctor" className="icon-inline" />
            {medic.PRENUME} {medic.NUME}
          </p>

          {serviceDetails.map(s => (
            <p key={s.ID}>
              <img src="/imagini/stethoscope-solid.svg" alt="service" className="icon-inline" />
              <strong>{s.denumire}</strong>
              <span className="price-tag-confirm">{s.pret} RON</span>
            </p>
          ))}

          <p>
            <img src="/imagini/calendar.png" alt="calendar" className="icon-inline" />
            {new Date(formData.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>

          <p>
            <img src="/imagini/clock.png" alt="time" className="icon-inline" />
            {formData.time}
          </p>
        </div>
      </div>
      <div className="appointment-buttons-confirm">
          <button onClick={onBack}>← Previous</button>
          <button onClick={handleConfirm} disabled={loading}>
            {loading ? 'Saving...' : 'Confirm Appointment'}
          </button>
        </div>
    </div>
  );
};

export default StepConfirm;
