import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditOrganisationProfile = () => {
  const [formData, setFormData] = useState({
    org_name: '',
    contact_email: '',
    contact_number: '',
    address: ''
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const navigate = useNavigate();
  const orgId = localStorage.getItem("organisation_id");

  useEffect(() => {
    if (!orgId) {
      alert("No organisation ID found. Redirecting to login.");
      navigate("/login-organisation");
      return;
    }

    axios.get(`http://127.0.0.1:8000/api/update_organisation_profile/${orgId}/`)
      .then(res => setFormData(res.data))
      .catch(() => alert("Failed to load organisation data."));
  }, [navigate, orgId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/api/update_organisation_profile/${orgId}/`, formData);
      alert("Organisation profile updated successfully!");
      navigate("/organisation-dashboard");
    } catch (err) {
      alert("Update failed.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert("New passwords do not match.");
      return;
    }

    try {
      await axios.post(`http://127.0.0.1:8000/api/change-organisation-password/${orgId}/`, passwordData);
      alert("Password changed successfully.");
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      alert("Password change failed.");
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.bgContainer}>
        <img
          src="/HomePic4.jpg"
          alt="Background"
          style={styles.bgImage}
        />
      </div>
      <button
        onClick={() => navigate("/organisation-dashboard")}
        style={styles.dashboardBtn}
      >
        Dashboard
      </button>
      <div style={styles.container}>
        <h3>Edit Organisation Profile</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input name="org_name" value={formData.org_name} onChange={handleChange} placeholder="Organisation Name" style={styles.input} />
          <input name="contact_email" value={formData.contact_email} onChange={handleChange} placeholder="Email" style={styles.input} />
          <input name="contact_number" value={formData.contact_number} onChange={handleChange} placeholder="Contact Number" style={styles.input} />
          <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" style={styles.input} />
          <button type="submit" style={styles.button}>Save Changes</button>
        </form>

        <h3 style={{ marginTop: '30px' }}>Change Password</h3>
        <form onSubmit={handleChangePassword} style={styles.form}>
          <input type="password" name="current_password" value={passwordData.current_password} onChange={handlePasswordChange} placeholder="Current Password" style={styles.input} />
          <input type="password" name="new_password" value={passwordData.new_password} onChange={handlePasswordChange} placeholder="New Password" style={styles.input} />
          <input type="password" name="confirm_password" value={passwordData.confirm_password} onChange={handlePasswordChange} placeholder="Confirm New Password" style={styles.input} />
          <button type="submit" style={styles.button}>Change Password</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    position: "relative",
    minHeight: "100vh",
    padding: "40px",
  },
  bgContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  bgImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: "blur(5px)", // Apply blur only to the background image
  },
  dashboardBtn: {
    position: "absolute",
    top: "20px",
    left: "20px",
    backgroundColor: "#1D5D9B",
    padding: "10px 15px",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#333",
    fontWeight: "bold",
    zIndex: 1,
  },
  container: {
    maxWidth: "400px",
    margin: "0 auto",
    padding: "30px",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: "10px",
    color: "white",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    position: "relative", // To ensure it sits on top of the background
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default EditOrganisationProfile;
