import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const EditOrganisationPreference = () => {
  const { orgId } = useParams();
  const organisationId = orgId || localStorage.getItem("organisation_id") || "";

  const [formData, setFormData] = useState({
    organisation: organisationId,
    pref_education_level: "",
    positions_available: "",
    start_date: "",
    end_date: "",
    preferred_fields: "",
    required_skills: "",
  });
  const [prefId, setPrefId] = useState(null);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [skillOptions, setSkillOptions] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/api/industries/")
      .then((res) => setIndustryOptions(res.data))
      .catch((error) => {
        console.error("Error fetching industries:", error);
        setIndustryOptions([]);
      });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8000/api/skills/")
      .then((res) => setSkillOptions(res.data))
      .catch((error) => {
        console.error("Error fetching skills:", error);
        setSkillOptions([]);
      });
  }, []);

  useEffect(() => {
    if (!organisationId) return;
    axios.get(`http://localhost:8000/api/organisation/${organisationId}/preferences/`)
      .then((response) => {
        const prefs = Array.isArray(response.data) ? response.data : [response.data];
        if (prefs.length > 0) {
          const existingPref = prefs[0];
          setPrefId(existingPref.pref_id);
          setFormData({
            organisation: organisationId,
            pref_education_level: existingPref.pref_education_level,
            positions_available: existingPref.positions_available,
            start_date: existingPref.start_date,
            end_date: existingPref.end_date,
            preferred_fields: existingPref.preferred_fields && existingPref.preferred_fields.length > 0
              ? existingPref.preferred_fields[0]
              : "",
            required_skills: existingPref.required_skills && existingPref.required_skills.length > 0
              ? existingPref.required_skills[0]
              : "",
          });
        } else {
          setMessage("No existing preference found. Please submit your preferences first.");
        }
      })
      .catch((error) => {
        console.error("Error fetching organisation preference:", error);
        setMessage("Error fetching organisation preference data.");
      });
  }, [organisationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prefId) {
      setMessage("No existing preference found. Please submit your preferences first.");
      return;
    }

    const payload = {
      ...formData,
      preferred_fields: formData.preferred_fields ? [formData.preferred_fields] : [],
      required_skills: formData.required_skills ? [formData.required_skills] : [],
    };

    try {
      await axios.put(
        `http://localhost:8000/api/organisation-preference/${prefId}/`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      setMessage("Preference updated successfully!");
    } catch (err) {
      console.error("Error updating organisation preference:", err);
      setMessage(err.response?.data?.error || "Server error. Try again later.");
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.bgContainer}>
        <img
          src="/eng.jpg"
          alt="Background"
          style={styles.bgImage}
        />
      </div>
      <Link to="/organisation-dashboard" style={styles.dashboardBtn}>Dashboard</Link>
      <div style={styles.container}>
        <h2 style={{ color: "white" }}>Edit Organisation Preference</h2>
        {message && <p style={styles.message}>{message}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="pref_education_level"
            placeholder="Preferred Education Level"
            value={formData.pref_education_level}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            name="positions_available"
            placeholder="Positions Available"
            type="number"
            value={formData.positions_available}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <label style={styles.label}>Start Date:</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <label style={styles.label}>End Date:</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <h4 style={styles.label}>Select Preferred Field (Industry):</h4>
          <select
            name="preferred_fields"
            value={formData.preferred_fields}
            onChange={handleSelectChange}
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
          <h4 style={styles.label}>Select Required Skill:</h4>
          <select
            name="required_skills"
            value={formData.required_skills}
            onChange={handleSelectChange}
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
          <button type="submit" style={styles.button}>Update Preference</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    position: "relative",
    minHeight: "100vh",
    padding: "40px",
  },
  bgContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  bgImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: "blur(5px)", // Apply blur only to the background image
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
    maxWidth: "500px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    color: "white",
    position: "relative", // To ensure it sits on top of the background
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
  message: {
    marginTop: "10px",
    color: "#ffc107",
  },
  label: {
    color: "white",
    marginBottom: "-10px",
  },
};

export default EditOrganisationPreference;
