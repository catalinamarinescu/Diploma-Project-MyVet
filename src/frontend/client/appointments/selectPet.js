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
    <div className="step-section-pet">
      <h3 className="section-title-pet">Select Your Pet</h3>
      <p className="section-subtitle-pet">Step 1 of 7</p>

      <div className="pet-card-container-app">
        {pets.map((pet) => (
          <div
            key={pet.ID}
            className={`pet-tile-app ${formData.petId === pet.ID ? 'selected' : ''}`}
            onClick={() => handlePetSelect(pet.ID)}
          >
            <div className="pet-avatar-wrapper-app">
              <img
                src={pet.POZA ? `http://localhost:5000/${pet.POZA}` : '/default-pet.png'}
                alt={pet.NUME}
                className="pet-avatar-app"
              />
            </div>
            <div className="pet-info-app">
              <h4 className="pet-name-app">{pet.NUME}</h4>
              <p className="pet-breed-app">{pet.RASA}</p>
              <p className="pet-age-app">{pet.TIP} · {pet.VARSTA} years old</p>
            </div>
          </div>
        ))}
      </div>

      <div className="nav-buttons-split-app">
        <button className="btn-outline-app" disabled>← Previous</button>
        <button className="btn-next-app" onClick={onNext} disabled={!formData.petId}>
          Next →
        </button>
      </div>
    </div>
  );
};

export default StepSelectPet;
