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
  const [joinRequests, setJoinRequests] = useState([]);
  const [showRequestsDropdown, setShowRequestsDropdown] = useState(false);


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
    fetchRequests();
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

const fetchRequests = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/clinic/join-requests', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();

    // 🔍 doar pending
    const pending = data.filter(r => r.STATUS === 'pending');
    setJoinRequests(pending);

    console.log('Join requests:', pending);
  } catch (err) {
    console.error('Eroare la fetch cereri:', err);
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

  const handleJoinAction = async (requestId, accept) => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/clinic/join-requests/${requestId}/${accept ? 'accept' : 'reject'}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (res.ok) {
      alert(`Request ${accept ? 'accepted' : 'rejected'}`);

      // 🔄 Refetch cereri rămase (doar cele pending)
      await fetchRequests();

      // 🔔 Notifică alte componente (ex: ClinicPatients) să se actualizeze
      if (accept) {
        window.dispatchEvent(new Event('patientUpdated'));
      }

    } else {
      const err = await res.json();
      alert(err.error || 'Error processing request');
    }
  } catch (err) {
    console.error('Join request action failed:', err);
    alert('Server error');
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
          <button className="notif-btn" onClick={() => setShowRequestsDropdown(prev => !prev)}>🔔</button>
          {showRequestsDropdown && (
            <div className="notif-dropdown">
              {joinRequests.length === 0 ? (
                <p className="no-requests">No requests</p>
              ) : (
                joinRequests.map((req, idx) => (
                  <div key={idx} className="notif-item">
                    <strong>{req.FIRST_NAME} {req.LAST_NAME}</strong>
                    <p>{req.MESSAGE}</p>
                    <div className="notif-actions">
                      <button onClick={() => handleJoinAction(req.ID_REQUEST, true)}>Accept</button>
                      <button onClick={() => handleJoinAction(req.ID_REQUEST, false)}>Reject</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          <button className="logout-button-clinic" onClick={handleLogout}>Logout</button>
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
              <li><a href="/clinic/patients">MyPatients</a></li>
              <li><a href="/clinic/calendar">Calendar</a></li>
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

export default ClinicDashboard;