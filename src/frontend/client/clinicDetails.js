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
            
            <div className="title">
                <h1>Get to know our services and our team!</h1>
                <div className="section-buttons">
                    {uniqueTypes.map((tip, i) =>(
                        <button
                            key = {i}
                            className={selectedType === tip ? "selected" : ""}
                            onClick={() => {
                                setSelectedType(tip);
                                setViewTeam(false);
                            }}
                        >
                            {tip}
                        </button>
                    ))}
                    <button onClick={() => {
                        setSelectedType(null);
                        setViewTeam(true);
                    }}
                    >
                        Our Team
                    </button>
                </div>

                {clinic && !viewTeam && selectedType && (
                    <div className="services-section">
                        {clinic.servicii.filter(s => s.tip === selectedType).map((s, i) => (
                            <div key={i} className="service-box">
                                <h4>{s.denumire}</h4>
                                <p>{s.descriere}</p>
                                <p><strong>{s.pret} RON</strong></p>
                            </div>   
                        ))}
                    </div>    
                )}

                {clinic && viewTeam && (
                    <div className="team-section">
                        {clinic.angajati.map((a, i) => (
                            <div key={i} className="employee-box">
                                <h4>{a.nume} {a.prenume}</h4>
                                <p>{a.tip}</p>
                                <p>Email: {a.email}</p>
                                <p>Telefon: {a.telefon}</p>
                            </div>    
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientClinicDetails;