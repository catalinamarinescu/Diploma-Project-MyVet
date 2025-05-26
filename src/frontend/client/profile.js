import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import ProfileTab from './tabs/profileTab';
import PetsTab from './tabs/petsTab';
import './profile.css';
import FavClinicsTab from "./tabs/favTab";
import Navbar from "../navbar";
import Footer from "../footer";

const ClientProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [summary, setSummary] = useState({ pets: 0, favorites: 0 });
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/client/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("myvet_token")}`
          }
        });
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Eroare la profil:", err);
      }
    };

    fetchProfile();

    const fetchSummary = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/client/summary", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("myvet_token")}`
          }
        });
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("Eroare la summary:", err);
      }
    };

    fetchSummary();
  }, []);

  if (!profile) return <p style={{ padding: "2rem" }}>Se încarcă profilul...</p>;

  return (
    <div className="profile-page">
     <Navbar/>

      <div className="profile-header">
        <div className="profile-avatar">
          {profile.IMAGE ? (
            <img src={`http://localhost:5000/${profile.IMAGE}`} alt="Profile" />
          ) : (
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#ccc" }} />
          )}
        </div>
        <div className="profile-info">
          <h2>{profile.FIRST_NAME} {profile.LAST_NAME} <span className="role-badge">Pet Owner</span></h2>
          <p className="member-since">
            Member since {new Date(profile.CREATED_AT).toLocaleDateString('eng', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
          <p><i className="fa fa-envelope"></i> {profile.EMAIL}</p>
          <p><i className="fa fa-phone"></i> {profile.PHONE}</p>
          <p><i className="fa fa-map-marker"></i> {profile.ADDRESS}</p>
        </div>
        {editing ? (
          <button className="edit-profile-btn" onClick={() => setEditing(false)}>Cancel</button>
        ) : (
          <button className="edit-profile-btn" onClick={() => setEditing(true)}>Edit profile</button>
        )}
      </div>

      <div className="profile-tabs">
        <div className={`tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Profile</div>
      </div>

      {activeTab === 'profile' && (
        <div className="profile-main">
          <div className="profile-card">
            <ProfileTab
              profile={profile}
              setProfile={setProfile}
              setEditing={setEditing}
              editing={editing}
            />
          </div>
          {!editing && (
            <div className="profile-card">
              <div className="profile-summary">
                <h3>Account Summary</h3>
                <p><strong>Pets:</strong> {summary.pets}</p>
                <p><strong>Future Appointments:</strong> 0</p>
                <p><strong>Fav Clinics:</strong> {summary.favorites}</p>
              </div>
            </div>
          )}
        </div>
      )}
      <Footer/>
    </div>
  );
};

export default ClientProfile;
