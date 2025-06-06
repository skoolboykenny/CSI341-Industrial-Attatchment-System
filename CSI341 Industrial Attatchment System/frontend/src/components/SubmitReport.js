import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SubmitReport = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentId: '',
    reportType: 'progress',
    comments: '',
    file: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle file upload and form submission
    console.log('Submitting report:', formData);
    alert('Report submitted successfully!');
    navigate('/supervisor/dashboard');
  };

  const handleFileChange = (e) => {
    setFormData({...formData, file: e.target.files[0]});
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <div style={styles.container}>
          <h1 style={styles.header}>Submit Supervisor Report</h1>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Select Student:</label>
              <select
                style={styles.select}
                value={formData.studentId}
                onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                required
              >
                <option value="">-- Select Student --</option>
                <option value="1">John Doe (COMP123)</option>
                <option value="2">Jane Smith (COMP124)</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Report Type:</label>
              <select
                style={styles.select}
                value={formData.reportType}
                onChange={(e) => setFormData({...formData, reportType: e.target.value})}
              >
                <option value="progress">Progress Report</option>
                <option value="evaluation">Evaluation Report</option>
                <option value="final">Final Assessment</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Comments:</label>
              <textarea
                style={styles.textarea}
                value={formData.comments}
                onChange={(e) => setFormData({...formData, comments: e.target.value})}
                rows="5"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Upload File:</label>
              <input
                type="file"
                onChange={handleFileChange}
                style={styles.fileInput}
                required
              />
            </div>

            <button type="submit" style={styles.submitButton}>
              Submit Report
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    backgroundImage: "url('/businessblock.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    width: "100vw",
    padding: "20px",
    boxSizing: "border-box"
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    minHeight: "calc(100vh - 40px)",
    borderRadius: "10px",
    padding: "20px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  container: {
    maxWidth: '800px',
    width: '100%',
    padding: '30px',
    backgroundColor: 'rgba(248, 249, 250, 0.9)',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.3)'
  },
  header: {
    color: '#1D5D9B',
    textAlign: 'center',
    marginBottom: '30px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontWeight: '600',
    color: '#333'
  },
  select: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    backgroundColor: 'white'
  },
  textarea: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    resize: 'vertical',
    backgroundColor: 'white'
  },
  fileInput: {
    padding: '10px 0'
  },
  submitButton: {
    backgroundColor: '#1D5D9B',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: '#15426b'
    }
  }
};

export default SubmitReport;