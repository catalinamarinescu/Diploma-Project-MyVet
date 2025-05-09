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
        <div className="background-image" style={{
            backgroundImage: `url(${picture})`,
        }}>
            <div className="overlay"></div>
            <div className="form-container">
                <h2>Pet Owner Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required />     
                    <button type="submit">Sign Up</button>           
                </form>
                <p className="login-link">Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
};

export default OwnerSignUp;