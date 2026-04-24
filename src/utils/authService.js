import axios from 'axios';

// --- PROXY BASE PATHS ---
const ENCR_DECR_BASE = '/api-encr'; 
const BANK_API_BASE = '/api-bank/dev/nsdlab-internal';
const ONBOARD_BASE = '/api-onboard/NSDL/user_onboarding';
const SDK_API_BASE = '/api-sdk/NSDL/user_onboarding_report';
const UTILITY_BASE = '/api-utility/dev/nsdlab-internal/user-mgmt/utility';
const WALLET_BASE = '/api-wallet/NSDLAB/wallet_topup/admin';

const SECURITY_KEY = 'a6T8tOCYiSzDTrcqPvCbJfy0wSQOVcfaevH0gtwCtoU=';

// 1. GENERAL ENCRYPTION
export const getEncryptedData = async (payload) => {
  const response = await axios.post(`${ENCR_DECR_BASE}/encr`, payload, {
    headers: { 'Key': SECURITY_KEY, 'Content-Type': 'application/json' }
  });
  return typeof response.data === 'object' ? response.data.RequestData : response.data;
};

// 2. GENERAL DECRYPTION
export const getDecryptedData = async (encryptedDataFromServer) => {
  try {
    let rawString = "";
    if (typeof encryptedDataFromServer === 'object' && encryptedDataFromServer !== null) {
      rawString = encryptedDataFromServer.ResponseData || encryptedDataFromServer.RequestData || encryptedDataFromServer.req;
    } else {
      rawString = encryptedDataFromServer;
    }
    const response = await axios.post(`${ENCR_DECR_BASE}/decr`, { req: rawString }, {
      headers: { 'Key': SECURITY_KEY, 'Content-Type': 'application/json' }
    });
    return response.data; 
  } catch (error) {
    throw error;
  }
};

// 3. BANK LOGIN
export const performBankLogin = async (encryptedString) => {
  return await axios.post(`${BANK_API_BASE}/user-authorization/user/login`, 
    { RequestData: encryptedString }, 
    {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Web',
        'Authorization': 'Basic bnNkbGFiLWludGVybmFsLWNsaWVudDpuc2RsYWItaW50ZXJuYWwtcGFzc3dvcmQ='
      }
    }
  );
};

// 4. DASHBOARD STATS
export const performDashboardFetch = async (token) => {
  return await axios.get(`${BANK_API_BASE}/user-mgmt/user/dashboard`, {
    headers: { 'Authorization': token, 'User-Agent': 'Web' }
  });
};

// 5. USER REQUEST LIST (ENCRYPTED)
export const fetchUserList = async (encryptedPayload) => {
  const token = localStorage.getItem('access_token');
  return await axios.post(`${SDK_API_BASE}/fetch-user-list`,
    { RequestData: encryptedPayload },
    {
      headers: {
        'Authorization': token,
        'pass_key': 'QC62FQKXT2DQTO43LMWH5A44UKVPQ7LK5Y6HVHRQ3XTIKLDTB6HA'
      }
    }
  );
};

// 6. USER REQUEST LIST (PLAIN)
export const fetchUserListPlain = async (payload) => {
  const token = localStorage.getItem('access_token');
  return await axios.post(`${ONBOARD_BASE}/fetch-user-list`, payload, {
    headers: { 'Authorization': token }
  });
};

// 7. USER DETAILS (PLAIN)
export const fetchUserDetails = async (username, userRole) => {
  const token = localStorage.getItem('access_token');
  return await axios.post(`${ONBOARD_BASE}/fetch-user-details`, 
    { username, userRole },
    { headers: { 'Authorization': token } }
  );
};

// 8. USER DETAILS (ENCRYPTED)
export const fetchUserDetailsEncr = async (encryptedPayload) => {
  const token = localStorage.getItem('access_token');
  return await axios.post(`${SDK_API_BASE}/fetch-user-details`,
    { RequestData: encryptedPayload },
    {
      headers: {
        'Authorization': token,
        'pass_key': 'QC62FQKXT2DQTO43LMWH5A44UKVPQ7LK5Y6HVHRQ3XTIKLDTB6HA'
      }
    }
  );
};

// 9. FORGOT PASSWORD FLOW
export const sendForgotPasswordOtp = async (username) => {
  return await axios.post(`${UTILITY_BASE}/send-forgot-password-otp?userName=${username}`);
};

export const verifyForgotPasswordOtp = async (otp, username) => {
  return await axios.post(`${UTILITY_BASE}/verify-otp-send-temporary-password`, { otp, userName: username });
};

// 10. WALLET ADJUSTMENT FLOW
export const fetchUserForAdjustment = async (payload) => {
  const token = localStorage.getItem('access_token');
  return await axios.post(`${ONBOARD_BASE}/fetch-user-details`, payload, {
    headers: { 'Authorization': token }
  });
};

export const performWalletAdjustment = async (payload) => {
  return await axios.post(`${WALLET_BASE}/payDebit`, payload);
};



/**
 * Send Change Password OTP
 */
export const sendChangePasswordOtp = async (oldPassword, newPassword) => {
  const token = localStorage.getItem('access_token');
  return await axios.post(
    '/api-password/NSDLAB/user-mgmt-internal/user/send-change-password-otp',
    { oldPassword, newPassword },
    {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    }
  );
};

// ... existing imports ...

/**
 * Logout User
 */
export const performLogout = async () => {
  const token = localStorage.getItem('access_token');
  return await axios.post(
    'https://services.iserveu.online/dev/nsdlab-internal/user-authorization/logout',
    {},
    {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    }
  );
};

// ... existing code ...

/**
 * Fetch City, State, District via Pincode
 * @param {string} pincode 
 */
export const fetchLocationByPin = async (pincode) => {
  try {
    const response = await axios.post('https://services.txninfra.com/isu/pincode/getCityStateDistrictAndroid', 
      { pin: pincode },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};