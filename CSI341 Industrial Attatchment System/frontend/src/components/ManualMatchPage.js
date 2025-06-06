import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Link } from 'react-router-dom';

const ItemTypes = {
  STUDENT_PREF: 'student_pref',
  ORGANISATION: 'organisation',
};

const StudentPreferenceItem = ({ studentPref, onSelect }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.STUDENT_PREF,
    item: {
      type: ItemTypes.STUDENT_PREF,
      studentPrefId: studentPref.student_pref_id,
      label: studentPref.student_name,
      ...studentPref,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      onClick={() => onSelect && onSelect(studentPref)}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: '0.5rem',
        border: '1px solid #ccc',
        marginBottom: '0.5rem',
        cursor: 'pointer',
        backgroundColor: '#FBEEAC',
      }}
    >
      <p><strong>{studentPref.student_name}</strong></p>
      <p>{studentPref.pref_location}</p>
    </div>
  );
};

const OrganisationItem = ({ organisation, onSelect }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ORGANISATION,
    item: {
      type: ItemTypes.ORGANISATION,
      organisationId: organisation.org_id,
      label: organisation.org_name,
      ...organisation,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      onClick={() => onSelect && onSelect(organisation)}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: '0.5rem',
        border: '1px solid #ccc',
        marginBottom: '0.5rem',
        cursor: 'pointer',
        backgroundColor: '#75C2F6',
      }}
    >
      <p><strong>{organisation.org_name}</strong></p>
      <p>{organisation.town}</p>
    </div>
  );
};

