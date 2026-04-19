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

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. AUTH ROUTES */}
        <Route path="/login" element={<AuthSystem />} />

        {/* 2. DASHBOARD ROUTES (Layout Wrapper) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          
          {/* User Management */}
          <Route path="user-request" element={<UserRequest />} />
          <Route path="user-list" element={<UserListReport />} />
          <Route path="functionalities" element={<Functionalities />} />
          
          {/* Audit Trail */}
          <Route path="audit-trail" element={<AuditTrail />} />

          {/* Reports Section */}
          <Route path="reports">
            <Route path="onboarding" element={<OnboardingReports />} />
            <Route path="transaction" element={<TransactionReports />} />
          </Route>

          {/* Wallet Adjustment - MOVED INSIDE DASHBOARD LAYOUT */}
          <Route path="wallet-adjustment" element={<WalletAdjustment />} />
        </Route>

        {/* 3. REDIRECTS */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;