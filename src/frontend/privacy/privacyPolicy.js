import React from "react";
import {Link} from "react-router-dom";
import "./privacyPolicy.css";

const PrivacyPolicy = () => {
    return (
        <div className="privacy-container">
            <nav className="navbar-privacy">
                <div className="logo-privacy">
                    MyVet
                </div>
                <div className="navbar-privacy-buttons">
                    <Link to="/" className="nav-privacy-button">
                        Home
                    </Link>
                    <Link to="/about" className="nav-privacy-button">
                        AboutUs
                    </Link>
                    <Link to="/petinfo" className="nav-privacy-button">
                        Find more about your pet!
                    </Link>
                    <Link to="/pharmacy" className="nav-privacy-button">
                        Pharmacy&Accesories
                    </Link>
                    <Link to="/map" className="nav-privacy-button">
                        Map
                    </Link> 
                </div>
                <div className="auth-privacy-buttons">
                    <Link to="/login" className="login-privacy-button">
                        Login
                    </Link>
                    <Link to="/accountType" className="sign-privacy-up-button">
                        Sign up
                    </Link>
                </div>
            </nav>
            <div className="privacy-box">
                <h1>Privacy Policy</h1>
                <p>Welcome to MyVet — your digital guide for discovering pet-friendly locations, clinics, 
                and useful pet care suggestions. We are committed to protecting your privacy and 
                handling your data responsibly.</p>
                <h3>We collect only a minimal amount of data, such as:</h3>
                <ul>
                    <li>Email address (only if you create an account)</li>
                    <li>Location (optional) if you use the "Find Nearby" feature</li>
                </ul>
                <p>We do not collect sensitive personal data or any financial/payment information.</p>
                <h3>The limited data we collect is used to:</h3>
                <ul>
                    <li>Personalize your experience on the platform</li>
                    <li>Improve our platform based on anonymous usage patterns</li>
                </ul>
                <p>We never sell your information or share it with third-party companies for advertising.</p>
                <h3>We use third-party APIs such as: </h3>
                <ul>
                    <li>Esri (ArcGIS) for displaying maps</li>
                    <li>TheCatAPI / TheDogAPI for pet breed information</li>
                </ul>
                <p>These platforms may collect anonymous technical data (like IP address or browser type). 
                    You can review their own privacy policies on their websites.</p>
                <p>We use appropriate technical measures to keep your information secure. However, no online platform is entirely immune to security risks.</p>
                <h3>Your Rights</h3>
                <ul>
                    <li>Request access to the data we hold about you</li>
                    <li>Ask for your account or data to be deleted</li>
                    <li>Opt out of email updates or notifications</li>
                </ul>
                <h3>Contact</h3>
                <p>Have questions about privacy?
                📧 Email us at: support@myvet.com</p>   
            </div>
            <footer className="footer">
            <div className="footer-column">
                    <h2 className="footer-logo">MyVet</h2>
                    <p>+40 712 345 678</p>
                    <p>support@myvet.com</p>
                    <p>Str. Animăluțelor nr. 5, București</p>
                    <div className="social-icons-privacy">
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

export default PrivacyPolicy;