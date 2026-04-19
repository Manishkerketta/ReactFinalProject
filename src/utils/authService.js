import axios from 'axios';

// URLs provided by you
// Change your constants to these:
const ENCR_DECR_BASE = '/api-encr'; 
const BANK_API_BASE = '/api-bank/dev/nsdlab-internal';
const SECURITY_KEY = 'a6T8tOCYiSzDTrcqPvCbJfy0wSQOVcfaevH0gtwCtoU=';

// 1. Function to Encrypt using your utility
export const getEncryptedData = async (payload) => {
  const response = await axios.post(`${ENCR_DECR_BASE}/encr`, payload, {
    headers: { 'Key': SECURITY_KEY, 'Content-Type': 'application/json' }
  });
  return response.data; // This returns the raw encrypted string
};

// 2. Function to Decrypt using your utility
// src/utils/authService.js

// src/utils/authService.js

export const getDecryptedData = async (encryptedDataFromServer) => {
  try {
    /**
     * EXTRACTION FIX:
     * We must ensure rawString is ONLY the Base64 text.
     * If bank sends {"ResponseData": "..."} or {"RequestData": "..."}
     */
    let rawString = "";
    
    if (typeof encryptedDataFromServer === 'object' && encryptedDataFromServer !== null) {
      // Extract the string from the common keys
      rawString = encryptedDataFromServer.ResponseData || 
                  encryptedDataFromServer.RequestData || 
                  encryptedDataFromServer.req;
    } else if (typeof encryptedDataFromServer === 'string') {
      // If it's a string, it might be a JSON string like '{"ResponseData":"..."}'
      // We try to parse it to be safe.
      try {
        const parsed = JSON.parse(encryptedDataFromServer);
        rawString = parsed.ResponseData || parsed.RequestData || parsed.req || encryptedDataFromServer;
      } catch (e) {
        rawString = encryptedDataFromServer;
      }
    }

    // Wrap in the format your utility expects: { "req": "PURE_BASE64_STRING" }
    const payload = { req: rawString };

    const response = await axios.post(`${ENCR_DECR_BASE}/decr`, payload, {
      headers: { 
        'Key': SECURITY_KEY, 
        'Content-Type': 'application/json' 
      }
    });
    
    return response.data; 
  } catch (error) {
    console.error("Decryption Utility Error:", error.response?.data || error.message);
    throw error;
  }
};

// 3. The Main Login Call
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