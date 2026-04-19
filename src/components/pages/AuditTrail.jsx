import React from 'react';
import { Download, Search, ArrowLeft } from 'lucide-react';

const AuditTrail = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
        <span>Bank User Management</span> / <span className="text-gray-600">Audit Trail</span>
      </div>
      <div className="flex items-center gap-3 mb-6">
        <ArrowLeft size={20} className="text-gray-600 cursor-pointer" />
        <h2 className="text-xl font-bold text-gray-800">Audit Trail</h2>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <input type="text" placeholder="Search here" className="px-4 py-2 bg-gray-50 border rounded-md text-sm" />
        <input type="text" placeholder="Start date → End date" className="px-4 py-2 bg-gray-50 border rounded-md text-sm" />
        <input type="text" placeholder="User Name" className="px-4 py-2 bg-gray-50 border rounded-md text-sm" />
        <button className="bg-[#8B0000] text-white py-2 rounded-md font-bold flex items-center justify-center gap-2"><Download size={18} /> Download Excel</button>
      </div>

      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-50 text-gray-500 font-semibold">
          <tr>
            <th className="px-4 py-3 border-b">S. No.</th>
            <th className="px-4 py-3 border-b">Field Name</th>
            <th className="px-4 py-3 border-b">Username</th>
            <th className="px-4 py-3 border-b">Admin Name</th>
            <th className="px-4 py-3 border-b">Created Date</th>
          </tr>
        </thead>
        <tbody>
           <tr className="border-b border-gray-50"><td className="px-4 py-4 text-center" colSpan="5">No Data Available</td></tr>
        </tbody>
      </table>
    </div>
  );
};

export default AuditTrail;