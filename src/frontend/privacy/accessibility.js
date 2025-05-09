import React from "react";
import {Link} from "react-router-dom";
import "./accessibility.css";

const Accessibility = () => {
    return (
        <div className="acc-container">
            <nav className="navbar-acc">
                <div className="logo-acc">
                    MyVet
                </div>
                <div className="navbar-acc-buttons">
                    <Link to="/" className="nav-acc-button">
                        Home
                    </Link>
                    <Link to="/about" className="nav-acc-button">
                        AboutUs
                    </Link>
                    <Link to="/petinfo" className="nav-acc-button">
                        Find more about your pet!
                    </Link>
                    <Link to="/pharmacy" className="nav-acc-button">
                        Pharmacy&Accesories
                    </Link>
                    <Link to="/map" className="nav-acc-button">
                        Map
                    </Link> 
                </div>
                <div className="auth-acc-buttons">
                    <Link to="/login" className="login-acc-button">
                        Login
                    </Link>
                    <Link to="/accountType" className="sign-acc-up-button">
                        Sign up
                    </Link>
                </div>
            </nav>
            <div className="acc-box">
                <h1>Accessibility</h1>
                <p>At MyVet, we are committed to providing a website that is accessible to all users, regardless of technology or ability.</p>
                <h3>Our Goal</h3>
                <p>We aim to make the MyVet platform easy to navigate and use for everyone — including people with disabilities. 
                    We believe accessibility is not a feature, but a core part of user experience.</p>
                <h3>Measures We’ve Taken</h3>
                <ul>
                    <li>Use semantic HTML for better screen reader compatibility</li>
                    <li>Ensure good contrast between text and background</li>
                    <li>Provide descriptive alt text for important images</li>
                    <li>Maintain keyboard navigation support</li>
                    <li>Avoid relying solely on color to convey information</li>
                </ul>
                <h3>Ongoing Improvements</h3>
                <p>This is an ongoing effort. As the platform evolves, we continue working
                to improve usability and ensure all users can benefit from what we offer.           
                If you encounter an accessibility issue, please let us know. Your feedback helps us improve.</p>
                <h3>Contact</h3>
                <p>If you need assistance using our site or have suggestions on how we can improve accessibility, email us at:
                support@myvet.com</p>
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

export default Accessibility;