import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './clinic.css';
import ServicesTab from './serviceTab';
import EmployeesTab from './employeesTab';

const ClinicDashboard = () => {
  const navigate = useNavigate();
  const [clinicData, setClinicData] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);

  const [formValues, setFormValues] = useState({
    name: '',
    descriere: '',
    latitudine: '',
    longitudine: '',
    adresa: ''
  });

  const token = localStorage.getItem('myvet_token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/clinic/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setClinicData(data);
        setFormValues({
          name: data.name,
          descriere: data.descriere,
          latitudine: data.latitudine,
          longitudine: data.longitudine,
          adresa: data.adresa
        });
      } catch (err) {
        console.error('Eroare la preluare:', err);
      }
    };

    fetchData();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('myvet_token');
    navigate('/');
  };

  const handleSaveProfile = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/clinic/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formValues)
      });

      if (res.ok) {
        alert('Profil actualizat!');
        setEditMode(false);
        setClinicData(prev => ({ ...prev, ...formValues }));
      } else {
        alert('Eroare la actualizare.');
      }
    } catch (err) {
      console.error(err);
    }
  };

 const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      await fetch('http://localhost:5000/api/clinic/images', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      // 🔄 Refetch images
      const res = await fetch('http://localhost:5000/api/clinic/images', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (data.success) {
        setClinicData(prev => ({ ...prev, imagini: data.imagini }));
      }
    } catch (err) {
      console.error('Eroare upload imagini:', err);
      alert('Eroare la upload.');
    }
  };


  if (!clinicData) return <p className="loading-message">Se încarcă...</p>;

  return (
    <div className="dashboard-container">
      <nav className="clinic-navbar">
        <div className="logo-clinic">MyVet</div>
        <div className="navbar-buttons-clinic">
          <Link to="/clinic/patients" className="nav-button-clinic">My Patients</Link>
          <Link to="/clinic/calendar" className="nav-button-clinic">Calendar</Link>
        </div>
        <div className="actions">
          <button className="notif-btn" onClick={() => alert("În lucru!")}>🔔</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-main">
        <h1 className="dashboard-title">Clinic Dashboard</h1>

        <div className="tab-buttons">
          <button className={activeTab === 'profile' ? 'active-tab' : ''} onClick={() => setActiveTab('profile')}>Profile</button>
          <button className={activeTab === 'services' ? 'active-tab' : ''} onClick={() => setActiveTab('services')}>Services</button>
          <button className={activeTab === 'employees' ? 'active-tab' : ''} onClick={() => setActiveTab('employees')}>Employees</button>
        </div>

        {activeTab === 'profile' && (
          <div className="profile-section-grid">
            <div className="profile-form-card">
              <div className="header-with-edit">
                <h3>Clinic Information</h3>
                <button className="edit-button" onClick={() => setEditMode(true)}>Edit</button>
              </div>

              <label>Clinic Name:</label>
              <input
                disabled={!editMode}
                value={formValues.name}
                onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
              />

              <label>Description:</label>
              <textarea
                disabled={!editMode}
                value={formValues.descriere}
                onChange={(e) => setFormValues({ ...formValues, descriere: e.target.value })}
              />

              <div className="latlong-row">
                <div>
                  <label>Latitude:</label>
                  <input
                    type="text"
                    disabled={!editMode}
                    value={formValues.latitudine}
                    onChange={(e) => setFormValues({ ...formValues, latitudine: e.target.value })}
                  />
                </div>
                <div>
                  <label>Longitude:</label>
                  <input
                    type="text"
                    disabled={!editMode}
                    value={formValues.longitudine}
                    onChange={(e) => setFormValues({ ...formValues, longitudine: e.target.value })}
                  />
                </div>
              </div>

              {editMode && (
                <div className="edit-actions">
                  <button className="button-edit" onClick={handleSaveProfile}>Save</button>
                  <button className="button-edit cancel" onClick={() => setEditMode(false)}>Cancel</button>
                </div>
              )}
            </div>

       <div className="profile-gallery-card">
        <h3>Clinic Gallery</h3>
        <div className="gallery">
          {clinicData.imagini.map((img, i) => (
            <img key={i} src={`http://localhost:5000/${img}`} alt="clinic" />
          ))}
        </div>

        <label htmlFor="imageUpload" className="edit-button upload-label">
          + Add Images
        </label>
        <input
          id="imageUpload"
          type="file"
          multiple
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
      </div>

          </div>
        )}
        {activeTab === 'services' && <ServicesTab />}
        {activeTab === 'employees' && <EmployeesTab />}
      </div>
    </div>
  );
};

export default ClinicDashboard;