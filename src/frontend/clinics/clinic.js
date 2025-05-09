import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './clinic.css';

const ClinicDashboard = () => {
  const navigate = useNavigate();
  const [clinicData, setClinicData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    descriere: '',
    latitudine: '',
    longitudine: ''
  });
  const [editServicii, setEditServicii] = useState(false);
  const [formServicii, setFormServicii] = useState([]);

  const [editAngajati, setEditAngajati] = useState(false);
  const[formAngajati, setFormAngajati] = useState([]);

  const token = localStorage.getItem('myvet_token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/clinic/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setClinicData(data);
        setFormValues({
          name: data.name,
          descriere: data.descriere,
          latitudine: data.latitudine,
          longitudine: data.longitudine
        });
        setFormServicii(data.servicii);
        setFormAngajati(data.angajati);
      } catch (err) {
        console.error('Eroare la preluarea profilului:', err);
      }
    };

    fetchData();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('myvet_token');
    navigate('/');
  };

  const handleSave = async () => {
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
        alert('Date actualizate cu succes!');
        setEditMode(false);
        setClinicData(prev => ({ ...prev, ...formValues }));
      } else {
        alert('Eroare la actualizare.');
      }
    } catch (err) {
      console.error('Eroare la salvare:', err);
      alert('Eroare de rețea.');
    }
  };

  const updateServicii = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/clinic/servicii', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ servicii: formServicii })
      });
  
      if (!res.ok) throw new Error('Eroare la salvare');
      
      return true;
    } catch (err) {
      console.error('Eroare la update servicii:', err);
      return false;
    }
  };

  const handleSaveServicii = async () => {
    const success = await updateServicii();
    if (success) {
      alert("Serviciile au fost actualizate!");
      setEditServicii(false);
    } else {
      alert("Eroare la salvare.");
    }
  };

  const handleAddService = () => {
    setFormServicii(prev => [
      ...prev,
      {
        id: null, // ← lipsă ID = serviciu nou
        tip: '',
        denumire: '',
        pret: '',
        descriere: ''
      }
    ]);
  };

  const deleteServiciu = async(id) => {
    const confirmDelete = window.confirm("Esti sigur ca vrei sa stergi acest serviciu?");
    if (!confirmDelete) return false;

    try {
      const res = await fetch(`http://localhost:5000/api/clinic/servicii/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Eroare la stergere");
      alert("Seviciu sters cu succes!");
      return true;
    } catch (err) {
      console.error("Eroare la ștergere:", err);
      alert("Eroare la ștergerea serviciului.");
      return false;
    }
  };

  const updateAngajati = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/clinic/angajati', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ angajati: formAngajati })
      });
  
      if (!res.ok) throw new Error('Eroare la salvare');
      
      return true;
    } catch (err) {
      console.error('Eroare la update angajati:', err);
      return false;
    }
  };

  const handleSaveAngajati = async () => {
    const success = await updateAngajati();
    if (success) {
      alert("Angajatii au fost actualizate!");
      setEditAngajati(false);
    } else {
      alert("Eroare la salvare.");
    }
  };

  const handleAddAngajat = () => {
    setFormAngajati(prev => [
      ...prev,
      {
        id: null, // ← lipsă ID = angajat nou
        nume: '',
        prenume: '',
        email: '',
        telefon: '',
        tip: ''
      }
    ]);
  };

  const deleteAngajat = async(id) => {
    const confirmDelete = window.confirm("Esti sigur ca vrei sa stergi acest angajat?");
    if (!confirmDelete) return false;

    try {
      const res = await fetch(`http://localhost:5000/api/clinic/angajati/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },  
      });

      if (!res.ok) throw new Error('Eroare la stergere');
      alert("Angajat sters cu succes!");
      return true;
    } catch (err) {
      console.error("Eroare la stergere: ", err);
      alert("Eroare la stergerea angajatului.");
      return false;
    }
  };

  if (!clinicData) return <p>Se încarcă datele...</p>;

  return (
    <div className="clinic-page">
      {/* NAVBAR */}
      <nav className="clinic-navbar">
        <div className="logo-clinic">MyVet</div>
        <div className="navbar-buttons-clinic">
          <Link to="/clinic/patients" className='nav-button-clinic'>MyPatients</Link>
          <Link to="/clinic/calendar" className='nav-button-clinic'>Calendar</Link>
        </div>
        <div className="actions">
          <button className="notif-btn" onClick={() => alert("Funcționalitate în lucru!")}>
            🔔
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* CONȚINUT */}
      <div className="clinic-profile-content">
        <h2>My Profile</h2>

        <div className="card">
          <h3>Dashboard</h3>
          <div className="edit-form">
            <label>Nume clinică:</label>
            <input
                disabled={!editMode}
                value={formValues.name}
                onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
            />

            <label>Descriere:</label>
            <textarea
                disabled={!editMode}
                value={formValues.descriere}
                onChange={(e) => setFormValues({ ...formValues, descriere: e.target.value })}
            />

            <label>Latitudine:</label>
            <input
                type="number"
                disabled={editMode}
                value={formValues.latitudine}
                onChange={(e) => setFormValues({ ...formValues, latitudine: e.target.value })}
            />

            <label>Longitudine:</label>
            <input
                type="number"
                disabled={editMode}
                value={formValues.longitudine}
                onChange={(e) => setFormValues({ ...formValues, longitudine: e.target.value })}
            />

            {!editMode ? (
                <button className="button-edit" onClick={() => setEditMode(true)}>✏️ Edit</button>
            ) : (
                <>
                <button className="button-edit" onClick={handleSave}>💾 Save</button>
                <button className="button-edit" onClick={() => setEditMode(false)}>❌ Cancel</button>
                </>
            )}
            </div>


          <h4>Imagini:</h4>
          <div className="gallery">
            {clinicData.imagini.map((img, i) => (
              <img key={i} src={`http://localhost:5000/${img.replaceAll('\\', '/')}`} alt="clinic" />
            ))}
          </div>
        </div>

        <div className="card">
        <h3>Servicii</h3>

        {formServicii.map((s, index) => (
            <div key={index} className="service-card">
                <label>Tip serviciu:</label>
                <input
                disabled={!editServicii}
                value={s.tip}
                onChange={(e) => {
                    const updated = [...formServicii];
                    updated[index].tip = e.target.value;
                    setFormServicii(updated);
                }}
                />

                <label>Denumire:</label>
                <input
                disabled={!editServicii}
                value={s.denumire}
                onChange={(e) => {
                    const updated = [...formServicii];
                    updated[index].denumire = e.target.value;
                    setFormServicii(updated);
                }}
                />

                <label>Preț:</label>
                <input
                type="number"
                disabled={!editServicii}
                value={s.pret}
                onChange={(e) => {
                    const updated = [...formServicii];
                    updated[index].pret = e.target.value;
                    setFormServicii(updated);
                }}
                />

                <label>Descriere:</label>
                <textarea
                disabled={!editServicii}
                value={s.descriere}
                onChange={(e) => {
                    const updated = [...formServicii];
                    updated[index].descriere = e.target.value;
                    setFormServicii(updated);
                }}
                />

                {editServicii && (
                <button
                    className="delete-btn"
                    onClick={async () => {
                      const serviciu = formServicii[index];
                      const succes = serviciu.id ? await deleteServiciu(serviciu.id) : true;
                      if (succes) {
                        const updated = formServicii.filter((_, i) => i !== index);
                        setFormServicii(updated);
                      }
                    }}
                >
                    🗑️ Delete
                </button>
                )}
            </div>
            ))}

        {!editServicii ? (
            <button className="button-edit" onClick={() => setEditServicii(true)}>✏️ Edit</button>
        ) : (
            <>
            <button className="button-edit" onClick={handleSaveServicii}>💾 Save</button>
            <button className="button-edit" onClick={() => setEditServicii(false)}>❌ Cancel</button>
            </>
        )}
        <button className="button-edit" onClick={handleAddService}>➕ Add Service</button>
        </div>

        <div className="card">
        <h3>Angajati</h3>

        {formAngajati.map((a, index) => (
            <div key={index} className="employee-card">
                <label>Nume Angajat:</label>
                <input
                disabled={!editAngajati}
                value={a.nume}
                onChange={(e) => {
                    const updated = [...formAngajati];
                    updated[index].nume = e.target.value;
                    setFormAngajati(updated);
                }}
                />

                <label>Prenume Angajat:</label>
                <input
                disabled={!editAngajati}
                value={a.prenume}
                onChange={(e) => {
                    const updated = [...formAngajati];
                    updated[index].prenume = e.target.value;
                    setFormAngajati(updated);
                }}
                />

                <label>Functie Angajat:</label>
                <input
                disabled={!editAngajati}
                value={a.tip}
                onChange={(e) => {
                    const updated = [...formAngajati];
                    updated[index].tip = e.target.value;
                    setFormAngajati(updated);
                }}
                />

                <label>Email:</label>
                <input
                disabled={!editAngajati}
                value={a.email}
                onChange={(e) => {
                    const updated = [...formAngajati];
                    updated[index].email = e.target.value;
                    setFormAngajati(updated);
                }}
                />

                <label>Numar de Telefon:</label>
                <input
                disabled={!editAngajati}
                value={a.telefon}
                onChange={(e) => {
                    const updated = [...formAngajati];
                    updated[index].telefon = e.target.value;
                    setFormAngajati(updated);
                }}
                />

                {editAngajati && (
                <button
                    className="delete-btn"
                    onClick={async () => {
                      const angajat = formAngajati[index];
                      const succes = angajat.id ? await deleteAngajat(angajat.id) : true;
                      
                      if (succes) {
                        const updated = formAngajati.filter((_, i) => i !== index);
                        setFormAngajati(updated);
                      }
                    }}
                >
                    🗑️ Delete
                </button>
                )}
            </div>
            ))}

        {!editAngajati ? (
            <button className="button-edit" onClick={() => setEditAngajati(true)}>✏️ Edit</button>
        ) : (
            <>
            <button className="button-edit" onClick={handleSaveAngajati}>💾 Save</button>
            <button className="button-edit" onClick={() => setEditAngajati(false)}>❌ Cancel</button>
            </>
        )}
        <button className="nav-button-clinic" onClick={handleAddAngajat}>➕ Add Employee</button>
        </div>
      </div>
    </div>
  );
};

export default ClinicDashboard;
