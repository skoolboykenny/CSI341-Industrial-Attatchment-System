import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SupervisorLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (message.text) setMessage({ text: '', type: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/login-supervisor/',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Login response:', response.data); // Debug log

      if (response.status === 200) {
        // Store authentication tokens/user data
        localStorage.setItem('supervisor_token', response.data.token);
        localStorage.setItem('supervisor_id', response.data.user.id);
        localStorage.setItem('supervisor_email', response.data.user.email);
        
        setMessage({
          text: 'Login successful! Redirecting...',
          type: 'success'
        });
        
        setTimeout(() => {
          navigate("/supervisor/dashboard");
        }, 1500);
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      
      if (error.response) {
        // Handle Django authentication errors
        if (error.response.status === 401) {
          setMessage({
            text: 'Invalid email or password',
            type: 'error'
          });
        } else {
          setMessage({
            text: error.response.data.detail || 'Login failed',
            type: 'error'
          });
        }
      } else {
        setMessage({
          text: 'Network error. Please try again.',
          type: 'error'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <Link to="/" style={styles.logoLink}>
        <img src="/UBlogo.png" alt="UB Logo" style={styles.logo} />
      </Link>

      <div style={styles.overlay}>
        <div style={styles.container}>
          <h2 style={styles.title}>Supervisor Login</h2>
          
          {message.text && (
            <p style={{
              ...styles.message,
              color: message.type === 'success' ? '#4CAF50' : '#f44336'
            }}>
              {message.text}
            </p>
          )}
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
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
            <button
              type="submit"
              style={styles.button}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div style={styles.registerLinkContainer}>
            <p style={styles.registerLinkText}>
              Don't have an account?{' '}
              <Link to="/supervisor/register" style={styles.registerLink}>
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Keep all your existing styles exactly as they were
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

export default SupervisorLogin;