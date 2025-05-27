import React, { useEffect, useState } from 'react';
import Navbar from '../../navbar';
import Footer from '../../footer';
import MedicalRecordTabs from './medicalRecord';
import './medicalRecordsPage.css';

const MedicalRecordsPage = () => {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [clinicRecords, setClinicRecords] = useState([]);
  const [expandedClinicId, setExpandedClinicId] = useState(null);
  const token = localStorage.getItem('myvet_token');

  useEffect(() => {
    const fetchPets = async () => {
      const res = await fetch('http://localhost:5000/api/client/pets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPets(data);
    };
    fetchPets();
  }, [token]);

  const handlePetSelect = async (pet) => {
    setSelectedPet(pet);
    try {
      const res = await fetch(`http://localhost:5000/api/client/pet/${pet.ID}/records-per-clinic`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setClinicRecords(data);
      setExpandedClinicId(null); // resetăm expansiunea când schimbăm animalul
    } catch (err) {
      console.error('Eroare la încărcarea fișelor:', err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="records-page">
        <div className="sidebar">
          <h2>Your Pets</h2>
          <p>Select a pet to view medical records</p>
          {pets.map(pet => (
            <div
              key={pet.ID}
              className={`pet-item ${selectedPet?.ID === pet.ID ? 'active' : ''}`}
              onClick={() => handlePetSelect(pet)}
            >
              {pet.POZA ? (
                <img src={`http://localhost:5000/${pet.POZA}`} alt={pet.NUME} className="sidebar-pet-photo" />
              ) : (
                <div className="avatar-circle">🐾</div>
              )}
              <div className="pet-info">
                <strong>{pet.NUME}</strong>
                <p>{pet.RASA} • {pet.VARSTA} years old</p>
              </div>
            </div>
          ))}
        </div>

        <div className="records-view">
          {selectedPet && (
            <div className="pet-summary-record">
              <div className="avatar-circle-lg">
                {selectedPet.POZA ? (
                  <img src={`http://localhost:5000/${selectedPet.POZA}`} alt={selectedPet.NUME} className="pet-photo-lg" />
                ) : (
                  '🐾'
                )}
              </div>
              <div>
                <h2>{selectedPet.NUME}</h2>
                <p>{selectedPet.TIP} • {selectedPet.RASA} • {selectedPet.VARSTA} years old</p>
              </div>
            </div>
          )}

          {clinicRecords.map(clinic => (
            <div key={clinic.ID_CLINICA} className="clinic-record">
              <div className="clinic-header-inline">
                <div>
                  <h3 className='clinic-name'>{clinic.NAME}</h3>
                  <p><i className="fa fa-map-marker"></i> {clinic.ADRESA}</p>
                  <p><i className="fa fa-envelope"></i> {clinic.EMAIL}</p>
                </div>
                <button
                  className="add-visit-btn"
                  onClick={() => setExpandedClinicId(
                    expandedClinicId === clinic.ID_CLINICA ? null : clinic.ID_CLINICA
                  )}
                >
                  {expandedClinicId === clinic.ID_CLINICA ? 'Hide Record' : 'View Full Record'}
                </button>
              </div>
              {expandedClinicId === clinic.ID_CLINICA && (
                <MedicalRecordTabs
                  petId={selectedPet.ID}
                  clinicId={clinic.ID_CLINICA}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MedicalRecordsPage;
