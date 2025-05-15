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

    useEffect(() => {
        fetch(`http://localhost:5000/api/clinics/${id}`)
            .then(res => res.json())
            .then(data => setClinic(data))
            .then(err => console.error("Eroare la detalii cliica:", err));
    }, [id]);

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
                <div className="clinic-image">
                    <img src={`http://localhost:5000/${clinic?.imagine}`} alt="clinic" />
                </div>
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

        </div>
    );
};

export default ClientClinicDetails;