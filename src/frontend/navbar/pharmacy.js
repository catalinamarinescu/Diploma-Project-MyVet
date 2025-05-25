import React, { useEffect, useRef, useState } from "react";
import "./pharmacy.css";
import Navbar from "../navbar";
import Footer from "../footer";
import items from "../../data/products.json";

const images = [
  "/imagini/slider1.png",
  "/imagini/slider2.png",
  "/imagini/slider3.png"
];

const Pharmacy = () => {
  const [products] = useState(items);
  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const productSectionRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesTab = selectedTab === "all" || p.type === selectedTab;
    return matchesSearch && matchesTab;
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="pharmacy-page">
      <Navbar />

      {/* Hero */}
      <section className="pharmacy-hero">
        <div className="hero-left">
          <span className="badge">Pet Care Essentials</span>
          <h1>
            Take Care of Your Pet's <span className="highlight">Needs</span>
          </h1>
          <p>At MyVet, we believe that every pet deserves the best care — from daily health essentials to fun and practical accessories.</p>
          <p>This section was created to inspire and guide pet lovers with a curated selection of trusted products.</p>
          <div className="disclaimer-box">
            <strong>⚠ Please note:</strong> Products listed here are handpicked recommendations to help you discover what's best for your companion. They are not for sale directly on our platform.
          </div>
          <div className="hero-buttons">
            <button
              className="explore-btn1"
              onClick={() => productSectionRef.current?.scrollIntoView({ behavior: "smooth" })}
            >
              ✨ Explore Products
            </button>
          </div>
        </div>
        <div className="hero-right">
          <img src={images[currentSlide]} alt="Pet Slide" />
        </div>
      </section>

      {/* Tabs */}
      <div className="product-tabs">
        <button className={selectedTab === "all" ? "active" : ""} onClick={() => { setSelectedTab("all"); setCurrentPage(1); }}>All Products</button>
        <button className={selectedTab === "pharmacy" ? "active" : ""} onClick={() => { setSelectedTab("pharmacy"); setCurrentPage(1); }}>Pharmacy</button>
        <button className={selectedTab === "accessory" ? "active" : ""} onClick={() => { setSelectedTab("accessory"); setCurrentPage(1); }}>Accessories</button>
      </div>

      {/* Filters */}
      <div className="product-filters">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Product Cards */}
      <div className="product-grid" ref={productSectionRef}>
        {currentItems.map((product, index) => (
          <div key={index} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="price">{product.price}</p>
            <p className="desc">{product.description}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default Pharmacy;
