// src/components/LogbookDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LogbookDetail = () => {
  const { logbookId } = useParams();
  const navigate = useNavigate();
  const [logbook, setLogbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogbook = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/logbooks/${logbookId}/`);
        setLogbook(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load logbook details');
        setLoading(false);
        console.error('Error fetching logbook:', err);
      }
    };

    fetchLogbook();
  }, [logbookId]);

  const handleMarkViewed = async () => {
    try {
      await axios.put(`http://localhost:8000/api/logbooks/${logbookId}/mark-viewed/`);
      setLogbook({
        ...logbook,
        status: 'viewed',
        viewed_at: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error marking as viewed:', err);
      alert('Failed to update logbook status');
    }
  };

  const handleBackToList = () => {
    navigate(-1); // Go back to the previous page
  };

  if (loading) return <div style={styles.loading}>Loading logbook details...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <button 
        onClick={handleBackToList}
        style={{ ...styles.button, backgroundColor: '#6c757d', marginBottom: '20px' }}
      >
        Back to List
      </button>

      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Logbook Entry - Week {logbook.week_number}</h2>
          <div style={styles.statusContainer}>
            <span style={{
              ...styles.statusBadge,
              backgroundColor: logbook.status === 'viewed' ? '#d4edda' : '#fff3cd',
              color: logbook.status === 'viewed' ? '#155724' : '#856404'
            }}>
              {logbook.status}
            </span>
            {logbook.status !== 'viewed' && (
              <button
                onClick={handleMarkViewed}
                style={{ ...styles.button, marginLeft: '10px' }}
              >
                Mark as Viewed
              </button>
            )}
          </div>
        </div>

        <div style={styles.meta}>
          <p><strong>Student:</strong> {logbook.student_name}</p>
          <p><strong>Submitted:</strong> {new Date(logbook.submitted_at).toLocaleString()}</p>
          {logbook.viewed_at && (
            <p><strong>Viewed:</strong> {new Date(logbook.viewed_at).toLocaleString()}</p>
          )}
        </div>

        <div style={styles.content}>
          <h3 style={styles.subtitle}>Log Entry</h3>
          <div style={styles.entry}>
            {logbook.log_entry}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    padding: '25px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  title: {
    margin: '0',
    color: '#333'
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  statusBadge: {
    padding: '5px 10px',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontSize: '0.9rem'
  },
  meta: {
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid #eee'
  },
  content: {
    marginTop: '20px'
  },
  subtitle: {
    color: '#333',
    marginBottom: '15px'
  },
  entry: {
    whiteSpace: 'pre-wrap',
    lineHeight: '1.6',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    border: '1px solid #eee'
  },
  button: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: '#0056b3'
    }
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

export default LogbookDetail;