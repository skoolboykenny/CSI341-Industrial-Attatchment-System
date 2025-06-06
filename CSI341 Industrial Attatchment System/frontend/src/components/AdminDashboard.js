import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const adminId = localStorage.getItem("admin_id");
    const email = localStorage.getItem("admin_email");

    if (!adminId || !email) {
      navigate("/admin/login");
      return;
    }

    setAdmin({
      admin_id: adminId,
      email,
      first_name: "Admin",
      last_name: "User",
      last_login: new Date().toLocaleString(),
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin_id");
    localStorage.removeItem("admin_email");
    navigate("/admin/login");
  };

  const goToManageStudents = () => {
    navigate("/admin/manage-students");
  };

  const goToManageOrganisations = () => {
    navigate("/admin/manage-organisations");
  };

  const goToManualMatch = () => {
    navigate("/admin/manual-match");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div style={styles.contentCard}>
            <h2 style={styles.cardTitle}>Welcome, {admin?.first_name}!</h2>
            <p style={styles.paragraph}><strong>Email:</strong> {admin?.email}</p>
            <p style={styles.paragraph}><strong>Last Login:</strong> {admin?.last_login}</p>
          </div>
        );
      case "manageStudents":
        return (
          <div style={styles.contentCard}>
            <h2 style={styles.cardTitle}>Manage Students</h2>
            <button
              style={{ ...styles.button, ...(hovered === "students" ? styles.hoverEffect : {}) }}
              onClick={goToManageStudents}
              onMouseEnter={() => setHovered("students")}
              onMouseLeave={() => setHovered(null)}
            >
              Go to Manage Students
            </button>
          </div>
        );
      case "manageOrganisations":
        return (
          <div style={styles.contentCard}>
            <h2 style={styles.cardTitle}>Manage Organisations</h2>
            <button
              style={{ ...styles.button, ...(hovered === "organisations" ? styles.hoverEffect : {}) }}
              onClick={goToManageOrganisations}
              onMouseEnter={() => setHovered("organisations")}
              onMouseLeave={() => setHovered(null)}
            >
              Go to Manage Organisations
            </button>
          </div>
        );
      case "manualMatch":
        return (
          <div style={styles.contentCard}>
            <h2 style={styles.cardTitle}>Manual Matching</h2>
            <button
              style={{ ...styles.button, ...(hovered === "manual" ? styles.hoverEffect : {}) }}
              onClick={goToManualMatch}
              onMouseEnter={() => setHovered("manual")}
              onMouseLeave={() => setHovered(null)}
            >
              Go to Manual Match
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (!admin) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.dashboardWrapper}>
      <div style={styles.sidebar}>
        {[
          { key: "dashboard", label: "Dashboard" },
          { key: "manageStudents", label: "Manage Students" },
          { key: "manageOrganisations", label: "Manage Organisations" },
          { key: "manualMatch", label: "Manual Match" },
        ].map((tab) => (
          <button
            key={tab.key}
            style={{
              ...styles.tabButton,
              ...(activeTab === tab.key ? styles.activeTab : {}),
              ...(hovered === tab.key ? styles.hoveredTab : {}),
            }}
            onClick={() => setActiveTab(tab.key)}
            onMouseEnter={() => setHovered(tab.key)}
            onMouseLeave={() => setHovered(null)}
          >
            {tab.label}
          </button>
        ))}

        <button
          style={{
            ...styles.logoutButton,
            ...(hovered === "logout" ? styles.hoveredTab : {}),
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
  loading: {
    textAlign: "center",
    padding: "2rem",
    fontSize: "1.2rem",
  },
};

export default AdminDashboard;
