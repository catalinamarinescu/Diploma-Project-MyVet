// JoinClinicForm.jsx
import React, { useEffect, useState } from "react";
import "./joinClinic.css";

const JoinClinicForm = ({ clinicId, onClose }) => {
  const [userData, setUserData] = useState({});
  const [pets, setPets] = useState([]);
  const [selectedPets, setSelectedPets] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/client/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('myvet_token')}`
      }
    })
      .then(res => res.json())
      .then(data => setUserData(data));

    fetch(`http://localhost:5000/api/client/pets`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('myvet_token')}`
      }
    })
      .then(res => res.json())
      .then(data => setPets(data));
  }, []);

  const togglePetSelection = (petId) => {
    setSelectedPets(prev =>
      prev.includes(petId) ? prev.filter(id => id !== petId) : [...prev, petId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const body = {
      clinic_id: clinicId,
      first_name: form.first_name.value,
      last_name: form.last_name.value,
      email: form.email.value,
      phone: form.phone.value,
      pet_ids: selectedPets
    };

    fetch("http://localhost:5000/api/join-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('myvet_token')}`
      },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(() => {
        alert("Cererea a fost trimisă cu succes!");
        onClose();
      });
  };

  return (
    <div className="join-form-overlay">
      <form className="join-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Join Clinic</h2>

        <label className="form-label">First Name</label>
        <input className="form-input" name="first_name" defaultValue={userData.prenume} required />

        <label className="form-label">Last Name</label>
        <input className="form-input" name="last_name" defaultValue={userData.nume} required />

        <label className="form-label">Email</label>
        <input className="form-input" name="email" defaultValue={userData.email} required />

        <label className="form-label">Phone</label>
        <input className="form-input" name="phone" defaultValue={userData.telefon} required />

        <label className="form-label">Select Pets</label>
        <div className="checkbox-list">
            {pets.map(p => (
            <label key={p.id} className="checkbox-item">
                <input
                type="checkbox"
                value={p.id}
                checked={selectedPets.includes(p.id)}
                onChange={() => togglePetSelection(p.id)}
                />
                {p.nume}
            </label>
            ))}
        </div>

        <div className="form-actions">
            <button className="submit-btn" type="submit">Submit Request</button>
            <button className="cancel-form-btn" type="button" onClick={onClose}>Cancel</button>
        </div>
        </form>
  
    </div>
  );
};

export default JoinClinicForm;
