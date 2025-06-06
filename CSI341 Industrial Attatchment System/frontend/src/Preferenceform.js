import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentPreferenceForm = () => {
  const studentId = localStorage.getItem("student_id") || "";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    student_id: studentId,
    pref_location: "",
    available_from: "",
    available_to: "",
    preferred_industry: "",
    desired_skill: "",
  });

  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [industryOptions, setIndustryOptions] = useState([]);
  const [skillOptions, setSkillOptions] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/industries/")
      .then((res) => setIndustryOptions(res.data))
      .catch(() => setIndustryOptions([]));

    axios
      .get("http://localhost:8000/api/skills/")
      .then((res) => setSkillOptions(res.data))
      .catch(() => setSkillOptions([]));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setFieldErrors({});

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/student-preference/",
        formData
      );

      setMessage("Preferences submitted successfully!");
      setFormData({
        student_id: studentId,
        pref_location: "",
        available_from: "",
        available_to: "",
        preferred_industry: "",
        desired_skill: "",
      });
    } catch (err) {
      if (err.response?.data) {
        const rawErrors = err.response.data;
        const flatErrors = {};
        Object.keys(rawErrors).forEach((key) => {
          if (key === "__all__") {
            flatErrors["available_from"] = rawErrors[key][0];
          } else {
            flatErrors[key] = Array.isArray(rawErrors[key])
              ? rawErrors[key][0]
              : rawErrors[key];
          }
        });
        setFieldErrors(flatErrors);
      } else {
        setMessage("Server error. Try again later.");
      }
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.blurOverlay} />

      {/* Dashboard button in top-left */}
      <button
        onClick={() => navigate("/dashboard")}
        style={styles.dashboardButton}
      >
        Dashboard
      </button>

      <div style={styles.container}>
        <h2 style={styles.header}>Student Preference Form</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="pref_location"
            placeholder="Preferred Location"
            value={formData.pref_location}
            onChange={handleChange}
            required
            style={styles.input}
          />
          {fieldErrors.pref_location && (
            <p style={styles.error}>{fieldErrors.pref_location}</p>
          )}

          <label>Available From:</label>
          <input
            type="date"
            name="available_from"
            value={formData.available_from}
            onChange={handleChange}
            required
            style={styles.input}
          />
          {fieldErrors.available_from && (
            <p style={styles.error}>{fieldErrors.available_from}</p>
          )}

          <label>Available To:</label>
          <input
            type="date"
            name="available_to"
            value={formData.available_to}
            onChange={handleChange}
            required
            style={styles.input}
          />
          {fieldErrors.available_to && (
            <p style={styles.error}>{fieldErrors.available_to}</p>
          )}

          <h4>Select Preferred Industry:</h4>
          <select
            name="preferred_industry"
            value={formData.preferred_industry}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">Select Industry</option>
            {industryOptions.map((industry) => (
              <option key={industry.industry_id} value={industry.industry_id}>
                {industry.industry_name}
              </option>
            ))}
          </select>
          {fieldErrors.industries && (
            <p style={styles.error}>{fieldErrors.industries}</p>
          )}

          <h4>Select Desired Skill:</h4>
          <select
            name="desired_skill"
            value={formData.desired_skill}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">Select Skill</option>
            {skillOptions.map((skill) => (
              <option key={skill.skill_id} value={skill.skill_id}>
                {skill.name}
              </option>
            ))}
          </select>
          {fieldErrors.skills && (
            <p style={styles.error}>{fieldErrors.skills}</p>
          )}

          <button type="submit" style={styles.button}>
            Submit
          </button>
        </form>

        {message && (
          <p
            style={
              message.includes("successfully")
                ? styles.success
                : styles.errorMsg
            }
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

const styles = {
  background: {
    position: "relative",
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  blurOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    backgroundImage: 'url("/eng.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "blur(8px)",
    zIndex: -1,
  },
  container: {
    width: "500px",
    padding: "20px",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    color: "white",
    zIndex: 1,
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
    color: "white",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    fontSize: "16px",
    border: "1px solid #aaa",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
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
  error: {
    color: "red",
    margin: 0,
    fontSize: "14px",
    textAlign: "left",
  },
  success: {
    color: "lightgreen",
    fontSize: "16px",
    textAlign: "center",
  },
  errorMsg: {
    color: "red",
    fontSize: "16px",
    textAlign: "center",
  },
};

export default StudentPreferenceForm;


