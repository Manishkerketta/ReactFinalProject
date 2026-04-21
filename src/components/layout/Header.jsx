import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, ChevronDown, User, KeyRound, LogOut, X, Key, Eye, EyeOff, BellRing, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { sendChangePasswordOtp } from '../../utils/authService';

// HELPER: Smooth Modal Wrapper
const AnimatedModal = ({ isOpen, children }) => {
  const [render, setRender] = useState(isOpen);
  useEffect(() => {
    if (isOpen) setRender(true);
    else {
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  if (!render) return null;
  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white rounded-md shadow-xl w-full max-w-[450px] overflow-hidden transition-all duration-300 transform ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
};

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Password State
  const [passData, setPassData] = useState({ old: '', new: '', confirm: '' });
  const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });
  
  // API Response Modal State
  const [respModal, setRespModal] = useState({ show: false, success: false, message: '' });

  useEffect(() => {
    const savedUser = localStorage.getItem('user_details');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // --- NEW: Reset password data when modal closes ---
  useEffect(() => {
    if (activeModal !== 'changePassword') {
      setPassData({ old: '', new: '', confirm: '' });
      setShowPassword({ old: false, new: false, confirm: false });
    }
  }, [activeModal]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getHeaderTitle = () => {
    const path = location.pathname;
    if (path.includes('user-request') || path.includes('create-cbc') || path.includes('profile-details')) return 'User Management';
    if (path.includes('audit-trail')) return 'Audit Trail';
    if (path.includes('wallet-adjustment')) return 'Wallet Adjustment';
    if (path.includes('reports')) return 'Reports';
    return 'Dashboard';
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passData.old === passData.new) {
      return setRespModal({
        show: true,
        success: false,
        message: "New password cannot be the same as your current password. Please choose a different one."
      });
    }

    if (passData.new !== passData.confirm) {
      return setRespModal({
        show: true,
        success: false,
        message: "Confirmation password does not match the new password."
      });
    }

    setLoading(true);
    try {
      const resp = await sendChangePasswordOtp(passData.old, passData.new);
      const isSuccess = resp.data.status === "SUCCESS";
      
      setRespModal({
        show: true,
        success: isSuccess,
        message: isSuccess ? "OTP has been sent to your registered mobile/email." : resp.data.statusDesc
      });
      if (isSuccess) {
        setActiveModal(null);
      }
    } catch (err) {
      setRespModal({
        show: true,
        success: false,
        message: err.response?.data?.statusDesc || "Something went wrong. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const username = user?.userType || 'Guest'; 
  const fullName = user ? `${user.firstName} ${user.lastName}` : 'User Name';

  return (
    <>
      <header className="h-[70px] bg-[#8B0000] text-white flex items-center justify-between px-6 relative z-30 shadow-md">
        <div className="flex items-center gap-4">
          <button onClick={toggleSidebar} className="p-1 hover:bg-white/10 rounded-md transition-colors">
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className="w-6 h-0.5 bg-white"></span>
              <span className="w-4 h-0.5 bg-white"></span>
              <span className="w-6 h-0.5 bg-white"></span>
            </div>
          </button>
          <h1 className="text-lg font-bold tracking-tight">{getHeaderTitle()}</h1>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setActiveModal('notifications')} className="p-2 hover:bg-white/10 rounded-full relative group"><Bell size={20} /></button>
          <div className="relative flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-white/40 shadow-sm bg-white/10">
              <img src={`https://api.dicebear.com/8.x/initials/svg?seed=${username}`} alt="avatar" className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-semibold tracking-wide hidden sm:block">{username}</span>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="group">
              <div className={`w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#8B0000] shadow-sm transition-all duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}><ChevronDown size={14} strokeWidth={3} /></div>
            </button>
            <div className={`absolute right-0 top-12 w-[210px] bg-white text-gray-800 rounded shadow-2xl border border-gray-100 py-1 z-50 transition-all duration-200 transform origin-top-right ${isMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                <button onClick={() => { setActiveModal('profile'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 border-b border-gray-50 text-left font-medium"><User size={16} className="text-gray-500" /> Profile</button>
                <button onClick={() => { setActiveModal('changePassword'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 border-b border-gray-50 text-left font-medium"><KeyRound size={16} className="text-gray-500" /> Change Password</button>
                <button onClick={() => { setActiveModal('logout'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-red-50 text-red-600 text-left font-bold transition-colors"><LogOut size={16} /> Logout</button>
            </div>
          </div>
        </div>
      </header>

      {/* --- RESPONSE MODAL --- */}
      {respModal.show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[400px] p-10 text-center animate-modalIn">
            <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${respModal.success ? 'bg-green-50 text-green-500' : 'bg-red-50 text-[#8B0000]'}`}>
              {respModal.success ? <CheckCircle2 size={48} /> : <AlertCircle size={48} />}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{respModal.success ? "Request Sent" : "Attention"}</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">{respModal.message}</p>
            <button onClick={() => setRespModal({ ...respModal, show: false })} className="w-full py-3 bg-[#8B0000] text-white font-bold rounded uppercase tracking-widest text-xs hover:bg-[#700000] transition-all">Close</button>
          </div>
        </div>
      )}

      {/* --- CHANGE PASSWORD MODAL --- */}
      <AnimatedModal isOpen={activeModal === 'changePassword'}>
        <div className="p-8">
          <div className="text-center mb-8"><h2 className="text-2xl font-bold text-gray-800">Update Credentials</h2><p className="text-sm text-gray-500 mt-1">Please enter your current and new password</p></div>
          <form className="space-y-4" onSubmit={handlePasswordSubmit}>
            {['old', 'new', 'confirm'].map((id) => (
              <div key={id} className="relative">
                <input 
                  required
                  type={showPassword[id] ? "text" : "password"} 
                  placeholder={id === 'old' ? 'Current Password*' : id === 'new' ? 'New Password*' : 'Confirm New Password*'} 
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-red-800 transition-all" 
                  value={passData[id]}
                  onChange={(e) => setPassData({ ...passData, [id]: e.target.value })}
                />
                <button type="button" onClick={() => setShowPassword(prev => ({ ...prev, [id]: !prev[id] }))} className="absolute right-3 top-4 text-gray-400 hover:text-gray-600">
                  {showPassword[id] ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            ))}
            <div className="flex gap-4 pt-6">
              {/* Clicking Cancel here triggers setActiveModal(null) which triggers our clear effect */}
              <button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-3 border-2 border-gray-200 text-gray-500 font-bold rounded-lg hover:bg-gray-50">Cancel</button>
              <button disabled={loading} type="submit" className="flex-1 py-3 bg-[#8B0000] text-white font-bold rounded-lg shadow-lg hover:bg-[#700000] flex items-center justify-center">
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </AnimatedModal>

      {/* Logout & Notifications remain identical */}
      <AnimatedModal isOpen={activeModal === 'notifications'}>
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-red-50 text-[#8B0000] rounded-full flex items-center justify-center mx-auto mb-6"><BellRing size={32} /></div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Notifications Coming Soon</h3>
          <p className="text-gray-500 text-sm mb-8">Feature will be available in the upcoming system enhancement.</p>
          <button onClick={() => setActiveModal(null)} className="w-full py-3 bg-[#8B0000] text-white font-bold rounded uppercase tracking-widest text-xs hover:bg-[#700000]">Got it</button>
        </div>
      </AnimatedModal>

      <AnimatedModal isOpen={activeModal === 'logout'}>
        <div className="p-10 text-center">
          <div className="w-16 h-16 bg-red-50 text-[#8B0000] rounded-full flex items-center justify-center mx-auto mb-6"><LogOut size={32} /></div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Logout</h3>
          <p className="text-gray-500 text-sm mb-10">Your session will be securely ended. Do you wish to continue?</p>
          <div className="flex gap-4">
            <button onClick={handleLogout} className="flex-1 py-3 bg-[#8B0000] text-white font-bold rounded uppercase hover:bg-[#700000] transition-all">Yes, Logout</button>
            <button onClick={() => setActiveModal(null)} className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded uppercase hover:bg-gray-50 transition-all">Cancel</button>
          </div>
        </div>
      </AnimatedModal>

      <AnimatedModal isOpen={activeModal === 'profile'}>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-1">User Profile</h2>
          <p className="text-sm text-gray-500 mb-8 font-medium">View personal information</p>
          <div className="space-y-5">
            {[
              { label: 'Name', value: fullName },
              { label: 'Phone No.', value: user?.mobileNumber || 'N/A' },
              { label: 'Email ID', value: user?.email || 'N/A' },
              { label: 'Address', value: 'Patia' },
              { label: 'State', value: 'Odisha' },
              { label: 'User ID', value: username },
              { label: 'Pan ID', value: 'EICPR6266H' },
              { label: 'User Type', value: user?.roleName || 'N/A' }
            ].map((item, idx) => (
              <div key={idx} className="grid grid-cols-[150px_1fr] items-center border-b border-gray-50 pb-2">
                <span className="text-[14px] text-gray-500 font-medium">{item.label}</span>
                <span className="text-[14px] text-gray-900 font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="px-8 pb-8"><button onClick={() => setActiveModal(null)} className="w-full py-3 bg-[#8B0000] text-white font-bold rounded hover:bg-[#700000] transition-colors uppercase tracking-widest text-sm">Close</button></div>
      </AnimatedModal>
    </>
  );
};

export default Header;