import React, { useState } from 'react';
import { Search, Calendar, Download, ChevronDown } from 'lucide-react';
import DownloadModal from '../shared/DownloadModal';

const TransactionReports = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 min-h-full">
      <div className="p-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
          <span>Reports</span> / <span className="text-gray-600 font-medium">Transaction Reports</span>
        </div>
        
        <h2 className="text-xl font-bold text-gray-800 mb-6">Transaction Reports</h2>
        
        {/* Radio Tabs */}
        <div className="flex items-center gap-6 mb-8">
          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
            <input type="radio" name="tr-rep" defaultChecked className="text-[#8B0000] focus:ring-[#8B0000]" /> 
            Today Report
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input type="radio" name="tr-rep" className="text-gray-300 focus:ring-gray-300" /> 
            Older Report
          </label>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input type="text" placeholder="Search here" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:border-[#8B0000]" />
          </div>
          
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
            <input type="text" placeholder="Start date → End date" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none" />
          </div>

          <select className="bg-gray-50 border border-gray-200 rounded-md px-3 text-sm text-gray-500 outline-none">
            <option>Transaction Type</option>
            <option>AEPS</option>
            <option>DMT</option>
            <option>Cashout</option>
            <option>Commission</option>
            <option>Wallet</option>
            <option>Account Opening</option>
          </select>

          <select className="bg-gray-50 border border-gray-200 rounded-md px-3 text-sm text-gray-500 outline-none">
            <option>Status</option>
            <option>Success</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>

          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#8B0000] text-white px-4 py-2.5 rounded-md flex items-center justify-center gap-2 text-sm font-bold hover:bg-[#700000] transition-colors shadow-sm"
          >
            <Download size={18} /> Download
          </button>
        </div>

        {/* Data Table */}
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
               {[1, 2, 3, 4, 5].map(i => (
                 <tr key={i} className="hover:bg-gray-50 transition-colors">
                   <td className="px-6 py-4">{i}</td>
                   <td className="px-6 py-4 font-medium text-gray-800">john_doe</td>
                   <td className="px-6 py-4">john_doe</td>
                   <td className="px-6 py-4">EMP92198</td>
                   <td className="px-6 py-4 flex items-center gap-2">
                     <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden">
                       <img src={`https://api.dicebear.com/7.x/initials/svg?seed=Admin${i}`} alt="user" />
                     </div>
                     Carson Darrin
                   </td>
                   <td className="px-6 py-4">15.08.2024</td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>

        {/* Pagination UI Placeholder */}
        <div className="mt-8 flex items-center justify-between text-xs text-gray-400">
           <div>Row per page <select className="ml-1 border rounded"><option>10</option></select></div>
           <div className="flex gap-2">
             <button className="w-6 h-6 border flex items-center justify-center rounded bg-[#8B0000] text-white">6</button>
             <button className="w-6 h-6 border flex items-center justify-center rounded">7</button>
           </div>
        </div>
      </div>

      {/* Reusable Success Modal */}
      <DownloadModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default TransactionReports;