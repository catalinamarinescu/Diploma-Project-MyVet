import React from "react";
import Navbar from "../navbar";
import Footer from "../footer";
import "./privacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-container">
      <Navbar />

      <section className="privacy-hero">
        <div className="badge">Privacy & Security</div>
        <h1><span>Privacy</span> <span className="highlight">Policy</span></h1>
        <p>Your privacy matters to us. Learn how we protect your information and your pets' data on our platform.</p>
      </section>

      <section className="privacy-section">
        <h2>Our Commitment</h2>
        <p>
          At MyVet, we understand that your personal information and your pets'
          medical records are sensitive and important to you.
        </p>
        <p>
          This Privacy Policy explains how we collect, use, protect, and share
          information when you use our veterinary platform that connects pet
          owners with trusted clinics.
        </p>
      </section>

      <section className="privacy-section dark">
        <h2>Information We Collect</h2>
        <p>
          We collect information to provide better services to all our users —
          from pet owners to veterinary clinics.
        </p>

        <div className="data-categories">
          <div>
            <h4>Pet Owners</h4>
            <p>Personal & Pet Information</p>
          </div>
          <div>
            <h4>Clinics</h4>
            <p>Business & Staff Details</p>
          </div>
          <div>
            <h4>Medical Records</h4>
            <p>Treatment History</p>
          </div>
          <div>
            <h4>Usage Data</h4>
            <p>Platform Analytics</p>
          </div>
        </div>
      </section>

      <section className="privacy-section light">
        <h2>How We Use Your Data</h2>
        <ul className="checklist">
          <li><strong>✔ Service Delivery:</strong> facilitate appointments, maintain medical records</li>
          <li><strong>✔ Communication:</strong> reminders, notifications</li>
          <li><strong>✔ Platform Improvement:</strong> usage insights</li>
          <li><strong>✔ Security & Compliance:</strong> meet legal requirements</li>
        </ul>
      </section>

      <section className="privacy-section dark">
        <h2>Data Sharing Policy</h2>
        <p>
          We only share your information when necessary to provide our services or when required by law.
        </p>
        <div className="sharing-columns">
          <div>
            <h4>We Share With:</h4>
            <ul>
              <li>Authorized veterinary staff</li>
              <li>Emergency care providers</li>
              <li>Payment processors</li>
              <li>Legal authorities (if required)</li>
            </ul>
          </div>
          <div>
            <h4>We Never Share:</h4>
            <ul>
              <li>Data with advertisers</li>
              <li>Information for marketing</li>
              <li>Personal data without consent</li>
              <li>Medical records publicly</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
