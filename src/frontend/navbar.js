import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [joinRequests, setJoinRequests] = useState([]);
  const [showRequestsDropdown, setShowRequestsDropdown] = useState(false);
  const token = localStorage.getItem('myvet_token');

  const [isAuthenticatedAsClient, setIsAuthenticatedAsClient] = useState(false);
    const [isAuthenticatedAsClinic, setIsAuthenticatedAsClinic] = useState(false);

  useEffect(() => {
  const checkAuth = () => {
    const userType = localStorage.getItem("userType");
    setIsAuthenticatedAsClient(userType === "client");
    setIsAuthenticatedAsClinic(userType == "clinic");
  };

  checkAuth();

  window.addEventListener("storage", checkAuth); // ascultă și alte taburi sau schimbări

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
            <Link to="/client/appointments" className="nav-button-home">Appointments</Link>
            <Link to="/client/profile" className="nav-button-home">My Profile</Link>
          </>
        )}

        {isAuthenticatedAsClinic && (
          <>
            <Link to="/clinic/patients" className="nav-button-home">Patients</Link>
            <Link to="/clinic/calendar" className="nav-button-home">Calendar</Link>
            <Link to="/clinic/profile" className="nav-button-home">MyProfile</Link>
            <div className="actions">
        </div>
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
