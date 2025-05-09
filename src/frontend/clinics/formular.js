import React, {useState} from 'react';
import "./formular.css";
import e from 'cors';

const Formular = () => {
    const[name, setName] = useState(''); 
    const[description, setDescription] = useState('');
    const[latitude, setLatitude] = useState('');
    const[longitude, setLongitude] = useState('');
    const[images, setImages] = useState([]);
    const[services, setServices] = useState([]);
    const[employees, setEmployees] = useState([]);

    const handleAddService = () => {
        setServices([...services, {type: '', name: '', price: '', description: ''}]);
    };

    const handleChangeService = (index, field, value) => {
        const updated = [...services];
        updated[index][field] = value;
        setServices(updated);
    };

    const handleAddEmployee = () => {
        setEmployees([...employees, {name: '', lastName: '', email: '', phoneNumber: '', type: '', providedServices: []}]);
    };

    const handleChangeEmployee = (index, field, value) => {
        const updated = [...employees];
        updated[index][field] = value;
        setEmployees(updated);
    };

    const handleServiceCheckbox = (employeeIndex, serviceName) => {
        const updated = [...employees];
        const currServices = updated[employeeIndex].providedServices;

        if(currServices.includes(serviceName)) {
            updated[employeeIndex].providedServices = currServices.filter(s => s !== serviceName);
        } else {
            updated[employeeIndex].providedServices.push(serviceName);
        }

        setEmployees(updated);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', name);
        data.append('description', description);
        data.append('latitude', latitude);
        data.append('longitude', longitude);

        for (let i = 0; i < images.length; i++) {
            data.append('images', images[i]);
        }

        data.append('services', JSON.stringify(services));
        data.append('employees', JSON.stringify(employees));

        try {
            const res = await fetch('http://localhost:5000/api/form', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('myvet_token')}`
              },
              body: data
            });
            if (res.ok) {
              alert('Date salvate cu succes!');
              window.location.href = '/clinic/profile';
            } else {
              alert('Eroare la salvare.');
            }
          } catch (err) {
            console.error(err);
            alert('Eroare de rețea.');
          }
    }

    return (
        <form onSubmit={handleSubmit} className="profil-container">
            <h2>Clinic Info</h2>
            <input type='text' placeholder='Name' value={name} onChange={e => setName(e.target.value)} required />
            <textarea placeholder='Description' value={description} onChange={e => setDescription(e.target.value)} required />
            <input type="number" placeholder="Latitude" value={latitude} onChange={e => setLatitude(e.target.value)} required />
            <input type="number" placeholder="Longitude" value={longitude} onChange={e => setLongitude(e.target.value)} required />
            <div className="file-upload-wrapper">
                <label htmlFor="file-upload" className="file-upload-label">
                    Choose Files
                </label>
                <input
                    id="file-upload"
                    type="file"
                    multiple
                    className="file-upload-input"
                    onChange={(e) => setImages(e.target.files)}
                />
                {images.length > 0 && (
                    <div className="selected-files">
                    {Array.from(images).map((f, i) => (
                        <div key={i}>{f.name}</div>
                    ))}
                    </div>
                )}
            </div>

            <div className="profil-section">
                <h3>Services</h3>
                {services.map((service, i) => (
                    <div key={i}>
                        <input placeholder='Service Type' value={service.type} onChange={e => handleChangeService(i, 'type', e.target.value)} required />
                        <input placeholder="Name" value={service.name} onChange={e => handleChangeService(i, 'name', e.target.value)} required />
                        <input type="number" placeholder="Price" value={service.price} onChange={e => handleChangeService(i, 'price', e.target.value)} required />
                        <textarea placeholder="Description" value={service.description} onChange={e => handleChangeService(i, 'description', e.target.value)} />
                    </div>
                ))}
                <button type="button" onClick={handleAddService}>
                    Add Service
                </button>
            </div>

            <div className="profil-section">
            <h3>Employees</h3>
            {employees.map((employee, i) => (
                <div key={i}>
                    <input placeholder="Name" value={employee.name} onChange={e => handleChangeEmployee(i, 'name', e.target.value)} required />
                    <input placeholder="Last Name" value={employee.lastName} onChange={e => handleChangeEmployee(i, 'lastName', e.target.value)} required />
                    <input placeholder="Email" value={employee.email} onChange={e => handleChangeEmployee(i, 'email', e.target.value)} required />
                    <input placeholder="Phone Number" value={employee.phoneNumber} onChange={e => handleChangeEmployee(i, 'phoneNumber', e.target.value)} required />
                    <input placeholder="Employee Type" value={employee.type} onChange={e => handleChangeEmployee(i, 'type', e.target.value)} />

                    <p>Provided Services:</p>
                    {services.map((s, j) => (
                        <label key={j}>
                            <input type="checkbox" checked={employee.providedServices.includes(s.name)}
                            onChange={() => handleServiceCheckbox(i, s.name)} />
                            {s.name}
                        </label>
                    ))}
                </div>
            ))}
            <button type="button" onClick={handleAddEmployee}>
                Add Employee
            </button>
            </div>
            <hr />
            <button type='submit'>Save profile</button>
        </form>
    );
};

export default Formular;