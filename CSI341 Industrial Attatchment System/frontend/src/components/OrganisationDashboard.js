import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OrganisationDashboard = () => {
  const [organization, setOrganization] = useState(null);
  const [hasPreference, setHasPreference] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const orgEmail = localStorage.getItem("contact_email");
    const orgName = localStorage.getItem("org_name");
    const orgId = localStorage.getItem("organisation_id");

    if (!orgEmail || !orgId) {
      navigate("/login-organisation");
    } else {
      setOrganization({
        name: orgName || "Your Organisation",
        email: orgEmail,
      });

      axios
        .get(`http://localhost:8000/api/organisation/${orgId}/preferences/`)
        .then((res) => {
          setHasPreference(res.data.length > 0);
        })
        .catch((err) => {
          console.error("Error fetching org preferences:", err);
          setHasPreference(false);
        });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("contact_email");
    localStorage.removeItem("organisation_id");
    localStorage.removeItem("org_name");
    navigate("/login-organisation");
  };

  const handleSubmitPreference = () => {
    const orgId = localStorage.getItem("organisation_id");
    navigate(`/organisation/${orgId}/preferences/create`);
  };

  const goToEdit = () => {
    navigate("/organisation-preference/edit");
  };

  const goToEditProfile = () => {
    navigate("/organisation-profile/edit");
  };

  const viewLogbooks = () => {
    const orgId = localStorage.getItem("organisation_id");
    navigate(`/organisation/${orgId}/logbooks`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div style={styles.contentCard}>
            <h2 style={styles.cardTitle}>Announcements</h2>
            <p style={styles.paragraph}><strong>Welcome {organization?.name}!</strong></p>
            <p style={styles.paragraph}>Here you can manage preferences, view logbooks, and update your organisation profile.</p>
          </div>
        );
      case "preferences":
        return (
          <div style={styles.contentCard}>
            <h2 style={styles.cardTitle}>Preferences</h2>
            {hasPreference ? (
              <button
                style={{ ...styles.button, ...(hovered === "editPref" ? styles.hoverEffect : {}) }}
                onClick={goToEdit}
                onMouseEnter={() => setHovered("editPref")}
                onMouseLeave={() => setHovered(null)}
              >
                Edit Preferences
              </button>
            ) : (
              <button
                style={{ ...styles.button, ...(hovered === "submitPref" ? styles.hoverEffect : {}) }}
                onClick={handleSubmitPreference}
                onMouseEnter={() => setHovered("submitPref")}
                onMouseLeave={() => setHovered(null)}
              >
                Submit Preference
              </button>
            )}
          </div>
        );
      case "profile":
        return (
          <div style={styles.contentCard}>
            <h2 style={styles.cardTitle}>Profile</h2>
            <button
              style={{ ...styles.button, ...(hovered === "editProfile" ? styles.hoverEffect : {}) }}
              onClick={goToEditProfile}
              onMouseEnter={() => setHovered("editProfile")}
              onMouseLeave={() => setHovered(null)}
            >
              Edit Profile
            </button>
          </div>
        );
      case "logbooks":
        return (
          <div style={styles.contentCard}>
            <h2 style={styles.cardTitle}>Logbooks</h2>
            <button
              style={{ ...styles.button, ...(hovered === "logbooks" ? styles.hoverEffect : {}) }}
              onClick={viewLogbooks}
              onMouseEnter={() => setHovered("logbooks")}
              onMouseLeave={() => setHovered(null)}
            >
              View Logbooks
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.dashboardWrapper}>
      <div style={styles.sidebar}>
        {["dashboard", "preferences", "profile", "logbooks"].map((tab) => (
          <button
            key={tab}
            style={{
              ...styles.tabButton,
              ...(activeTab === tab ? styles.activeTab : {}),
              ...(hovered === tab ? styles.hoveredTab : {})
            }}
            onClick={() => setActiveTab(tab)}
            onMouseEnter={() => setHovered(tab)}
            onMouseLeave={() => setHovered(null)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
        <button
          style={{
            ...styles.logoutButton,
            ...(hovered === "logout" ? styles.hoveredTab : {})
          }}
          onClick={handleLogout}
          onMouseEnter={() => setHovered("logout")}
          onMouseLeave={() => setHovered(null)}
        >
          Logout
        </button>
      </div>

      <div style={styles.mainArea}>
        <div style={styles.centerContainer}>
          <h1 style={styles.greeting}>Hi {organization?.name}</h1>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const styles = {
  dashboardWrapper: {
    display: "flex",
    minHeight: "100vh",
  },
  sidebar: {
    width: "220px",
    backgroundColor: "#1e293b",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  tabButton: {
    backgroundColor: "#334155",
    color: "white",
    padding: "12px 16px",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textAlign: "left",
  },
  activeTab: {
    backgroundColor: "#F4D160",
    color: "#000",
    fontWeight: "bold",
  },
  hoveredTab: {
    transform: "scale(1.04)",
    backgroundColor: "#64748b",
  },
  logoutButton: {
    marginTop: "auto",
    backgroundColor: "#ef4444",
    color: "white",
    padding: "12px 16px",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  mainArea: {
    flex: 1,
    background: "linear-gradient(to bottom, #1D5D9B, white)",
    padding: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  centerContainer: {
    width: "100%",
    maxWidth: "800px",
    textAlign: "center",
  },
  greeting: {
    fontSize: "30px",
    fontWeight: "600",
    marginBottom: "30px",
    color: "white",
  },
  contentCard: {
    backgroundColor: "#1e293b",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  cardTitle: {
    fontSize: "22px",
    marginBottom: "20px",
    fontWeight: "600",
    color: "#F4D160",
  },
  paragraph: {
    fontSize: "16px",
    marginBottom: "12px",
    color: "white",
  },
  button: {
    backgroundColor: "#3b82f6",
    color: "white",
    padding: "12px 20px",
    margin: "10px 8px",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  hoverEffect: {
    transform: "scale(1.05)",
    backgroundColor: "#2563eb",
  },
};

export default OrganisationDashboard;
