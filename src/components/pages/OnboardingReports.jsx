import React, { useState } from 'react';
import { Search, Calendar, Download } from 'lucide-react';
import DownloadModal from '../shared/DownloadModal';

const OnboardingReports = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 min-h-full">
      <div className="p-6">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
          <span>Reports</span> / <span className="text-gray-600 font-medium">Onboarding Reports</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-6">Onboarding Reports</h2>
        
        <div className="flex items-center gap-6 mb-8">
          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
            <input type="radio" name="onb-rep" defaultChecked className="text-[#8B0000]" /> Today Report
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input type="radio" name="onb-rep" className="text-gray-300" /> Older Report
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="relative"><Search className="absolute left-3 top-3 text-gray-400" size={18} /><input type="text" placeholder="Search here" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-md text-sm outline-none" /></div>
          <div className="relative"><Calendar className="absolute left-3 top-3 text-gray-400" size={18} /><input type="text" placeholder="Start date → End date" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-md text-sm outline-none" /></div>
          
          {/* Added User Type Options */}
          <select className="bg-gray-50 border rounded-md px-3 text-sm text-gray-500 outline-none">
            <option>User Type</option>
            <option>CBC</option>
            <option>CBC Maker</option>
            <option>Master Distributor</option>
            <option>Distributor</option>
            <option>Agent</option>
          </select>

          <select className="bg-gray-50 border rounded-md px-3 text-sm text-gray-500 outline-none">
            <option>Status</option>
            <option>All</option>
            <option>Approve</option>
            <option>Pending</option>
            <option>Reject</option>
          </select>

          <button onClick={() => setShowModal(true)} className="bg-[#8B0000] text-white px-4 py-2.5 rounded-md flex items-center justify-center gap-2 text-sm font-bold shadow-sm transition-all hover:bg-[#700000]">
            <Download size={18} /> Download
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">S. No.</th>
                <th className="px-6 py-4">Field Name</th>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">User ID</th>
                <th className="px-6 py-4">Admin Name</th>
                <th className="px-6 py-4">Updated Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-600">
               {[1, 2, 3].map(i => (
                 <tr key={i} className="hover:bg-gray-50 transition-colors">
                   <td className="px-6 py-4">{i}</td>
                   <td className="px-6 py-4">john_doe</td>
                   <td className="px-6 py-4">john_doe</td>
                   <td className="px-6 py-4">EMP92198</td>
                   <td className="px-6 py-4 flex items-center gap-2">
                     <div className="w-7 h-7 rounded-full bg-gray-200"></div> Carson Darrin
                   </td>
                   <td className="px-6 py-4">15.08.2024</td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>
      <DownloadModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default OnboardingReports;