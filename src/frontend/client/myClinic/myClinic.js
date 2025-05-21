import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MedicalRecordModal from './medicalRecord';
import './myClinic.css';

const MyClinicPage = () => {
  const { clinicId } = useParams();
  const [clinic, setClinic] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [medicalData, setMedicalData] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const navigate = useNavigate();
  const token = localStorage.getItem('myvet_token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/client/my-clinic?clinicId=${clinicId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setClinic(data);
      } catch (err) {
        console.error('Eroare:', err);
      }
    };
    if (clinicId) fetchData();
  }, [clinicId, token]);

  const handleLogout = () => {
    localStorage.removeItem('myvet_token');
    navigate('/');
  };

  const openMedicalRecord = async (pet) => {
    setSelectedPet(pet);
    try {
      const res = await fetch(`http://localhost:5000/api/client/pet/${pet.ID}/medical-record?clinicId=${clinicId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setMedicalData(data);
      setActiveTab('summary');
    } catch (err) {
      console.error('Eroare la fișa medicală:', err);
    }
  };

  const closeMedicalRecord = () => {
    setSelectedPet(null);
    setMedicalData(null);
  };

  if (!clinic) return <p>Se încarcă...</p>;

  return (
    <div className="myclinic-page">
      <nav className="myclinic-navbar">
        <div className="logo-myclinic">MyVet</div>
        <div className="nav-links-myclinic">
          <Link to="/client" className="nav-btn-myclinic">Clinics</Link>
          <Link to="/client/appointments" className="nav-btn-myclinic">My Appointments</Link>
        </div>
        <div className="nav-actions-myclinic">
          <Link to="/client/profile" className="profile-btn-myclinic">My Profile</Link>
          <button className="logout-btn-myclinic" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="myclinic-header">
        <div>
          <h1>{clinic.NAME}</h1>
          <p><strong>{clinic.ADDRESS}</strong></p>
          <p>{clinic.DESCRIPTION}</p>
          <h2>Here you can view and manage your pet's health information!</h2>
        </div>
        <button className="schedule-btn">Schedule Appointment</button>
      </div>

     <div className="pets-grid-myclinic">
      {clinic?.PETS && clinic.PETS.length > 0 ? (
        clinic.PETS.map(pet => (
          <div className="pet-card-myclinic" key={pet.ID} onClick={() => openMedicalRecord(pet)}>
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
        ))
      ) : (
        <p>No pets registered yet.</p>
      )}
    </div>

      {selectedPet && medicalData && (
        <MedicalRecordModal
          pet={selectedPet}
          medicalData={medicalData}
          onClose={closeMedicalRecord}
        />
      )}
    </div>
  );
};

export default MyClinicPage;
