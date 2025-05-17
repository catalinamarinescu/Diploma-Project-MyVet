import React, { useState, useEffect } from 'react';
import './petsTab.css';

const PetsTab = () => {
  const token = localStorage.getItem('myvet_token');
  const [pets, setPets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [petImage, setPetImage] = useState(null);
  const [form, setForm] = useState({ id: null, nume: '', tip: '', rasa: '', varsta: '' });

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

  return (
    <div className="pets-tab">
      <div className="pets-tab-header">
        <h2>My Pets</h2>
        <button className="add-pet-tab-btn" onClick={() => setShowForm(true)}>
          Add New Pet
        </button>
      </div>

      <div className="pets-grid">
        {pets.map((pet, i) => (
          <div key={i} className="pet-card">
            {pet.POZA ? (
              <img src={`http://localhost:5000/${pet.POZA}`} alt={pet.NUME} className="pet-photo" />
            ) : (
              <div className="pet-photo placeholder"><span>No Image</span></div>
            )}
            <h4>{pet.NUME}</h4>
            <span className="pet-type-label">{pet.TIP}</span>
            <p>{pet.RASA}</p>
            <p>{pet.VARSTA} years</p>
            <button className="edit-btn" onClick={() => handleEdit(pet)}>Edit</button>
          </div>
        ))}

        {!showForm && (
          <div className="add-pet-box" onClick={() => setShowForm(true)}>
            <div className="add-icon">🐾</div>
            <h4>Add a New Pet</h4>
            <p>Register your pet to manage their health records</p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal-backdrop">
          <div className="modal">
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
              <label htmlFor="pet-image">Upload Image</label>
              <input id="pet-image" type="file" accept="image/*" onChange={e => setPetImage(e.target.files[0])} />
              <div className="form-buttons">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetsTab;
