import React from 'react';
import { Link } from 'react-router-dom';
import "./petInfo.css";
import Navbar from "../navbar";
import Footer from "../footer";

const PetInfo = () => {
  return (
    <div className='pet-info-page'>
      <Navbar />

      <section className="pet-info-hero">
        <p className="badge-knowledge">✨ Pet Knowledge Hub</p>
        <h1>
          Every tail, paw, and feather has a <span className="highlight">story</span>
        </h1>
        <p className="subtitle">
          Whether you have a playful pup, a curious kitten, a gentle rabbit, or a chirpy parrot —
          we help you understand them better. Explore trusted breed info and fun facts.
        </p>
        <div className="pet-fact">
          <img src="/imagini/info.png" alt="Info Icon" className="info-icon" />
          <strong>Did you know?</strong> Hamsters store food in their cheeks.

        </div>
      </section>

      <section className="pet-category">
        <h2>Choose Your Pet Category</h2>
        <p className="subtext">
          Dive deep into the world of your beloved companion with expert guides, care tips, and fascinating insights.
        </p>
        <div className="category-cards">
          <div className="category-card dog">
            <img src="/imagini/cutu.png" alt="Dog" className="category-img" />
            <h3>Dogs</h3>
            <p className="subtitle">Man's Best Friend</p>
            <ul>
              <li>⭐ 350+ breeds worldwide</li>
              <li>⭐ Loyal companions</li>
              <li>⭐ Highly trainable</li>
            </ul>
            <Link to="/dogs" className="explore-btn orange">Explore Dogs →</Link>
          </div>

          <div className="category-card cat">
            <img src="/imagini/pisi.png" alt="Cat" className="category-img" />
            <h3>Cats</h3>
            <p className="subtitle">Independent Spirits</p>
            <ul>
              <li>⭐ 40+ recognized breeds</li>
              <li>⭐ Independent nature</li>
              <li>⭐ Natural hunters</li>
            </ul>
            <Link to="/cats" className="explore-btn purple">Explore Cats →</Link>
          </div>

          <div className="category-card small-pets">
            <img src="/imagini/iepuras.png" alt="Bunny" className="category-img" />
            <h3>Small Pets</h3>
            <p className="subtitle">Tiny Treasures</p>
            <ul>
              <li>⭐ Rabbits, birds, fish & more</li>
              <li>⭐ Unique care needs</li>
              <li>⭐ Perfect for apartments</li>
            </ul>
            <Link to="/smallPets" className="explore-btn green">Explore Small Pets →</Link>
          </div>
        </div>
      </section>
        <section className="pet-benefits">
            <h2>Why Pet Knowledge Matters</h2>
            <div className="benefit-cards">
                <div className="benefit-card">
                <img src="/imagini/heart.png" alt="Better Care" />
                <h3>Better Care</h3>
                <p>Understanding your pet's needs leads to better health and happiness.</p>
                </div>
                <div className="benefit-card">
                <img src="/imagini/star1.png" alt="Stronger Bond" />
                <h3>Stronger Bond</h3>
                <p>Knowledge deepens the connection between you and your furry friend.</p>
                </div>
                <div className="benefit-card">
                <img src="/imagini/star.png" alt="Expert Insights" />
                <h3>Expert Insights</h3>
                <p>Access veterinarian-approved information and care guidelines.</p>
                </div>
            </div>
        </section>
      <Footer />
    </div>
  );
};

export default PetInfo;
