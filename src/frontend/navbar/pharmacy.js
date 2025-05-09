import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./pharmacy.css";
import items from "../../data/products.json";

const images = [
  "/imagini/slider1.png",
  "/imagini/slider2.png",
  "/imagini/slider3.png"
];

const Pharmacy = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setProducts(items.filter(p => p.type === selectedCategory));
  }, [selectedCategory]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pharmacy-page">
      <nav className="navbar-pharmacy">
        <div className="logo-pharmacy">MyVet</div>
        <div className="navbar-pharmacy-buttons">
          <Link to="/about" className="nav-pharmacy-button">About Us</Link>
          <Link to="/petinfo" className="nav-pharmacy-button">Find more about your pet!</Link>
          <Link to="/" className="nav-pharmacy-button">Home</Link>
          <Link to="/map" className="nav-pharmacy-button">Map</Link>
        </div>
        <div className="auth-pharmacy-buttons">
          <Link to="/login" className="login-pharmacy-button">Login</Link>
          <Link to="/accountType" className="sign-pharmacy-up-button">Sign up</Link>
        </div>
      </nav>

      <div className="hero-section">
        <div className="hero-text">
          <h1>Take Care of Your Pet's Needs</h1>
          <p>At MyVet, we believe that every pet deserves the best care — from daily health essentials to fun and practical accessories.
            This section was created to inspire and guide pet lovers with a curated selection of trusted products.
            Whether it's vitamins for your pup, scratching posts for your cat, or travel carriers for your furry friend, 
            we've got suggestions you'll love.</p>
        <p>🛑 Please note: Products listed here are not for sale directly on our platform. 
            They are handpicked recommendations to help you discover what's best for your companion!</p>
        </div>
        <div className="hero-carousel">
          <img src={images[currentSlide]} alt="Pet Slide" />
        </div>
      </div>

      <div className="category-selector">
        <h2>Discover the best products for your pet</h2>
        <div className="category-buttons">
          <button onClick={() => setSelectedCategory("pharmacy")}>Pharmacy</button>
          <button onClick={() => setSelectedCategory("accessory")}>Accessories</button>
        </div>
      </div>

      <div className="product-grid">
        {products.map((product, index) => (
          <div key={index} className="product-card">
            <img src={product.image} alt={product.name} />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
          </div>
        ))}
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
            <li><a href="/about">About Us</a></li>
            <li><a href="/petinfo">Find more about your pet!</a></li>
            <li><a href="/">Home</a></li>
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

export default Pharmacy;
