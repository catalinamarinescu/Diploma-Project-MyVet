import React, {useState} from "react";
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import "./ownerSignUp.css"

const picture = "/imagini/fundal.jpg";
const OwnerSignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
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
            await axios.post('http://localhost:5000/api/signupAsPetOwner', formData);
            alert('Registered');
            navigate('/login');
        } catch (err) {
            alert('Error: ' + (err.response?.data?.message));
        }
    };

    return (
        <div className="owner-signup-page">
            <Link to="/accountType" className="back-btn">← Back to Account Type</Link>

            <div className="owner-left">
                <h1>Join Our Pet-Loving Community</h1>
                <p>Connect with trusted veterinarians and give your pet the best care possible.</p>
                <ul className="features-list">
                <li><span className="icon green">✔</span> Easy Appointment Booking</li>
                <li><span className="icon blue">✔</span> Digital Health Records</li>
                <li><span className="icon red">✔</span> 24/7 Support</li>
                <li><span className="icon orange">✔</span> Trusted Network</li>
                </ul>
            </div>

            <div className="owner-right">
                <div className="owner-form-box">
                <h2>Create Your Pet Owner Account</h2>
                <form onSubmit={handleSubmit}>
                    <label>Username</label>
                    <input type="text" name="username" placeholder="Your username" onChange={handleChange} required />

                    <label>Email</label>
                    <input type="email" name="email" placeholder="your@email.com" onChange={handleChange} required />

                    <label>Password</label>
                    <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />

                    <button type="submit">Sign Up</button>
                </form>
                <p className="login-link">Already have an account? <Link to="/login">Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default OwnerSignUp;