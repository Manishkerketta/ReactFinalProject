import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// UI Components
import GlobalLoader from './components/ui/GlobalLoader'; // Create this file with the code below

// Auth Components
import AuthSystem from './components/AuthSystem';
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
import ProfileDetails from './components/pages/ProfileDetails';

// Import API services
import { performBankLogin, getDecryptedData } from './utils/authService';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('access_token');
    if (!token) return <Navigate to="/login" replace />;
    return children;
};

// --- NEW: COMPONENT TO TRIGGER LOADER ON ROUTE CHANGES ---
const RouteChangeTracker = ({ setIsLoading }) => {
  const location = useLocation();

  useEffect(() => {
    // Show loader on route change
    setIsLoading(true);
    
    // Simulate loading time (matches the SVG drawing animation duration)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); 

    return () => clearTimeout(timer);
  }, [location.pathname, setIsLoading]);

  return null;
};

function App() {
  // 1. ADD LOADING STATE
  const [isLoading, setIsLoading] = useState(true);

  // Initial load effect (on site refresh)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // --- BACKGROUND TOKEN REFRESH LOGIC ---
    const refreshInterval = setInterval(async () => {
      const encryptedCreds = localStorage.getItem('login_payload');
      const token = localStorage.getItem('access_token');

      if (token && encryptedCreds) {
        try {
          const loginResp = await performBankLogin(encryptedCreds);
          const loginEncryptedData = loginResp.data.RequestData || loginResp.data;
          const loginDecrypted = await getDecryptedData(loginEncryptedData);

          if (loginDecrypted && loginDecrypted.access_token) {
            localStorage.setItem('access_token', loginDecrypted.access_token);
          }
        } catch (error) {
          console.error("Background refresh failed:", error);
        }
      }
    }, 600000); // 10 Minutes (Adjusted from your 600000)

    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <Router>
      {/* 2. ADD ROUTE TRACKER INSIDE ROUTER */}
      <RouteChangeTracker setIsLoading={setIsLoading} />

      {/* 3. SHOW GLOBAL LOADER */}
      {isLoading && <GlobalLoader />}

      <Routes>
        <Route path="/login" element={<AuthSystem />} />

        <Route path="/dashboard" element={
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
        }>
          <Route index element={<DashboardHome />} />
          <Route path="create-cbc" element={<CreateCBCUser />} />
          <Route path="user-request" element={<UserRequest />} />
          <Route path="profile-details" element={<ProfileDetails />} />
          <Route path="user-list" element={<UserListReport />} />
          <Route path="functionalities" element={<Functionalities />} />
          <Route path="audit-trail" element={<AuditTrail />} />
          <Route path="reports">
            <Route path="onboarding" element={<OnboardingReports />} />
            <Route path="transaction" element={<TransactionReports />} />
          </Route>
          <Route path="wallet-adjustment" element={<WalletAdjustment />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;