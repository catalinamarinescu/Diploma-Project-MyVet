import React, { useEffect, useState } from 'react';
import './favTab.css';

const FavClinicsTab = () => {
  const [clinics, setClinics] = useState([]);
  const token = localStorage.getItem('myvet_token');

  const fetchFavorites = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/client/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setClinics(data);
    } catch (err) {
      console.error("Eroare la preluare clinici favorite:", err);
    }
  };

  const handleRemove = async (clinicId) => {
    try {
      const res = await fetch('http://localhost:5000/api/client/favorites/remove', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ clinicId })
      });

      if (res.ok) {
        setClinics(prev => prev.filter(c => c.id !== clinicId));
      } else {
        console.error("Eroare la ștergere");
      }
    } catch (err) {
      console.error("Eroare rețea la ștergere:", err);
    }
  };

  useEffect(() => {
    if (token) fetchFavorites();
  }, [token]);

  return (
    <div className="fav-clinics-tab">
      <h2>Favorite Clinics</h2>
      <div className="fav-clinics-list">
        {clinics.length === 0 ? (
          <p className="no-fav-message">You have not added any favorite clinics yet.</p>
        ) : (
          clinics.map((clinic, index) => (
            <div key={index} className="fav-clinic-card">
              <div className="fav-clinic-image">
                <img src={`http://localhost:5000/${clinic.imagine}`} alt={clinic.name} />
              </div>
              <div className="fav-clinic-info">
                <h3>{clinic.name}</h3>
                <p className="fav-clinic-address"><strong>{clinic.adresa}</strong></p>
                <p className="fav-clinic-desc">{clinic.descriere}</p>
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(clinic.id)}
                >
                  Remove from Favorites
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FavClinicsTab;
