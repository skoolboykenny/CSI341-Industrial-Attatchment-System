import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrganizationLogbooks = () => {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const [logbooks, setLogbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogbooks = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/organisation/${orgId}/logbooks/`);
        setLogbooks(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch logbooks. Please try again later.');
        setLoading(false);
        console.error('Error fetching logbooks:', err);
      }
    };

    fetchLogbooks();
  }, [orgId]);

  const handleMarkViewed = async (logbookId) => {
    try {
      await axios.put(`http://localhost:8000/api/logbooks/${logbookId}/mark-viewed/`);
      setLogbooks(logbooks.map(logbook => 
        logbook.logbook_id === logbookId 
          ? { ...logbook, status: 'viewed', viewed_at: new Date().toISOString() } 
          : logbook
      ));
    } catch (err) {
      console.error('Error marking logbook as viewed:', err);
      alert('Failed to update logbook status');
    }
  };

  const handleViewDetails = (logbookId) => {
    navigate(`/logbooks/${logbookId}`);
  };

  const handleBackToDashboard = () => {
    navigate('/organisation-dashboard');
  };

  if (loading) return <div style={styles.loading}>Loading logbooks...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Student Logbooks</h2>
      
      <button 
        onClick={handleBackToDashboard}
        style={{ ...styles.button, backgroundColor: '#6c757d', marginBottom: '20px' }}
      >
        Back to Dashboard
      </button>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Student</th>
              <th style={styles.th}>Week</th>
              <th style={styles.th}>Submitted</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {logbooks.length > 0 ? (
              logbooks.map(logbook => (
                <tr key={logbook.logbook_id} style={styles.tr}>
                  <td style={styles.td}>{logbook.student_name}</td>
                  <td style={styles.td}>{logbook.week_number}</td>
                  <td style={styles.td}>
                    {new Date(logbook.submitted_at).toLocaleDateString()}
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: logbook.status === 'viewed' ? '#d4edda' : '#fff3cd',
                      color: logbook.status === 'viewed' ? '#155724' : '#856404'
                    }}>
                      {logbook.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button 
                      onClick={() => handleViewDetails(logbook.logbook_id)}
                      style={{ ...styles.button, marginRight: '8px' }}
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleMarkViewed(logbook.logbook_id)}
                      disabled={logbook.status === 'viewed'}
                      style={{
                        ...styles.button,
                        backgroundColor: logbook.status === 'viewed' ? '#6c757d' : '#28a745',
                        cursor: logbook.status === 'viewed' ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {logbook.status === 'viewed' ? 'Viewed' : 'Mark Viewed'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  No logbooks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333'
  },
  tableContainer: {
    overflowX: 'auto',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    borderRadius: '8px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white'
  },
  th: {
    backgroundColor: '#f8f9fa',
    padding: '12px 15px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
    fontWeight: 'bold'
  },
  tr: {
    borderBottom: '1px solid #eee',
    '&:hover': {
      backgroundColor: '#f5f5f5'
    }
  },
  td: {
    padding: '12px 15px',
    verticalAlign: 'middle'
  },
  statusBadge: {
    padding: '5px 10px',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontWeight: 'bold'
  },
  button: {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.3s'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '1.2rem'
  },
  error: {
    textAlign: 'center',
    padding: '40px',
    color: '#dc3545',
    fontSize: '1.2rem'
  }
};

export default OrganizationLogbooks;