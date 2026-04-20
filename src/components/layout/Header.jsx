import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, User, KeyRound, LogOut, X, Key, Eye, EyeOff } from 'lucide-react';

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
      <div className={`bg-white rounded-md shadow-xl w-full max-w-[500px] overflow-hidden transition-all duration-300 transform ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
};

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  
  // FIX: Added the missing state for password visibility
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  });
  
  useEffect(() => {
    const savedUser = localStorage.getItem('user_details');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const username = user?.user_name || 'gourab_ops_checker';
  const fullName = user ? `${user.firstName} ${user.lastName}` : 'gourab rana';

  return (
    <>
      <header className="h-[70px] bg-[#8B0000] text-white flex items-center justify-between px-6 relative z-30">
        <div className="flex items-center gap-4">
          <button onClick={toggleSidebar} className="p-1 hover:bg-white/10 rounded-md">
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className="w-6 h-0.5 bg-white"></span>
              <span className="w-4 h-0.5 bg-white"></span>
              <span className="w-6 h-0.5 bg-white"></span>
            </div>
          </button>
          <h1 className="text-lg font-medium">Dashboard</h1>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/10 rounded-full">
            <Bell size={20} />
          </button>
          
          <div className="relative flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/50">
              <img src={`https://api.dicebear.com/8.x/initials/svg?seed=${username}`} alt="avatar" />
            </div>
            <span className="text-sm font-medium">{username}</span>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 hover:bg-white/10 rounded-full transition-transform"
            >
              <div className={`w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#8B0000] transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}>
                <ChevronDown size={16} strokeWidth={3} />
              </div>
            </button>

            {/* DROPDOWN MENU */}
            <div className={`absolute right-0 top-12 w-[200px] bg-white text-gray-800 rounded shadow-lg border border-gray-200 py-1 z-50 transition-all duration-200 transform origin-top-right ${isMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                <button onClick={() => { setActiveModal('profile'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 border-b border-gray-100 text-left">
                  <User size={16} /> Profile
                </button>
                <button onClick={() => { setActiveModal('changePassword'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 border-b border-gray-100 text-left">
                  <KeyRound size={16} /> Change Password
                </button>
                <button onClick={() => { setActiveModal('logout'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 text-red-600 text-left">
                  <LogOut size={16} /> Logout
                </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- PROFILE MODAL --- */}
      <AnimatedModal isOpen={activeModal === 'profile'}>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-[#444] mb-1">User Profile</h2>
          <p className="text-sm text-gray-500 mb-6 font-medium">View personal information</p>
          <div className="space-y-4">
            {[
              { label: 'Name', value: fullName },
              { label: 'Phone No.', value: user?.mobileNumber || '8455992820' },
              { label: 'Email ID', value: user?.email || 'gourab.rana04@iserveu.in' },
              { label: 'Address', value: 'Patia' },
              { label: 'State', value: 'Odisha' },
              { label: 'User ID', value: username },
              { label: 'Pan ID', value: 'EICPR6266H' },
              { label: 'User Type', value: user?.roleName || 'ROLE_OPS_CHECKER' }
            ].map((item, idx) => (
              <div key={idx} className="grid grid-cols-[140px_1fr] items-start">
                <span className="text-[15px] text-gray-600 font-medium">{item.label}</span>
                <span className="text-[15px] text-gray-800 font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="px-8 pb-8">
          <button onClick={() => setActiveModal(null)} className="w-full py-2.5 bg-[#8B0000] text-white font-bold rounded uppercase">Close</button>
        </div>
      </AnimatedModal>

      {/* --- LOGOUT MODAL --- */}
      <AnimatedModal isOpen={activeModal === 'logout'}>
        <div className="p-8 text-center">
          <h3 className="text-lg font-bold text-gray-800 mb-8">Are you sure want to Logout?</h3>
          <div className="flex gap-4">
            <button onClick={handleLogout} className="flex-1 py-2.5 bg-[#8B0000] text-white font-bold rounded uppercase">Yes</button>
            <button onClick={() => setActiveModal(null)} className="flex-1 py-2.5 border border-red-800 text-red-800 font-bold rounded uppercase">No</button>
          </div>
        </div>
      </AnimatedModal>

      {/* --- PASSWORD MODAL --- */}
      <AnimatedModal isOpen={activeModal === 'changePassword'}>
        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
            <p className="text-xs text-gray-500 mt-1">Enter your old and new password</p>
          </div>
          <form className="space-y-4">
            {[
              { id: 'old', label: 'Old Password*' },
              { id: 'new', label: 'New Password*' },
              { id: 'confirm', label: 'Confirm Password*' }
            ].map((field) => (
              <div key={field.id} className="relative">
                <input 
                  type={showPassword[field.id] ? "text" : "password"} 
                  placeholder={field.label} 
                  className="w-full px-4 py-3 border border-gray-300 rounded text-sm outline-none focus:border-red-800" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => ({ ...prev, [field.id]: !prev[field.id] }))}
                  className="absolute right-3 top-3.5 text-gray-400 cursor-pointer"
                >
                  {showPassword[field.id] ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            ))}
            <div className="flex gap-4 pt-4">
              <button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-2.5 border border-red-800 text-red-800 font-bold rounded">Cancel</button>
              <button type="submit" className="flex-1 py-2.5 bg-[#8B0000] text-white font-bold rounded">Verify Otp</button>
            </div>
          </form>
        </div>
      </AnimatedModal>
    </>
  );
};

export default Header;