import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import nsdl_logo from '../assets/nsdl_logo.png';
// Importing the modular functions we created
import { getEncryptedData, performBankLogin, getDecryptedData } from '../utils/authService';

const AuthSystem = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('login'); // login, forgot, otp, success
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Dynamic input states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // The Integrated Login Logic
  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   if (!username || !password) return alert("Please fill in all fields");

  //   setLoading(true);

  //   try {
  //     // 1. Get encrypted payload from your utility
  //     const loginPayload = {
  //       grant_type: "password",
  //       username: username,
  //       password: password
  //     };
      
  //     const encryptionResponse = await getEncryptedData(loginPayload);

  //     /**
  //      * FIX: The Bank API expects RequestData to be a STRING, not an OBJECT.
  //      * If your encr utility returns { RequestData: "xyz" }, we must extract "xyz".
  //      */
  //     const encryptedStringOnly = typeof encryptionResponse === 'object' 
  //       ? encryptionResponse.RequestData 
  //       : encryptionResponse;

  //     // 2. Pass that clean string to the Bank API
  //     const bankResponse = await performBankLogin(encryptedStringOnly);

  //     /**
  //      * 3. Decrypt the response coming back from the bank
  //      * The bank usually returns { RequestData: "encrypted_response_string" }
  //      */
  //     const encryptedResponseData = bankResponse.data.RequestData || bankResponse.data;
      
  //     // Ensure we are passing a string to the decr utility
  //     const finalData = await getDecryptedData(
  //       typeof encryptedResponseData === 'object' 
  //         ? encryptedResponseData.RequestData 
  //         : encryptedResponseData
  //     );

  //     if (finalData.access_token) {
  //       // Save session
  //       localStorage.setItem('access_token', finalData.access_token);
  //       localStorage.setItem('user_details', JSON.stringify(finalData));
        
  //       // Success: Route to dashboard
  //       navigate('/dashboard');
  //     } else {
  //       alert(finalData.message || "Invalid credentials. Please try again.");
  //     }
  //   } catch (err) {
  //     console.error("Auth Flow Error:", err);
  //     // Checking for the specific unmarshalling error in the console if it happens again
  //     alert("System error. Please check your credentials or connection.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleLogin = async (e) => {
  e.preventDefault();
  if (!username || !password) return alert("Please fill in all fields");

  setLoading(true);

  try {
    // 1. ENCRYPT
    const encryptionResponse = await getEncryptedData({
      grant_type: "password",
      username: username,
      password: password
    });

    const encryptedStringOnly = typeof encryptionResponse === 'object' 
      ? encryptionResponse.RequestData 
      : encryptionResponse;

    // 2. LOGIN
    const bankResponse = await performBankLogin(encryptedStringOnly);

    // 3. DECRYPT
    // Most bank APIs return the encrypted payload inside "RequestData"
    const encryptedBodyFromServer = bankResponse.data.RequestData || bankResponse.data;

    // We pass the encrypted chunk to our decryption utility
    const finalData = await getDecryptedData(encryptedBodyFromServer);

    // If finalData is the object you shared (with access_token)
    if (finalData && finalData.access_token) {
      localStorage.setItem('access_token', finalData.access_token);
      localStorage.setItem('user_details', JSON.stringify(finalData));
      
      console.log("Login Successful, Token received");
      navigate('/dashboard');
    } else {
      alert("Decryption failed or invalid credentials");
    }
  } catch (err) {
    console.error("Auth Flow Error:", err);
    alert("Login Error: " + (err.response?.data?.error || "Check console"));
  } finally {
    setLoading(false);
  }
};

  // Wrapper for consistency across all auth screens
  const CardWrapper = ({ children }) => (
    <div className="h-screen w-full bg-[#FBFBFB] flex items-center justify-center font-sans overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -left-40 top-1/4 w-[600px] h-[800px] bg-red-900 opacity-10 blur-[120px] rounded-full rotate-12"></div>
      </div>
      <div className="relative z-10 flex flex-col items-center w-full px-4">
        <div className="w-full max-w-[475px] min-h-[521px] bg-white rounded-[10px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center p-10">
          <div className="w-[274px] h-[64px] mb-8">
            <img src={nsdl_logo} alt="NSDL" className="w-full h-full object-contain" />
          </div>
          {children}
        </div>
        <div className="mt-8 flex gap-8 text-[12px] text-gray-400">
          <span className="hover:underline cursor-pointer">Terms and Conditions</span>
          <span className="hover:underline cursor-pointer">Privacy Policy</span>
          <span className="hover:underline cursor-pointer">CA Privacy Notice</span>
        </div>
      </div>
    </div>
  );

  if (step === 'login') {
    return (
      <CardWrapper>
        <h2 className="text-[24px] font-bold text-[#1A1A1A] mb-6">Login to your Account</h2>
        <form className="w-full max-w-[395px] space-y-6" onSubmit={handleLogin}>
          {/* Username */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[14px] text-gray-500 font-medium">Username</label>
            <input 
              type="text" 
              placeholder="Enter your Username" 
              className="w-full h-[50px] px-4 border border-gray-200 rounded-md outline-none focus:border-red-800"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          {/* Password */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[14px] text-gray-500 font-medium">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password" 
                className="w-full h-[50px] px-4 border border-gray-200 rounded-md outline-none focus:border-red-800"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-[48px] bg-[#8B0000] hover:bg-[#700000] text-white font-bold rounded-md uppercase flex items-center justify-center transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Login"}
          </button>
          
          <div className="flex items-center justify-between text-[13px] mt-4">
            <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <input type="checkbox" className="rounded text-red-800" />
              Remember Me
            </label>
            <button type="button" onClick={() => setStep('forgot')} className="text-red-800 font-semibold hover:underline">Forgot Password?</button>
          </div>
        </form>
      </CardWrapper>
    );
  }

  if (step === 'forgot') {
    return (
      <CardWrapper>
        <h2 className="text-[24px] font-bold text-[#1A1A1A] mb-4">Forgot Password</h2>
        <p className="text-gray-500 text-center text-[14px] mb-8 px-4">Lost your password? No worries. Enter your Mobile Number, and we'll help you reset it.</p>
        <div className="w-full max-w-[395px] space-y-6 text-left">
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] text-gray-500 font-medium">Mobile Number</label>
            <input type="text" placeholder="Please enter your Mobile Number" className="w-full h-[50px] px-4 border border-gray-200 rounded-md outline-none focus:border-red-800" />
          </div>
          <button onClick={() => setStep('otp')} className="w-full h-[48px] bg-[#8B0000] text-white font-bold rounded-md uppercase">Send OTP</button>
          <p className="text-center text-[14px]">Remembered Password? <button onClick={() => setStep('login')} className="text-red-800 font-bold hover:underline">Log In</button></p>
        </div>
      </CardWrapper>
    );
  }

  if (step === 'otp') {
    return (
      <CardWrapper>
        <h2 className="text-[24px] font-bold text-[#1A1A1A] mb-4">Phone Verification</h2>
        <p className="text-gray-500 text-center text-[14px] mb-8 px-4">To ensure your account security, please verify your Mobile Number by entering the OTP sent to your device.</p>
        <div className="w-full max-w-[395px] space-y-6 text-left">
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] text-gray-500 font-medium">OTP</label>
            <input type="text" placeholder="Please enter OTP" className="w-full h-[50px] px-4 border border-gray-200 rounded-md outline-none focus:border-red-800" />
          </div>
          <button onClick={() => setStep('success')} className="w-full h-[48px] bg-[#8B0000] text-white font-bold rounded-md uppercase">Verify</button>
          <p className="text-center text-[14px]">Remembered Password? <button onClick={() => setStep('login')} className="text-red-800 font-bold hover:underline">Log In</button></p>
        </div>
      </CardWrapper>
    );
  }

  if (step === 'success') {
    return (
      <CardWrapper>
        <h2 className="text-[24px] font-bold text-[#1A1A1A] mb-4">Verification Success!</h2>
        <p className="text-gray-500 text-center text-[14px] mb-10 px-4">Your mobile number has been successfully verified. You'll receive your credentials via registered Email.</p>
        <button onClick={() => setStep('login')} className="w-full max-w-[395px] h-[48px] bg-[#8B0000] text-white font-bold rounded-md uppercase">Back to Login</button>
      </CardWrapper>
    );
  }
};

export default AuthSystem;