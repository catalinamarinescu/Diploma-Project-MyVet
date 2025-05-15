import React, { useEffect, useState } from 'react';
import './employeesTab.css';

const EmployeesTab = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [allServices, setAllServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [currentEmployee, setCurrentEmployee] = useState({
    id: null,
    nume: '',
    prenume: '',
    email: '',
    telefon: '',
    tip: '',
    poza: null,
    pozaPreview: null
  });
  const token = localStorage.getItem('myvet_token');

  const fetchEmployees = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/clinic/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEmployees(data.angajati || []);
      setAllServices(data.servicii || []);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Confirm deletion?")) return;
    try {
      await fetch(`http://localhost:5000/api/clinic/angajati/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEmployees();
    } catch (err) {
      console.error("Error deleting employee:", err);
    }
  };

  const handleModalOpen = (emp = null) => {
    if (emp) {
      const matchedServiceIds = allServices
        .filter(s => emp.servicii.includes(s.denumire)) // match denumiri
        .map(s => s.id); // extrage ID-uri

      setCurrentEmployee({
        ...emp,
        poza: null,
        pozaPreview: emp.poza ? `http://localhost:5000/${emp.poza}` : null
      });
      setSelectedServices(matchedServiceIds);
    } else {
      setCurrentEmployee({
        id: null,
        nume: '',
        prenume: '',
        email: '',
        telefon: '',
        tip: '',
        poza: null,
        pozaPreview: null
      });
      setSelectedServices([]);
    }
    setShowModal(true);
  };


  const handleModalClose = () => {
    if (currentEmployee.pozaPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(currentEmployee.pozaPreview); // curăță bloburile
    }
    setShowModal(false);
    setCurrentEmployee({
      id: null,
      nume: '',
      prenume: '',
      email: '',
      telefon: '',
      tip: '',
      poza: null,
      pozaPreview: null
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('nume', currentEmployee.nume);
    formData.append('prenume', currentEmployee.prenume);
    formData.append('email', currentEmployee.email);
    formData.append('telefon', currentEmployee.telefon);
    formData.append('tip', currentEmployee.tip);
    formData.append('servicii', JSON.stringify(selectedServices));
    if (currentEmployee.poza) {
      formData.append('poza', currentEmployee.poza);
    }

    const method = currentEmployee.id ? 'PUT' : 'POST';
    const url = currentEmployee.id
      ? `http://localhost:5000/api/clinic/angajati/${currentEmployee.id}`
      : `http://localhost:5000/api/clinic/angajati`;

    try {
      await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      fetchEmployees();
      handleModalClose();
    } catch (err) {
      console.error("Error saving employee:", err);
    }
  };

  return (
    <div className="employees-tab">
      <div className="employees-header">
        <h2>Employees</h2>
        <div className="actions">
          <button className="add-btn" onClick={() => handleModalOpen()}>Add Employee</button>
        </div>
      </div>

      <div className="employee-list">
        {employees.map((e) => (
          <div className="employee-card" key={e.id}>
            <div className="avatar">
              {e.poza ? (
                <img src={`http://localhost:5000/${e.poza}`} alt="avatar" />
              ) : (
                <div className="initials">{e.nume[0]}{e.prenume[0]}</div>
              )}
            </div>
            <div className="details">
            <h3>{e.nume} {e.prenume}</h3>
            <span className="badge">{e.tip}</span>
            <p><strong>Email:</strong> {e.email}</p>
            <p><strong>Phone:</strong> {e.telefon}</p>
            {e.servicii && e.servicii.length > 0 && (
              <span className='badge2'>{e.servicii.join(', ')}</span>
            )}
          </div>
            <div className="card-actions">
              <button onClick={() => handleModalOpen(e)}>Edit</button>
              <button onClick={() => handleDelete(e.id)} className="delete">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{currentEmployee?.id ? "Edit Employee" : "Add Employee"}</h3>
            <form onSubmit={handleSubmit}>
              <label>First Name</label>
              <input value={currentEmployee.nume} onChange={(e) => setCurrentEmployee(prev => ({ ...prev, nume: e.target.value }))} required />

              <label>Last Name</label>
              <input value={currentEmployee.prenume} onChange={(e) => setCurrentEmployee(prev => ({ ...prev, prenume: e.target.value }))} required />

              <label>Role</label>
              <input value={currentEmployee.tip} onChange={(e) => setCurrentEmployee(prev => ({ ...prev, tip: e.target.value }))} required />

              <label>Email</label>
              <input type="email" value={currentEmployee.email} onChange={(e) => setCurrentEmployee(prev => ({ ...prev, email: e.target.value }))} required />

              <label>Phone</label>
              <input value={currentEmployee.telefon} onChange={(e) => setCurrentEmployee(prev => ({ ...prev, telefon: e.target.value }))} required />
              <label>Services</label>
                <div className="checkbox-group">
                  {allServices.map(service => (
                  <label key={service.id} style={{ display: 'block', marginBottom: '0.5rem' }}>
                    <input
                      type="checkbox"
                      value={service.id}
                      checked={selectedServices.includes(service.id)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const value = parseInt(e.target.value);
                        if (checked) {
                          setSelectedServices(prev => [...prev, value]);
                        } else {
                          setSelectedServices(prev => prev.filter(id => id !== value));
                        }
                      }}
                    />
                    {service.denumire}
                  </label>
                ))}
                </div>
              <label htmlFor="file-upload" className="file-upload-label">
                Upload Image
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setCurrentEmployee(prev => ({
                      ...prev,
                      poza: file,
                      pozaPreview: URL.createObjectURL(file)
                    }));
                  }
                }}
              />

              {/* Live Preview Image */}
              {currentEmployee.pozaPreview && (
                <div style={{ marginTop: '1rem' }}>
                  <img
                    src={currentEmployee.pozaPreview}
                    alt="Preview"
                    style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '10px' }}
                  />
                </div>
              )}

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

export default EmployeesTab;
