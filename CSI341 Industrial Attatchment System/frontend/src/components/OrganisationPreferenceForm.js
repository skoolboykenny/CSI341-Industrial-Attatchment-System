import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const OrganisationPreferenceForm = () => {
  const { orgId } = useParams();
  const navigate = useNavigate();

  // Compute organisationId from URL or localStorage
  const organisationId = orgId || localStorage.getItem("organisation_id");

  const [formData, setFormData] = useState({
    pref_education_level: "",
    positions_available: "",
    start_date: "",
    end_date: "",
    preferred_field: "", // This will store the industry ID
    required_skill: "",
  });

  const [industryOptions, setIndustryOptions] = useState([]);
  const [skills, setSkills] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!organisationId) {
      setErrorMessage("No organisation ID found. Redirecting to login...");
      setTimeout(() => navigate("/login-organisation"), 2000);
      return;
    }

    // Update localStorage if the URL orgId differs
    if (orgId && localStorage.getItem("organisation_id") !== orgId) {
      localStorage.setItem("organisation_id", orgId);
    }

    // Fetch industry options from the backend
    axios
      .get("http://localhost:8000/api/industries/")
      .then((res) => setIndustryOptions(res.data))
      .catch(() => setIndustryOptions([]));

    // Fetch skills from the backend
    axios
      .get("http://localhost:8000/api/skills/")
      .then((res) => setSkills(res.data))
      .catch(() => setSkills([]));

    setLoading(false);
  }, [orgId, navigate, organisationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Update form data
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear individual field error on change
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    // Clear general error message if present
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear any old messages and errors
    setErrorMessage("");
    setFieldErrors({});

    if (!organisationId) {
      setErrorMessage("Invalid organisation session. Please login again.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8000/api/organisation/${organisationId}/preferences/create/`,
        {
          ...formData,
          organisation: parseInt(organisationId),
          // Submit preferred field and required skills as arrays
          preferred_fields: [formData.preferred_field],
          required_skills: [formData.required_skill],
        },
        { headers: { "Content-Type": "application/json" } }
      );
      navigate("/organisation-dashboard");
    } catch (error) {
      if (error.response && error.response.data) {
        const rawErrors = error.response.data;
        const flatErrors = {};
    
        Object.keys(rawErrors).forEach((key) => {
          if (key === "__all__") {
            const errMsg = rawErrors[key][0];
            // Check if the error message includes a phrase that indicates date problems
            if (errMsg.includes("Start Date must be before End Date")) {
              flatErrors["start_date"] = errMsg;
              flatErrors["end_date"] = errMsg;
            } else if (errMsg.includes("Start date cannot be in the past")) {
              flatErrors["start_date"] = errMsg;
            } else {
              flatErrors["form"] = errMsg;
            }
          } else {
            flatErrors[key] = Array.isArray(rawErrors[key])
              ? rawErrors[key][0]
              : rawErrors[key];
          }
        });
        setFieldErrors(flatErrors);
        setErrorMessage("Submission failed. Please fix the highlighted errors below.");
      } else {
        setErrorMessage("Submission failed");
      }
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h2>Create Organisation Preference</h2>
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Read-only Organisation ID field */}
        <input
          type="text"
          name="organisation_id"
          value={organisationId}
          readOnly
          style={{ ...styles.input, backgroundColor: "#e0e0e0" }}
        />
        <input
          name="pref_education_level"
          placeholder="Preferred Education Level"
          value={formData.pref_education_level}
          onChange={handleChange}
          required
          style={styles.input}
        />
        {fieldErrors.pref_education_level && (
          <p style={styles.error}>{fieldErrors.pref_education_level}</p>
        )}
        <input
          name="positions_available"
          type="number"
          placeholder="Positions Available"
          value={formData.positions_available}
          onChange={handleChange}
          required
          style={styles.input}
        />
        {fieldErrors.positions_available && (
          <p style={styles.error}>{fieldErrors.positions_available}</p>
        )}
        <div>
          <label>Start Date</label>
          <input
            name="start_date"
            type="date"
            value={formData.start_date}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        {fieldErrors.start_date && <p style={styles.error}>{fieldErrors.start_date}</p>}
        <div>
          <label>End Date</label>
          <input
            name="end_date"
            type="date"
            value={formData.end_date}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        {fieldErrors.end_date && <p style={styles.error}>{fieldErrors.end_date}</p>}
        {/* Dropdown for Preferred Industry */}
        <select
          name="preferred_field"
          value={formData.preferred_field}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Select Preferred Industry</option>
          {industryOptions.map((industry) => (
            <option key={industry.industry_id} value={industry.industry_id}>
              {industry.industry_name}
            </option>
          ))}
        </select>
        {fieldErrors.preferred_field && (
          <p style={styles.error}>{fieldErrors.preferred_field}</p>
        )}
        {/* Dropdown for Required Skills */}
        <select
          name="required_skill"
          value={formData.required_skill}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Select Required Skill</option>
          {skills.map((skill) => (
            <option key={skill.skill_id} value={skill.skill_id}>
              {skill.name}
            </option>
          ))}
        </select>
        {fieldErrors.required_skill && (
          <p style={styles.error}>{fieldErrors.required_skill}</p>
        )}
        <button type="submit" style={styles.button}>Submit</button>
        {fieldErrors.form && <p style={styles.error}>{fieldErrors.form}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "25px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  loading: {
    textAlign: "center",
    padding: "20px",
    fontSize: "18px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  error: {
    color: "#d32f2f",
    backgroundColor: "#fde8e8",
    padding: "10px",
    borderRadius: "5px",
    textAlign: "center",
  },
};

export default OrganisationPreferenceForm;