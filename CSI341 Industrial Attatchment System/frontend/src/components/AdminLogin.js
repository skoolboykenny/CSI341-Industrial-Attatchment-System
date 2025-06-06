import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post(
        'http://localhost:8000/api/admin/login/',
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      setMessage(response.data.message);
      localStorage.setItem('admin_id', response.data.admin_id);
      localStorage.setItem('admin_email', response.data.email);
      navigate('/admin/dashboard');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={styles.page}>
      <Link to="/" style={styles.logoLink}>
        <img src="/UBlogo.png" alt="UB Logo" style={styles.logo} />
      </Link>

      <div style={styles.overlay}>
        <div style={styles.container}>
          <h2 style={styles.header}>Admin Login</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              style={styles.input}
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Login</button>
          </form>
          {message && <p style={styles.message}>{message}</p>}
          <p style={styles.linkText}>
            Don't have an account? <Link to="/admin/register" style={styles.link}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    backgroundImage: "url('/247.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    position: "relative",
  },
  overlay: {
    backdropFilter: "blur(8px)",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoLink: {
    position: "absolute",
    top: "20px",
    left: "20px",
    zIndex: 2,
  },
  logo: {
    width: "80px",
    height: "auto",
  },
  container: {
    width: "400px",
    padding: "30px",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
    color: "#fff",
    zIndex: 2,
  },
  header: {
    marginBottom: "20px",
    color: "#fff",
    fontSize: "1.8rem",
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
    marginTop: "10px",
  },
  message: {
    marginTop: "15px",
    color: "#f0f0f0",
  },
  linkText: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#ccc",
  },
  link: {
    color: "#00bfff",
    textDecoration: "underline",
  },
};

export default AdminLogin;
