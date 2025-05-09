import React from "react";
import { Link } from "react-router-dom";
import "./aboutUs.css";

const AboutUs = () => {
    return (
            <div className="aboutUs-container">
                <nav className="navbar-about">
                    <div className="logo-about">
                        MyVet
                    </div>
                    <div className="navbar-about-buttons">
                        <Link to="/" className="nav-about-button">
                            Home
                        </Link>
                        <Link to="/petinfo" className="nav-about-button">
                            Find more about your pet!
                        </Link>
                        <Link to="/pharmacy" className="nav-about-button">
                            Pharmacy&Accesories
                        </Link>
                        <Link to="/map" className="nav-about-button">
                            Map
                        </Link> 
                    </div>
                    <div className="auth-about-buttons">
                        <Link to="/login" className="login-about-button">
                            Login
                        </Link>
                        <Link to="/accountType" className="sign-about-up-button">
                            Sign up
                        </Link>
                    </div>
                </nav>
                <div className="about-box">
                    <h1>About MyVet</h1>
                    <h3>Welcome to MyVet! 🐾</h3>
                    <p>Here, we celebrate love, compassion, and the well-being of our cherished little friends.
                    Our journey began this year with a simple realization: pet owners and veterinary clinics needed a better, 
                    easier way to connect and care for the precious souls we all adore.
                    Driven by passion and dedication, MyVet was born — a platform designed to bring pets and clinics together 
                    like never before, making care more accessible, personal, and effortless.</p>
                    <h3>Our Mission</h3>
                    <p>Our mission is to provide top-quality veterinary services through a simple, trustworthy platform 
                    that connects clinics and pet owners. We offer a wide range of features to help owners discover valuable 
                    information about pets, products, parks, and other pet-friendly locations.</p>
                    <h3>Our Values</h3>
                    <ul>
                        <li>❤️ Compassion and love for animals</li>
                        <li>🌎 Building a strong pet-friendly community</li>
                        <li>🔬 Excellence in veterinary practices</li>
                        <li>🤝 Trust and dedication to every pet owner</li>
                    </ul>
                </div>
                <div className="instagram-section">
                    <h2>Join our Instagram Community</h2>
                    <div className="gallery">
                        <img src="/imagini/insta3.png" alt="Pet 1" />
                        <img src="/imagini/insta6.png" alt="Pet 2" />
                        <img src="/imagini/insta5.png" alt="Pet 3" />
                        <img src="/imagini/insta4.png" alt="Pet 4" />
                        <img src="/imagini/insta1.png" alt="Pet 5" />
                        <img src="/imagini/insta2.png" alt="Pet 6" />
                    </div>
                </div>
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
                    <li><a href="/">Home</a></li>
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

export default AboutUs;
