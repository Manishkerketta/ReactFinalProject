import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import nsdl_logo from '../assets/nsdl_logo.png';
import { 
  getEncryptedData, 
  performBankLogin, 
  getDecryptedData, 
  performDashboardFetch,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp 
} from '../utils/authService';

// Reusable Custom Modal (Matches image_ae14c3.png style)
const StatusModal = ({ isOpen, type, message, onClose, onConfirm }) => {
  if (!isOpen) return null;
  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-[420px] overflow-hidden animate-modalIn relative">
        <div className="p-10 text-center">
          <p className="text-[18px] font-bold text-gray-700 mb-8 px-2">{message}</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={onConfirm || onClose} 
              className="min-w-[100px] py-2.5 bg-[#8B0000] text-white font-bold rounded uppercase text-sm hover:bg-[#700000] transition-colors"
            >
              OK
            </button>
            {onConfirm && (
              <button 
                onClick={onClose} 
                className="min-w-[100px] py-2.5 border border-red-800 text-red-800 font-bold rounded uppercase text-sm hover:bg-red-50 transition-colors"
              >
                NO
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

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
    </div>
  </div>
);

const AuthSystem = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('login');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showPassword, setShowPassword] = useState(false);
  const [modal, setModal] = useState({ open: false, type: '', message: '', action: null });

  useEffect(() => {
    if (step === 'forgot') setUsername('');
  }, [step]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      localStorage.clear();
      
      const encryptedCreds = await getEncryptedData({
        grant_type: "password",
        username: username.trim(),
        password: password.trim()
      });

      const loginResp = await performBankLogin(encryptedCreds);
      const loginDecrypted = await getDecryptedData(loginResp.data.RequestData || loginResp.data);

      if (loginDecrypted?.access_token) {
        // FETCH DASHBOARD DATA IMMEDIATELY AFTER LOGIN SUCCESS
        const dashResp = await performDashboardFetch(loginDecrypted.access_token);
        const dashDecrypted = await getDecryptedData(dashResp.data);

        setModal({
          open: true,
          type: 'success',
          message: 'Congratulations!!! Login Successfull',
          action: () => {
            localStorage.setItem('access_token', loginDecrypted.access_token);
            localStorage.setItem('user_details', JSON.stringify(loginDecrypted));
            localStorage.setItem('dashboard_stats', JSON.stringify(dashDecrypted)); // Save Stats
            navigate('/dashboard');
          }
        });
      } else {
        setModal({ open: true, type: 'error', message: 'Invalid Credentials' });
      }
    } catch (err) {
      setModal({ open: true, type: 'error', message: 'System error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!username) return;
    setLoading(true);
    try {
      const resp = await sendForgotPasswordOtp(username);
      if (resp.data.status === "SUCCESS") {
        setModal({ open: true, type: 'success', message: resp.data.statusDesc });
        setStep('otp');
      } else {
        setModal({ open: true, type: 'error', message: resp.data.statusDesc });
      }
    } catch (err) {
      setModal({ open: true, type: 'error', message: "Service connection failed." });
    } finally { setLoading(false); }
  };

  const handleVerifyOTP = async () => {
    const fullOtp = otp.join('');
    setLoading(true);
    try {
      const resp = await verifyForgotPasswordOtp(fullOtp, username);
      if (resp.data.statusCode === 0 || resp.data.status === "SUCCESS") {
        setStep('success');
      } else {
        setModal({ open: true, type: 'error', message: resp.data.statusDesc });
      }
    } catch (err) {
      setModal({ open: true, type: 'error', message: "Verification failed." });
    } finally { setLoading(false); }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling && element.value) element.nextSibling.focus();
  };

  return (
    <>
      <StatusModal 
        isOpen={modal.open} 
        type={modal.type} 
        message={modal.message} 
        onClose={() => setModal({ ...modal, open: false })}
        onConfirm={modal.action}
      />

      {step === 'login' && (
        <CardWrapper>
          <h2 className="text-[24px] font-bold text-[#1A1A1A] mb-6">Login to your Account</h2>
          <form className="w-full max-w-[395px] space-y-6" onSubmit={handleLogin}>
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[14px] text-gray-500 font-medium">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full h-[50px] px-4 border border-gray-200 rounded-md outline-none focus:border-red-800" placeholder="Enter your Username" required />
            </div>
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[14px] text-gray-500 font-medium">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-[50px] px-4 border border-gray-200 rounded-md outline-none focus:border-red-800" placeholder="Enter your password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full h-[48px] bg-[#8B0000] text-white font-bold rounded-md uppercase flex items-center justify-center">
              {loading ? <Loader2 className="animate-spin" /> : "Login"}
            </button>
            <div className="flex items-center justify-between text-[13px] mt-4 w-full">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer"><input type="checkbox" className="rounded text-red-800" /> Remember Me</label>
              <button type="button" onClick={() => setStep('forgot')} className="text-red-800 font-semibold hover:underline">Forgot Password?</button>
            </div>
          </form>
        </CardWrapper>
      )}

      {step === 'forgot' && (
        <CardWrapper>
          <div className="w-full text-left">
            <h2 className="text-[32px] font-bold text-[#1A1A1A] leading-tight mb-2">Forgot <br/> Password?</h2>
            <p className="text-gray-500 text-[15px] mb-8 leading-relaxed">Put your Username and verify OTP then you will receive a new password in your inbox</p>
            <div className="relative mb-8">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[12px] text-gray-400">Username*</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full h-[54px] px-4 border border-gray-300 rounded-md outline-none focus:border-[#8B0000]" placeholder="Enter Username" />
            </div>
            <button onClick={handleSendOTP} disabled={loading} className="w-full h-[54px] bg-[#8B0000] text-white font-bold rounded-md uppercase mb-8 flex items-center justify-center">
              {loading ? <Loader2 className="animate-spin" /> : "Send OTP"}
            </button>
            <button onClick={() => setStep('login')} className="w-full flex items-center justify-center gap-2 text-gray-600 font-bold hover:text-red-800"><ArrowLeft size={18} /> Back to Login</button>
          </div>
        </CardWrapper>
      )}

      {step === 'otp' && (
        <CardWrapper>
          <div className="w-full text-left">
            <h2 className="text-[32px] font-bold text-[#1A1A1A] mb-2">Verify OTP</h2>
            <p className="text-[#5B6B79] text-[15px] mb-8">The OTP was sent to the following recipient</p>
            <div className="flex gap-3 mb-6">
              {otp.map((data, index) => (
                <input key={index} type="text" maxLength="1" className="w-[50px] h-[54px] border border-gray-200 rounded-md text-center text-lg font-bold outline-none focus:border-[#8B0000] bg-gray-50" value={data} onChange={e => handleOtpChange(e.target, index)} onFocus={e => e.target.select()} />
              ))}
            </div>
            <p className="text-[14px] text-gray-600 mb-8">Go to previous page <button onClick={() => setStep('forgot')} className="text-[#8B0000] font-bold hover:underline">Click Here</button></p>
            <button onClick={handleVerifyOTP} disabled={loading} className="w-full h-[54px] bg-[#8B0000] text-white font-bold rounded-md uppercase mb-6 flex items-center justify-center">
              {loading ? <Loader2 className="animate-spin" /> : "Verify"}
            </button>
            <div className="text-center"><button onClick={handleSendOTP} className="text-gray-600 font-bold hover:text-red-800">Resend OTP</button></div>
          </div>
        </CardWrapper>
      )}

      {step === 'success' && (
        <CardWrapper>
          <div className="text-center">
            <h2 className="text-[28px] font-bold text-[#1A1A1A] mb-4">Success!</h2>
            <p className="text-gray-500 text-[15px] mb-10 px-4">Your OTP has been verified. Please check your inbox for the new temporary password.</p>
            <button onClick={() => setStep('login')} className="w-full h-[54px] bg-[#8B0000] text-white font-bold rounded-md uppercase">Back to Login</button>
          </div>
        </CardWrapper>
      )}
    </>
  );
};

export default AuthSystem;