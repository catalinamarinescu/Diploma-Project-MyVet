import React, { useState, useEffect } from 'react';
import "./selectPet.css";

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
      window.location.href = '/client/programari';
    } else {
      alert('A apărut o eroare la salvarea programării.');
    }

    setLoading(false);
  };

  return (
    <div className="step-section">
      <h3>Confirm Appointment</h3>
      <p>Step 6 of 6</p>

      <div className="summary-card">
        <h4>📌 Pet Information</h4>
        <p><strong>{pet.NUME}</strong></p>
        <p>{pet.RASA} • {pet.TIP}</p>

        <h4>🏥 Clinic</h4>
        <p><strong>{clinic.name || clinic.NUME}</strong></p>
        <p>{clinic.adresa || clinic.ADRESA}</p>

        <h4>👨‍⚕️ Doctor</h4>
        <p>{medic.PRENUME} {medic.NUME} ({medic.TIP_ANGAJAT})</p>

        <h4>🛠️ Services</h4>
        {serviceDetails.map(s => (
          <p key={s.ID}>🩺 {s.denumire} – {s.pret} RON</p>
        ))}

        <h4>📅 Appointment Time</h4>
        <p>{new Date(formData.date).toLocaleDateString('ro-RO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p>🕒 {formData.time} – {formData.timeEnd}</p>
      </div>

      <div className="appointment-buttons">
        <button onClick={onBack}>Previous</button>
        <button onClick={handleConfirm} disabled={loading}>
          {loading ? 'Saving...' : 'Confirm Appointment'}
        </button>
      </div>
    </div>
  );
};

export default StepConfirm;
