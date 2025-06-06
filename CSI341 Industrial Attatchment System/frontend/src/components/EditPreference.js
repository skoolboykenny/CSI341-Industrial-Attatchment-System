import React, { useState, useEffect } from "react";
import axios from "axios";

const EditPreference = () => {
  const studentId = localStorage.getItem("student_id") || "";
  const [formData, setFormData] = useState({
    student_id: studentId,
    pref_location: "",
    available_from: "",
    available_to: "",
    preferred_industry: "", // single-select: expects an industry id
    desired_skill: "",      // single-select: expects a skill id
  });
  const [preferenceId, setPreferenceId] = useState(null);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [skillOptions, setSkillOptions] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch industry options
  useEffect(() => {
    axios.get("http://localhost:8000/api/industries/")
      .then((res) => setIndustryOptions(res.data))
      .catch(() => setIndustryOptions([]));
  }, []);

  // Fetch skill options
  useEffect(() => {
    axios.get("http://localhost:8000/api/skills/")
      .then((res) => setSkillOptions(res.data))
      .catch(() => setSkillOptions([]));
  }, []);

  // Fetch the current student's preference if it exists.
  useEffect(() => {
    if (!studentId) return;
    axios.get("http://localhost:8000/api/student-preferences/")
      .then((response) => {
        let prefs = response.data;
        if (!Array.isArray(prefs)) {
          prefs = [prefs];
        }
        console.log("Fetched student preferences:", prefs);
        const existingPref = prefs.find(
            (pref) =>
              pref.student === studentId ||
              pref.student_id === studentId ||
              (pref.student?.student_id === studentId)
          );
        if (existingPref) {
          setPreferenceId(existingPref.student_pref_id || existingPref.id);
          setFormData({
            student_id: studentId,
            pref_location: existingPref.pref_location,
            available_from: existingPref.available_from,
            available_to: existingPref.available_to,
            preferred_industry: existingPref.preferred_industry || "",
            desired_skill: existingPref.desired_skill || ""
          });
        } else {
          setMessage("No existing preferences found. Please submit your preferences.");
        }
      })
      .catch((error) => {
        console.error("Error fetching preference", error);
        setMessage("Error fetching preference data.");
      });
  }, [studentId]);

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Check if this cookie string begins with the name we want.
        if (cookie.substring(0, name.length + 1) === (name + "=")) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  // Handle text and date inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // For single-select dropdowns, onChange is handled like a text input.
  // (No need for multi-select logic in this case.)
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!preferenceId) {
      setMessage("No existing preference found. Please submit your preferences first.");
      return;
    }
    try {
        const csrftoken = getCookie("csrftoken");

        await axios.put(
          `http://localhost:8000/api/student-preference/${preferenceId}/`,
          formData,
          { headers: { "Content-Type": "application/json", "X-CSRFToken": csrftoken } }
        );
      setMessage("Preferences updated successfully!");
    } catch (err) {
      console.error("Error updating preferences:", err);
      setMessage(err.response?.data?.error || "Server error. Try again later.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Edit Preferences</h2>
      {message && <p style={styles.message}>{message}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="pref_location"
          placeholder="Preferred Location"
          value={formData.pref_location}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <label>Available From:</label>
        <input
          type="date"
          name="available_from"
          value={formData.available_from}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <label>Available To:</label>
        <input
          type="date"
          name="available_to"
          value={formData.available_to}
          onChange={handleChange}
          required
          style={styles.input}
        />
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
        <button type="submit" style={styles.button}>Update Preferences</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    width: "500px",
    margin: "30px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
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
    color: "#333",
  },
};

export default EditPreference;