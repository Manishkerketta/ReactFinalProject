import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, User, KeyRound, LogOut, X, Key, Eye, EyeOff, AlertCircle } from 'lucide-react';

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
  
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  });
  
  useEffect(() => {
    const savedUser = localStorage.getItem('user_details');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // DYNAMIC DATA: Pulling correctly from the shared JSON structure
  const username = user?.userType || 'Guest'; 
  const fullName = user ? `${user.firstName} ${user.lastName}` : 'User Name';

  return (
    <>
      <header className="h-[70px] bg-[#8B0000] text-white flex items-center justify-between px-6 relative z-30">
        {/* Left Section: Sidebar Toggle & Title */}
        <div className="flex items-center gap-4">
          <button onClick={toggleSidebar} className="p-1 hover:bg-white/10 rounded-md transition-colors">
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className="w-6 h-0.5 bg-white"></span>
              <span className="w-4 h-0.5 bg-white"></span>
              <span className="w-6 h-0.5 bg-white"></span>
            </div>
          </button>
          <h1 className="text-lg font-medium">Dashboard</h1>
        </div>

        {/* Right Section: Notifications & Profile Dropdown */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Bell size={20} />
          </button>
          
          <div className="relative flex items-center gap-3">
            {/* Avatar Image */}
            <div className="w-9 h-9 rounded-full overflow-hidden border border-white/40 shadow-sm bg-white/10">
              <img 
                src={`https://api.dicebear.com/8.x/initials/svg?seed=${username}`} 
                alt="avatar" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Username Display */}
            <span className="text-sm font-semibold tracking-wide hidden sm:block">
              {username}
            </span>

            {/* Circular Arrow Button (Matches Image exactly) */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="group"
            >
              <div className={`w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#8B0000] shadow-sm transition-all duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}>
                <ChevronDown size={16} strokeWidth={3} />
              </div>
            </button>

            {/* DROPDOWN MENU */}
            <div className={`absolute right-0 top-12 w-[210px] bg-white text-gray-800 rounded shadow-2xl border border-gray-100 py-1 z-50 transition-all duration-200 transform origin-top-right ${isMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                <button onClick={() => { setActiveModal('profile'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 border-b border-gray-50 text-left font-medium">
                  <User size={16} className="text-gray-500" /> Profile
                </button>
                <button onClick={() => { setActiveModal('changePassword'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 border-b border-gray-50 text-left font-medium">
                  <KeyRound size={16} className="text-gray-500" /> Change Password
                </button>
                <button onClick={() => { setActiveModal('logout'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-red-50 text-red-600 text-left font-bold transition-colors">
                  <LogOut size={16} /> Logout
                </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- PROFILE MODAL (Detailed Information) --- */}
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
        <div className="px-8 pb-8">
          <button 
            onClick={() => setActiveModal(null)} 
            className="w-full py-3 bg-[#8B0000] text-white font-bold rounded hover:bg-[#700000] transition-colors uppercase tracking-widest text-sm"
          >
            Close
          </button>
        </div>
      </AnimatedModal>

      {/* --- LOGOUT MODAL --- */}
      <AnimatedModal isOpen={activeModal === 'logout'}>
        <div className="p-10 text-center">
          <div className="w-16 h-16 bg-red-50 text-[#8B0000] rounded-full flex items-center justify-center mx-auto mb-6">
            <LogOut size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Are you sure want to Logout?</h3>
          <p className="text-gray-500 text-sm mb-10">Your session will be cleared and you'll need to login again.</p>
          <div className="flex gap-4">
            <button onClick={handleLogout} className="flex-1 py-3 bg-[#8B0000] text-white font-bold rounded uppercase hover:bg-[#700000] transition-all">Yes</button>
            <button onClick={() => setActiveModal(null)} className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded uppercase hover:bg-gray-50 transition-all">No</button>
          </div>
        </div>
      </AnimatedModal>

      {/* --- PASSWORD MODAL --- */}
      <AnimatedModal isOpen={activeModal === 'changePassword'}>
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
            <p className="text-sm text-gray-500 mt-1">Update your account credentials</p>
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
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-red-800 transition-all" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => ({ ...prev, [field.id]: !prev[field.id] }))}
                  className="absolute right-3 top-4 text-gray-400 cursor-pointer hover:text-gray-600"
                >
                  {showPassword[field.id] ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            ))}
            <div className="flex gap-4 pt-6">
              <button 
                type="button" 
                onClick={() => setActiveModal(null)} 
                className="flex-1 py-3 border-2 border-gray-100 text-gray-500 font-bold rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="flex-1 py-3 bg-[#8B0000] text-white font-bold rounded-lg shadow-lg hover:bg-[#700000]"
              >
                Verify Otp
              </button>
            </div>
          </form>
        </div>
      </AnimatedModal>
    </>
  );
};

export default Header;