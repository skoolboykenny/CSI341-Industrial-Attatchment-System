import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LogbookForm = () => {
  // Get student id from localStorage
  const storedStudentId = localStorage.getItem("student_id") || '';
  const navigate = useNavigate();

  // Initialize formData with the stored student id so it's preset in the form
  const [formData, setFormData] = useState({
    student_id: storedStudentId,
    org_name: '',
    week_number: '',
    log_entry: '',
  });
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear individual field error on change
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setFieldErrors({});

    // Check that log_entry does not exceed 300 words
    const logEntryWords = formData.log_entry.trim().split(/\s+/);
    if (logEntryWords.length > 300) {
      setFieldErrors((prev) => ({
        ...prev,
        log_entry: 'Log book entry must not exceed 300 words.',
      }));
      setMessage('Submission failed. Please fix the highlighted errors below.');
      return;
    }

    try {
      // First, fetch the org_id using org_name.
      const orgRes = await fetch(
        `http://127.0.0.1:8000/api/get-org-id-by-name/?name=${formData.org_name}`
      );
      const orgData = await orgRes.json();

      if (!orgRes.ok || !orgData.org_id) {
        setFieldErrors((prev) => ({
          ...prev,
          org_name: 'Organisation not found.',
        }));
        setMessage('Submission failed. Please fix the highlighted errors below.');
        return;
      }

      const payload = {
        student_id: formData.student_id,
        org_id: orgData.org_id,
        week_number: formData.week_number,
        log_entry: formData.log_entry,
      };

      const response = await fetch("http://127.0.0.1:8000/api/logbook/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Logbook entry submitted successfully!');
        setFormData({
          student_id: storedStudentId, // keep the student id the same
          org_name: '',
          week_number: '',
          log_entry: '',
        });
      } else {
        // Process field-specific errors if provided by the backend
        const rawErrors = data;
        const flatErrors = {};

        Object.keys(rawErrors).forEach((key) => {
          if (key === '__all__') {
            // For generic errors, assign them to a specific field (example: log_entry)
            flatErrors['log_entry'] = rawErrors[key][0];
          } else {
            flatErrors[key] = Array.isArray(rawErrors[key])
              ? rawErrors[key][0]
              : rawErrors[key];
          }
        });

        setFieldErrors(flatErrors);
        setMessage('Submission failed. Please fix the highlighted errors below.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}></div> {/* This is the overlay with the blur */}
      <button
        onClick={() => navigate("/organisation-dashboard")}
        style={styles.dashboardBtn}
      >
        Dashboard
      </button>
      <div style={styles.container}>
        <h2 style={styles.title}>Logbook Entry</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
            placeholder="Student ID"
            style={{ ...styles.input, backgroundColor: '#e0e0e0' }} // greyed out style
            readOnly
            required
          />
          {fieldErrors.student_id && <p style={styles.error}>{fieldErrors.student_id}</p>}

          <input
            type="text"
            name="org_name"
            value={formData.org_name}
            onChange={handleChange}
            placeholder="Organisation Name"
            style={styles.input}
            required
          />
          {fieldErrors.org_name && <p style={styles.error}>{fieldErrors.org_name}</p>}

          <input
            type="number"
            name="week_number"
            value={formData.week_number}
            onChange={handleChange}
            placeholder="Week Number"
            style={styles.input}
            required
          />
          {fieldErrors.week_number && <p style={styles.error}>{fieldErrors.week_number}</p>}

          <textarea
            name="log_entry"
            value={formData.log_entry}
            onChange={handleChange}
            placeholder="Log Entry"
            style={styles.textarea}
            required
          />
          {fieldErrors.log_entry && <p style={styles.error}>{fieldErrors.log_entry}</p>}

          <button type="submit" style={styles.button}>Submit</button>
          {message && <p style={styles.message}>{message}</p>}
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    backgroundImage: "url('/HomePic3.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    position: "relative",
  },
  overlay: {
    backdropFilter: "blur(8px)", // Apply blur effect
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent dark overlay
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
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
    maxWidth: '500px',
    margin: '2rem auto',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 0 15px rgba(0,0,0,0.1)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent black background
    position: 'relative',
    zIndex: 2, // Ensure content is above the overlay
  },
  title: {
    textAlign: 'center',
    marginBottom: '1rem',
    fontSize: '1.5rem',
    color: 'white',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  textarea: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    minHeight: '100px',
  },
  button: {
    padding: '0.6rem',
    fontSize: '1rem',
    borderRadius: '6px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  message: {
    textAlign: 'center',
    marginTop: '1rem',
    color: '#4f86d9',
  },
  error: {
    color: 'red',
    fontSize: '0.9rem',
    margin: 0,
  },
};

export default LogbookForm;
