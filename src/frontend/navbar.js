import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('myvet_token');

  const [joinRequests, setJoinRequests] = useState([]);
  const [newAppointments, setNewAppointments] = useState([]);
  const [showRequestsDropdown, setShowRequestsDropdown] = useState(false);

  const [isAuthenticatedAsClient, setIsAuthenticatedAsClient] = useState(false);
  const [isAuthenticatedAsClinic, setIsAuthenticatedAsClinic] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const userType = localStorage.getItem("userType");
      setIsAuthenticatedAsClient(userType === "client");
      setIsAuthenticatedAsClinic(userType === "clinic");
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("myvet_token");
    navigate("/");
  };

  const handleJoinAction = async (requestId, accept) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/clinic/join-requests/${requestId}/${accept ? 'accept' : 'reject'}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.ok) {
        alert(`Request ${accept ? 'accepted' : 'rejected'}`);
        await fetchRequests();
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

  const fetchRequests = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/clinic/join-requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const pending = data.filter(r => r.STATUS === 'pending');
      setJoinRequests(pending);
    } catch (err) {
      console.error('Eroare la fetch cereri:', err);
    }
  };

 const fetchNewAppointments = async () => {
  try {
    const lastSeen = localStorage.getItem('lastSeenAppointments');

    const res = await fetch(`http://localhost:5000/api/clinic/appointment-notifications${lastSeen ? `?after=${lastSeen}` : ''}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    setNewAppointments(data);
  } catch (err) {
    console.error('Eroare fetch notificări programări:', err);
  }
};


  useEffect(() => {
    if (isAuthenticatedAsClinic) {
      fetchRequests();
      fetchNewAppointments();
    }
  }, [isAuthenticatedAsClinic]);

 const toggleDropdown = () => {
  setShowRequestsDropdown(prev => {
    const aboutToOpen = !prev;

    if (aboutToOpen) {
      localStorage.setItem('lastSeenAppointments', new Date().toISOString());
    }

    return aboutToOpen;
  });
};



  return (
    <nav className="navbar-home">
      <div className="logo-home">MyVet</div>

      <div className="navbar-buttons-home">
        <Link to="/" className="nav-button-home">Home</Link>
        <Link to="/about" className="nav-button-home">About Us</Link>
        <Link to="/petinfo" className="nav-button-home">Find more about your pet!</Link>
        <Link to="/pharmacy" className="nav-button-home">Pharmacy&Accessories</Link>
        <Link to="/map" className="nav-button-home">Map</Link>

        {isAuthenticatedAsClient && (
          <>
            <Link to="/client" className="nav-button-home">Clinics</Link>
            <Link to="/client/pets" className="nav-button-home">Pets</Link>
            <Link to="/client/medical-records" className="nav-button-home">Medical Records</Link>
            <Link to="/client/appointments" className="nav-button-home">Appointments</Link>
            <Link to="/client/profile" className="nav-button-home">My Profile</Link>
          </>
        )}

        {isAuthenticatedAsClinic && (
          <>
            <Link to="/clinic/patients" className="nav-button-home">Patients</Link>
            <Link to="/clinic/calendar" className="nav-button-home">Calendar</Link>
            <Link to="/clinic/profile" className="nav-button-home">MyProfile</Link>
          </>
        )}
      </div>

      <div className="auth-buttons-home">
        {!isAuthenticatedAsClient && !isAuthenticatedAsClinic ? (
          <>
            <Link to="/login" className="login-button-home">Login</Link>
            <Link to="/accountType" className="sign-up-button-home">Sign up</Link>
          </>
        ) : (
          <>
            {isAuthenticatedAsClinic && (
             <div className="notif-container">
                <button className="notif-btn" onClick={toggleDropdown}>
                  🔔
                  {(joinRequests.length > 0 || newAppointments.length > 0) && (
                    <span className="notif-dot" />
                  )}
                </button>
                {showRequestsDropdown && (
                  <div className="notif-dropdown">
                    {joinRequests.length === 0 && newAppointments.length === 0 ? (
                      <p className="no-requests">No notifications</p>
                    ) : (
                      <>
                        {joinRequests.map((req, idx) => (
                          <div key={idx} className="notif-item">
                            <strong>{req.FIRST_NAME} {req.LAST_NAME}</strong>
                            <p>{req.MESSAGE}</p>
                            <div className="notif-actions">
                              <button onClick={() => handleJoinAction(req.ID_REQUEST, true)}>Accept</button>
                              <button onClick={() => handleJoinAction(req.ID_REQUEST, false)}>Reject</button>
                            </div>
                          </div>
                        ))}

                        {newAppointments.map((appt, idx) => (
                          <div key={`appt-${idx}`} className="notif-item">
                            <strong>Nouă programare</strong>
                            <p>{appt.PET_NAME} la {appt.DOCTOR_NAME}</p>
                            <small>
  {appt.DATA_ORA_INCEPUT.split('T')[0]} {appt.DATA_ORA_INCEPUT.split('T')[1].slice(0, 5)}
</small>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
            <button onClick={handleLogout} className="logout-button-home">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
