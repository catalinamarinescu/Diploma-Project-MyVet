import React, { useState, useEffect } from 'react';
import './expandOwner.css';
import MedicalRecord from './medicalRecord'; // ✅ asigură-te că e importat corect

const ExpandablePatientCard = ({ patient, clinicId }) => {
  const [expanded, setExpanded] = useState(false);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [registeredPets, setRegisteredPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('myvet_token');

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    const fetchOwnerData = async () => {
      if (!expanded || !clinicId) return;

      setLoading(true);
      try {
        const profileRes = await fetch(`http://localhost:5000/api/client/${patient.ID_PET_OWNER}/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const petsRes = await fetch(`http://localhost:5000/api/client/${patient.ID_PET_OWNER}/registered-pets?clinicId=${clinicId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!profileRes.ok || !petsRes.ok) throw new Error('Eroare la fetch');

        const profileData = await profileRes.json();
        const petsData = await petsRes.json();

        setOwnerProfile(profileData);
        setRegisteredPets(Array.isArray(petsData) ? petsData : []);
      } catch (err) {
        console.error('Eroare la profil/pets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerData();
  }, [expanded, patient.ID_PET_OWNER, clinicId, token]);

  return (
    <div className="expandable-card">
      <div className="patient-card" onClick={toggleExpand}>
        <div className="avatar">
          {patient.IMAGE ? (
            <img src={`http://localhost:5000/${patient.IMAGE}`} alt="avatar" />
          ) : (
            <div className="initials">
              {patient.FIRST_NAME[0]}{patient.LAST_NAME[0]}
            </div>
          )}
        </div>
        <div className="patient-info">
          <h3>{patient.LAST_NAME}, {patient.FIRST_NAME}</h3>
          <p className="last-visit">Last visit: unknown</p>
        </div>
      </div>

      {expanded && (
        <div className="expanded-details">
          <div className="details-left">
            <h4>Owner Details</h4>
            {loading ? (
              <p>Se încarcă...</p>
            ) : ownerProfile ? (
              <>
                <p><i className="fa fa-envelope"></i> {ownerProfile.EMAIL}</p>
                <p><i className="fa fa-phone"></i> {ownerProfile.PHONE}</p>
                <p><i className="fa fa-map-marker"></i> {ownerProfile.ADDRESS}</p>
                <div className="owner-actions">
                  <button className="appointment-btn">Schedule Appointment</button>
                </div>
              </>
            ) : (
              <p>Nu s-au putut încărca detaliile.</p>
            )}
          </div>

          <div className="details-right">
            <h4>Animale înregistrate în această clinică</h4>
            {registeredPets.length === 0 ? (
              <p>Nu există animale înregistrate.</p>
            ) : (
              <div className="pet-list">
                {registeredPets.map(pet => (
                  <div
                    key={pet.ID}
                    className="pet-box"
                    onClick={() => setSelectedPetId(pet.ID)}
                    style={{ cursor: 'pointer' }}
                  >
                    {pet.POZA ? (
                      <img src={`http://localhost:5000/${pet.POZA}`} alt={pet.NUME} className="pet-avatar-mini" />
                    ) : (
                      <div className="pet-avatar-mini placeholder">🐾</div>
                    )}
                    <div className="pet-info-box">
                      <strong>{pet.NUME}</strong>
                      <p>{pet.TIP} • {pet.RASA} • {pet.VARSTA} ani</p>
                      <span className={`health-badge ${pet.STATUS === 'Healthy' ? 'healthy' : 'unhealthy'}`}>
                        {pet.STATUS || 'Unknown'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {selectedPetId && (
        <MedicalRecord
          petId={selectedPetId}
          onClose={() => setSelectedPetId(null)}
        />
      )}
    </div>
  );
};

export default ExpandablePatientCard;
