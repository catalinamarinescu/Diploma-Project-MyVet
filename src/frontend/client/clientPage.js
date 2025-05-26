import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./clientPage.css";
import Navbar from "../navbar";
import Footer from "../footer";
import ClinicCard from "./clinicCard"; // folosește componenta separată

const ClientPage = () => {
  const [clinics, setClinics] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [joinedClinics, setJoinedClinics] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('myvet_token');

  useEffect(() => {
    if (!token) return;

    fetch('http://localhost:5000/api/clinics/all', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setClinics(data))
      .catch(err => console.error("Eroare la preluare clinici:", err));
    console.log("clinics:", clinics);

    fetchFavorites();
    fetchJoined();
  }, [token]);

  const fetchFavorites = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/client/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setFavorites(data.map(f => Number(f.id))); // 🔁 aici corectăm
    } catch (err) {
      console.error("Eroare la fetch favorite:", err);
    }
  };

    const fetchJoined = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/client/my-clinics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setJoinedClinics(data.map(c => Number(c.ID_CLINICA)));
      } catch (err) {
        console.error("Eroare la fetch joined clinics:", err);
      }
    };

  const toggleFavorite = async (clinicId) => {
    try {
      const isFav = favorites.includes(clinicId);
      const endpoint = isFav ? 'remove' : 'add';

      const res = await fetch(`http://localhost:5000/api/client/favorites/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ clinicId })
      });

      if (res.ok) {
        fetchFavorites(); // 🔁 important!
      }
    } catch (err) {
      console.error("Eroare la toggle favorite:", err);
    }
  };

  return (
    <div className="client-page">
      <Navbar />

      <div className="header-section">
        <h1 className="main-title">Your Veterinary Network</h1>
        <p className="subtitle">
          Manage your joined clinics, discover new favorites, and explore our complete network of trusted veterinary partners dedicated to your pet's health and happiness.
        </p>
        <input
          type="text"
          className="search-input"
          placeholder="Search clinics by name, location, or services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

     <div className="section-title">
        <div className="section-title-top">
          <img src="./imagini/group.png" alt="Joined" className="section-icon" />
          <h2>My Joined Clinics</h2>
        </div>
        <p className="section-subtitle">Clinics where you're an active patient</p>
      </div>
      <div className="clinic-list">
        {clinics.filter(c =>
          joinedClinics.includes(c.id) &&
          c.name?.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(clinic => (
          <ClinicCard
            key={clinic.id}
            clinic={clinic}
            isFavorite={favorites.includes(clinic.id)}
            isJoined={joinedClinics.includes(clinic.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      <div className="section-title">
        <div className="section-title-top">
          <img src="./imagini/heart-attack.png" alt="Favorite" className="section-icon" />
          <h2>Favorite Clinics</h2>
        </div>
        <p className="section-subtitle">Clinics you've marked as favorites</p>
      </div>
      <div className="clinic-list">
        {clinics.filter(c =>
          favorites.includes(c.id) &&
          c.name?.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(clinic => (
          <ClinicCard
            key={clinic.id}
            clinic={clinic}
            isFavorite={favorites.includes(clinic.id)}
            isJoined={joinedClinics.includes(clinic.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      
    <div className="section-title">
      <div className="section-title-top">
        <img src="./imagini/medal-ribbon.png" alt="Discover" className="section-icon" />
        <h2>Discover New Clinics</h2>
      </div>
      <p>Explore all clinics available on the platform</p>
    </div>
      <div className="clinic-list">
        {clinics.filter(c =>
          c.name?.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(clinic => (
          <ClinicCard
            key={clinic.id}
            clinic={clinic}
            isFavorite={favorites.includes(clinic.id)}
            isJoined={joinedClinics.includes(clinic.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default ClientPage;
