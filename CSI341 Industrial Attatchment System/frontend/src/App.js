// src/App.js
import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Student Components
import StudentRegister from "./components/StudentRegister";
import StudentLogin from "./components/studentlogin";

// Organisation Components
import OrganisationRegister from "./components/OrganisationRegister";
import OrganisationLogin from "./components/OrganisationLogin";
import OrganisationDashboard from "./components/OrganisationDashboard";
import OrganisationPreferenceForm from "./components/OrganisationPreferenceForm";
import PreferenceForm from "./Preferenceform"

// Supervisor Components
import SupervisorLogin from "./components/SupervisorLogin";
import SupervisorRegister from "./components/SupervisorRegister";
import SupervisorDashboard from "./components/SupervisorDashboard";
import ViewReports from "./components/ViewReports";
import SubmitReport from "./components/SubmitReport";
import ReportDetails from "./components/ReportDetails";

// Shared Components
import Dashboard from "./components/Dashboard";
import Homepage from "./components/Homepage";
import LogbookForm from './components/LogbookForm';

// Admin Components
import AdminLogin from './components/AdminLogin';
import AdminRegister from './components/AdminRegister';
import AdminDashboard from './components/AdminDashboard';
import ManageStudents from "./components/ManageStudents";
import ManageOrganisations from './components/ManageOrganisations';
import ManualMatchPage from './components/ManualMatchPage';
import EditPreference from "./components/EditPreference";
import EditOrganisationPreference from "./components/EditOrganisationPreference";
import EditProfile from './components/EditProfile'; 
import EditOrganisationProfile from './components/EditOrganisationProfile';
import OrganizationLogbooks from './components/OrganizationLogbooks';
import LogbookDetail from './components/LogbookDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        
        {/* Student */}
        <Route path="/login" element={<StudentLogin />} />
        <Route path="/register" element={<StudentRegister />} />

        {/* Organisation */}
        <Route path="/login-organisation" element={<OrganisationLogin />} />
        <Route path="/register-organisation" element={<OrganisationRegister />} />
        <Route path="/organisation-dashboard" element={<OrganisationDashboard />} />
        <Route path="/organisation/:orgId/preferences/create" element={<OrganisationPreferenceForm />}/>

        {/* Supervisor */}
        <Route path="/supervisor/login" element={<SupervisorLogin />} />
        <Route path="/supervisor/register" element={<SupervisorRegister />} />
        <Route path="/supervisor/dashboard" element={<SupervisorDashboard />} />
        <Route path="/supervisor/view-reports" element={<ViewReports />} />
        <Route path="/supervisor/submit-report" element={<SubmitReport />} />
        <Route path="/supervisor/report-details/:reportId" element={<ReportDetails />} />

        {/* Shared */}
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/submit-preference" element={<PreferenceForm />} />
        <Route path="/logbook" element={<LogbookForm />} />

        {/* Admin */}
        <Route path="/admin/register" element={<AdminRegister />} /> 
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-students" element={<ManageStudents />} />
        <Route path="/admin/manage-organisations" element={<ManageOrganisations />} />
        <Route path="/admin/manual-match" element={<ManualMatchPage />} />
        <Route path="/edit-preference" element={<EditPreference />} />
        <Route path="/organisation-preference/edit" element={<EditOrganisationPreference />} />
        <Route path="/edit-profile" element={<EditProfile />} /> 
        <Route path="/organisation-profile/edit" element={<EditOrganisationProfile />} />
        <Route path="/organisation/:orgId/logbooks" element={<OrganizationLogbooks />} />
        <Route path="/logbooks/:logbookId" element={<LogbookDetail />} />
      </Routes>
    </Router>
  );
}
export default App;