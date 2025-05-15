import React, { useEffect, useState } from 'react';
import './serviceTab.css';

const ServicesTab = () => {
  const [services, setServices] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentService, setCurrentService] = useState({
    tip: '',
    denumire: '',
    descriere: '',
    pret: ''
  });
  const token = localStorage.getItem('myvet_token');

  const fetchServices = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/clinic/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setServices(data.servicii || []);
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Confirm deletion?")) return;
    try {
      await fetch(`http://localhost:5000/api/clinic/servicii/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchServices();
    } catch (err) {
      console.error("Error deleting service:", err);
    }
  };

  const handleModalOpen = (service = { tip: '', denumire: '', descriere: '', pret: '' }) => {
    setCurrentService(service);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setCurrentService(null);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = currentService?.id ? 'PUT' : 'POST';
    const url = currentService?.id
      ? `http://localhost:5000/api/clinic/servicii/${currentService.id}`
      : `http://localhost:5000/api/clinic/servicii`;

    try {
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(currentService),
      });
      fetchServices();
      handleModalClose();
    } catch (err) {
      console.error("Error saving service:", err);
    }
  };

  const handleChange = (field, value) => {
    setCurrentService((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="services-tab">
      <div className="services-header">
        <h2>Services</h2>
        <div className="actions">
          <button className="add-btn-service" onClick={() => handleModalOpen()}>+Add Service</button>
        </div>
      </div>
      <div className="service-list">
        {services.map((s) => (
          <div className="service-card" key={s.id}>
            <div className="card-header">
              <h3>{s.denumire}</h3>
              <span className="badge-service">{s.tip}</span>
            </div>
            <p>{s.descriere}</p>
            <p className="price">{s.pret} RON</p>
            <div className="card-actions">
              <button onClick={() => handleModalOpen(s)}>Edit</button>
              <button onClick={() => handleDelete(s.id)} className="delete">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{currentService?.id ? "Edit Service" : "Add Service"}</h3>
            <form onSubmit={handleSubmit}>
              <label>Type</label>
              <input
                value={currentService.tip}
                onChange={(e) => handleChange('tip', e.target.value)}
                required
              />

              <label>Title</label>
              <input
                value={currentService.denumire}
                onChange={(e) => handleChange('denumire', e.target.value)}
                required
              />

              <label>Description</label>
              <textarea
                value={currentService.descriere}
                onChange={(e) => handleChange('descriere', e.target.value)}
              />

              <label>Price</label>
              <input
                type="number"
                value={currentService.pret}
                onChange={(e) => handleChange('pret', e.target.value)}
                required
              />

              <div className="modal-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={handleModalClose} className="cancel">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesTab;
