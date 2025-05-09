import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import "./petInfo.css";

const PetInfo = () => {
        
    return (
        <div className='pet-info-page'>
             <nav className="navbar-petInfo">
                <div className="logo-petInfo">
                    MyVet
                </div>
                <div className="navbar-petInfo-buttons">
                    <Link to="/about" className="nav-petInfo-button">
                        About Us
                    </Link>
                    <Link to="/" className="nav-petInfo-button">
                        Home
                    </Link>
                    <Link to="/pharmacy" className="nav-petInfo-button">
                        Pharmacy&Accesories
                    </Link>
                    <Link to="/map" className="nav-petInfo-button">
                        Map
                    </Link> 
                </div>
                <div className="auth-petInfo-buttons">
                    <Link to="/login" className="login-petInfo-button">
                        Login
                    </Link>
                    <Link to="/accountType" className="sign-petInfo-up-button">
                        Sign up
                    </Link>
                </div>
            </nav>
            <div className='content-petInfo'>
                <div className="left-images-petInfo">
                    <img src="/imagini/dog.png" alt="Dog" />
                    <img src="/imagini/cat.png" alt="Cat" />
                    <img src="/imagini/rabbit.png" alt="Rabbit" />
                    <img src="/imagini/guineea.png" alt="Guinea Pig" />
                </div>
                <div className='petInfo-box'>
                    <h1>Every tail, paw, and feather has a story.
                    We’re here to help you learn it.</h1>
                    <p>Whether you have a playful pup, a curious kitten, a gentle rabbit, or a chirpy parrot — we help you understand them better.
                    Explore trusted breed info and fun facts.</p>
                    <div className="pets-buttons">
                        <Link to="/dogs" className="pet-button">
                            Dogs
                        </Link>
                        <Link to="/cats" className="pet-button">
                            Cats
                        </Link>
                        <Link to="/smallPets" className="pet-button">
                            Small Pets
                        </Link>
                    </div>
                </div>
                <div className="right-images-petInfo">
                    <img src="/imagini/hamsteri.png" alt="Dog" />
                    <img src="/imagini/papagal.png" alt="Cat" />
                    <img src="/imagini/fluture.png" alt="Rabbit" />
                    <img src="/imagini/pesti.png" alt="Guinea Pig" />
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
                    <li><a href="/about">About Us</a></li>
                    <li><a href="/">Home</a></li>
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

export default PetInfo;