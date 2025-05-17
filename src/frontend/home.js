import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import "./home.css";

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
                className="background-image"
                style={{ backgroundImage: `url(${images[currImage]})` }}
            ></div>
            <div className="overlay"></div>
            <nav className="navbar">
                <div className="logo">
                    MyVet
                </div>
                <div className="navbar-buttons">
                    <Link to="/about" className="nav-button">
                        About Us
                    </Link>
                    <Link to="/petinfo" className="nav-button">
                        Find more about your pet!
                    </Link>
                    <Link to="/pharmacy" className="nav-button">
                        Pharmacy&Accesories
                    </Link>
                    <Link to="/map" className="nav-button">
                        Map
                    </Link> 
                </div>
                <div className="auth-buttons">
                    <Link to="/login" className="login-button">
                        Login
                    </Link>
                    <Link to="/accountType" className="sign-up-button">
                        Sign up
                    </Link>
                </div>
            </nav>
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
                <h2>Subscribe to our Newsletter</h2>
                <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                    <input type="email" placeholder="Enter your email" required />
                    <button type="submit">Subscribe</button>
                </form>
            </section>           
            <footer className="footer">
                <div className="footer-column">
                    <h2 className="footer-logo">MyVet</h2>
                    <p>+40 712 345 678</p>
                    <p>support@myvet.com</p>
                    <p>Str. Animăluțelor nr. 5, București</p>
                    <div className="social-icons">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <img src="/imagini/instagram.png" alt="Instagram" />
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <img src="/imagini/facebook.png" alt="Facebook" />
                    </a>
                    <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                        <img src="/imagini/tiktok.png" alt="TikTok" />
                    </a>
                    </div>
                </div>

                <div className="footer-column">
                   <ul className="quick-links">
                   <h4>Quick Links</h4>    
                    <li><a href="/about">About Us</a></li>
                    <li><a href="/petinfo">Find more about your pet!</a></li>
                    <li><a href="/pharmacy">Pharmacy</a></li>
                    <li><a href="/map">Map</a></li>
                    </ul>       
                </div>

                <div className="footer-column">
                    <ul className="quick-links">
                    <li><a href="/privacypolicy">Privacy Policy</a></li>
                    <li><a href="/accessibility">Accessibility</a></li>
                    <li><a href="/terms">Terms & Conditions</a></li>
                    </ul>
                    <p className="copyright">© 2025 by MyVet</p>
                </div>
            </footer>

        </div>
    );
};

export default Home;