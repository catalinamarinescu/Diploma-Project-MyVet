import React, { useEffect, useState } from "react";
import Navbar from "../../navbar";
import Footer from "../../footer";
import "./smallPets.css";
import petsData from "../../../data/smallPets.json";

const SmallPets = () => {
  const [pets, setPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("az");
  const [currentPage, setCurrentPage] = useState(1);
  const petsPerPage = 8;

  useEffect(() => {
    setPets(petsData);
  }, []);

  const filtered = pets.filter(pet =>
    pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.fun_fact?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPets = [...filtered].sort((a, b) =>
    sortOption === "az"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  );

  const indexOfLast = currentPage * petsPerPage;
  const indexOfFirst = indexOfLast - petsPerPage;
  const currentPets = sortedPets.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedPets.length / petsPerPage);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="dog-hero">
        <h1>Discover Small Pets 🐹</h1>
        <p>Explore cute and curious small companions for every home</p>
        <div className="dog-stats">
          <div><strong>{pets.length}</strong><span>Species</span></div>
          <div><strong>Multiple</strong><span>Origins</span></div>
          <div><strong>∞</strong><span>Snuggles</span></div>
        </div>
      </section>

      {/* Filters */}
      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search pets or fun facts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="az">Sort A–Z</option>
          <option value="za">Sort Z–A</option>
        </select>
      </div>

      {/* Cards */}
      <div className="breed-grid">
        {currentPets.map((pet, i) => (
          <div className="breed-card1" key={i}>
            <img src={pet.image} alt={pet.name} />
            <h2>{pet.name}</h2>
            <p className="details">
              {pet.origin} <br />
              🕒 {pet.life_span} <br />
            </p>
            <div className="temperament">
              <span className="temper-tag">{pet.description}</span>
              <span className="temper-tag">✨ {pet.fun_fact}</span>
            </div>
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
    </>
  );
};

export default SmallPets;
