import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    year_of_study: '',
    student_email: '',
    student_contact_number: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/students/');
      setStudents(response.data);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to fetch students');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (student) => {
    setEditingStudent(student.student_id);
    setFormData({
      student_id: student.student_id,
      first_name: student.first_name,
      last_name: student.last_name,
      year_of_study: student.year_of_study,
      student_email: student.student_email,
      student_contact_number: student.student_contact_number,
      password: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await axios.put(
          `http://localhost:8000/api/admin/students/${editingStudent}/`,
          formData,
          { headers: { 'Content-Type': 'application/json' } }
        );
        console.log('Student updated successfully');
        setMessage('Student updated successfully!');
      } else {
        await axios.post(
          'http://localhost:8000/api/register/student/',
          formData,
          { headers: { 'Content-Type': 'application/json' } }
        );
        console.log('Student created successfully');
        setMessage('Student created successfully!');
      }

      setEditingStudent(null);
      setFormData({
        student_id: '',
        first_name: '',
        last_name: '',
        year_of_study: '',
        student_email: '',
        student_contact_number: '',
        password: ''
      });
      fetchStudents();
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      setMessage(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`http://localhost:8000/api/admin/students/${studentId}/`);
        console.log('Student deleted successfully');
        setMessage('Student deleted successfully!');
        fetchStudents();
      } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        setMessage(error.response?.data?.error || 'Delete failed');
      }
    }
  };

  const handleDashboardClick = () => {
    navigate('/admin/dashboard');
  };

  return (
    <div style={styles.container}>
      <button
        onClick={handleDashboardClick}
        style={styles.dashboardButton}
      >
        Dashboard
      </button>
      <h2>Manage Students</h2>
      {message && <p style={styles.message}>{message}</p>}

      <div style={styles.formContainer}>
        <h3>{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="student_id"
            placeholder="Student ID"
            value={formData.student_id}
            onChange={handleInputChange}
            required
            style={styles.input}
            disabled={!!editingStudent}
          />
          <input
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
          <input
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
          <input
            name="year_of_study"
            placeholder="Year of Study"
            type="number"
            value={formData.year_of_study}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
          <input
            name="student_email"
            placeholder="Email"
            type="email"
            value={formData.student_email}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
          <input
            name="student_contact_number"
            placeholder="Phone Number"
            value={formData.student_contact_number}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
          <input
            name="password"
            placeholder="Password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required={!editingStudent}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            {editingStudent ? 'Update Student' : 'Add Student'}
          </button>
          {editingStudent && (
            <button
              type="button"
              style={{ ...styles.button, backgroundColor: '#dc3545' }}
              onClick={() => {
                setEditingStudent(null);
                setFormData({
                  student_id: '',
                  first_name: '',
                  last_name: '',
                  year_of_study: '',
                  student_email: '',
                  student_contact_number: '',
                  password: ''
                });
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <div style={styles.tableContainer}>
        <h3>Student List</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Year</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.student_id}>
                <td style={styles.td}>{student.student_id}</td>
                <td style={styles.td}>{student.first_name} {student.last_name}</td>
                <td style={styles.td}>{student.year_of_study}</td>
                <td style={styles.td}>{student.student_email}</td>
                <td style={styles.td}>{student.student_contact_number}</td>
                <td style={styles.td}>
                  <button
                    style={{ ...styles.actionButton, backgroundColor: '#1D5D9B' }}
                    onClick={() => handleEdit(student)}
                  >
                    Edit
                  </button>
                  <button
                    style={{ ...styles.actionButton, backgroundColor: '#FBEEAC' }}
                    onClick={() => handleDelete(student.student_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  dashboardButton: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    padding: '10px 20px',
    backgroundColor: '#75C2F6',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  formContainer: {
    margin: '20px 0',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#F4D160',
  },
  tableContainer: {
    margin: '20px 0',
    overflowX: 'auto',
  },
  form: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '15px',
  },
  input: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '8px 15px',
    backgroundColor: '#1D5D9B',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  actionButton: {
    padding: '5px 10px',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '5px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  th: {
    backgroundColor: '#343a40',
    color: 'white',
    padding: '10px',
    textAlign: 'left',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
  message: {
    padding: '10px',
    margin: '10px 0',
    borderRadius: '4px',
    backgroundColor: '#d4edda',
    color: '#155724',
  },
};

export default ManageStudents;
