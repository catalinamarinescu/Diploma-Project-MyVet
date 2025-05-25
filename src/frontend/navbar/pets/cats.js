import React, { useEffect, useState } from "react";
import Navbar from "../../navbar";
import Footer from "../../footer";
import "./cats.css";

const Cats = () => {
  const [cats, setCats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("az");
  const [currentPage, setCurrentPage] = useState(1);
  const catsPerPage = 8;

  useEffect(() => {
    fetch("https://api.thecatapi.com/v1/breeds", {
      headers: {
        "x-api-key": "live_5hT8YGtnc9EFd8RdVHcpQ8zWM0YjbPvhZHR9JMvr3dVTCM0OyvPd2E4otoeRn9WK"
      }
    })
      .then((res) => res.json())
      .then((data) => setCats(data))
      .catch((err) => console.error("Error fetching cat data:", err));
  }, []);

  const filtered = cats.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.temperament?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCats = [...filtered].sort((a, b) =>
    sortOption === "az"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  );

  const indexOfLastCat = currentPage * catsPerPage;
  const indexOfFirstCat = indexOfLastCat - catsPerPage;
  const currentCats = sortedCats.slice(indexOfFirstCat, indexOfLastCat);
  const totalPages = Math.ceil(sortedCats.length / catsPerPage);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="dog-hero">
        <h1>Discover Cat Breeds 🐱</h1>
        <p>Explore adorable breeds and find the one that purrs just right for you</p>
        <div className="dog-stats">
          <div><strong>{cats.length}</strong><span>Breeds</span></div>
          <div><strong>Various</strong><span>Origins</span></div>
          <div><strong>∞</strong><span>Purring</span></div>
        </div>
      </section>

      {/* Filters */}
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

      {/* Breed Cards */}
      <div className="breed-grid">
        {currentCats.map((cat) => (
          <div key={cat.id} className="breed-card">
            {cat.image && <img src={cat.image.url} alt={cat.name} />}
            <h2>{cat.name}</h2>
           <p className="details">
             {cat.origin} • {cat.life_span} years <br />
            ⚖ {cat.weight.metric} kg
            </p>
            <div className="temperament">
              {cat.temperament?.split(", ").slice(0, 3).map((t, i) => (
                <span key={i} className="temper-tag">{t}</span>
              ))}
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

export default Cats;
