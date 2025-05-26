import React from "react";
import { useNavigate } from "react-router-dom";
import "./clinicCard.css";

const ClinicCard = ({ clinic, isFavorite, isJoined, onToggleFavorite }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const path = isJoined
      ? `/client/my-clinics/${clinic.id}`
      : `/client/clinic/${clinic.id}`;
    navigate(path);
  };

  return (
    <div className="clinic-card-custom" onClick={handleClick}>
      <div className="clinic-image-container">
        <img
          src={clinic.imagine ? `http://localhost:5000/${clinic.imagine}` : "/imagini/clinic-placeholder.jpg"}
          alt="clinic"
          className="clinic-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/imagini/clinic-placeholder.jpg";
          }}
        />

        {isJoined && <div className="joined-badge">Joined</div>}

        <div
          className={`favorite-icon ${isFavorite ? "filled" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(clinic.id);
          }}
        >
          ❤
        </div>
      </div>

      <div className="clinic-info">
        <h3 className="clinic-name">{clinic.name}</h3>
        <p className="clinic-address">{clinic.adresa}</p>
        <p className="clinic-description">{clinic.descriere}</p>
      </div>
    </div>
  );
};

export default ClinicCard;
