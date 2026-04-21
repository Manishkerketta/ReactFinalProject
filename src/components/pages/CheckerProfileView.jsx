// import React, { useState } from 'react';
// import { Mail, Phone, CheckCircle, XCircle, ShieldCheck } from 'lucide-react';
// import ProfileTabs from './ProfileTabs'; // We will create this below

// const CheckerProfileView = ({ details, username }) => {
//   const personal = details?.["1"] || {};
//   const business = details?.["2"] || {};

//   return (
//     <div className="space-y-6 animate-modalIn">
//       <div className="flex justify-end gap-3">
//         <button className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded shadow-sm font-bold text-sm hover:bg-green-700 transition-all">
//           <CheckCircle size={16}/> Approve User
//         </button>
//         <button className="flex items-center gap-2 px-6 py-2.5 bg-[#8B0000] text-white rounded shadow-sm font-bold text-sm hover:bg-[#700000] transition-all">
//           <XCircle size={16}/> Reject User
//         </button>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center relative overflow-hidden">
//           <div className="absolute top-0 left-0 w-full h-1 bg-orange-400"></div>
//           <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[10px] font-bold mb-6 uppercase tracking-wider">Awaiting Verification</span>
//           <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
//             {personal?.firstName?.[0]}{personal?.lastName?.[0]}
//           </div>
//           <h2 className="text-xl font-bold text-gray-800">{personal?.firstName} {personal?.lastName}</h2>
//           <p className="text-gray-400 text-xs mt-1">User ID : {username}</p>
//           <div className="w-full mt-8 pt-6 border-t border-gray-50 space-y-4">
//              <div className="flex items-center gap-3 text-sm text-gray-600"><Mail size={14} className="text-gray-400"/> {personal?.email}</div>
//              <div className="flex items-center gap-3 text-sm text-gray-600"><Phone size={14} className="text-gray-400"/> {personal?.mobileNumber}</div>
//           </div>
//         </div>

//         <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
//           <div className="flex items-center gap-2 mb-8"><ShieldCheck className="text-[#8B0000]" size={20} /><h3 className="font-bold text-gray-800 text-lg">Personal Details</h3></div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
//             <InfoItem label="PAN" value={business?.pan} />
//             <InfoItem label="AADHAAR" value="XXXX XXXX 3354" />
//             <InfoItem label="CREATED DATE" value="12/09/2025" />
//             <InfoItem label="SUBMISSION DATE" value="15/09/2025" />
//             <div className="md:col-span-2"><InfoItem label="ADDRESS" value={`${personal?.city}, ${personal?.state}`} /></div>
//           </div>
//         </div>
//       </div>

//       {/* RENDER THE TABS COMPONENT */}
//       <ProfileTabs details={details} />
//     </div>
//   );
// };

// const InfoItem = ({ label, value }) => (
//   <div>
//     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{label}</p>
//     <p className="text-[15px] font-bold text-gray-800">{value || "NA"}</p>
//   </div>
// );

// export default CheckerProfileView;

import React, { useState } from 'react';
import { Mail, Phone, CheckCircle, XCircle, ShieldCheck, Lock } from 'lucide-react';
import ProfileTabs from './ProfileTabs';

const CheckerProfileView = ({ details, username }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // 1. Check if the current user is actually a Checker
  const savedUser = JSON.parse(localStorage.getItem('user_details'));
  const currentLoggedRole = savedUser?.roleName; 

  const personal = details?.["1"] || {};
  const business = details?.["2"] || {};

  const handleActionClick = () => {
    // 2. Open Unauthorized modal
    setShowAuthModal(true);
  };

  return (
    <div className="space-y-6 animate-modalIn relative">
      
      {/* ACCESS DENIED MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-[400px] overflow-hidden animate-modalIn border-t-4 border-[#8B0000]">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 text-[#8B0000] rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h3>
              <p className="text-gray-500 text-sm mb-8">
                You are not authorized to update the status. Please contact your system administrator for permission.
              </p>
              <button 
                onClick={() => setShowAuthModal(false)}
                className="w-full py-3 bg-[#8B0000] text-white font-bold rounded-md uppercase tracking-widest text-sm hover:bg-[#700000]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTION BUTTONS: Only shown if the user has Checker permissions */}
      {currentLoggedRole === "ROLE_OPS_CHECKER" && (
        <div className="flex justify-end gap-3">
          <button 
            onClick={handleActionClick}
            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded shadow-sm font-bold text-sm hover:bg-green-700 transition-all"
          >
            <CheckCircle size={16}/> Approve User
          </button>
          <button 
            onClick={handleActionClick}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#8B0000] text-white rounded shadow-sm font-bold text-sm hover:bg-[#700000] transition-all"
          >
            <XCircle size={16}/> Reject User
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-orange-400"></div>
          <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[10px] font-bold mb-6 uppercase tracking-wider">Awaiting Verification</span>
          <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg border-4 border-white">
            {personal?.firstName?.[0]}{personal?.lastName?.[0]}
          </div>
          <h2 className="text-xl font-bold text-gray-800">{personal?.firstName} {personal?.lastName}</h2>
          <p className="text-gray-400 text-xs font-medium mt-1">User ID : {username}</p>
          <div className="w-full mt-8 pt-6 border-t border-gray-50 space-y-4">
             <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><Mail size={14}/></div>
                <span className="truncate">{personal?.email || 'NA'}</span>
             </div>
             <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><Phone size={14}/></div>
                {personal?.mobileNumber || 'NA'}
             </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <ShieldCheck className="text-[#8B0000]" size={20} />
            <h3 className="font-bold text-gray-800 text-lg">Personal Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
            <InfoItem label="PAN" value={business?.pan} />
            <InfoItem label="AADHAAR" value="XXXX XXXX 3354" />
            <InfoItem label="CREATED DATE" value="12/09/2025" />
            <InfoItem label="SUBMISSION DATE" value="15/09/2025" />
            <div className="md:col-span-2">
                <InfoItem label="ADDRESS" value={`${personal?.city || ''}, ${personal?.state || ''}`} />
            </div>
          </div>
        </div>
      </div>

      <ProfileTabs details={details} />
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="group">
    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 group-hover:text-[#8B0000] transition-colors">{label}</p>
    <p className="text-[15px] font-bold text-gray-800">{value || "NA"}</p>
  </div>
);

export default CheckerProfileView;