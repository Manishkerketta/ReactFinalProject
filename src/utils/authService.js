import axios from 'axios';

// Base URLs
const ENCR_DECR_BASE = '/api-encr'; 
const BANK_API_BASE = '/api-bank/dev/nsdlab-internal';
const SDK_API_BASE = 'https://apidev-sdk.iserveu.online/NSDL/user_onboarding_report';

// Constants
const SECURITY_KEY = 'a6T8tOCYiSzDTrcqPvCbJfy0wSQOVcfaevH0gtwCtoU=';

/**
 * 1. GENERAL ENCRYPTION
 * Plain JSON Object -> Encrypted Base64 String
 */
export const getEncryptedData = async (payload) => {
  const response = await axios.post(`${ENCR_DECR_BASE}/encr`, payload, {
    headers: { 'Key': SECURITY_KEY, 'Content-Type': 'application/json' }
  });
  return typeof response.data === 'object' ? response.data.RequestData : response.data;
};

/**
 * 2. GENERAL DECRYPTION
 * Encrypted Base64 String -> Plain JSON Object
 */
export const getDecryptedData = async (encryptedDataFromServer) => {
  try {
    let rawString = "";
    if (typeof encryptedDataFromServer === 'object' && encryptedDataFromServer !== null) {
      rawString = encryptedDataFromServer.ResponseData || 
                  encryptedDataFromServer.RequestData || 
                  encryptedDataFromServer.req;
    } else if (typeof encryptedDataFromServer === 'string') {
      try {
        const parsed = JSON.parse(encryptedDataFromServer);
        rawString = parsed.ResponseData || parsed.RequestData || parsed.req || encryptedDataFromServer;
      } catch (e) {
        rawString = encryptedDataFromServer;
      }
    }

    const payload = { req: rawString };
    const response = await axios.post(`${ENCR_DECR_BASE}/decr`, payload, {
      headers: { 'Key': SECURITY_KEY, 'Content-Type': 'application/json' }
    });
    return response.data; 
  } catch (error) {
    console.error("Decryption Utility Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 3. BANK LOGIN API
 */
export const performBankLogin = async (encryptedString) => {
  return await axios.post(`${BANK_API_BASE}/user-authorization/user/login`, 
    { RequestData: encryptedString }, 
    {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Web',
        'Geo-Location': 'eyJkZXZpY2UiOiJXRUIiLCJsYXRpdHVkZSI6MjAuMzM3MDcwMjM4MjIyMzYzLCJsb25naXR1ZGUiOjg1LjgwOTU0NDM0NTUzMDQ0LCJjaXR5IjoiQmh1YmFuZXN3YXIiLCJjb3VudHJ5IjoiSW5kaWEiLCJjb250aW5lbnQiOiJBc2lhIn0=',
        'Authorization': 'Basic bnNkbGFiLWludGVybmFsLWNsaWVudDpuc2RsYWItaW50ZXJuYWwtcGFzc3dvcmQ='
      }
    }
  );
};

/**
 * 4. DASHBOARD STATS API
 */
export const performDashboardFetch = async (token) => {
  return await axios.get(`${BANK_API_BASE}/user-mgmt/user/dashboard`, {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Web',
      'Geo-Location': 'eyJkZXZpY2UiOiJXRUIiLCJsYXRpdHVkZSI6MjAuMzM3MDcwMjM4MjIyMzYzLCJsb25naXR1ZGUiOjg1LjgwOTU0NDM0NTUzMDQ0LCJjaXR5IjoiQmh1YmFuZXN3YXIiLCJjb3VudHJ5IjoiSW5kaWEiLCJjb250aW5lbnQiOiJBc2lhIn0=',
      'Authorization': token 
    }
  });
};

/**
 * 5. USER REQUEST LIST - FETCH
 */
export const fetchUserList = async (encryptedPayload) => {
  const token = localStorage.getItem('access_token');
  return await axios.post(`${SDK_API_BASE}/fetch-user-list`,
    { RequestData: encryptedPayload },
    {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Web',
        'Authorization': token,
        'pass_key': 'QC62FQKXT2DQTO43LMWH5A44UKVPQ7LK5Y6HVHRQ3XTIKLDTB6HA'
      }
    }
  );
};

/**
 * 6. USER REQUEST LIST - PLAIN FETCH (For ROLE_OPS_MAKER)
 * This hits the apidev (SDK) endpoint without encryption as requested.
 */
export const fetchUserListPlain = async (payload) => {
  const token = localStorage.getItem('access_token');
  return await axios.post(
    'https://apidev.iserveu.online/NSDL/user_onboarding/fetch-user-list',
    payload, // Sending plain JSON body
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      }
    }
  );
};
export const fetchUserDetails = async (username, userRole) => {
  const token = localStorage.getItem('access_token');
  return await axios.post(
    'https://apidev.iserveu.online/NSDL/user_onboarding/fetch-user-details',
    { username, userRole },
    { headers: { 'Authorization': token, 'Content-Type': 'application/json' } }
  );
};


export const fetchUserDetailsEncr = async (encryptedPayload) => {
  const token = localStorage.getItem('access_token');
  return await axios.post(
    'https://apidev-sdk.iserveu.online/NSDL/user_onboarding_report/fetch-user-details',
    { RequestData: encryptedPayload },
    {
      headers: {
        'Authorization': token,
        'pass_key': 'QC62FQKXT2DQTO43LMWH5A44UKVPQ7LK5Y6HVHRQ3XTIKLDTB6HA',
        'User-Agent': 'Web',
        'Geo-Location': 'eyJkZXZpY2UiOiJXRUIiLCJsYXRpdHVkZSI6MjAuMzM3MDcwMjM4MjIyMzYzLCJsb25naXR1ZGUiOjg1LjgwOTU0NDM0NTUzMDQ0LCJjaXR5IjoiQmh1YmFuZXN3YXIiLCJjb3VudHJ5IjoiSW5kaWEiLCJjb250aW5lbnQiOiJBc2lhIn0=',
        'Content-Type': 'application/json'
      }
    }
  );
};

// src/utils/authService.js

// ... existing functions ...

/**
 * Send OTP for Forgot Password
 */
export const sendForgotPasswordOtp = async (username) => {
  return await axios.post(`https://services.iserveu.online/dev/nsdlab-internal/user-mgmt/utility/send-forgot-password-otp?userName=${username}`);
};

/**
 * Verify OTP and Send Temporary Password
 */
export const verifyForgotPasswordOtp = async (otp, username) => {
  // Assuming this API takes a POST body with otp and username
  return await axios.post(`https://services.iserveu.online/dev/nsdlab-internal/user-mgmt/utility/verify-otp-send-temporary-password`, {
    otp: otp,
    userName: username
  });
};

// export const performDashboardFetch = async (token) => {
//   return await axios.get(`${BANK_API_BASE}/user-mgmt/user/dashboard`, {
//     headers: {
//       'Content-Type': 'application/json',
//       'User-Agent': 'Web',
//       'Geo-Location': 'eyJkZXZpY2UiOiJXRUIiLCJsYXRpdHVkZSI6MjAuMzM3MDcwMjM4MjIyMzYzLCJsb25naXR1ZGUiOjg1LjgwOTU0NDM0NTUzMDQ0LCJjaXR5IjoiQmh1YmFuZXN3YXIiLCJjb3VudHJ5IjoiSW5kaWEiLCJjb250aW5lbnQiOiJBc2lhIn0=',
//       'Authorization': token 
//     }
//   });
// };