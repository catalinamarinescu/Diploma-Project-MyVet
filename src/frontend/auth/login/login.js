import React, {use, useState} from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
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
          alert("Login reușit!");
      
          if (accountType === "clinic") {
            const profilCheck = await axios.get('http://localhost:5000/api/profil-completat', {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
      
            if (profilCheck.data.completat) {
              navigate("/clinic/profile");
            } else {
              navigate("/form");
            }
          } else {
            navigate("/client");
          }
      
        } catch (err) {
          alert("Login eșuat");
          console.error(err);
        }
      };

    return (
        <div className="login-container">
            <div className="background-image" style={{
            backgroundImage: `url(${picture})`,
            }}/>
            <div className="overlay"></div> 
            <h2>Login</h2>
            <label>Choose account type:</label>
            <select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
                <option value="clinic">Clinic</option>
                <option value="petowner">Pet Owner</option>
            </select>

            <form onSubmit={handleLogin}>
                {accountType === "clinic" && (
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                )}
                {accountType === "petowner" && (
                    <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                )}
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;