import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Globe } from 'lucide-react';
import { fetchUserDetails } from '../../utils/authService';

const ProfileDetails = () => {
  const { state } = useLocation(); // Receives username and role from table
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('Browser Data');

  useEffect(() => {
    const getDetails = async () => {
      try {
        const resp = await fetchUserDetails(state.username, state.role);
        setDetails(resp.data?.resultObj);
      } catch (err) { console.error(err); }
    };
    if (state?.username) getDetails();
  }, [state]);

  if (!details) return <div className="p-10">Loading Details...</div>;

  const personal = details["1"] || {};

  return (
    <div className="p-6 bg-[#F8F9FA] min-h-screen">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 mb-6 hover:text-[#8B0000]">
        <ArrowLeft size={20} /> <span className="font-bold">Profile Details</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center relative">
          <span className="absolute top-4 right-4 bg-green-100 text-green-600 text-[10px] font-bold px-2 py-1 rounded">Active</span>
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-gray-50">
             <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${personal.firstName}`} alt="avatar" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">{personal.firstName} {personal.lastName}</h2>
          <p className="text-gray-400 text-sm mb-6">User Name : {state.username}</p>
          <div className="w-full space-y-4 border-t pt-6">
            <div className="flex items-center gap-3 text-sm text-gray-600"><Mail size={16}/> {personal.email}</div>
            <div className="flex items-center gap-3 text-sm text-gray-600"><Phone size={16}/> {personal.mobileNumber}</div>
          </div>
        </div>

        {/* Personal Details Table */}
        <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6">Personal Details</h3>
          <div className="grid grid-cols-2 gap-y-8">
            <div><p className="text-xs text-gray-400 uppercase font-bold">PAN</p><p className="text-sm font-semibold">{details["4"]?.pan || 'NA'}</p></div>
            <div><p className="text-xs text-gray-400 uppercase font-bold">Aadhaar</p><p className="text-sm font-semibold">XXXX XXXX {details["4"]?.aadhaar?.slice(-4)}</p></div>
            <div><p className="text-xs text-gray-400 uppercase font-bold">Created Date</p><p className="text-sm font-semibold">12/09/2025</p></div>
            <div><p className="text-sm text-gray-400 uppercase font-bold">Submission Date</p><p className="text-sm font-semibold">15/09/2025</p></div>
            <div className="col-span-2"><p className="text-xs text-gray-400 uppercase font-bold">Address</p><p className="text-sm font-semibold">{personal.permanentAddress1}, {personal.city}, {personal.state} {personal.pinCode}</p></div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="flex border-b">
          {['Basic Details', 'PAN Details', 'Aadhar Details', 'Matching Details', 'Geo-Tagging Analysis', 'Browser Data'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium transition-colors ${activeTab === tab ? 'text-[#8B0000] border-b-2 border-[#8B0000]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="p-10 flex items-start justify-between">
           <div className="space-y-6">
              <div className="grid grid-cols-[150px_1fr] text-sm"><span className="text-gray-400">Browser :</span><span className="font-bold">NA</span></div>
              <div className="grid grid-cols-[150px_1fr] text-sm"><span className="text-gray-400">User OS :</span><span className="font-bold">NA</span></div>
              <div className="grid grid-cols-[150px_1fr] text-sm"><span className="text-gray-400">Platform :</span><span className="font-bold">NA</span></div>
           </div>
           <div className="pr-20 opacity-80">
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg" width="120" alt="chrome" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;