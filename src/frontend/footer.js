import React from "react";
import "./footer.css"; // dacă ai stiluri separate

const Footer = () => {
  return (
    <footer className="footer-home1">
      <div className="footer-column-home1">
        <h2 className="footer-logo-home1">MyVet</h2>
        <p><i className="fa fa-phone"></i> +40 712 345 678</p>
        <p><i className="fa fa-envelope"></i> support@myvet.com</p>
        <p><i className="fa fa-map-marker"></i> Str. Animăluțelor nr. 5, București</p>
        <div className="social-icons-home1">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <img src="/imagini/i.png" alt="Instagram" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <img src="/imagini/f.png" alt="Facebook" />
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
            <img src="/imagini/t.png" alt="TikTok" />
          </a>
        </div>
      </div>

      <div className="footer-column-home1">
        <ul className="quick-links-home1">
          <h4>Quick Links</h4>
          <li><a href="/about">About Us</a></li>
          <li><a href="/petinfo">Find more about your pet!</a></li>
          <li><a href="/pharmacy">Pharmacy</a></li>
          <li><a href="/map">Map</a></li>
        </ul>
      </div>

      <div className="footer-column-home1">
        <ul className="quick-links-home1">
          <li><a href="/privacypolicy">Privacy Policy</a></li>
          <li><a href="/accessibility">Accessibility</a></li>
          <li><a href="/terms">Terms & Conditions</a></li>
          <li className="copyright-home1">© 2025 by MyVet. All rights reserved.</li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
