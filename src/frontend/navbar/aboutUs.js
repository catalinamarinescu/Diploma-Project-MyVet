import React from "react";
import "./aboutUs.css";
import {Link} from "react-router-dom";
import Navbar from "../navbar";
import Footer from "../footer";

const AboutUs = () => {
  return (
    <>
      <Navbar />

      <div className="about-hero">
        <p className="badge">🐾 Welcome to MyVet</p>
        <h1><span>About </span><span className="highlight">MyVet</span></h1>
        <p className="subtitle">Here, we celebrate love, compassion, and the well-being of our cherished little friends.</p>
      </div>

      <section className="about-story">
        <div className="story-text">
          <h2>Our Story</h2>
          <p>Our journey began this year with a simple realization: pet owners and veterinary clinics needed a better, easier way to connect and care for the precious souls we all adore.</p>
          <p>Driven by passion and dedication, MyVet was born — a platform designed to bring pets and clinics together like never before, making care more accessible, personal, and effortless.</p>
          <p>Every feature we build, every partnership we form, and every innovation we introduce is guided by one simple principle: the love we share for our furry, feathered, and scaled companions.</p>
          <Link to="/accountType" className="cta-btn">Join Our Mission →</Link>
        </div>
        <div className="story-images">
          <img src="./imagini/about.png" alt="img1"/>
        </div>
      </section>

      <section className="about-mission">
        <img src="/imagini/stethoscope-solid.svg" alt="Mission" className="mission-icon"/>
        <h2>Our Mission</h2>
        <p>
          Our mission is to provide top-quality veterinary services through a simple, trustworthy platform that connects clinics and pet owners. We offer a wide range of features to help owners discover valuable information about pets, products, parks, and other pet-friendly locations.
        </p>
        <div className="stats">
          <div><h3>500+</h3><p>Partner Clinics</p></div>
          <div><h3>10,000+</h3><p>Happy Pets</p></div>
          <div><h3>50+</h3><p>Cities Covered</p></div>
          <div><h3>98%</h3><p>Satisfaction Rate</p></div>
        </div>
      </section>

      <section className="about-values">
        <h2>Our Values</h2>
        <p>These core values guide everything we do and shape the way we serve our community of pet lovers.</p>
        <div className="values-grid">
          <div className="value-card">
            <img src="/imagini/heart-attack.png" alt="Compassion Icon" className="value-icon" />
            <h3>Compassion and Love for Animals</h3>
            <p>Every decision we make is guided by our deep love and respect for all animals.</p>
          </div>
          <div className="value-card">
            <img src="/imagini/group.png" alt="Compassion Icon" className="value-icon" />
            <h3>Building a Strong Pet-Friendly Community</h3>
            <p>We’re creating connections that strengthen the bond between pets, owners, and care providers.</p>
          </div>
          <div className="value-card">
            <img src="/imagini/medal-ribbon.png" alt="Compassion Icon" className="value-icon" />
            <h3>Excellence in Veterinary Practices</h3>
            <p>We partner only with the highest quality veterinary professionals and clinics.</p>
          </div>
          <div className="value-card">
            <img src="/imagini/shield.png" alt="Compassion Icon" className="value-icon" />
            <h3>Trust and Dedication</h3>
            <p>Your trust is sacred to us, and we're dedicated to earning it every single day.</p>
          </div>
        </div>
      </section>

      <section className="about-instagram">
        <img src="/imagini/instagram.png" alt="Instagram" />
        <h2>Join Our Instagram Community</h2>
        <p>Follow us for daily doses of cuteness, pet care tips, and heartwarming stories from our community.</p>
        <button className="instagram-btn">Follow @MyVet</button>
        <div className="insta-gallery">
            <img src="./imagini/insta1.png" alt="img1"/>
            <img src="./imagini/insta2.png" alt="img1"/>
            <img src="./imagini/insta3.png" alt="img1"/>
            <img src="./imagini/insta4.png" alt="img1"/>
            <img src="./imagini/insta5.png" alt="img1"/>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default AboutUs;
