// JoinClinicForm.jsx
import React, { useEffect, useState } from "react";
import "./joinClinic.css";

const JoinClinicForm = ({ clinicId, onClose }) => {
  const [joinMessage, setJoinMessage] = useState("");

  const handleJoinClinic = async () => {
    try {
     const res = await fetch("http://localhost:5000/api/client/join-clinic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("myvet_token")}`
        },
        body: JSON.stringify({
          clinicId: clinicId,
          message: joinMessage
        })
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        alert("Request sent successfully!");
        setJoinMessage("");
        onClose();
      } else {
        alert(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error("Error sending join request:", err);
      alert("Server error. Try again later.");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Send Join Request</h3>
        <textarea
          placeholder="Write a short message to the clinic..."
          value={joinMessage}
          onChange={(e) => setJoinMessage(e.target.value)}
        />
        <div className="form-buttons">
          <button onClick={handleJoinClinic}>Send</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default JoinClinicForm;
