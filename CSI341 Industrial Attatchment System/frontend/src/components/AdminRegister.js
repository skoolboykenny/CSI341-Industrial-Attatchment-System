import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8000/api/admin/register/',
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setMessage(response.data.message || 'Admin registered successfully!');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div style={styles.page}>
      <Link to="/" style={styles.logoLink}>
        <img src="/UBlogo.png" alt="UB Logo" style={styles.logo} />
      </Link>

      <div style={styles.overlay}>
        <div style={styles.container}>
          <h2 style={styles.header}>Admin Registration</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Register</button>
          </form>
          {message && <p style={styles.message}>{message}</p>}
          <p style={styles.linkText}>
            Already have an account? <Link to="/admin/login" style={styles.link}>Login here</Link>
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
    width: '400px',
    padding: '30px',
    textAlign: 'center',
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.3)',
    color: '#fff',
    zIndex: 2,
  },
  header: {
    marginBottom: '20px',
    color: '#fff',
    fontSize: "1.8rem",
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  message: {
    marginTop: '15px',
    color: '#f0f0f0',
  },
  linkText: {
    marginTop: '15px',
    fontSize: '14px',
    color: '#ccc',
  },
  link: {
    color: '#00bfff',
    textDecoration: 'underline',
  },
};

export default AdminRegister;
