// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Loader2, ArrowLeft, UserCheck, AlertCircle } from 'lucide-react';
// import { fetchUserDetailsEncr, getDecryptedData, getEncryptedData } from '../../utils/authService';
// import CheckerProfileView from './CheckerProfileView';

// const ProfileDetails = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
  
//   const [details, setDetails] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [selectedRole, setSelectedRole] = useState(""); 
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertMsg, setAlertMsg] = useState("");

//   const handleFetchDetails = async (role) => {
//     if (!role) return;
    
//     setLoading(true);
//     setDetails(null); // IMPORTANT: Clear previous role's data before new fetch
//     setShowAlert(false);

//     try {
//       const plainPayload = { 
//         userRole: role, 
//         username: state?.username 
//       };

//       const encryptedString = await getEncryptedData(plainPayload);
//       const resp = await fetchUserDetailsEncr(encryptedString);
//       const decrypted = await getDecryptedData(resp.data);
      
//       if (decrypted?.success) {
//         setDetails(decrypted.resultObj.data);
//       } else {
//         // Handle failure response from API
//         setTableData([]); // Safety
//         setAlertMsg(decrypted?.message || "No data found for the selected role.");
//         setShowAlert(true);
//       }
//     } catch (err) {
//       console.error("Detail Fetch Error:", err);
//       setAlertMsg("An error occurred while fetching user details.");
//       setShowAlert(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onRoleChange = (e) => {
//     const role = e.target.value;
//     setSelectedRole(role);
//     handleFetchDetails(role);
//   };

//   return (
//     <div className="p-4 min-h-screen bg-[#FBFBFB] relative">
      
//       {/* THEMED CUSTOM ALERT MODAL */}
//       {showAlert && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
//           <div className="bg-white rounded-lg shadow-2xl w-full max-w-[380px] overflow-hidden animate-modalIn border-t-4 border-[#8B0000]">
//             <div className="p-8 text-center">
//               <div className="w-16 h-16 bg-red-50 text-[#8B0000] rounded-full flex items-center justify-center mx-auto mb-4">
//                 <AlertCircle size={32} />
//               </div>
//               <h3 className="text-xl font-bold text-gray-800 mb-2">Notice</h3>
//               <p className="text-gray-500 text-sm mb-8">
//                 {alertMsg}
//               </p>
//               <button 
//                 onClick={() => setShowAlert(false)}
//                 className="w-full py-3 bg-[#8B0000] text-white font-bold rounded-md hover:bg-[#700000] transition-colors uppercase tracking-widest text-sm"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Header & Role Selector */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
//         <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-[#8B0000] font-bold transition-colors">
//           <ArrowLeft size={20} /> Profile Details
//         </button>

//         <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
//           <label className="text-xs font-bold text-gray-500 uppercase px-2 tracking-tight">Select Role to View Details:</label>
//           <select 
//             value={selectedRole} 
//             onChange={onRoleChange}
//             className="bg-gray-50 border border-gray-200 rounded px-4 py-2 text-sm font-bold text-[#8B0000] outline-none focus:ring-2 focus:ring-red-100"
//           >
//             <option value="">-- Choose Role --</option>
//             <option value="CBC">CBC</option>
//             <option value="Agent">Agent</option>
//             <option value="CBC Maker">CBC Maker</option>
//           </select>
//         </div>
//       </div>

//       {loading ? (
//         <div className="h-96 flex flex-col items-center justify-center gap-4">
//           <Loader2 className="animate-spin text-[#8B0000]" size={48} />
//           <p className="text-gray-500 font-bold tracking-wide">Decrypting User Information...</p>
//         </div>
//       ) : details ? (
//         <CheckerProfileView details={details} username={state?.username} />
//       ) : (
//         <div className="h-80 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 rounded-xl bg-white/50">
//           <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
//              <UserCheck size={32} className="text-gray-300" />
//           </div>
//           <h3 className="text-gray-500 font-bold">No Data Loaded</h3>
//           <p className="text-gray-400 text-sm">Please select a User Role from the dropdown above to continue.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfileDetails;

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, UserCheck, AlertCircle } from 'lucide-react';
import { fetchUserDetailsEncr, getDecryptedData, getEncryptedData } from '../../utils/authService';
import CheckerProfileView from './CheckerProfileView';
import MakerProfileView from './MakerProfileView';

const ProfileDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(""); 
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  // Get current user role from localStorage to determine which view to render
  const savedUser = JSON.parse(localStorage.getItem('user_details'));
  const userRole = savedUser?.roleName; 

  const handleFetchDetails = async (role) => {
    if (!role) return;
    
    setLoading(true);
    setDetails(null); 
    setShowAlert(false);

    try {
      const plainPayload = { 
        userRole: role, 
        username: state?.username 
      };

      const encryptedString = await getEncryptedData(plainPayload);
      const resp = await fetchUserDetailsEncr(encryptedString);
      const decrypted = await getDecryptedData(resp.data);
      
      if (decrypted?.success) {
        setDetails(decrypted.resultObj.data);
      } else {
        setAlertMsg(decrypted?.message || "No data found for the selected role.");
        setShowAlert(true);
      }
    } catch (err) {
      console.error("Detail Fetch Error:", err);
      setAlertMsg("An error occurred while fetching user details.");
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const onRoleChange = (e) => {
    const role = e.target.value;
    setSelectedRole(role);
    handleFetchDetails(role);
  };

  return (
    <div className="p-4 min-h-screen bg-[#FBFBFB] relative">
      
      {/* NO DATA / ERROR MODAL */}
      {showAlert && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-[380px] overflow-hidden animate-modalIn border-t-4 border-[#8B0000]">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 text-[#8B0000] rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Notice</h3>
              <p className="text-gray-500 text-sm mb-8">{alertMsg}</p>
              <button 
                onClick={() => setShowAlert(false)}
                className="w-full py-3 bg-[#8B0000] text-white font-bold rounded-md uppercase tracking-widest text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header & Role Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-[#8B0000] font-bold transition-colors">
          <ArrowLeft size={20} /> Profile Details
        </button>

        <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
          <label className="text-xs font-bold text-gray-500 uppercase px-2 tracking-tight">Select Role to View Details:</label>
          <select 
            value={selectedRole} 
            onChange={onRoleChange}
            className="bg-gray-50 border border-gray-200 rounded px-4 py-2 text-sm font-bold text-[#8B0000] outline-none focus:ring-2 focus:ring-red-100"
          >
            <option value="">-- Choose Role --</option>
            <option value="CBC">CBC</option>
            <option value="Agent">Agent</option>
            <option value="CBC Maker">CBC Maker</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-[#8B0000]" size={48} />
          <p className="text-gray-500 font-bold tracking-wide">Decrypting User Information...</p>
        </div>
      ) : details ? (
        // Switch view based on the user's login role
        userRole === "ROLE_OPS_MAKER" ? (
            <MakerProfileView details={details} username={state?.username} />
        ) : (
            <CheckerProfileView details={details} username={state?.username} />
        )
      ) : (
        <div className="h-80 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 rounded-xl bg-white/50">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
             <UserCheck size={32} className="text-gray-300" />
          </div>
          <h3 className="text-gray-500 font-bold">No Data Loaded</h3>
          <p className="text-gray-400 text-sm">Please select a User Role from the dropdown above to continue.</p>
        </div>
      )}
    </div>
  );
};

export default ProfileDetails;