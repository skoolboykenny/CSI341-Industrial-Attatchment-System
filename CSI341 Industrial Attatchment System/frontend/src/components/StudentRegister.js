import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    year_of_study: '',
    student_email: '',
    student_contact_number: '',
    password: ''
  });
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register/student/", formData);
      setMessage(response.data.message);
      setFieldErrors({});
    } catch (error) {
      if (error.response && error.response.data) {
        const rawErrors = error.response.data;
        const flatErrors = {};
        Object.keys(rawErrors).forEach((key) => {
          flatErrors[key] = Array.isArray(rawErrors[key]) ? rawErrors[key][0] : rawErrors[key];
        });
        setFieldErrors(flatErrors);
      } else {
        setMessage("Something went wrong.");
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
          <h2 style={styles.title}>Student Registration</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input name="student_id" placeholder="Student ID" onChange={handleChange} required style={styles.input} />
            {fieldErrors.student_id && <p style={styles.error}>{fieldErrors.student_id}</p>}

            <input name="first_name" placeholder="First Name" onChange={handleChange} required style={styles.input} />
            {fieldErrors.first_name && <p style={styles.error}>{fieldErrors.first_name}</p>}

            <input name="last_name" placeholder="Last Name" onChange={handleChange} required style={styles.input} />
            {fieldErrors.last_name && <p style={styles.error}>{fieldErrors.last_name}</p>}

            <input name="year_of_study" placeholder="Year of Study" type="number" onChange={handleChange} required style={styles.input} />
            {fieldErrors.year_of_study && <p style={styles.error}>{fieldErrors.year_of_study}</p>}

            <input name="student_email" placeholder="Email" type="email" onChange={handleChange} required style={styles.input} />
            {fieldErrors.student_email && <p style={styles.error}>{fieldErrors.student_email}</p>}

            <input name="student_contact_number" placeholder="Phone Number" onChange={handleChange} required style={styles.input} />
            {fieldErrors.student_contact_number && <p style={styles.error}>{fieldErrors.student_contact_number}</p>}

            <input name="password" placeholder="Password" type="password" onChange={handleChange} required style={styles.input} />
            {fieldErrors.password && <p style={styles.error}>{fieldErrors.password}</p>}

            <button type="submit" style={styles.button}>Register</button>
          </form>
          {message && <p style={styles.message}>{message}</p>}

          {/* 🚀 Just this link added below! */}
          <p style={styles.loginLink}>
            Already have an account?{" "}
            <Link to="/login" style={styles.loginAnchor}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    backgroundImage: "url('/StudentLoginPic.jpg')",
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
  error: {
    color: 'red',
    fontSize: '14px',
    margin: '0',
    textAlign: 'left',
    paddingLeft: '10px',
  },
  loginLink: {
    marginTop: '15px',
    fontSize: '14px',
    color: '#ccc',
  },
  loginAnchor: {
    color: '#00bfff',
    textDecoration: 'underline',
  }
};

export default StudentRegister;
