import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ReportDetails = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  
  // Mock data - replace with API call
  const reportDetails = {
    1: {
      studentName: 'John Doe',
      studentId: 'COMP123',
      type: 'Progress Report',
      date: '2023-05-15',
      status: 'Submitted',
      comments: 'Good progress on project milestones',
      attachments: ['progress_report.pdf']
    },
    2: {
      studentName: 'Jane Smith',
      studentId: 'COMP124',
      type: 'Final Assessment',
      date: '2023-06-20',
      status: 'Approved',
      comments: 'Excellent performance throughout the attachment',
      attachments: ['final_assessment.pdf']
    }
  };

  const report = reportDetails[reportId] || reportDetails[1];

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Report Details</h1>
      
      <div style={styles.detailsCard}>
        <div style={styles.detailRow}>
          <span style={styles.label}>Student:</span>
          <span>{report.studentName} ({report.studentId})</span>
        </div>
        
        <div style={styles.detailRow}>
          <span style={styles.label}>Report Type:</span>
          <span>{report.type}</span>
        </div>
        
        <div style={styles.detailRow}>
          <span style={styles.label}>Date:</span>
          <span>{report.date}</span>
        </div>
        
        <div style={styles.detailRow}>
          <span style={styles.label}>Status:</span>
          <span style={{
            ...styles.status,
            backgroundColor: getStatusColor(report.status)
          }}>
            {report.status}
          </span>
        </div>
        
        <div style={styles.commentsSection}>
          <h3 style={styles.sectionTitle}>Supervisor Comments</h3>
          <p style={styles.commentsText}>{report.comments}</p>
        </div>
        
        {report.attachments && (
          <div style={styles.attachmentsSection}>
            <h3 style={styles.sectionTitle}>Attachments</h3>
            <ul style={styles.attachmentList}>
              {report.attachments.map((file, index) => (
                <li key={index} style={styles.attachmentItem}>
                  <a href={`/path/to/files/${file}`} download style={styles.downloadLink}>
                    {file}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <button 
          style={styles.backButton}
          onClick={() => navigate('/supervisor/view-reports')}
        >
          Back to Reports
        </button>
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
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#1e293b',
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
  detailsCard: {
    backgroundColor: '#334155',
    borderRadius: '10px',
    padding: '20px',
    marginTop: '20px'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid #475569'
  },
  label: {
    fontWeight: 'bold',
    color: '#F4D160'
  },
  status: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  commentsSection: {
    margin: '25px 0'
  },
  sectionTitle: {
    color: '#F4D160',
    marginBottom: '10px'
  },
  commentsText: {
    lineHeight: '1.6'
  },
  attachmentsSection: {
    margin: '25px 0'
  },
  attachmentList: {
    listStyle: 'none',
    padding: 0
  },
  attachmentItem: {
    marginBottom: '8px'
  },
  downloadLink: {
    color: '#3b82f6',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  backButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px'
  }
};

export default ReportDetails;