import React from 'react';
import { Info, Download, Search, Calendar, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserListReport = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
        <span>Bank User Management</span> / <span className="text-gray-600">User List Report</span>
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">User List Report</h2>
      
      {/* Filters (Reusing your UI logic) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="relative"><Search className="absolute left-3 top-3 text-gray-400" size={18} /><input type="text" placeholder="Search here" className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-md text-sm" /></div>
        <div className="relative"><Calendar className="absolute left-3 top-3 text-gray-400" size={18} /><input type="text" placeholder="Date Range" className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-md text-sm" /></div>
        <select className="bg-gray-50 border rounded-md px-3 py-2 text-sm"><option>User Type</option></select>
        <select className="bg-gray-50 border rounded-md px-3 py-2 text-sm"><option>Status</option></select>
        <button className="bg-[#8B0000] text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 text-sm font-bold"><Download size={18} /> Excel</button>
      </div>

      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-50 text-gray-500 font-semibold uppercase">
          <tr>
            <th className="px-6 py-4">S. No.</th>
            <th className="px-6 py-4">Username</th>
            <th className="px-6 py-4">Employee Name</th>
            <th className="px-6 py-4">Email ID</th>
            <th className="px-6 py-4 text-center">Expand</th>
            <th className="px-6 py-4 text-center">Details</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          <tr>
            <td className="px-6 py-4">1</td>
            <td className="px-6 py-4">john_doe</td>
            <td className="px-6 py-4">Carson Darrin</td>
            <td className="px-6 py-4">johndoe@gmail.com</td>
            <td className="px-6 py-4 text-center text-[#8B0000]"><ChevronDown size={18} className="mx-auto" /></td>
            <td className="px-6 py-4 text-center">
              <button 
                onClick={() => navigate('/dashboard/functionalities')} 
                className="text-gray-400 hover:text-[#8B0000]"
              >
                <Info size={20} />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UserListReport;