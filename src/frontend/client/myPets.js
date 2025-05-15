import React, { useState, useEffect } from 'react';
import './myPets.css';
import { Link, useNavigate } from 'react-router-dom';

const MyPets = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('myvet_token');

  const [pets, setPets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [petImage, setPetImage] = useState(null);
  const [form, setForm] = useState({
    id: null,
    nume: '',
    tip: '',
    rasa: '',
    varsta: ''
  });

  const fetchPets = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/client/pets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPets(data);
    } catch (err) {
      console.error("Eroare la preluare animale:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPets();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('myvet_token');
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nume', form.nume);
    formData.append('tip', form.tip);
    formData.append('rasa', form.rasa);
    formData.append('varsta', form.varsta);
    if (petImage) formData.append('poza', petImage);

    const url = form.id
      ? `http://localhost:5000/api/client/pets/${form.id}`
      : `http://localhost:5000/api/client/pets`;
    const method = form.id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) throw new Error("Eroare la salvare");

      await fetchPets();
      setShowForm(false);
      setForm({ id: null, nume: '', tip: '', rasa: '', varsta: '' });
      setPetImage(null);
    } catch (err) {
      alert("Eroare la salvare animal.");
      console.error(err);
    }
  };

  const handleEdit = (pet) => {
    setForm({
      id: pet.ID,
      nume: pet.NUME,
      tip: pet.TIP,
      rasa: pet.RASA,
      varsta: pet.VARSTA
    });
    setPetImage(null);
    setShowForm(true);
  };

  return (
    <div className="mypets-page">
      <nav className="navbar-pets">
        <div className="logo-pets">MyVet</div>
        <div className="nav-links-pets">
          <Link to="/client" className="nav-btn-pets">Clinics</Link>
          <Link to="/client/clinic" className="nav-btn-pets">My Clinic</Link>
          <Link to="/client/appointments" className="nav-btn-pets">My Appointments</Link>
        </div>
        <div className="nav-actions-pets">
          <Link to="/client/profile" className="profile-btn-pets">My Profile</Link>
          <button className="logout-btn-pets" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <h2 className="pets-title">My Pets</h2>
      <p className='pets-paragraf'> Here you can create profiles for each one of your pets.</p>
      {pets.length === 0 && !showForm && (
        <div className="no-pets">
          <p>You haven't added any pets yet.</p>
          <button className="add-pet-btn" onClick={() => setShowForm(true)}>
            +Add Your First Pet
          </button>
        </div>
      )}

      {pets.length > 0 && !showForm && (
        <div className="top-add-btn">
          <button className="add-pet-btn" onClick={() => setShowForm(true)}>
            +Add New Pet
          </button>
        </div>
      )}

      {showForm && (
        <div className="modal-backdrop">
          <div className="modal">
            <form className="pet-form" onSubmit={handleSubmit}>
              <h3>{form.id ? "Edit Pet" : "Add New Pet"}</h3>

              <label>Pet Name</label>
              <input type="text" placeholder="Enter pet name" value={form.nume} onChange={e => setForm({ ...form, nume: e.target.value })} required />

              <label>Pet Type</label>
              <select value={form.tip} onChange={e => setForm({ ...form, tip: e.target.value })} required>
                <option value="">Select pet type</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Other">Other</option>
              </select>

              <label>Breed</label>
              <input type="text" placeholder="Enter breed" value={form.rasa} onChange={e => setForm({ ...form, rasa: e.target.value })} required />

              <label>Age (years)</label>
              <input type="number" placeholder="Enter age" value={form.varsta} onChange={e => setForm({ ...form, varsta: e.target.value })} required />

              <label htmlFor="pet-image" className="file-upload-label">Upload Image</label>
              <input
                id="pet-image"
                type="file"
                accept="image/*"
                onChange={(e) => setPetImage(e.target.files[0])}
              />

              {form.poza && !petImage && (
                <div className="image-preview">
                  <img src={`http://localhost:5000/${form.poza}`} alt="Preview" />
                  <p style={{ fontSize: '0.8rem', color: '#555' }}>Current image</p>
                </div>
              )}

              <div className="form-buttons">
                <button type="submit" className="save-btn">Save</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowForm(false);
                    setForm({ id: null, nume: '', tip: '', rasa: '', varsta: '', poza: '' });
                    setPetImage(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

     <div className="pet-list">
      {pets.map((p, i) => (
        <div key={i} className="pet-card">
          {p.POZA ? (
            <img
              src={`http://localhost:5000/${p.POZA}`}
              alt={p.NUME}
              className="pet-image"
            />
          ) : (
            <div className="pet-image placeholder">
              <span>No Image</span>
            </div>
          )}

          <div className="pet-details">
            <h4>{p.NUME}</h4>
            <p><strong>Type:</strong> {p.TIP}</p>
            <p><strong>Breed:</strong> {p.RASA}</p>
            <p><strong>Age:</strong> {p.VARSTA} years</p>
          </div>

          <button className="edit-btn" onClick={() => handleEdit(p)}>
            Edit
          </button>
        </div>

      ))}
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
              <li><a href="/client">Clinics</a></li>
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

export default MyPets;
