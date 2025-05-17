import React, { useState, useEffect } from "react";

const ProfileTab = ({ profile, setProfile, setEditing, editing }) => {
  const [formData, setFormData] = useState(profile);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        IMAGE_FILE: file,
        PREVIEW_URL: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("first_name", formData.FIRST_NAME);
    form.append("last_name", formData.LAST_NAME);
    form.append("phone", formData.PHONE);
    form.append("address", formData.ADDRESS);
    if (formData.IMAGE_FILE) {
      form.append("image", formData.IMAGE_FILE || '');
    }

    try {
      const res = await fetch("http://localhost:5000/api/client/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myvet_token")}`
        },
        body: form
      });

      const result = await res.json();
      setProfile({
        ...formData,
        IMAGE: result.imagePath || profile.IMAGE,
        EMAIL: profile.EMAIL,
        CREATED_AT: profile.CREATED_AT
      });
      setEditing(false);
    } catch (err) {
      console.error("Eroare la actualizare profil:", err);
      alert("Eroare la salvare.");
    }
  };

  if (!formData) return null;

  if (!editing) {
    return (
      <div className="profile-section">
        <h3>Personal Information</h3>
        <p className="section-subtitle">Your basic information and contact details</p>

        <div className="input-grid">
          <div>
            <label>First Name</label>
            <input type="text" value={formData.FIRST_NAME || ''} disabled />
          </div>
          <div>
            <label>Last Name</label>
            <input type="text" value={formData.LAST_NAME || ''} disabled />
          </div>
          <div>
            <label>Phone Number</label>
            <input type="text" value={formData.PHONE || ''} disabled />
          </div>
          <div style={{ gridColumn: "1 / span 2" }}>
            <label>Address</label>
            <input type="text" value={formData.ADDRESS || ''} disabled />
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="profile-section" onSubmit={handleSubmit}>
      <h3>Edit profile</h3>
      <div className="input-grid">
        <div>
          <label>First Name</label>
          <input
            type="text"
            value={formData.FIRST_NAME || ''}
            onChange={(e) => handleChange('FIRST_NAME', e.target.value)}
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            type="text"
            value={formData.LAST_NAME || ''}
            onChange={(e) => handleChange('LAST_NAME', e.target.value)}
          />
        </div>
        <div>
          <label>Phone Number</label>
          <input
            type="text"
            value={formData.PHONE || ''}
            onChange={(e) => handleChange('PHONE', e.target.value)}
          />
        </div>
        <div style={{ gridColumn: "1 / span 2" }}>
          <label>Address</label>
          <input
            type="text"
            value={formData.ADDRESS || ''}
            onChange={(e) => handleChange('ADDRESS', e.target.value)}
          />
        </div>
        <div style={{ gridColumn: "1 / span 2" }}>
            <label htmlFor="file-upload" className="file-upload-label1">
                Upload profile picture
            </label>
            <input
                id="file-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                    setFormData(prev => ({
                    ...prev,
                    IMAGE_FILE: file,
                    PREVIEW_URL: URL.createObjectURL(file)
                    }));
                }
                }}
            />
            </div>
      </div>
      <button type="submit" className="edit-profile-btn" style={{ marginTop: "1rem" }}>
        Save
      </button>
    </form>
  );
};

export default ProfileTab;