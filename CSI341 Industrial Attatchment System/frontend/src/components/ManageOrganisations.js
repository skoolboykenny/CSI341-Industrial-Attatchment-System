import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // import useNavigate

const ManageOrganisations = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [organisations, setOrganisations] = useState([]);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [editingOrg, setEditingOrg] = useState(null);
  const [formData, setFormData] = useState({
    org_name: '',
    industry: '', // will hold the selected industry's id
    town: '',
    street: '',
    plot_number: '',
    contact_number: '',
    contact_email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  // Fetch organisations and industry options when component mounts.
  useEffect(() => {
    fetchOrganisations();
    fetchIndustries();
  }, []);

  const fetchOrganisations = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/organisations/');
      setOrganisations(response.data);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to fetch organizations');
    }
  };

  const fetchIndustries = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/industries/');
      setIndustryOptions(response.data);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to fetch industries');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = (org) => {
    setEditingOrg(org.org_id);
    setFormData({
      org_name: org.org_name,
      industry: org.industry, // assuming org.industry is its id
      town: org.town,
      street: org.street,
      plot_number: org.plot_number,
      contact_number: org.contact_number,
      contact_email: org.contact_email,
      password: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOrg) {
        // Update existing organization
        await axios.put(
          `http://localhost:8000/api/admin/organisations/${editingOrg}/`,
          formData,
          { headers: { 'Content-Type': 'application/json' } }
        );
        setMessage('Organization updated successfully!');
      } else {
        // Create new organization using the registration endpoint
        await axios.post(
          'http://localhost:8000/api/register-organisation/',
          formData,
          { headers: { 'Content-Type': 'application/json' } }
        );
        setMessage('Organization created successfully!');
      }
      setEditingOrg(null);
      setFormData({
        org_name: '',
        industry: '',
        town: '',
        street: '',
        plot_number: '',
        contact_number: '',
        contact_email: '',
        password: ''
      });
      fetchOrganisations();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (orgId) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      try {
        await axios.delete(`http://localhost:8000/api/admin/organisations/${orgId}/`);
        setMessage('Organization deleted successfully!');
        fetchOrganisations();
      } catch (error) {
        setMessage(error.response?.data?.error || 'Delete failed');
      }
    }
  };

  return (
    <div style={styles.container}>
      {/* Dashboard Button */}
      <button
        style={styles.dashboardButton}
        onClick={() => navigate('/admin/dashboard')} // Navigate to /admin/dashboard
      >
        Dashboard
      </button>

      <h2>Manage Organizations</h2>
      {message && <p style={styles.message}>{message}</p>}

      <div style={styles.formContainer}>
        <h3>{editingOrg ? 'Edit Organization' : 'Add New Organization'}</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="org_name"
            placeholder="Organization Name"
            value={formData.org_name}
            onChange={handleInputChange}
            required
            style={styles.input}
          />

          {/* Industry dropdown */}
          <select
            name="industry"
            value={formData.industry}
            onChange={handleInputChange}
            required
            style={styles.input}
          >
            <option value="">Select Industry</option>
            {industryOptions.map((industry) => (
              <option key={industry.industry_id} value={industry.industry_id}>
                {industry.industry_name}
              </option>
            ))}
          </select>

          <input
            name="town"
            placeholder="Town"
            value={formData.town}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
          <input
            name="street"
            placeholder="Street"
            value={formData.street}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
          <input
            name="plot_number"
            placeholder="Plot Number"
            value={formData.plot_number}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
          <input
            name="contact_number"
            placeholder="Contact Number"
            value={formData.contact_number}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
          <input
            name="contact_email"
            placeholder="Email"
            type="email"
            value={formData.contact_email}
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
            required={!editingOrg}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            {editingOrg ? 'Update Organization' : 'Add Organization'}
          </button>
          {editingOrg && (
            <button
              type="button"
              style={{ ...styles.button, backgroundColor: '#F4D160' }}
              onClick={() => {
                setEditingOrg(null);
                setFormData({
                  org_name: '',
                  industry: '',
                  town: '',
                  street: '',
                  plot_number: '',
                  contact_number: '',
                  contact_email: '',
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
        <h3>Organization List</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Industry(ID)</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Contact</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {organisations.map((org) => (
              <tr key={org.org_id}>
                <td style={styles.td}>{org.org_name}</td>
                <td style={styles.td}>{org.industry}</td>
                <td style={styles.td}>
                  {org.town}, {org.street}, {org.plot_number}
                </td>
                <td style={styles.td}>
                  {org.contact_email}<br />{org.contact_number}
                </td>
                <td style={styles.td}>
                  <button
                    style={{ ...styles.actionButton, backgroundColor: '#1D5D9B' }}
                    onClick={() => handleEdit(org)}
                  >
                    Edit
                  </button>
                  <button
                    style={{ ...styles.actionButton, backgroundColor: '#FBEEAC' }}
                    onClick={() => handleDelete(org.org_id)}
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
    fontSize: '16px',
    backgroundColor: '#1D5D9B',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    zIndex: '1000',
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
    fontSize: '16px',
    backgroundColor: '#75C2F6',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  actionButton: {
    padding: '5px 10px',
    fontSize: '14px',
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
    backgroundColor: '#1D5D9B',
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

export default ManageOrganisations;
