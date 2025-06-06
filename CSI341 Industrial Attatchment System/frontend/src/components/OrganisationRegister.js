import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const OrganisationRegister = () => {
  const [formData, setFormData] = useState({
    org_name: '',
    industry: '',
    town: '',
    street: '',
    plot_number: '',
    contact_number: '',
    contact_email: '',
    password: '',
  });
  const [industries, setIndustries] = useState([]);
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    axios.get("http://localhost:8000/api/industries/")
      .then((res) => setIndustries(res.data))
      .catch(() => setIndustries([]));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setFieldErrors({});

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register-organisation/", formData);
      setMessage("✅ Organisation registered successfully!");
      setFormData({
        org_name: '',
        industry: '',
        town: '',
        street: '',
        plot_number: '',
        contact_number: '',
        contact_email: '',
        password: '',
      });
    } catch (error) {
      if (error.response && error.response.data) {
        const rawErrors = error.response.data;
        const flatErrors = {};

        Object.keys(rawErrors).forEach((key) => {
          if (key === '__all__') {
            flatErrors['org_name'] = rawErrors[key][0];
          } else {
            flatErrors[key] = Array.isArray(rawErrors[key])
              ? rawErrors[key][0]
              : rawErrors[key];
          }
        });
        setFieldErrors(flatErrors);
        setMessage("Registration failed. Please fix the highlighted errors below.");
      } else {
        setMessage("Registration failed.");
      }
    }
  };

  return (
    <div style={styles.page}>
      <Link to="/" style={styles.logoLink}>
        <img src="/UBlogo.png" alt="UB Logo" style={styles.logo} />
      </Link>

      <div style={styles.overlay}>
        <div style={styles.container}>
          <h2 style={styles.title}>Organisation Registration</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input name="org_name" placeholder="Organisation Name" onChange={handleChange} value={formData.org_name} required style={styles.input} />
            {fieldErrors.org_name && <p style={styles.error}>{fieldErrors.org_name}</p>}

            <select name="industry" onChange={handleChange} value={formData.industry} required style={styles.input}>
              <option value="">Select Industry</option>
              {industries.map((industry) => (
                <option key={industry.industry_id} value={industry.industry_id}>{industry.industry_name}</option>
              ))}
            </select>
            {fieldErrors.industry && <p style={styles.error}>{fieldErrors.industry}</p>}

            <input name="town" placeholder="Town" onChange={handleChange} value={formData.town} required style={styles.input} />
            {fieldErrors.town && <p style={styles.error}>{fieldErrors.town}</p>}

            <input name="street" placeholder="Street" onChange={handleChange} value={formData.street} required style={styles.input} />
            {fieldErrors.street && <p style={styles.error}>{fieldErrors.street}</p>}

            <input name="plot_number" placeholder="Plot Number" onChange={handleChange} value={formData.plot_number} required style={styles.input} />
            {fieldErrors.plot_number && <p style={styles.error}>{fieldErrors.plot_number}</p>}

            <input name="contact_number" placeholder="Contact Number" onChange={handleChange} value={formData.contact_number} required style={styles.input} />
            {fieldErrors.contact_number && <p style={styles.error}>{fieldErrors.contact_number}</p>}

            <input name="contact_email" type="email" placeholder="Contact Email" onChange={handleChange} value={formData.contact_email} required style={styles.input} />
            {fieldErrors.contact_email && <p style={styles.error}>{fieldErrors.contact_email}</p>}

            <input name="password" type="password" placeholder="Password" onChange={handleChange} value={formData.password} required style={styles.input} />
            {fieldErrors.password && <p style={styles.error}>{fieldErrors.password}</p>}

            <button type="submit" style={styles.button}>Register</button>
            {message && <p style={styles.message}>{message}</p>}
          </form>
          <div style={styles.registerLinkContainer}>
            <p style={styles.registerLinkText}>
              Already have an account? <Link to="/login-organisation" style={styles.registerLink}>Login here</Link>
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
  error: {
    color: 'red',
    fontSize: '14px',
    margin: 0,
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
  },
};

export default OrganisationRegister;
