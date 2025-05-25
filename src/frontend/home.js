import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import Navbar from "./navbar";
import "./home.css";
import Footer from "./footer";

const images = [
    "/imagini/poza14.jpg",
   "/imagini/pozab.png",
   "/imagini/pozabb.png",
   "/imagini/poza12.webp",
   "/imagini/poza5.jpg",
   "/imagini/poza11.jpg",
];

const Home = () => {

    const [currImage, setCurrImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrImage((prevImage) => (prevImage + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [])

    return (
        <div className="home-container">
            <div
                className="background-image-home"
                style={{ backgroundImage: `url(${images[currImage]})` }}
            ></div>
            <div className="overlay-home"></div>
           <Navbar/>
            <section className="front-page">
                <h1>Welcome to MyVet!</h1>
                <p className="p">
                Bringing clinics and pets together for happier, healthier lives.</p>
                <Link to="/accountType" className="cta-button">
                    Get Started
                </Link>
            </section>
            <section className="section-features">
                <h2 className="features-title">What we offer to our pet owners</h2>

                <div className="feature-row">
                    <img src="/imagini/clinica.jpg" alt="Clinics" className="feature-img" />
                    <div className="feature-text">
                    <h4>Find Nearby Clinics</h4>
                    <p>Easily discover and connect with trusted veterinary clinics near you.</p>
                    </div>
                </div>

                <div className="feature-row">
                    <img src="/imagini/chatbot.jpg" alt="Chatbot" className="feature-img" />
                    <div className="feature-text">
                    <h4>Smart Assistant</h4>
                    <p>Ask questions and get instant guidance.</p>
                    </div>
                </div>

                <div className="feature-row">
                    <img src="/imagini/turn pisici.jpg" alt="Pharmacy" className="feature-img" />
                    <div className="feature-text">
                    <h4>Accessories & Meds for Your Pets</h4>
                    <p>Find more about products that make your pet's life amazing!</p>
                    </div>
                </div>
            </section>
            <section className="stats-section">
            <div className="stat-box">
                <h3 className="stat-number">500+</h3>
                <p>Partner Clinics</p>
            </div>
            <div className="stat-box">
                <h3 className="stat-number">10K+</h3>
                <p>Happy Pets</p>
            </div>
            <div className="stat-box">
                <h3 className="stat-number">24/7</h3>
                <p>Support</p>
            </div>
            <div className="stat-box">
                <h3 className="stat-number">98%</h3>
                <p>Satisfaction</p>
            </div>
            </section>

            <section className="map-preview-section">
            <div className="map-preview-left">
                <h2>Discover Pet-Friendly<br />Places Near You</h2>
                <p>
                Explore our interactive map to find veterinary clinics, pet-friendly parks, hotels,
                and other amazing places where you and your furry friend are welcome.
                </p>
                <ul className="map-benefits">
                <li>🏥 Trusted Veterinary Clinics</li>
                <li>🌳 Pet-Friendly Parks</li>
                <li>🏨 Pet Hotels & Services</li>
                </ul>
                <Link to="/map" className="map-btn">Explore Interactive Map →</Link>
            </div>
            <div className="map-preview-right">
                <img src="/imagini/map-preview.png" alt="Map Preview" />
            </div>
            </section>
            <section className="clinic-invite">
                <h2 className="invite-title">
                    Let’s build a future where every furry friend has access to the care they deserve — with your clinic on board.
                </h2>

                <div className="clinic-gallery">
                    <img src="/imagini/vet.jpg" alt="Clinic 1" />
                    <img src="/imagini/owner.webp" alt="Clinic 2" />
                    <img src="/imagini/cliniq.jpg" alt="Clinic 3" />
                    <img src="/imagini/pacient.jpg" alt="Clinic 4" />
                </div>
            </section>
            <section className="newsletter-section">
                <h2>Stay Updated</h2>
                <p>Subscribe to our newsletter for the latest pet info, clinic updates, and exclusive offers.</p>
                <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                    <input type="email" placeholder="Enter your email" required />
                    <button type="submit">Subscribe</button>
                </form>
            </section>           
            <Footer/>

        </div>
    );
};

export default Home;