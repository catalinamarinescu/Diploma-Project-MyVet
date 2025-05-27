import React, { useEffect, useState } from 'react';
import './selectPet.css';

const StepSelectPet = ({ formData, setFormData, onNext }) => {
  const token = localStorage.getItem('myvet_token');
  const [pets, setPets] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/client/pets', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setPets);
  }, [token]);

  const handlePetSelect = (petId) => {
    setFormData({ ...formData, petId, clinicId: '' });
  };

  return (
    <div className="step-section">
      <h3>Select Your Pet</h3>
      <p>Step 1 of 6</p>

      <div className="card-container">
        {pets.map((pet) => (
          <div
            key={pet.ID}
            className={`card pet-card ${formData.petId === pet.ID ? 'selected' : ''}`}
            onClick={() => handlePetSelect(pet.ID)}
          >
            <h4>{pet.NUME}</h4>
            <p>{pet.RASA}</p>
            <p>{pet.TIP} • {pet.VARSTA} years old</p>
            <span className="clinic-tag">{pet.NR_CLINICI || 1} clinic{(pet.NR_CLINICI || 1) > 1 ? 's' : ''}</span>
          </div>
        ))}
      </div>

      <div className="appointment-buttons">
        <button onClick={onNext} disabled={!formData.petId}>
          Next
        </button>
      </div>
    </div>
  );
};

export default StepSelectPet;