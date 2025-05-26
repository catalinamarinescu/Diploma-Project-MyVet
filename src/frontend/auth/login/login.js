import React, {use, useState} from "react";
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import "./login.css";

const picture = "/imagini/fundal.jpg";

const Login = () => {
    const navigate = useNavigate();
    const [accountType, setAccountType] = useState("clinic");
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
      
        const endpoint = accountType === "clinic"
          ? "http://localhost:5000/api/loginAsClinic"
          : "http://localhost:5000/api/loginAsPetOwner";
      
        const payload = accountType === "clinic"
          ? { email: formData.email, password: formData.password }
          : { username: formData.username, password: formData.password };
      
        try {
          const res = await axios.post(endpoint, payload);
          const token = res.data.token;
      
          localStorage.setItem("myvet_token", token);
          localStorage.setItem("userType", accountType);
          alert("Login reușit!");
      
          if (accountType === "clinic") {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            localStorage.setItem("clinicId", decoded.id);
            const profilCheck = await axios.get('http://localhost:5000/api/profil-completat', {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
      
            if (profilCheck.data.completat) {
              localStorage.setItem("userType", "clinic");
              navigate("/");
            } else {
              localStorage.setItem("userType", "clinic");
              navigate("/");
            }
          } else {
            localStorage.setItem("userType", "client");
            navigate("/");
          }
      
        } catch (err) {
          alert("Login eșuat");
          console.error(err);
        }
      };

    return (
        <div className="login-page">
          <Link to="/" className="back-link">← Back to Home</Link>
          <div className="login-left">
            <div className="login-welcome">
              <span className="welcome-badge">Welcome Back</span>
              <h1>Sign in to <span className="highlight">MyVet</span></h1>
              <p>Continue your journey in providing the best care for our furry friends. Access your dashboard and manage your pet care services.</p>
              <ul className="login-features">
                <li>
                  <img src="/imagini/shield.png" alt="Shield" className="icon" />
                  Secure and encrypted login
                </li>
                <li>
                  <img src="/imagini/heart.png" alt="Heart" className="icon" />
                  Access to all pet care features
                </li>

              </ul>
            </div>
          </div>

          <div className="login-right">
            <div className="login-box">
              <h2>Welcome Back!</h2>
              <p>Sign in to your account to continue</p>

              <label>Account Type</label>
              <select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
                <option value="clinic">Veterinary Clinic</option>
                <option value="petowner">Pet Owner</option>
              </select>

              {accountType === "clinic" && (
                <>
                  <label>Email Address</label>
                  <input type="email" name="email" placeholder="clinic@example.com" onChange={handleChange} required />
                </>
              )}

              {accountType === "petowner" && (
                <>
                  <label>Username</label>
                  <input type="text" name="username" placeholder="Your username" onChange={handleChange} required />
                </>
              )}

              <label>Password</label>
              <input type="password" name="password" placeholder="Enter your password" onChange={handleChange} required />
              <button className="login-btn" onClick={handleLogin}>Sign In</button>

              <div className="signup-link">
                <span>Don't have an account?</span>
                <Link to="/accountType">Create New Account</Link>
              </div>
            </div>
          </div>
        </div>

    );
};

export default Login;