import React from "react";
import {Link} from "react-router-dom";
import "./terms.css";

const Terms = () => {
    return (
        <div className="terms-container">
            <nav className="navbar-terms">
                <div className="logo-terms">
                    MyVet
                </div>
                <div className="navbar-terms-buttons">
                    <Link to="/" className="nav-terms-button">
                        Home
                    </Link>
                    <Link to="/about" className="nav-terms-button">
                        AboutUs
                    </Link>
                    <Link to="/petinfo" className="nav-terms-button">
                        Find more about your pet!
                    </Link>
                    <Link to="/pharmacy" className="nav-terms-button">
                        Pharmacy&Accesories
                    </Link>
                    <Link to="/map" className="nav-terms-button">
                        Map
                    </Link> 
                </div>
                <div className="auth-terms-buttons">
                    <Link to="/login" className="login-terms-button">
                        Login
                    </Link>
                    <Link to="/accountType" className="sign-terms-up-button">
                        Sign up
                    </Link>
                </div>
            </nav>
            <div className="terms-box">
                <h1>Terms & Conditions</h1>
                <h3>1. About MyVet</h3>
                <p>
                MyVet is an educational platform that helps users explore pet care locations, animal breed information, and suggested products. Products listed on the platform are not for purchase and are for informational purposes only.
                </p>

                <h3>2. Use of the Website</h3>
                <p>
                By using MyVet, you agree to:
                </p>
                <ul>
                <li>Use the website only for lawful purposes</li>
                <li>Not disrupt or harm the platform or other users</li>
                <li>Respect all site content and intellectual property</li>
                </ul>

                <h3>3. User Accounts</h3>
                <p>
                You are responsible for keeping your account information safe. We may suspend or delete accounts that violate our terms or are inactive.
                </p>

                <h3>4. Disclaimer</h3>
                <p>
                MyVet provides general information. We do not guarantee the accuracy of locations, breed details, or suggested products. Always consult a veterinarian for pet health concerns.
                </p>

                <h3>5. Third-Party Tools</h3>
                <p>
                We integrate services like maps and breed APIs. We are not responsible for the functionality or content of these external tools.
                </p>

                <h3>6. Updates</h3>
                <p>
                These terms may be updated at any time. Continued use of the platform means you accept any revised terms.
                </p>

                <h3>7. Contact</h3>
                <p>
                Questions? Reach us at <strong>support@myvet.com</strong>
                </p>
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

export default Terms;