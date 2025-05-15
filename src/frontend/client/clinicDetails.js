import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from "react-router-dom";
import "./clinicDetails.css";

const ClientClinicDetails = () => {
    const {id} = useParams();
    const [clinic, setClinic] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [viewTeam, setViewTeam] = useState(false);
    const navigate = useNavigate();

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        fetch(`http://localhost:5000/api/clinics/${id}`)
            .then(res => res.json())
            .then(data => setClinic(data))
            .catch(err => console.error("Eroare la detalii clinica:", err));
    }, [id]);

   useEffect(() => {
        if (!clinic?.imagini || clinic.imagini.length === 0) return;

        const interval = setInterval(() => {
            setCurrentImageIndex(prev =>
                (prev + 1) % clinic.imagini.length
            );
        }, 3000);

        return () => clearInterval(interval);
    }, [clinic?.imagini]);


    const uniqueTypes = clinic?.servicii ? [...new Set(clinic.servicii.map(s => s.tip))] : [];

    const handleLogout = () => {
        localStorage.removeItem('myvet_token');
        navigate('/');
    }

    return (
        <div className="clinic-details-page">
            <nav className="clinicDetails-navbar">
                <div className="logo-clinicDetails">
                    MyVet
                </div>
                <div className="navbar-buttons-clinicDetails">
                    <Link to="/client" className="nav-button-clinicDetails">Clinics</Link>
                    <Link to="/client/pets" className="nav-button-clinicDetails">My Pets</Link>
                    <Link to="/client/clinic" className="nav-button-clinicDetails">My Clinic</Link>
                    <Link to="/client/appointments" className="nav-button-clinicDetails">My Appointments</Link>
                </div>
                <div className="actions-clinicDetails">
                    <Link to="/client/profile" className="profile-btn-clinicDetails">MyProfile</Link>
                    <button className="logout-btn-clinicDetails" onClick={handleLogout}>Logout</button>
                </div>
            </nav>
            <div className="clinic-header">
                <div className="clinic-text">
                    <h1>{clinic?.name}</h1>
                    <p>{clinic?.descriere}</p>
                    <p><strong>Adresa:</strong>{clinic?.adresa}</p>
                    <button className="join-btn">Join Now</button>
                </div>
                {clinic?.imagini?.length > 0 && (
                <div className="clinic-gallery-client">
                    <img
                    className="clinic-gallery-client-img"
                    src={`http://localhost:5000/${clinic.imagini[currentImageIndex]}`}
                    alt="clinic slide"
                    />
                </div>
                )}
                </div>
            
            <div className="clinic-info-wrapper">
                <h2 className="section-title">Get to Know Our Services and Team</h2>
                <p className="section-subtitle">
                    We offer a wide range of veterinary services and have a team of dedicated professionals ready to care for your pets.
                </p>

                <div className="toggle-tabs">
                    <button className={!viewTeam ? "active-tab" : ""} onClick={() => setViewTeam(false)}>Services</button>
                    <button className={viewTeam ? "active-tab" : ""} onClick={() => setViewTeam(true)}>Our Team</button>
                </div>

                {!viewTeam && (
                    <>
                    <div className="filter-buttons">
                        {uniqueTypes.map((tip, i) => (
                        <button
                            key={i}
                            className={selectedType === tip ? "selected" : ""}
                            onClick={() => setSelectedType(tip)}
                        >
                            {tip}
                        </button>
                        ))}
                        <button onClick={() => setSelectedType(null)}>All Services</button>
                    </div>

                    <div className="service-cards">
                        {(clinic?.servicii || [])
                        .filter(s => !selectedType || s.tip === selectedType)
                        .map((s, i) => (
                            <div key={i} className="service-card">
                            <div className="badge">{s.tip}</div>
                            <h3>{s.denumire}</h3>
                            <p className="description">{s.descriere}</p>
                            <div className="card-footer">
                                <span className="price">{s.pret} RON</span>
                            </div>
                            </div>
                        ))}
                    </div>
                    </>
                )}

               {clinic && viewTeam && (
                <div className="team-cards">
                    {clinic.angajati.map((a, i) => (
                    <div key={i} className="team-card">
                        {a.poza ? (
                        <img
                            src={`http://localhost:5000/${a.poza}`}
                            alt={`${a.nume} ${a.prenume}`}
                            className="team-avatar"
                        />
                        ) : (
                        <div className="team-avatar initials">
                            {a.nume[0]}{a.prenume[0]}
                        </div>
                        )}
                        <h3>{a.nume} {a.prenume}</h3>
                        <span className="badge">{a.tip}</span>
                        <p>Email: {a.email}</p>
                        <p>Phone: {a.telefon}</p>
                    </div>
                    ))}
                </div>
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

export default ClientClinicDetails;