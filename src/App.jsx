import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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

function App() {
  
  useEffect(() => {
    // --- BACKGROUND TOKEN REFRESH LOGIC ---
    const refreshInterval = setInterval(async () => {
      // 1. Get the encrypted credentials stored during initial login
      const encryptedCreds = localStorage.getItem('login_payload');
      const token = localStorage.getItem('access_token');

      // Only attempt refresh if user is logged in and we have the payload
      if (token && encryptedCreds) {
        try {
          console.log("Auto-refreshing session...");
          
          // 2. Call the login API again with the same encrypted payload
          const loginResp = await performBankLogin(encryptedCreds);
          
          // 3. Decrypt the new response
          const loginEncryptedData = loginResp.data.RequestData || loginResp.data;
          const loginDecrypted = await getDecryptedData(loginEncryptedData);

          if (loginDecrypted && loginDecrypted.access_token) {
            // 4. Update the new token in storage
            localStorage.setItem('access_token', loginDecrypted.access_token);
            console.log("Token updated successfully at:", new Date().toLocaleTimeString());
          }
        } catch (error) {
          console.error("Background refresh failed:", error);
          // Optional: If refresh fails multiple times, you could force logout here
        }
      }
    }, 600000); // 60000ms = 1 Minute

    // Cleanup interval on app unmount
    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <Router>
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