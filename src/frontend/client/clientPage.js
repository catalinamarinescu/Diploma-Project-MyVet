import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./clientPage.css";

const ClientPage = () => {
  const [clinics, setClinics] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem('myvet_token');

  useEffect(() => {
    fetch('http://localhost:5000/api/clinics/all', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setClinics(data))
      .catch(err => console.error("Eroare la preluare clinici:", err));
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

  return (
    <div className="client-page">
      <nav className="client-navbar">
        <div className="logo-client">MyVet</div>
        <div className="nav-links">
          <Link to="/client/clinic" className="nav-btn">My Clinic</Link>
          <Link to="/client/appointments" className="nav-btn">My Appointments</Link>
        </div>
        <div className="nav-actions">
          <Link to="/client/profile" className="profile-btn">My Profile</Link>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

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
      <footer className="footer">
          <div className="footer-column">
              <h2 className="footer-logo">MyVet</h2>
              <p>+40 712 345 678</p>
              <p>support@myvet.com</p>
              <p>Str. Animăluțelor nr. 5, București</p>
              <div className="social-icons">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <img src="/imagini/instagram.png" alt="Instagram" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <img src="/imagini/facebook.png" alt="Facebook" />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                  <img src="/imagini/tiktok.png" alt="TikTok" />
              </a>
              </div>
          </div>

          <div className="footer-column">
              <ul className="quick-links">
              <h4>Quick Links</h4>    
              <li><a href="/client/pets">MyPets</a></li>
              <li><a href="/client/clinic">MyClinic</a></li>
              <li><a href="/client/appointments">MyAppointments</a></li>
              </ul>       
          </div>

          <div className="footer-column">
              <ul className="quick-links">
              <li><a href="/privacypolicy">Privacy Policy</a></li>
              <li><a href="/accessibility">Accessibility</a></li>
              <li><a href="/terms">Terms & Conditions</a></li>
              </ul>
              <p className="copyright">© 2025 by MyVet</p>
          </div>
      </footer>
    </div>
  );
};

export default ClientPage;
