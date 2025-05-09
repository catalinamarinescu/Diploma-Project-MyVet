import React, {useState} from "react";
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import "./clinicSignUp.css"

const picture = "/imagini/fundal.jpg";
const ClinicSignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/signupAsClinic', formData);
            alert('Registered');
            navigate('/login');
        } catch (err) {
            alert('Error: ' + (err.response?.data?.message));
        }
    };

    return (
        <div className="background-image" style={{
            backgroundImage: `url(${picture})`,
        }}>
        <div className="overlay"></div>    
            <div className="form-container">
                <h2>Clinic Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Clinic Name" onChange={handleChange} required />
                    <input type="text" name="address" placeholder="Clinic Address" onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                    <button type="submit">Sign Up</button>
                </form>
                <p className="login-link">Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
};

export default ClinicSignUp;