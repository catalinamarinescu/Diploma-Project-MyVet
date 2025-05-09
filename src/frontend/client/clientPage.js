import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./clientPage.css";

const ClientPage = () => {
    const [clinics, setClinics] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('myvet_token');

    useEffect(() => {
        fetch('http://localhost:5000/api/clinics/all', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => setClinics(data))
        .catch(err => console.error("Eroare la preluare clinici:", err));
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('myvet_token');
        navigate('/');
    }

    return (
        <div className="client-page">
            <nav className="client-navbar">
                <div className="logo-client">
                    MyVet
                </div>
                <div className="navbar-buttons-client">
                    <Link to="/client/pets" className="nav-button-client">My Pets</Link>
                    <Link to="/client/clinic" className="nav-button-client">My Clinic</Link>
                    <Link to="/client/appointments" className="nav-button-client">My Appointments</Link>
                </div>
                <div className="actions">
                    <Link to="/client/profile" className="profile-btn">MyProfile</Link>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </nav>
            <div className="clinic-list">
                {clinics.map((clinic, index) => (
                    <div key={index} className="clinic-card" onClick={() => navigate(`/client/clinic/${clinic.id}`)}>
                        <img src={`http://localhost:5000/${clinic.imagine}`} alt="clinica" />
                        <h3>{clinic.name}</h3>
                        <p><strong>Descriere:</strong>{clinic.descriere}</p>
                        <p><strong>Locatie:</strong>{clinic.latitudine}, {clinic.longitudine}</p>    
                    </div>    
                ))}
            </div>
        </div>
    )

};

export default ClientPage;