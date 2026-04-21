import React from 'react';
import { Mail, Phone } from 'lucide-react';
import ProfileTabs from './ProfileTabs';

const MakerProfileView = ({ details, username }) => {
  const personal = details?.["1"] || {};

  return (
    <div className="space-y-6 animate-modalIn">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-lg border border-gray-100 flex flex-col items-center shadow-sm">
          <div className="w-24 h-24 rounded-full bg-[#D81B60] flex items-center justify-center text-white text-3xl font-bold mb-4">
            {personal.firstName?.[0]}{personal.lastName?.[0]}
          </div>
          <h2 className="text-xl font-bold">{personal.firstName} {personal.lastName}</h2>
          <p className="text-gray-400 text-sm">User ID: {username}</p>
          <div className="w-full mt-6 pt-6 border-t space-y-3">
             <div className="flex items-center gap-2 text-sm text-gray-600"><Mail size={14} className="text-gray-400"/> {personal.email || 'NA'}</div>
             <div className="flex items-center gap-2 text-sm text-gray-600"><Phone size={14} className="text-gray-400"/> {personal.mobileNumber || 'NA'}</div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-lg border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6 border-b pb-2">Submission Details</h3>
          <div className="grid grid-cols-2 gap-y-6">
            <InfoItem label="PAN" value={details?.["2"]?.pan} />
            <InfoItem label="GST" value={details?.["2"]?.gstNumber} />
            <InfoItem label="COMPANY" value={details?.["2"]?.companyName} />
            <InfoItem label="CITY" value={personal.city} />
          </div>
        </div>
      </div>

      {/* RENDER THE TABS COMPONENT */}
      <ProfileTabs details={details} />
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{label}</p>
    <p className="text-sm font-bold text-gray-800">{value || "NA"}</p>
  </div>
);

export default MakerProfileView;