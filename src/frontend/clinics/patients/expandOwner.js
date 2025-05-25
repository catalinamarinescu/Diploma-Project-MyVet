import React, { useState, useEffect } from 'react';
import './expandOwner.css';
import MedicalRecord from './medicalRecord';

const ExpandablePatientCard = ({ patient }) => {
  const [expanded, setExpanded] = useState(false);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const token = localStorage.getItem('myvet_token');

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
  const fetchOwnerData = async () => {
    if (!expanded) return; // fetch only when expanded is true

    setLoading(true);
    try {
      const [profileRes, petsRes] = await Promise.all([
        fetch(`http://localhost:5000/api/client/${patient.ID_PET_OWNER}/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`http://localhost:5000/api/client/${patient.ID_PET_OWNER}/pets`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (!profileRes.ok || !petsRes.ok) throw new Error('Fetch error');

      const profileData = await profileRes.json();
      const petsData = await petsRes.json();

      setOwnerProfile(profileData);
      setPets(Array.isArray(petsData) ? petsData : []);
    } catch (err) {
      console.error('Eroare la fetch profile/pets:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchOwnerData();
}, [expanded, patient.ID_PET_OWNER, token]);

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
        <div className="status">
          <span className="badge active">Active</span>
        </div>
      </div>

      {expanded && (
        <div className="expanded-details">
          <div className="details-left">
            <h4>Owner Details</h4>
            {loading ? (
              <p>Loading...</p>
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
              <p>Could not load owner details.</p>
            )}
          </div>

          <div className="details-right">
            <h4>Pets</h4>
            <div className="pet-list">
              {pets.length === 0 ? (
                <p>No pets found.</p>
              ) : (
                pets.map(pet => (
                  <div
                    className="pet-box"
                    key={pet.ID}
                    onClick={() => setSelectedPet(pet)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="pet-avatar">
                      {pet.POZA ? (
                        <img src={`http://localhost:5000/${pet.POZA}`} alt={pet.NUME} />
                      ) : (
                        <div className="placeholder-avatar">🐾</div>
                      )}
                    </div>
                    <div className="pet-info">
                      <strong>{pet.NUME}</strong>
                      <p>{pet.TIP} • {pet.RASA} • {pet.VARSTA} years old</p>
                    </div>
                    <span className="badge active">{pet.STATUS || 'Healthy'}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      {selectedPet && (
        <MedicalRecord
          petId={selectedPet.ID}
          onClose={() => setSelectedPet(null)}
        />
      )}
    </div>
  );
};

export default ExpandablePatientCard;
