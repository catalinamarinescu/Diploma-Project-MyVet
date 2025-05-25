import React, { useEffect, useState } from 'react';
import './patients.css';
import { Link, useNavigate } from 'react-router-dom';
import ExpandablePatientCard from './expandOwner';
import Navbar from '../../navbar';
import Footer from "../../footer";

const ClinicPatients = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const token = localStorage.getItem('myvet_token');
  const navigate = useNavigate();

  const fetchPatients = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/clinic/patients/owners', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      console.log('Pacienți primiți:', data);
      setPatients(data);
    } catch (err) {
      console.error('Eroare la fetch pacienți:', err);
    }
  };

  useEffect(() => {
    if (token) fetchPatients();

    // Ascultă evenimentul global pentru reîncărcare pacienți
    const refresh = () => fetchPatients();
    window.addEventListener('patientUpdated', refresh);

    return () => {
      window.removeEventListener('patientUpdated', refresh);
    };
  }, [token]);

  const filtered = patients.filter(p =>
    `${p.FIRST_NAME} ${p.LAST_NAME}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('myvet_token');
    navigate('/');
  };

  return (
    <div className="patients-page">
      <Navbar/>

      <div className="patients-container">
        <h1 className="patients-title">My Patients</h1>
        <p className="patients-subtitle">Manage and view all your patient records</p>

        <div className="filters">
          <input
            type="text"
            placeholder="Search by name, email, phone, or pet name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select>
            <option>All Statuses</option>
          </select>
          <select>
            <option>A-Z (Ascending)</option>
          </select>
        </div>

        <div className="patients-list">
          {filtered.map(p => (
            <ExpandablePatientCard key={p.ID_PET_OWNER} patient={p} />
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ClinicPatients;
