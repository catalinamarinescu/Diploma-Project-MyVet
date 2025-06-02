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
      <p>Step 1 of 7</p>

      <div className="card-container">
        <div className="card-container">
          {pets.map((pet) => (
            <div
              key={pet.ID}
              className={`pet-card ${formData.petId === pet.ID ? 'selected' : ''}`}
              onClick={() => handlePetSelect(pet.ID)}
            >
              <div className="pet-avatar-wrapper">
                <img
                  src={pet.POZA ? `http://localhost:5000/${pet.POZA}` : '/default-pet.png'}
                  alt={pet.NUME}
                  className="pet-avatar"
                />
              </div>
              <h4 className="pet-name">{pet.NUME}</h4>
              <p className="pet-breed">{pet.RASA}</p>
              <p className="pet-age">{pet.TIP} · {pet.VARSTA} years old</p>
            </div>
          ))}
        </div>

      </div>

      <div className="nav-buttons-split">
        <div>
          <button className="btn1-secondary" onClick={onNext} disabled={!formData.petId}>Next →</button>
        </div>
      </div>
</div>
  );
};

export default StepSelectPet;