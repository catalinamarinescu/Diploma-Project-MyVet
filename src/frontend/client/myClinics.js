// MyClinicsPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './myClinics.css';

const MyClinicsPage = () => {
  const [clinics, setClinics] = useState([]);
  const token = localStorage.getItem('myvet_token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/client/my-clinics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setClinics(data);
      } catch (err) {
        console.error('Eroare la clinici:', err);
      }
    };
    fetchClinics();
  }, [token]);

  const openClinic = (id) => {
    navigate(`/client/my-clinics/${id}`);
  };

    const handleLogout = () => {
    localStorage.removeItem('myvet_token');
    navigate('/');
  };

  return (
    <div className="myclinics-page">
         <nav className="myclinics-navbar">
            <div className="logo-myclinics">MyVet</div>
            <div className="nav-links-myclinics">
            <Link to="/client" className="nav-btn-myclinics">Clinics</Link>
            </div>
            <div className="nav-actions-myclinics">
            <Link to="/client/profile" className="profile-btn-myclinics">My Profile</Link>
            <button className="logout-btn-myclinics" onClick={handleLogout}>Logout</button>
            </div>
        </nav>
      <h1 className="myclinics-title">My Clinics</h1>
      <div className="clinics-grid">
        {clinics.length === 0 ? (
          <p>No clinics registered yet.</p>
        ) : (
          clinics.map(c => (
            <div key={c.ID_CLINICA} className="clinics-card" onClick={() => openClinic(c.ID_CLINICA)}>
                <div className="clinics-image">
                    <img src={`http://localhost:5000/${c.CALE_IMAGINE}`} alt="clinic" />
                </div>
                <div className="clinics-info">
                    <h3>{c.NAME}</h3>
                    <p>{c.ADDRESS}</p>
                    <p>{c.DESCRIERE || '-'}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyClinicsPage;
