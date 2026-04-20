import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth Components
import AuthSystem from './components/AuthSystem';

// Layout Components
import DashboardLayout from './components/layout/DashboardLayout';

// Page Components
import DashboardHome from './components/pages/DashboardHome';
import UserRequest from './components/pages/UserRequest';
import UserListReport from './components/pages/UserListReport';
import AuditTrail from './components/pages/AuditTrail';
import Functionalities from './components/pages/Functionalities';
import OnboardingReports from './components/pages/OnboardingReports';
import TransactionReports from './components/pages/TransactionReports';
import WalletAdjustment from './components/pages/WalletAdjustment';
import CreateCBCUser from './components/pages/CreateCBCUser';

// 1. IMPORT THE NEW PROFILE DETAILS COMPONENT
import ProfileDetails from './components/pages/ProfileDetails';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('access_token');
    if (!token) return <Navigate to="/login" replace />;
    return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* AUTHENTICATION */}
        <Route path="/login" element={<AuthSystem />} />

        {/* PROTECTED DASHBOARD ROUTES */}
        <Route path="/dashboard" element={
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
        }>
          {/* Default Landing */}
          <Route index element={<DashboardHome />} />
          
          {/* User Management Section */}
          <Route path="create-cbc" element={<CreateCBCUser />} />
          <Route path="user-request" element={<UserRequest />} />
          
          {/* 2. ADDED PROFILE DETAILS ROUTE (Accessible from User Request) */}
          <Route path="profile-details" element={<ProfileDetails />} />
          
          <Route path="user-list" element={<UserListReport />} />
          <Route path="functionalities" element={<Functionalities />} />
          
          {/* Audit & Logs */}
          <Route path="audit-trail" element={<AuditTrail />} />

          {/* Reports Sub-routes */}
          <Route path="reports">
            <Route path="onboarding" element={<OnboardingReports />} />
            <Route path="transaction" element={<TransactionReports />} />
          </Route>

          {/* Wallet Section */}
          <Route path="wallet-adjustment" element={<WalletAdjustment />} />
        </Route>

        {/* REDIRECTS & 404 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;