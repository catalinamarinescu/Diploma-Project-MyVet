import React, { useState } from "react";
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import "./clinicSignUp.css";

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
    <div className="signup-page">
      <Link to="/accountType" className="back-btn">← Back to Account Type</Link>

      <div className="signup-left">
        <span className="badge">📄 Veterinary Clinic</span>
        <h1>Join MyVet's Professional Network</h1>
        <p>
          Connect with pet owners, manage your practice efficiently, and grow your
          veterinary business with our trusted platform.
        </p>
        <ul className="features-list">
          <li>✔ Connect with thousands of pet owners</li>
          <li>✔ Manage appointments efficiently</li>
          <li>✔ Secure and verified profile</li>
        </ul>
      </div>

      <div className="signup-right">
        <div className="signup-form-box">
          <h2>Create Your Clinic Account</h2>
          <form onSubmit={handleSubmit}>
            <label>Clinic Name</label>
            <input type="text" name="name" placeholder="Your Clinic Name" onChange={handleChange} required />
            <label>Address</label>
            <input type="text" name="address" placeholder="Clinic Address" onChange={handleChange} required />
            <label>Email</label>
            <input type="email" name="email" placeholder="clinic@example.com" onChange={handleChange} required />
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

export default ClinicSignUp;
