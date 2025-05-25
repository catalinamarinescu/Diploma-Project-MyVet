import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./accountType.css";

const AccountType = () => {
  const navigate = useNavigate();

  return (
    <div className="account-type-page">
      <Link to="/" className="back-link">← Back to Home</Link>

      <div className="header">
        <h1>Welcome to <span className="highlight">MyVet</span>!</h1>
        <p>Choose how you'd like to join our community of pet lovers and veterinary professionals</p>
        <div className="trust-icons">
            <div className="trust-item">
                <img src="/imagini/checked.png" alt="Check icon" />
                <span>Trusted by thousands</span>
            </div>
            <div className="trust-item">
                <img src="/imagini/star1.png" alt="Star icon" />
                <span>4.9/5 rating</span>
            </div>
            <div className="trust-item">
                <img src="/imagini/stethoscope-solid.svg" alt="Network icon" />
                <span>Professional network</span>
            </div>
            </div>
      </div>

      <div className="account-options">
        <div className="account-card clinic">
          <div className="account-card-header">
            <span className="account-label">Healthcare Providers</span>
          </div>
          <h2>Veterinary Clinic</h2>
          <p>Join our network of trusted veterinary professionals and connect with pet owners in your area.</p>
          <strong>What you'll get:</strong>
          <ul>
            <li>✔ Manage patient records</li>
            <li>✔ Schedule appointments</li>
            <li>✔ Connect with pet owners</li>
            <li>✔ Showcase your services</li>
            <li>✔ Build your reputation</li>
          </ul>
          <div className="account-stats">500+<span>Partner Clinics</span></div>
          <button onClick={() => navigate("/signupAsClinic")}>Join as Veterinary →</button>
        </div>

        <div className="account-card pet">
          <div className="account-card-header">
            <span className="account-label blue">Loving Pet Parents</span>
          </div>
          <h2>Pet Owner</h2>
          <p>Find trusted veterinary care, manage your pet's health records, and connect with other pet lovers.</p>
          <strong>What you'll get:</strong>
          <ul>
            <li>✔ Find nearby clinics</li>
            <li>✔ Track pet health records</li>
            <li>✔ Schedule appointments</li>
            <li>✔ Access pet care tips</li>
            <li>✔ Join pet community</li>
          </ul>
          <div className="account-stats blue">10K+<span>Happy Pet Owners</span></div>
          <button className="blue" onClick={() => navigate("/signupAsPetOwner")}>Join as Pet →</button>
        </div>
      </div>
    </div>
  );
};

export default AccountType;
