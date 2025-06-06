import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const OrganisationLogin = () => {
  const [formData, setFormData] = useState({
    contact_email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login-organisation/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Login successful!');
        localStorage.setItem("organisation_id", data.organisation_id);
        localStorage.setItem("contact_email", formData.contact_email);
        navigate("/organisation-dashboard");
      } else {
        setMessage(data.error || 'Login failed');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div style={styles.page}>
      <Link to="/" style={styles.logoLink}>
        <img src="/UBlogo.png" alt="UB Logo" style={styles.logo} />
      </Link>

      <div style={styles.overlay}>
        <div style={styles.container}>
          <h2 style={styles.title}>Organisation Login</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="email"
              name="contact_email"
              value={formData.contact_email}
              onChange={handleChange}
              placeholder="Contact Email"
              style={styles.input}
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              style={styles.input}
              required
            />
            <button type="submit" style={styles.button}>Login</button>
            {message && <p style={styles.message}>{message}</p>}
          </form>
          <div style={styles.registerLinkContainer}>
            <p style={styles.registerLinkText}>
              Don't have an account? <Link to="/register-organisation" style={styles.registerLink}>Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    backgroundImage: "url('/businessblock.jpg')",
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.3)',
    color: '#fff',
    zIndex: 2,
  },
  title: {
    color: '#fff',
    marginBottom: '20px',
    fontSize: '1.8rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
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
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  message: {
    marginTop: '15px',
    color: '#f0f0f0',
  },
  registerLinkContainer: {
    marginTop: '15px',
  },
  registerLinkText: {
    fontSize: '14px',
    color: '#ccc',
  },
  registerLink: {
    color: '#00bfff',
    textDecoration: 'underline',
  }
};

export default OrganisationLogin;
