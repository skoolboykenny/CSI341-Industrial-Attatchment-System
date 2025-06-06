import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SupervisorRegister = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setFieldErrors({});
    setIsSubmitting(true);

    // Basic validation
    if (formData.password !== formData.confirm_password) {
      setFieldErrors({ confirm_password: "Passwords don't match" });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/register-supervisor/',
        {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
        }
      );

      if (response.status === 201) {
        setMessage('✅ Registration successful! Redirecting to login...');
        setTimeout(() => navigate("/supervisor/login"), 1500);
      }
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      
      if (error.response?.data) {
        const rawErrors = error.response.data;
        const flatErrors = {};

        Object.keys(rawErrors).forEach((key) => {
          flatErrors[key] = Array.isArray(rawErrors[key])
            ? rawErrors[key][0]
            : rawErrors[key];
        });

        setFieldErrors(flatErrors);
        setMessage('❌ Registration failed. Please fix the errors below.');
      } else {
        setMessage('❌ Registration failed. Please try again later.');
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
          <h2 style={styles.title}>Supervisor Registration</h2>
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="First Name"
              style={styles.input}
              required
            />
            {fieldErrors.first_name && <p style={styles.error}>{fieldErrors.first_name}</p>}

            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Last Name"
              style={styles.input}
              required
            />
            {fieldErrors.last_name && <p style={styles.error}>{fieldErrors.last_name}</p>}

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              style={styles.input}
              required
            />
            {fieldErrors.email && <p style={styles.error}>{fieldErrors.email}</p>}

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              style={styles.input}
              required
            />
            {fieldErrors.password && <p style={styles.error}>{fieldErrors.password}</p>}

            <input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              placeholder="Confirm Password"
              style={styles.input}
              required
            />
            {fieldErrors.confirm_password && <p style={styles.error}>{fieldErrors.confirm_password}</p>}

            <button 
              type="submit" 
              style={styles.button}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
            
            {message && <p style={styles.message}>{message}</p>}
          </form>
          
          <div style={styles.registerLinkContainer}>
            <p style={styles.registerLinkText}>
              Already have an account?{' '}
              <Link to="/supervisor/login" style={styles.registerLink}>
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Keep all your existing styles and add error style
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
  error: {
    color: '#ff6b6b',
    fontSize: '14px',
    margin: '-10px 0 5px 0',
    textAlign: 'left',
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

export default SupervisorRegister;