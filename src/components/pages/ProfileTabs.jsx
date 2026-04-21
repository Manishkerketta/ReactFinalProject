import React, { useState } from 'react';

const ProfileTabs = ({ details }) => {
  const [activeTab, setActiveTab] = useState('Basic Details');

  const tabs = [
    'Basic Details', 
    'PAN Details', 
    'Aadhar Details', 
    'Matching Details', 
    'Geo-Tagging Analysis', 
    'Agreement Details', 
    'Browser Data'
  ];

  // Mapping based on your API response structure
  const personal = details?.["1"] || {};
  const business = details?.["2"] || {};
  const admin = details?.["3"] || {};
  const bank = details?.["4"] || {};
  const documents = details?.["5"] || {};

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex border-b border-gray-100 bg-gray-50/50 overflow-x-auto scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === tab ? 'text-[#8B0000] border-b-2 border-[#8B0000] bg-white' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-10 min-h-[250px]">
        {/* BASIC DETAILS */}
        {activeTab === 'Basic Details' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <TabItem label="Institution Type" value={business?.institutionType} />
            <TabItem label="Number of Staff" value={business?.numberOfStaff} />
            <TabItem label="CEO Name" value={business?.ceoName} />
            <TabItem label="Admin Name" value={admin?.adminName} />
          </div>
        )}

        {/* PAN DETAILS */}
        {activeTab === 'PAN Details' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <TabItem label="PAN Number" value={business?.pan} />
            <TabItem label="Entity PAN" value={documents?.entityPanCard} />
            <TabItem label="GST Number" value={business?.gstNumber} />
          </div>
        )}

        {/* AADHAR DETAILS */}
        {activeTab === 'Aadhar Details' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <TabItem label="First Name" value={personal?.firstName} />
            <TabItem label="Last Name" value={personal?.lastName} />
            <TabItem label="Address" value={personal?.permanentAddress1} />
            <TabItem label="District" value={personal?.district} />
            <TabItem label="Pincode" value={personal?.pinCode} />
            <TabItem label="State" value={personal?.state} />
          </div>
        )}

        {/* MATCHING DETAILS */}
        {activeTab === 'Matching Details' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <TabItem label="Account Number" value={bank?.accountNumber} />
            <TabItem label="Admin Mobile" value={admin?.adminMobileNumber} />
            <TabItem label="Admin Email" value={admin?.adminEmail} />
            <TabItem label="Entity ID" value={documents?.entityId} />
          </div>
        )}

        {/* GEO-TAGGING ANALYSIS */}
        {activeTab === 'Geo-Tagging Analysis' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <TabItem label="Latitude" value={business?.latitude} />
            <TabItem label="Longitude" value={business?.longitude} />
            <TabItem label="Business Address" value={business?.businessAddress} />
          </div>
        )}

        {/* AGREEMENT DETAILS */}
        {activeTab === 'Agreement Details' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <TabItem label="Agreement Start Date" value={documents?.agreementStartDate} />
            <TabItem label="Agreement End Date" value={documents?.agreementEndDate} />
            <TabItem label="Affiliation Fee" value={documents?.affiliationFee} />
          </div>
        )}

        {/* BROWSER DATA */}
        {activeTab === 'Browser Data' && (
          <div className="flex flex-col md:flex-row justify-between items-start">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 w-full md:w-2/3">
              <TabItem label="Browser" value="Chrome" />
              <TabItem label="User OS" value="Windows" />
              <TabItem label="Platform" value="Web" />
              <TabItem label="Browser Language" value="English" />
            </div>
            <div className="hidden md:flex w-1/3 justify-center items-center">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg" 
                alt="Browser Icon" 
                className="w-32 h-32 opacity-90"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TabItem = ({ label, value }) => (
  <div className="flex flex-col border-b border-gray-100 pb-2">
    <span className="text-gray-400 text-xs font-medium mb-1">{label}:</span>
    <span className="font-bold text-gray-800 text-sm">{value || "NA"}</span>
  </div>
);

export default ProfileTabs;