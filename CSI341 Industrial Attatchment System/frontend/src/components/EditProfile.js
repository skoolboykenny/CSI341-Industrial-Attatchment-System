import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    student_email: '',
    student_contact_number: '',
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const navigate = useNavigate();
  const student_id = localStorage.getItem("student_id");

  useEffect(() => {
    if (!student_id) {
      alert("No student ID found. Redirecting to login.");
      navigate("/login");
      return;
    }

    axios.get(`http://127.0.0.1:8000/api/update_student_profile/${student_id}/`)
      .then(response => {
        setFormData(response.data);
      })
      .catch(() => {
        alert("Failed to load profile data.");
      });
  }, [navigate, student_id]);

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
      const res = await axios.put(
        `http://127.0.0.1:8000/api/update_student_profile/${student_id}/`,
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      alert("Profile updated successfully");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.new_password !== passwordData.confirm_password) {
      alert("New password and confirmation do not match.");
      return;
    }

    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/change-password/${student_id}/`,
        passwordData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      alert("Password changed successfully");
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      console.error("Password change error:", err);
      alert("Failed to change password.");
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.blurOverlay} />

      <button onClick={() => navigate("/dashboard")} style={styles.dashboardButton}>
        Dashboard
      </button>

      <div style={styles.container}>
        <h3 style={styles.header}>Edit Profile</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" style={styles.input} />
          <input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" style={styles.input} />
          <input name="student_email" value={formData.student_email} onChange={handleChange} placeholder="Email" style={styles.input} />
          <input name="student_contact_number" value={formData.student_contact_number} onChange={handleChange} placeholder="Contact Number" style={styles.input} />
          <button type="submit" style={styles.button}>Save Changes</button>
        </form>

        <h3 style={{ ...styles.header, marginTop: '30px' }}>Change Password</h3>
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
  background: {
    position: "relative",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
  },
  blurOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    backgroundImage: 'url("/HomePic2.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "blur(8px)",
    zIndex: -1,
  },
  dashboardButton: {
    position: "absolute",
    top: "20px",
    left: "20px",
    backgroundColor: "#1D5D9B",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    fontSize: "14px",
    cursor: "pointer",
    zIndex: 2,
  },
  container: {
    width: "400px",
    margin: "60px auto",
    padding: "30px",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.4)",
    color: "white",
    zIndex: 1,
    position: "relative",
  },
  header: {
    color: "white",
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

export default EditProfile;