const CenterDropTarget = ({ selectedStudent, selectedOrganisation, onItemDrop }) => {
  const [{ isOver }, drop] = useDrop({
    accept: [ItemTypes.STUDENT_PREF, ItemTypes.ORGANISATION],
    drop: (item) => onItemDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const style = {
    border: '2px dashed #1D5D9B',
    padding: '1rem',
    minHeight: '150px',
    backgroundColor: isOver ? '#F4D160' : '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
  };

  return (
    <div ref={drop} style={style}>
      {selectedStudent ? (
        <div>
          <h4 style={{ color: '#1D5D9B' }}>Selected Student Preference:</h4>
          <p><strong>{selectedStudent.student_name}</strong></p>
          <p>Location: {selectedStudent.pref_location}</p>
          <p>Available: {selectedStudent.available_from} to {selectedStudent.available_to}</p>
          <p>
            Preferred Industries:{" "}
            {selectedStudent.industries_details?.length > 0
              ? selectedStudent.industries_details.map(i => `${i.industry_name} (${i.industry_id})`).join(', ')
              : "None"}
          </p>
          <p>
            Desired Skills:{" "}
            {selectedStudent.skills_details?.length > 0
              ? selectedStudent.skills_details.map(s => `${s.skill_name} (${s.skill_id})`).join(', ')
              : "None"}
          </p>
        </div>
      ) : (
        <p style={{ color: '#1D5D9B' }}>Drop a student preference here</p>
      )}

      {selectedOrganisation ? (
        <div>
          <h4 style={{ color: '#1D5D9B' }}>Selected Organisation:</h4>
          <p><strong>{selectedOrganisation.org_name}</strong></p>
          <p>Town: {selectedOrganisation.town}</p>
          <p>
            Required Skills:{' '}
            {selectedOrganisation.organisation_preference?.required_skills_names?.length > 0
              ? selectedOrganisation.organisation_preference.required_skills_names.join(', ')
              : 'None'}
          </p>
          <p>
            Preferred Fields:{' '}
            {selectedOrganisation.organisation_preference?.preferred_fields_names?.length > 0
              ? selectedOrganisation.organisation_preference.preferred_fields_names.join(', ')
              : 'None'}
          </p>
        </div>
      ) : (
        <p style={{ color: '#1D5D9B' }}>Drop an organisation here</p>
      )}
    </div>
  );
};

const ManualMatchPage = () => {
  const [studentPrefs, setStudentPrefs] = useState([]);
  const [organisations, setOrganisations] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedOrganisation, setSelectedOrganisation] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/student-preferences/')
      .then((response) => {
        console.log("Student Preferences Response:", response.data);
        setStudentPrefs(response.data);
      })
      .catch((error) => {
        console.error('Error fetching student preferences', error);
      });

    axios.get('http://localhost:8000/api/admin/organisations/')
      .then((response) => {
        console.log("Organisations Response:", response.data);
        setOrganisations(response.data);
      })
      .catch((error) => {
        console.error('Error fetching organisations', error);
      });
  }, []);

  const handleItemDrop = (item) => {
    if (item.type === ItemTypes.STUDENT_PREF) {
      const found = studentPrefs.find((pref) => pref.student_pref_id === item.studentPrefId);
      if (found) setSelectedStudent(found);
    } else if (item.type === ItemTypes.ORGANISATION) {
      const found = organisations.find((org) => org.org_id === item.organisationId);
      if (found) setSelectedOrganisation(found);
    }
  };

  const handleStudentSelect = (pref) => {
    console.log("Student Preference Selected:", pref);
    setSelectedStudent(pref);
  };

  const handleOrganisationSelect = (org) => {
    console.log("Organisation Selected:", org);
    setSelectedOrganisation(org);
  };

  const handleMatch = () => {
    if (!selectedStudent || !selectedOrganisation) {
      setMessage("Please select both a student preference and an organisation.");
      return;
    }

    axios.post('http://localhost:8000/api/manual-match/', {
      student_pref_id: selectedStudent.student_pref_id,
      organisation_id: selectedOrganisation.org_id,
      admin_note: "Matched manually via drag-and-drop",
    }, { headers: { 'Content-Type': 'application/json' } })
      .then((response) => {
        console.log("Match Response:", response.data);
        setMessage(response.data.message);
        setSelectedStudent(null);
        setSelectedOrganisation(null);
      })
      .catch((error) => {
        console.error("Match Error:", error);
        setMessage(error.response?.data?.error || "Match failed");
      });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ padding: '1rem' }}>
        {/* Dashboard Button */}
        <Link to="/admin/dashboard">
          <button
            style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              padding: '10px 20px',
              backgroundColor: '#1D5D9B',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Dashboard
          </button>
        </Link>

        <h2 style={{ textAlign: 'center', color: '#1D5D9B' }}>Manual Matching</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
          <div style={{ width: '30%', borderRight: '1px solid #ccc', paddingRight: '1rem' }}>
            <h3 style={{ color: '#1D5D9B' }}>Student Preferences</h3>
            {studentPrefs.length > 0 ? (
              studentPrefs.map((pref) => (
                <div key={pref.student_pref_id} onClick={() => handleStudentSelect(pref)}>
                  <StudentPreferenceItem studentPref={pref} onSelect={handleStudentSelect} />
                </div>
              ))
            ) : (
              <p>No student preferences found.</p>
            )}
          </div>
          <div style={{ width: '40%', padding: '0 1rem' }}>
            <CenterDropTarget
              selectedStudent={selectedStudent}
              selectedOrganisation={selectedOrganisation}
              onItemDrop={handleItemDrop}
            />
            <button
              onClick={handleMatch}
              style={{
                marginTop: '1rem',
                padding: '10px',
                fontSize: '16px',
                backgroundColor: '#F4D160',
                color: '#1D5D9B',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Create Match
            </button>
          </div>
          <div style={{ width: '30%', borderLeft: '1px solid #ccc', paddingLeft: '1rem' }}>
            <h3 style={{ color: '#1D5D9B' }}>Organisations</h3>
            {organisations.length > 0 ? (
              organisations.map((org) => (
                <div key={org.org_id} onClick={() => handleOrganisationSelect(org)}>
                  <OrganisationItem organisation={org} onSelect={handleOrganisationSelect} />
                </div>
              ))
            ) : (
              <p>No organisations found.</p>
            )}
          </div>
        </div>
        {message && <div style={{ textAlign: 'center', marginTop: '1rem', color: '#F4D160' }}>{message}</div>}
      </div>
    </DndProvider>
  );
};

export default ManualMatchPage;
