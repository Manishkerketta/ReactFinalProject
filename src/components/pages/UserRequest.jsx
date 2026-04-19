import React, { useState } from 'react';
import { Search, Calendar, Download, ChevronDown } from 'lucide-react';

const UserRequest = () => {
  const [expandedRow, setExpandedRow] = useState(null);

  // This data will eventually come from your API
  const tableData = [
    { id: 1, username: 'john_doe', empId: 'EMP92198', name: 'Carson Darrin', mobile: '+91 9238732872', email: 'johndoe@gmail.com', role: 'Maker', date: '12.09.2024' },
    { id: 2, username: 'sara_s', empId: 'EMP92205', name: 'Sara Soudan', mobile: '+91 9238732873', email: 'sara@gmail.com', role: 'Checker', date: '14.09.2024' },
  ];

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      {/* 1. TOP TOOLBAR & BREADCRUMBS */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
          <span>Bank User Management</span> / <span className="text-gray-600 font-medium">User Request</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-6">User Request</h2>
        
        {/* Radio Filter */}
        <div className="flex items-center gap-6 mb-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer font-medium text-gray-700">
            <input type="radio" name="st" defaultChecked className="text-[#8B0000] focus:ring-[#8B0000]" /> 
            Search by Date Range
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-400">
            <input type="radio" name="st" className="text-gray-300" /> 
            Search by User Name
          </label>
        </div>

        {/* Search & Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input type="text" placeholder="Search here" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:border-[#8B0000]" />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
            <input type="text" placeholder="Start date → End date" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none" />
          </div>
          <select className="bg-gray-50 border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-500 outline-none"><option>User Type</option></select>
          <select className="bg-gray-50 border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-500 outline-none"><option>Status</option></select>
          <button className="bg-[#8B0000] text-white px-4 py-2.5 rounded-md flex items-center justify-center gap-2 text-sm font-bold hover:bg-[#700000] transition-colors">
            <Download size={18} /> Download Excel
          </button>
        </div>
      </div>

      {/* 2. DATA TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-[13px] font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">S. No.</th>
              <th className="px-6 py-4">Username</th>
              <th className="px-6 py-4">Employee ID</th>
              <th className="px-6 py-4">Employee Name</th>
              <th className="px-6 py-4">Mobile Number</th>
              <th className="px-6 py-4">Email ID</th>
              <th className="px-6 py-4 text-center">Expand</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tableData.map((row) => (
              <React.Fragment key={row.id}>
                <tr className="hover:bg-gray-50/50 transition-colors text-sm text-gray-600">
                  <td className="px-6 py-5">{row.id}</td>
                  <td className="px-6 py-5 font-semibold">{row.username}</td>
                  <td className="px-6 py-5">{row.empId}</td>
                  <td className="px-6 py-5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                       <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${row.name}`} alt="avatar" />
                    </div> 
                    {row.name}
                  </td>
                  <td className="px-6 py-5">{row.mobile}</td>
                  <td className="px-6 py-5">{row.email}</td>
                  <td className="px-6 py-5 text-center">
                    <button 
                      onClick={() => toggleRow(row.id)}
                      className={`p-1 transition-transform ${expandedRow === row.id ? 'rotate-180' : ''}`}
                    >
                      <ChevronDown size={20} className="text-[#8B0000]" />
                    </button>
                  </td>
                </tr>
                
                {/* 3. EXPANDED VIEW (Figma 395x160 logic equivalent) */}
                {expandedRow === row.id && (
                  <tr>
                    <td colSpan="7" className="bg-[#FBFBFB] px-12 py-8 border-b border-gray-100">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 text-sm">
                        <div><p className="text-gray-400 mb-1">User Role</p><p className="font-bold text-gray-800">{row.role}</p></div>
                        <div><p className="text-gray-400 mb-1">Employee Name</p><p className="font-bold text-gray-800">{row.name}</p></div>
                        <div><p className="text-gray-400 mb-1">Email Address</p><p className="font-bold text-gray-800">{row.email}</p></div>
                        <div><p className="text-gray-400 mb-1">Updated By</p><p className="font-bold text-gray-800">Admin</p></div>
                        <div><p className="text-gray-400 mb-1">Updated Date</p><p className="font-bold text-gray-800">{row.date}</p></div>
                        <div><p className="text-gray-400 mb-1">Status</p><p className="font-bold text-gray-800">Active</p></div>
                        <div><p className="text-gray-400 mb-1">Operation Type</p><p className="font-bold text-gray-800">Login</p></div>
                        <div><p className="text-gray-400 mb-1">Remarks</p><p className="font-bold text-gray-800">Test Remarks</p></div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. PAGINATION FOOTER */}
      <div className="p-6 flex items-center justify-between border-t border-gray-100 text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <span>Row per page</span>
          <select className="border rounded px-2 py-1 outline-none"><option>10</option></select>
          <span>Go to <input type="text" className="w-8 border rounded px-1 text-center" defaultValue="1" /></span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border rounded hover:bg-gray-50">1</button>
          <button className="px-3 py-1 text-gray-400">...</button>
          <button className="px-3 py-1 border rounded bg-[#8B0000] text-white font-bold">6</button>
        </div>
      </div>
    </div>
  );
};

export default UserRequest;