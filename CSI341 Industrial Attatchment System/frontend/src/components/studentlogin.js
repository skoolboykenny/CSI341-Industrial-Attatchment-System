import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const StudentLogin = () => {
  const [formData, setFormData] = useState({
    student_id: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/student/", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setMessage(response.data.message);

      if (response.status === 200) {
        localStorage.setItem("student_id", formData.student_id);
        navigate("/dashboard");
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "Invalid Student ID or Password.");
    }
  };

  return (
    <div style={styles.page}>
      {/* UB logo that links to home */}
      <Link to="/" style={styles.logoLink}>
        <img src="/UBlogo.png" alt="UB Logo" style={styles.logo} />
      </Link>

      {/* Overlay for blur and dark background */}
      <div style={styles.overlay}>
        <div style={styles.container}>
          <h2 style={styles.title}>Student Login</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              name="student_id"
              placeholder="Student ID"
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              name="password"
              placeholder="Password"
              type="password"
              onChange={handleChange}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Login</button>
          </form>
          {message && <p style={styles.message}>{message}</p>}
          <p style={styles.linkText}>
            Don't have an account? <Link to="/register" style={styles.link}>Register here</Link>
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
    width: "400px",
    padding: "30px",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
    color: "#fff",
    zIndex: 2,
  },
  title: {
    color: "#fff",
    marginBottom: "20px",
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
    color: "#4dafff",
    textDecoration: "none",
  },
};

export default StudentLogin;


