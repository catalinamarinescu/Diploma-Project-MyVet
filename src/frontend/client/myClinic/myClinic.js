import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../navbar';
import Footer from '../../footer';
import './myClinic.css';

const MyClinicPage = () => {
  const { clinicId } = useParams();
  const [clinic, setClinic] = useState(null);
  const [registeredPets, setRegisteredPets] = useState([]);
  const [unregisteredPets, setUnregisteredPets] = useState([]);
  const [showRegisterPets, setShowRegisterPets] = useState(false);
  const token = localStorage.getItem('myvet_token');

  useEffect(() => {
    const fetchClinic = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/client/my-clinic?clinicId=${clinicId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setClinic(data);
        setRegisteredPets(data.PETS || []);
      } catch (err) {
        console.error('Eroare:', err);
      }
    };

    if (clinicId) fetchClinic();
  }, [clinicId, token]);

  const loadUnregisteredPets = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/client/unregistered-pets?clinicId=${clinicId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUnregisteredPets(Array.isArray(data) ? data : []);
      setShowRegisterPets(true);
    } catch (err) {
      console.error('Eroare la fetch unregistered pets:', err);
    }
  };

  const registerPet = async (petId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/client/register-pet-to-clinic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ petId, clinicId })
      });

      if (res.ok) {
        const pet = unregisteredPets.find(p => p.ID === petId);
        setRegisteredPets(prev => [...prev, pet]);
        setUnregisteredPets(prev => prev.filter(p => p.ID !== petId));
        alert('Animal înregistrat!');
      } else {
        const error = await res.json();
        alert(error.error || 'Eroare la înregistrare.');
      }
    } catch (err) {
      console.error('Eroare înregistrare:', err);
      alert('Eroare server.');
    }
  };

  if (!clinic) return <p style={{ padding: '2rem' }}>Se încarcă...</p>;

  return (
    <div className="myclinic-page">
      <Navbar />

      <div className="myclinic-header">
        <div>
          <h1>{clinic.NAME}</h1>
          <p><strong>{clinic.ADDRESS}</strong></p>
          <p>{clinic.DESCRIPTION}</p>
          <h2>Manage your pet records here</h2>
        </div>
        <div>
          <button className="schedule-btn-clinic">Schedule Appointment</button>
        </div>
      </div>

      {!showRegisterPets ? (
        <div className="registered-section">
          {registeredPets.length === 0 ? (
            <div className="no-pets-section">
              <p>Nu ai încă animale înregistrate la această clinică.</p>
              <button className="schedule-btn-clinic" onClick={loadUnregisteredPets}>
                Adaugă animal în clinică
              </button>
            </div>
          ) : (
            <>
              <p className="section-label">Animalele tale înregistrate:</p>
              <div className="pets-grid-myclinic">
                {registeredPets.map(pet => (
                  <div className="pet-card-myclinic" key={pet.ID}>
                    {pet.POZA ? (
                      <img src={`http://localhost:5000/${pet.POZA}`} alt={pet.NUME} className="pet-photo-myclinic" />
                    ) : (
                      <div className="pet-photo-myclinic placeholder">🐾</div>
                    )}
                    <h4>{pet.NUME}</h4>
                    <span className="pet-type-label-myclinic">{pet.TIP}</span>
                    <p>{pet.RASA}</p>
                    <p>{pet.VARSTA} years old</p>
                  </div>
                ))}
              </div>
              <div className="myclinic-actions">
                <button className="schedule-btn-clinic" onClick={loadUnregisteredPets}>
                  Adaugă mai multe animale
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="register-header">
            <p>Selectează animalele pe care vrei să le înregistrezi:</p>
          </div>

          <div className="pets-grid-myclinic">
            {unregisteredPets.length === 0 ? (
              <p className="no-unregistered">Toate animalele tale sunt deja înregistrate în clinică.</p>
            ) : (
              unregisteredPets.map(pet => (
                <div className="pet-card-myclinic" key={pet.ID}>
                  {pet.POZA ? (
                    <img src={`http://localhost:5000/${pet.POZA}`} alt={pet.NUME} className="pet-photo-myclinic" />
                  ) : (
                    <div className="pet-photo-myclinic placeholder">🐾</div>
                  )}
                  <h4>{pet.NUME}</h4>
                  <span className="pet-type-label-myclinic">{pet.TIP}</span>
                  <p>{pet.RASA}</p>
                  <p>{pet.VARSTA} years old</p>
                  <button className="schedule-btn-clinic" onClick={() => registerPet(pet.ID)}>
                    Înregistrează acest animal
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="myclinic-actions">
            <button className="back-btn-myclinic" onClick={() => setShowRegisterPets(false)}>
              Înapoi
            </button>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default MyClinicPage;
