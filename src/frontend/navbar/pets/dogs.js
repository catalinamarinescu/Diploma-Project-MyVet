import React, { useEffect, useState } from "react";
import Navbar from "../../navbar";
import Footer from "../../footer";
import "./dogs.css";

const Dogs = () => {
  const [dogs, setDogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("az");
  const [currentPage, setCurrentPage] = useState(1);
  const dogsPerPage = 8;

  useEffect(() => {
    fetch("https://api.thedogapi.com/v1/breeds", {
      headers: {
        "x-api-key": "live_bRwnTjFBkF8LpACwVXiO9nw8aKBpIgtIKuCvDXUHeZlyrDpyFfXvg209xYTaiJxt"
      }
    })
      .then((res) => res.json())
      .then((data) => setDogs(data))
      .catch((err) => console.error("Error fetching dog data:", err));
  }, []);

  const filtered = dogs.filter(dog =>
    dog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dog.temperament?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedDogs = [...filtered].sort((a, b) =>
    sortOption === "az"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  );

  const indexOfLastDog = currentPage * dogsPerPage;
  const indexOfFirstDog = indexOfLastDog - dogsPerPage;
  const currentDogs = sortedDogs.slice(indexOfFirstDog, indexOfLastDog);
  const totalPages = Math.ceil(sortedDogs.length / dogsPerPage);

  return (
    <>
      <Navbar />

      <section className="dog-hero">
        <h1>Discover Dog Breeds 🐶</h1>
        <p>Explore over 170 dog breeds and find your perfect companion</p>
        <div className="dog-stats">
          <div><strong>172+</strong><span>Breeds</span></div>
          <div><strong>8</strong><span>Groups</span></div>
          <div><strong>∞</strong><span>Love</span></div>
        </div>
      </section>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search breeds or temperament..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="az">Sort A–Z</option>
          <option value="za">Sort Z–A</option>
        </select>
      </div>

      <div className="breed-grid">
        {currentDogs.map((dog) => (
          <div key={dog.id} className="breed-card">
            <img src={dog.image?.url} alt={dog.name} />
            <h2>{dog.name}</h2>
            <p className="details">
              {dog.breed_group || "Unknown Group"} • {dog.life_span}  <br />
              ⚖ {dog.weight.metric} kg
            </p>
            <div className="temperament">
              {dog.temperament?.split(", ").slice(0, 3).map((t, i) => (
                <span key={i} className="temper-tag">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

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

export default Dogs;
