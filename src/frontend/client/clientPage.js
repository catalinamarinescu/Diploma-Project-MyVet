import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./clientPage.css";
import Navbar from "../navbar";
import Footer from "../footer";

const ClientPage = () => {
  const [clinics, setClinics] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('myvet_token');

  useEffect(() => {
    fetch('http://localhost:5000/api/clinics/all', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setClinics(data))
      .catch(err => console.error("Eroare la preluare clinici:", err));
      const fetchFavorites = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/client/favorites', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setFavorites(data.map(f => Number(f.clinicId))); // sau f.id, cum e structurat
      } catch (err) {
        console.error("Eroare la fetch favorite:", err);
      }
    };

    if (token) {
      fetch('http://localhost:5000/api/clinics/all', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setClinics(data))
        .catch(err => console.error("Eroare la preluare clinici:", err));

      fetchFavorites();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('myvet_token');
    navigate('/');
  };

  const filteredClinics = clinics.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.adresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.descriere.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFavorite = async (clinicId) => {
  const isFavorite = favorites.includes(clinicId);
  const endpoint = isFavorite ? 'remove' : 'add';

  try {
    await fetch(`http://localhost:5000/api/client/favorites/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ clinicId })
    });

    setFavorites(prev =>
      isFavorite ? prev.filter(id => id !== clinicId) : [...prev, clinicId]
    );
  } catch (err) {
    console.error("Eroare la toggle favorite:", err);
  }
};


  return (
    <div className="client-page">
      <Navbar/>

      <div className="header-section">
        <h1 className="main-title">Discover Our Partner Clinics</h1>
        <p className="subtitle">
          Explore all the clinics that have joined our platform and find the perfect fit for your best friend's needs.
          We feature some of the top veterinary clinics on the market—each dedicated to providing exceptional care and attention.
        </p>
        <input
          type="text"
          className="search-input"
          placeholder="Search clinics by name, address or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="clinic-list">
        {filteredClinics.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>No clinics found.</p>
        ) : (
          filteredClinics.map((clinic, index) => (
            <div key={index} className="clinic-card" onClick={() => navigate(`/client/clinic/${clinic.id}`)}>
               <div
                  className={`favorite-icon ${favorites.includes(clinic.id) ? 'filled' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation(); // previne navigarea
                    toggleFavorite(clinic.id);
                  }}
                >
               <i className={`fas fa-heart ${favorites.includes(Number(clinic.id)) ? 'filled' : ''}`}></i>
              </div>
              <div className="clinic-image">
                <img src={`http://localhost:5000/${clinic.imagine}`} alt="clinic" />
              </div>
              <div className="clinic-info">
                <h3>{clinic.name}</h3>
                <p className="clinic-address"><strong>{clinic.adresa}</strong></p>
                <p className="clinic-desc">{clinic.descriere}</p>
                <button className="view-btn">View Clinic</button>
              </div>
            </div>
          ))
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default ClientPage;
