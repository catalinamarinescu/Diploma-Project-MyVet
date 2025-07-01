// MyPets.js
import React, { useState, useEffect } from 'react';
import './myPets.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar';
import Footer from "../footer";

const MyPets = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('myvet_token');

  const [pets, setPets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [petImage, setPetImage] = useState(null);
  const [form, setForm] = useState({ id: null, nume: '', tip: '', rasa: '', varsta: '' });

  const [currentPage, setCurrentPage] = useState(1);
  const petsPerPage = 4;

  useEffect(() => {
    if (token) {
      fetch('http://localhost:5000/api/client/pets', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setPets(data))
        .catch(err => console.error("Eroare la preluare animale:", err));
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nume', form.nume);
    formData.append('tip', form.tip);
    formData.append('rasa', form.rasa);
    formData.append('varsta', form.varsta);
    if (petImage) formData.append('poza', petImage);

    const url = form.id ? `http://localhost:5000/api/client/pets/${form.id}` : `http://localhost:5000/api/client/pets`;
    const method = form.id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) throw new Error("Eroare la salvare");

      const updated = await fetch('http://localhost:5000/api/client/pets', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json());

      setPets(updated);
      setShowForm(false);
      setForm({ id: null, nume: '', tip: '', rasa: '', varsta: '' });
      setPetImage(null);
    } catch (err) {
      alert("Eroare la salvare animal.");
      console.error(err);
    }
  };

  const handleEdit = (pet) => {
    setForm({ id: pet.ID, nume: pet.NUME, tip: pet.TIP, rasa: pet.RASA, varsta: pet.VARSTA });
    setPetImage(null);
    setShowForm(true);
  };

  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = pets.slice(indexOfFirstPet, indexOfLastPet);
  const totalPages = Math.ceil(pets.length / petsPerPage);

  return (
    <div className="mypets-page">
      <Navbar />

      <h2 className="pets-title">My Pets</h2>
      <p className='pets-paragraf'>Here you can create profiles for each one of your pets.</p>

      <div className="pets-grid">
        {currentPets.map((pet, i) => (
          <div key={i} className="pet-card">
            {pet.POZA ? (
              <img src={`http://localhost:5000/${pet.POZA}`} alt={pet.NUME} className="pet-photo" />
            ) : (
              <div className="pet-photo placeholder"><span>No Image</span></div>
            )}
            <div className="pet-details">
              <h4>{pet.NUME}</h4>
              <span className="pet-type-label">{pet.TIP}</span>
              <p>{pet.RASA}</p>
              <p>{pet.VARSTA} years</p>
            </div>
            <button className="edit-btn-pet" onClick={() => handleEdit(pet)}>Edit</button>
          </div>
        ))}

           <div
            className="add-pet-box"
            onClick={() => {
              setForm({ id: null, nume: '', tip: '', rasa: '', varsta: '' });
              setPetImage(null);
              setShowForm(true);
            }}
          >
          <div className="add-icon-pet">🐾</div>
          <h4>Add a New Pet</h4>
          <p>Register your pet to manage their health records</p>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="pagination-pet">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-backdrop-pet">
          <div className="modal-pet">
            <form className="pet-form" onSubmit={handleSubmit}>
              <h3>{form.id ? "Edit Pet" : "Add New Pet"}</h3>
              <label>Pet Name</label>
              <input type="text" value={form.nume} onChange={e => setForm({ ...form, nume: e.target.value })} required />
              <label>Pet Type</label>
              <select value={form.tip} onChange={e => setForm({ ...form, tip: e.target.value })} required>
                <option value="">Select pet type</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Other">Other</option>
              </select>
              <label>Breed</label>
              <input type="text" value={form.rasa} onChange={e => setForm({ ...form, rasa: e.target.value })} required />
              <label>Age</label>
              <input type="number" value={form.varsta} onChange={e => setForm({ ...form, varsta: e.target.value })} required />
              <label htmlFor="pet-image" className="file-upload-label-pet">Upload Image</label>
              <input
                id="pet-image"
                type="file"
                accept="image/*"
                onChange={(e) => setPetImage(e.target.files[0])}
                className="file-upload-input-pet"
              />
              <input id="pet-image" type="file" accept="image/*" onChange={e => setPetImage(e.target.files[0])} />
              <div className="form-buttons-pet">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MyPets;
