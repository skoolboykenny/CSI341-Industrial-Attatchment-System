import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SupervisorDashboard = () => {
  const [supervisor, setSupervisor] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // DEVELOPMENT BYPASS - REMOVE IN PRODUCTION
    const devMode = true; // Set to false in production
    
    if (devMode) {
      console.log("Development mode - bypassing auth");
      setSupervisor({
        supervisor_id: "dev_mock_id",
        email: "dev@example.com",
        first_name: "Dev",
        last_name: "User",
        last_login: new Date().toLocaleString(),
      });
      return;
    }

    // Normal auth check
    const supervisorId = localStorage.getItem("supervisor_id");
    const email = localStorage.getItem("supervisor_email");

    if (!supervisorId || !email) {
      navigate("/supervisor/login");
      return;
    }

    setSupervisor({
      supervisor_id: supervisorId,
      email,
      first_name: "Supervisor",
      last_name: "User",
      last_login: new Date().toLocaleString(),
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("supervisor_id");
    localStorage.removeItem("supervisor_email");
    navigate("/supervisor/login");
  };

  // Update these navigation functions to match the new routes
  const goToSubmitReport = () => {
    navigate("/supervisor/submit-report");
  };

  const goToViewReports = () => {
    navigate("/supervisor/view-reports");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div style={styles.contentCard}>
            <h2 style={styles.cardTitle}>Welcome, {supervisor?.first_name}!</h2>
            <p style={styles.paragraph}><strong>Email:</strong> {supervisor?.email}</p>
            <p style={styles.paragraph}><strong>Last Login:</strong> {supervisor?.last_login}</p>
            
            {/* Placeholder for analytics */}
            <div style={{ marginTop: '30px' }}>
              <h3 style={{ color: '#F4D160', marginBottom: '15px' }}>Analytics Coming Soon</h3>
              <div style={{ 
                backgroundColor: '#334155', 
                padding: '20px', 
                borderRadius: '10px',
                color: 'white'
              }}>
                Student performance metrics will be displayed here once available.
              </div>
            </div>
          </div>
        );
      case "submitReport":
        return (
          <div style={styles.contentCard}>
            <h2 style={styles.cardTitle}>Submit Report</h2>
            <button
              style={{ ...styles.button, ...(hovered === "submitReport" ? styles.hoverEffect : {}) }}
              onClick={goToSubmitReport}
              onMouseEnter={() => setHovered("submitReport")}
              onMouseLeave={() => setHovered(null)}
            >
              Go to Report Submission
            </button>
          </div>
        );
      case "viewReports":
        return (
          <div style={styles.contentCard}>
            <h2 style={styles.cardTitle}>View Student Reports</h2>
            <button
              style={{ ...styles.button, ...(hovered === "viewReports" ? styles.hoverEffect : {}) }}
              onClick={goToViewReports}
              onMouseEnter={() => setHovered("viewReports")}
              onMouseLeave={() => setHovered(null)}
            >
              Go to View Reports
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (!supervisor) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.dashboardWrapper}>
      <div style={styles.sidebar}>
        {[
          { key: "dashboard", label: "Dashboard" },
          { key: "submitReport", label: "Submit Report" },
          { key: "viewReports", label: "View Reports" },
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

export default SupervisorDashboard;