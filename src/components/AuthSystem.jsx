import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import nsdl_logo from '../assets/nsdl_logo.png';
import nsdl_watermark from '../assets/nsdl_watermark.png';
import {
  getEncryptedData,
  performBankLogin,
  getDecryptedData,
  performDashboardFetch,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp
} from '../utils/authService';

// Reusable Custom Modal (Matches image_ae14c3.png)
const StatusModal = ({ isOpen, message, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-[420px] overflow-hidden animate-modalIn relative">
        <div className="p-10 text-center">
          <p className="text-[18px] font-bold text-gray-700 mb-8 px-2">{message}</p>
          <div className="flex gap-4 justify-center">
            <button onClick={onConfirm || onClose} className="min-w-[100px] py-2.5 bg-[#8B0000] text-white font-bold rounded uppercase text-sm">OK</button>
            {onConfirm && (
              <button onClick={onClose} className="min-w-[100px] py-2.5 border border-red-800 text-red-800 font-bold rounded uppercase text-sm">NO</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Split Screen Wrapper (Layout Ratio fixed for image_63ddd9.png)
const CardWrapper = ({ children }) => (
  <div className="h-screen w-full bg-white flex overflow-hidden font-sans">
    {/* LEFT PANEL */}
    <div className="hidden lg:flex w-[55%] flex-col items-start justify-start p-16 bg-white border-r border-gray-50">
      <img src={nsdl_logo} alt="NSDL Payments Bank" className="w-[340px] mb-12" />
      
      <div className="w-full max-w-[580px] aspect-[16/11] bg-[#F4F4F4] rounded-xl flex items-center justify-center relative overflow-hidden border border-gray-100 shadow-inner">
         <img 
            src={nsdl_watermark} 
            alt="Watermark" 
            className="absolute w-full h-full object-contain pointer-events-none select-none z-0 scale-110"
         />
      </div>
    </div>

    {/* RIGHT PANEL */}
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white lg:bg-transparent">
      <div className="w-full max-w-[440px]">
        {children}
      </div>
    </div>

    <style>
      {`
        @keyframes watermarkZoom {
          0% { transform: scale(0.6); opacity: 0; }
          100% { transform: scale(1.1); opacity: 0.08; }
        }
        .animate-watermarkZoom {
          animation: watermarkZoom 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-modalIn {
          animation: modalIn 0.3s ease-out forwards;
        }
      `}
    </style>
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
  const [modal, setModal] = useState({ open: false, message: '', action: null });

  useEffect(() => { if (step === 'forgot') setUsername(''); }, [step]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      localStorage.clear();
      const encryptedCreds = await getEncryptedData({ grant_type: "password", username: username.trim(), password: password.trim() });
      const loginPayload = typeof encryptedCreds === 'object' ? encryptedCreds.RequestData : encryptedCreds;
      localStorage.setItem('login_payload', loginPayload);

      const loginResp = await performBankLogin(loginPayload);
      const loginDecrypted = await getDecryptedData(loginResp.data.RequestData || loginResp.data);

      if (loginDecrypted?.access_token) {
        const dashResp = await performDashboardFetch(loginDecrypted.access_token);
        const dashDecrypted = await getDecryptedData(dashResp.data);

        setModal({
          open: true,
          message: 'Congratulations!!! Login Successfull',
          action: () => {
            localStorage.setItem('access_token', loginDecrypted.access_token);
            localStorage.setItem('user_details', JSON.stringify(loginDecrypted));
            localStorage.setItem('dashboard_stats', JSON.stringify(dashDecrypted));
            navigate('/dashboard');
          }
        });
      } else {
        setModal({ open: true, message: 'Invalid Credentials' });
      }
    } catch (err) {
      setModal({ open: true, message: 'System error. Please try again.' });
    } finally { setLoading(false); }
  };

  const handleSendOTP = async () => {
    if (!username) return;
    setLoading(true);
    try {
      const resp = await sendForgotPasswordOtp(username);
      if (resp.data.status === "SUCCESS") setStep('otp');
      else setModal({ open: true, message: resp.data.statusDesc });
    } catch (err) { setModal({ open: true, message: "Service failed." });
    } finally { setLoading(false); }
  };

  const handleVerifyOTP = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) return;
    setLoading(true);
    try {
      const resp = await verifyForgotPasswordOtp(fullOtp, username);
      if (resp.data.statusCode === 0 || resp.data.status === "SUCCESS") {
        setModal({ 
            open: true, 
            message: "OTP Verified Successfully. Temporary password sent to your inbox.",
            action: () => setStep('login')
        });
      } else {
        setModal({ open: true, message: resp.data.statusDesc });
      }
    } catch (err) {
      setModal({ open: true, message: "Verification failed." });
    } finally { setLoading(false); }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.nextSibling && element.value) element.nextSibling.focus();
  };

  return (
    <>
      <StatusModal isOpen={modal.open} message={modal.message} onClose={() => setModal({ ...modal, open: false })} onConfirm={modal.action} />

      {step === 'login' && (
        <CardWrapper>
          <div className="mb-12 text-left">
            <h2 className="text-[52px] font-bold text-[#1A1A1A] leading-tight mb-2 tracking-tight">Welcome Back!</h2>
            <p className="text-[#5B6B79] text-xl font-medium">Please enter your details</p>
          </div>

          <form className="w-full space-y-8" onSubmit={handleLogin}>
            <div className="relative border border-gray-300 rounded-[6px] focus-within:border-[#8B0000] focus-within:ring-0 transition-all">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[12px] font-bold text-gray-500 uppercase tracking-widest">Username*</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full h-[60px] px-4 bg-transparent outline-none text-[16px] text-gray-800" placeholder="Enter your Username" required />
            </div>

            <div className="relative border border-gray-300 rounded-[6px] focus-within:border-[#8B0000] transition-all">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[12px] font-bold text-gray-500 uppercase tracking-widest">Password*</label>
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-[60px] px-4 bg-transparent outline-none text-[16px] text-gray-800" placeholder="Enter your password" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            <div className="flex items-center justify-between text-[15px]">
              <label className="flex items-center gap-2 text-[#5B6B79] cursor-pointer font-semibold">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-[#8B0000]" /> Remember me
              </label>
              <button type="button" onClick={() => setStep('forgot')} className="text-[#1A1A1A] font-bold hover:underline">Forgot Password?</button>
            </div>

            <button type="submit" disabled={loading} className="w-full h-[60px] bg-[#8B0000] text-white font-bold rounded-[6px] hover:bg-[#700000] transition-all flex items-center justify-center text-[20px] uppercase tracking-widest shadow-md">
              {loading ? <Loader2 className="animate-spin" size={26} /> : "Login"}
            </button>
          </form>
        </CardWrapper>
      )}

      {step === 'forgot' && (
        <CardWrapper>
          <div className="mb-10 text-left">
            <h2 className="text-[48px] font-bold text-[#1A1A1A] leading-tight mb-2 tracking-tight">Forgot <br /> Password?</h2>
            <p className="text-[#5B6B79] text-lg leading-relaxed">Put your Username and verify OTP then you will receive a new password in your inbox</p>
          </div>
          <div className="w-full space-y-8">
            <div className="relative border border-gray-300 rounded-[6px] focus-within:border-[#8B0000]">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[12px] font-bold text-gray-500 uppercase tracking-widest">Username*</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full h-[60px] px-4 bg-transparent outline-none text-[16px]" placeholder="Enter Username" />
            </div>
            <button onClick={handleSendOTP} disabled={loading} className="w-full h-[60px] bg-[#8B0000] text-white font-bold rounded-[6px] uppercase text-[18px] hover:bg-[#700000] transition-all tracking-widest shadow-md">
               {loading ? <Loader2 className="animate-spin" size={24} /> : "Send OTP"}
            </button>
            <button onClick={() => setStep('login')} className="w-full flex items-center justify-center gap-2 text-gray-700 font-bold hover:text-red-800 transition-colors uppercase text-sm tracking-widest">
              <ArrowLeft size={20} /> Back to Login
            </button>
          </div>
        </CardWrapper>
      )}

      {step === 'otp' && (
        <CardWrapper>
          <div className="mb-10 text-left">
            <h2 className="text-[48px] font-bold text-[#1A1A1A] leading-tight mb-2 tracking-tight">Verify OTP</h2>
            <p className="text-[#5B6B79] text-lg">The OTP was sent to the following recipient</p>
          </div>
          <div className="w-full space-y-8">
            <div className="flex gap-2 sm:gap-4 justify-start">
              {otp.map((data, index) => (
                <input key={index} type="text" maxLength="1" className="w-[50px] h-[58px] sm:w-[62px] sm:h-[62px] border border-gray-300 rounded-md text-center text-2xl font-bold outline-none focus:border-[#8B0000] bg-[#F9F9F9] transition-all" value={data} onChange={e => handleOtpChange(e.target, index)} onFocus={e => e.target.select()} />
              ))}
            </div>
            <p className="text-[16px] text-gray-600">Go to previous page <button onClick={() => setStep('forgot')} className="text-[#8B0000] font-bold hover:underline">Click Here</button></p>
            
            {/* FIXED: Added onClick={handleVerifyOTP} */}
            <button onClick={handleVerifyOTP} disabled={loading} className="w-full h-[60px] bg-[#8B0000] text-white font-bold rounded-[6px] uppercase text-[18px] hover:bg-[#700000] transition-all shadow-md">
              {loading ? <Loader2 className="animate-spin" size={24} /> : "Verify"}
            </button>
            
            <div className="text-center">
              <button onClick={handleSendOTP} className="text-[#5B6B79] font-bold hover:text-red-800 transition-colors uppercase text-sm tracking-widest">Resend OTP</button>
            </div>
          </div>
        </CardWrapper>
      )}
    </>
  );
};

export default AuthSystem;