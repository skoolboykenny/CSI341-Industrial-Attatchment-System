import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [hasPreference, setHasPreference] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [hovered, setHovered] = useState(null);

  const studentId = localStorage.getItem("student_id");

  useEffect(() => {
    if (!studentId) {
      navigate('/login');
      return;
    }

    // Set student name from localStorage
    const firstName = localStorage.getItem("first_name");
    const lastName = localStorage.getItem("last_name");
    setStudentName(`${firstName || ''} ${lastName || ''}`.trim());

    // Check if student has submitted preferences
    axios.get("http://localhost:8000/api/admin/student-preferences/")
      .then(response => {
        const preferenceExists = response.data.some(
          (pref) =>
            pref.student === studentId ||
            pref.student_id === studentId ||
            (pref.student?.student_id === studentId)
        );
        setHasPreference(preferenceExists);
      });
  }, [studentId, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const goToPreferenceForm = () => {
    navigate(hasPreference ? "/edit-preference" : "/submit-preference");
  };

  const goToLogbook = () => {
    navigate("/logbook");
  };

  const goToEditProfile = () => {
    navigate("/edit-profile");
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div style={styles.contentCard}>
            <h2 style={styles.cardTitle}>Announcements</h2>
            <p style={styles.paragraph}><strong>Industrial Attachment Alert!</strong></p>
            <p style={styles.paragraph}>
              Industrial Attachment starts soon—students are advised to start applying now.
              Prepare your documents and begin reaching out to organizations.
            </p>
            <p style={styles.paragraph}><em>Don’t wait—secure your placement early!</em></p>
          </div>
        );
      case 'preferences':
        return (
          <div style={styles.contentCard}>
            <h2 style={styles.cardTitle}>Preferences</h2>
            <button
              style={{ ...styles.button, ...(hovered === 'pref' ? styles.hoverEffect : {}) }}
              onClick={goToPreferenceForm}
              onMouseEnter={() => setHovered('pref')}
              onMouseLeave={() => setHovered(null)}
            >
              {hasPreference ? "Edit Preferences" : "Submit Preferences"}
            </button>
          </div>
        );
      case 'profile':
        return (
          <div style={styles.contentCard}>
            <h2 style={styles.cardTitle}>Profile</h2>
            <button
              style={{ ...styles.button, ...(hovered === 'editProfile' ? styles.hoverEffect : {}) }}
              onClick={goToEditProfile}
              onMouseEnter={() => setHovered('editProfile')}
              onMouseLeave={() => setHovered(null)}
            >
              Edit Profile
            </button>
          </div>
        );
      case 'job':
        return (
          <div style={styles.contentCard}>
            <h2 style={styles.cardTitle}>Job</h2>
            <button
              style={{ ...styles.button, ...(hovered === 'logbook' ? styles.hoverEffect : {}) }}
              onClick={goToLogbook}
              onMouseEnter={() => setHovered('logbook')}
              onMouseLeave={() => setHovered(null)}
            >
              Submit Logbook
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
        {['dashboard', 'preferences', 'profile', 'job'].map((tab) => (
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
          style={{ ...styles.logoutButton, ...(hovered === 'logout' ? styles.hoveredTab : {}) }}
          onClick={handleLogout}
          onMouseEnter={() => setHovered('logout')}
          onMouseLeave={() => setHovered(null)}
        >
          Logout
        </button>
      </div>

      <div style={styles.mainArea}>
        <div style={styles.centerContainer}>
          <h1 style={styles.greeting}>Hi {studentName}</h1>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const styles = {
  dashboardWrapper: {
    display: 'flex',
    minHeight: '100vh',
  },
  sidebar: {
    width: '220px',
    backgroundColor: '#1e293b',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  tabButton: {
    backgroundColor: '#334155',
    color: 'white',
    padding: '12px 16px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'left',
  },
  activeTab: {
    backgroundColor: '#F4D160',
    color: '#000',
    fontWeight: 'bold',
  },
  hoveredTab: {
    transform: 'scale(1.04)',
    backgroundColor: '#64748b',
  },
  logoutButton: {
    marginTop: 'auto',
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '12px 16px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  mainArea: {
    flex: 1,
    background: 'linear-gradient(to bottom, #1D5D9B, white)',
    padding: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    width: '100%',
    maxWidth: '800px',
    textAlign: 'center',
  },
  greeting: {
    fontSize: '30px',
    fontWeight: '600',
    marginBottom: '30px',
    color: 'white',
  },
  contentCard: {
    backgroundColor: '#1e293b',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: '22px',
    marginBottom: '20px',
    fontWeight: '600',
    color: '#F4D160',
  },
  paragraph: {
    fontSize: '16px',
    marginBottom: '12px',
    color: 'white',
  },
  button: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '12px 20px',
    margin: '10px 8px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  hoverEffect: {
    transform: 'scale(1.05)',
    backgroundColor: '#2563eb',
  },
};

export default Dashboard;
