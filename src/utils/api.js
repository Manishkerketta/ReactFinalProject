import axios from 'axios';
import CryptoJS from 'crypto-js';

// Mapping the keys you provided
const S_KEY = "a6T8tOCYiSzDTrcqPvCbJfy0wSQOVcfaevH0gtwCtoU="; 
const PASS_KEY = "QC62FQKXT2DQTO43LMWH5A44UKVPQ7LK5Y6HVHRQ3XTIKLDTB6HA";

/**
 * ENCRYPTION LOGIC
 * Note: Most IServeU APIs use the first 16 or 32 characters 
 * of the sKey as the IV or Key depending on the environment.
 */
export const encryptPayload = (data) => {
    const jsonStr = JSON.stringify(data);
    // Parsing the key. Often it needs to be parsed as Utf8 or Hex
    const key = CryptoJS.enc.Utf8.parse(S_KEY.substring(0, 32)); 
    const iv = CryptoJS.enc.Utf8.parse(S_KEY.substring(0, 16));

    const encrypted = CryptoJS.AES.encrypt(jsonStr, key, {
        iv: iv,
        mode: CryptoJS.mod.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
};

// Base URLs from your configuration
const AUTH_BASE_URL = 'https://services-encr.iserveu.online/dev/nsdlab-internal';
const USER_MGMT_BASE_URL = 'https://services.iserveu.online/dev/nsdlab-internal/user-mgmt';

const apiClient = axios.create({
    baseURL: AUTH_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Web',
        'pass_Key': PASS_KEY // Often required in headers
    }
});

// Interceptor to handle dynamic Base URLs
apiClient.interceptors.request.use((config) => {
    // If the URL contains 'user-mgmt', switch the baseURL
    if (config.url.includes('/user/dashboard')) {
        config.baseURL = USER_MGMT_BASE_URL;
    }
    
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;