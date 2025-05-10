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
    varsta: '',
    poza: ''
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

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem('myvet_token');
    navigate('/');
  };

  // 📤 Salvare animal
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nume', form.nume);
    formData.append('tip', form.tip);
    formData.append('rasa', form.rasa);
    formData.append('varsta', form.varsta);

    if (petImage) {
      formData.append('poza', petImage); // 🔥 Fix aici
    }

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

      await fetchPets(); // reîncarcă animalele
      setShowForm(false);
      setForm({ id: null, nume: '', tip: '', rasa: '', varsta: '', poza: '' });
      setPetImage(null);
    } catch (err) {
      alert("Eroare la salvare animal.");
      console.error(err);
    }
  };


  // ✏️ Editare
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
      <nav className="myPets-navbar">
        <div className="logo-myPets">MyVet</div>
        <div className="navbar-buttons-myPets">
          <Link to="/client" className="nav-button-myPets">Clinics</Link>
          <Link to="/client/clinic" className="nav-button-myPets">My Clinic</Link>
          <Link to="/client/appointments" className="nav-button-myPets">My Appointments</Link>
        </div>
        <div className="actions-myPets">
          <Link to="/client/profile" className="profile-btn-myPets">MyProfile</Link>
          <button className="logout-btn-myPets" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="create-btn-wrapper">
        <button className="create-btn" onClick={() => {
          setForm({ id: null, nume: '', tip: '', rasa: '', varsta: '' });
          setPetImage(null);
          setShowForm(true);
        }}>
          {form.id ? 'Edit Pet Profile' : 'Create a PetProfile'}
        </button>
      </div>

      {showForm && (
        <form className="pet-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Nume" value={form.nume} onChange={e => setForm({ ...form, nume: e.target.value })} required />
          <input type="text" placeholder="Tip Animal" value={form.tip} onChange={e => setForm({ ...form, tip: e.target.value })} required />
          <input type="text" placeholder="Rasa" value={form.rasa} onChange={e => setForm({ ...form, rasa: e.target.value })} required />
          <input type="number" placeholder="Varsta" value={form.varsta} onChange={e => setForm({ ...form, varsta: e.target.value })} required />
         <label htmlFor="pet-image-upload" className="file-upload-label">
            Upload Image
          </label>
          <input
            id="pet-image-upload"
            type="file"
            accept="uploads/*"
            style={{ display: 'none' }}
            onChange={(e) => setPetImage(e.target.files[0])}
          />

          <button type="submit">Save</button>
        </form>
      )}

      <div className="pet-list">
        {pets.map((p, i) => (
          <div key={i} className="pet-card">
            {p.POZA && <img src={`http://localhost:5000/${p.POZA}`} alt={p.NUME} />}
            <h4>{p.NUME}</h4>
            <p>{p.TIP} - {p.RASA}</p>
            <p>Vârstă: {p.VARSTA} ani</p>
            <button className="edit-btn" onClick={() => handleEdit(p)}>✏️ Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPets;
