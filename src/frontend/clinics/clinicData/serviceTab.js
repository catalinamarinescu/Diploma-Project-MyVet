import React, { useEffect, useState } from 'react';
import './serviceTab.css';

const ServicesTab = () => {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentService, setCurrentService] = useState({
    tip: '',
    denumire: '',
    descriere: '',
    pret: '',
    durata: '' // <-- Adăugat
  });

  const token = localStorage.getItem('myvet_token');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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
      setCurrentPage(1);
    } catch (err) {
      console.error("Error deleting service:", err);
    }
  };

  const handleModalOpen = (service = {
    id: null,
    tip: '',
    denumire: '',
    descriere: '',
    pret: '',
    durata: ''
  }) => {
    setCurrentService({
      id: service.id ?? null, // ✅ important
      tip: service.tip || '',
      denumire: service.denumire || '',
      descriere: service.descriere || '',
      pret: service.pret || '',
      durata: service.durata !== null && service.durata !== undefined ? service.durata.toString() : ''
    });
    setShowModal(true);
  };



  const handleModalClose = () => {
    setShowModal(false);
    setCurrentService(null);
    setCurrentPage(1);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const method = currentService?.id ? 'PUT' : 'POST';
  const url = currentService?.id
    ? `http://localhost:5000/api/clinic/servicii/${currentService.id}` // cu id
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

  // Pagination
  const totalPages = Math.ceil(services.length / itemsPerPage);
  const paginatedServices = services.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="services-tab">
      <div className="services-header">
        <h2>Services</h2>
        <button className="services1-actions-button" onClick={() => handleModalOpen()}>
          + Add Service
        </button>
      </div>

      <div className="service-list">
        {paginatedServices.map((s) => (
          <div className="service1-card" key={s.id}>
            <div className="service-card1-header">
              <h3>{s.denumire}</h3>
              <span className="service1-badge-service">{s.tip}</span>
            </div>
            <p>{s.descriere}</p>
            <p className="service1-price">{s.pret} RON</p>
            <p className="service1-duration">{s.durata} min</p> {/* Nou */}
            <div className="service-card-actions">
              <button onClick={() => handleModalOpen(s)}>Edit</button>
              <button onClick={() => handleDelete(s.id)} className="delete">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination1">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? 'active' : ''}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {showModal && (
        <div className="service-modal-backdrop">
          <div className="service-modal">
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

              <label>Duration (minutes)</label>
              <input
                type="number"
                value={currentService.durata}
                onChange={(e) => handleChange('durata', e.target.value)}
                required
              />

              <div className="service-modal-actions">
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
