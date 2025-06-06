import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewReports = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  
  // Mock data - replace with API call
  const reports = [
    {
      id: 1,
      studentName: 'John Doe',
      studentId: 'COMP123',
      type: 'Progress Report',
      date: '2023-05-15',
      status: 'Submitted',
      comments: 'Good progress on project milestones'
    },
    {
      id: 2,
      studentName: 'Jane Smith',
      studentId: 'COMP124',
      type: 'Final Assessment',
      date: '2023-06-20',
      status: 'Approved',
      comments: 'Excellent performance throughout the attachment'
    }
  ];

  const filteredReports = filter === 'all' 
    ? reports 
    : reports.filter(report => report.status.toLowerCase() === filter);

  const viewReportDetails = (reportId) => {
    navigate(`/supervisor/report-details/${reportId}`);
  };
  
  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <div style={styles.container}>
          <h1 style={styles.header}>Student Reports</h1>
          
          <div style={styles.controls}>
            <select 
              style={styles.filter}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Reports</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
            
            <button 
              style={styles.newReportButton}
              onClick={() => navigate('/supervisor/submit-report')}
            >
              + New Report
            </button>
          </div>
          
          <div style={styles.reportsContainer}>
            {filteredReports.map(report => (
              <div key={report.id} style={styles.reportCard}>
                <div style={styles.reportHeader}>
                  <h3 style={styles.studentName}>{report.studentName} ({report.studentId})</h3>
                  <span style={{
                    ...styles.status,
                    backgroundColor: getStatusColor(report.status)
                  }}>
                    {report.status}
                  </span>
                </div>
                <p style={styles.reportType}>{report.type}</p>
                <p style={styles.reportDate}>Submitted: {report.date}</p>
                <p style={styles.reportComments}>{report.comments}</p>
                <button 
                  style={styles.viewButton}
                  onClick={() => viewReportDetails(report.id)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch(status.toLowerCase()) {
    case 'approved': return '#4CAF50';
    case 'submitted': return '#2196F3';
    case 'pending': return '#FFC107';
    default: return '#9E9E9E';
  }
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
    boxSizing: "border-box"
  },
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '30px',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    color: 'white'
  },
  header: {
    fontSize: '22px',
    marginBottom: '20px',
    fontWeight: '600',
    color: '#F4D160',
    textAlign: 'center'
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px'
  },
  filter: {
    padding: '8px 12px',
    borderRadius: '5px',
    backgroundColor: '#1e293b',
    color: 'white',
    border: '1px solid #334155'
  },
  newReportButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  reportsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '20px'
  },
  reportCard: {
    backgroundColor: '#334155',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  reportHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  studentName: {
    margin: 0,
    color: 'white'
  },
  status: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  reportType: {
    color: '#F4D160',
    margin: '5px 0',
    fontSize: '14px'
  },
  reportDate: {
    color: '#94a3b8',
    margin: '5px 0',
    fontSize: '14px'
  },
  reportComments: {
    margin: '15px 0',
    color: '#e2e8f0',
    fontStyle: 'italic'
  },
  viewButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

export default ViewReports;