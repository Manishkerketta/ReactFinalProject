// import React, { useState } from 'react';
// import { 
//   LayoutDashboard, Users, FileText, BarChart3, Wallet, 
//   Menu, Bell, ChevronDown, ChevronUp, Download, Search, Calendar
// } from 'lucide-react';
// import nsdl_logo from '../assets/nsdl_logo.png';

// const Dashboard = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [isUserMgmtOpen, setIsUserMgmtOpen] = useState(true); // Sub-menu toggle
//   const [activeTab, setActiveTab] = useState('user-request'); // Control main content
//   const [expandedRow, setExpandedRow] = useState(null); // Row expansion logic

//   // Mock Data for the Table
//   const tableData = [
//     { id: 1, username: 'john_doe', empId: 'EMP92198', name: 'Carson Darrin', mobile: '+91 9238732872', email: 'johndoe@gmail.com' },
//     { id: 2, username: 'jane_smith', empId: 'EMP92199', name: 'Sara Soudan', mobile: '+91 9238732873', email: 'janesmith@gmail.com' },
//     // ... add more mock rows as needed
//   ];

//   const toggleRow = (id) => {
//     setExpandedRow(expandedRow === id ? null : id);
//   };

//   return (
//     <div className="flex h-screen bg-[#F8F9FA] font-sans overflow-hidden">
      
//       {/* SIDEBAR */}
//       <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col z-20`}>
//         <div className="p-6 border-b border-gray-100 flex justify-center">
//           <img src={nsdl_logo} alt="NSDL" className="h-8 object-contain" />
//         </div>

//         <nav className="flex-1 mt-4 overflow-y-auto">
//           <ul className="space-y-1">
//             {/* Dashboard Link */}
//             <li 
//               onClick={() => setActiveTab('welcome')}
//               className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-all ${activeTab === 'welcome' ? 'bg-[#FDF2F2] border-r-4 border-[#8B0000] text-[#8B0000]' : 'text-gray-600 hover:bg-gray-50'}`}
//             >
//               <LayoutDashboard size={20} />
//               {isSidebarOpen && <span className="font-medium">Dashboard</span>}
//             </li>

//             {/* Bank User Management (Dropdown) */}
//             <li>
//               <div 
//                 onClick={() => setIsUserMgmtOpen(!isUserMgmtOpen)}
//                 className={`flex items-center justify-between px-6 py-3 cursor-pointer text-gray-600 hover:bg-gray-50 ${activeTab.includes('user-') && 'text-[#8B0000]'}`}
//               >
//                 <div className="flex items-center gap-3">
//                   <Users size={20} />
//                   {isSidebarOpen && <span className="font-medium">Bank User Management</span>}
//                 </div>
//                 {isSidebarOpen && (isUserMgmtOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
//               </div>
              
//               {/* Sub-menu items */}
//               {isSidebarOpen && isUserMgmtOpen && (
//                 <ul className="bg-gray-50/50">
//                   <li 
//                     onClick={() => setActiveTab('user-request')}
//                     className={`pl-14 py-2 text-[14px] cursor-pointer hover:text-[#8B0000] ${activeTab === 'user-request' ? 'text-[#8B0000] font-bold border-r-4 border-[#8B0000] bg-[#FDF2F2]' : 'text-gray-500'}`}
//                   >
//                     User Request
//                   </li>
//                   <li 
//                     onClick={() => setActiveTab('user-list')}
//                     className={`pl-14 py-2 text-[14px] cursor-pointer hover:text-[#8B0000] ${activeTab === 'user-list' ? 'text-[#8B0000] font-bold' : 'text-gray-500'}`}
//                   >
//                     User List Report
//                   </li>
//                 </ul>
//               )}
//             </li>

//             <li className="flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-gray-50 cursor-pointer">
//               <FileText size={20} />
//               {isSidebarOpen && <span className="font-medium">Audit Trail</span>}
//             </li>
//           </ul>
//         </nav>
//       </aside>

//       {/* MAIN CONTENT AREA */}
//       <div className="flex-1 flex flex-col overflow-hidden">
        
//         {/* HEADER */}
//         <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
//           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg"><Menu size={24} /></button>
//           <div className="flex items-center gap-6">
//             <div className="relative cursor-pointer"><Bell size={22} className="text-gray-500" /><span className="absolute -top-1 -right-1 bg-[#8B0000] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">9</span></div>
//             <div className="flex items-center gap-3 border-l pl-4"><span className="text-sm font-semibold">Stebin Ben</span><ChevronDown size={14} className="text-gray-400" /></div>
//           </div>
//         </header>

//         {/* PAGE CONTENT */}
//         <main className="flex-1 overflow-y-auto p-6">
//           {activeTab === 'user-request' ? (
//             <div className="bg-white rounded-lg shadow-sm border border-gray-100">
//               {/* Table Toolbar */}
//               <div className="p-6 border-b border-gray-100">
//                 <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
//                   <span>Bank User Management</span> / <span className="text-gray-600">User Request</span>
//                 </div>
//                 <h2 className="text-xl font-bold text-gray-800 mb-6">User Request</h2>
                
//                 {/* Filters */}
//                 <div className="flex flex-wrap items-center justify-between gap-4">
//                   <div className="flex items-center gap-6">
//                     <label className="flex items-center gap-2 text-sm cursor-pointer font-medium text-gray-700">
//                       <input type="radio" name="searchType" checked className="text-[#8B0000] focus:ring-[#8B0000]" /> Search by Date Range
//                     </label>
//                     <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-400">
//                       <input type="radio" name="searchType" className="text-gray-300" /> Search by User Name
//                     </label>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
//                   <div className="relative"><Search className="absolute left-3 top-3 text-gray-400" size={18} /><input type="text" placeholder="Search here" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:border-[#8B0000]" /></div>
//                   <div className="relative"><Calendar className="absolute left-3 top-3 text-gray-400" size={18} /><input type="text" placeholder="Start date → End date" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none" /></div>
//                   <select className="bg-gray-50 border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-500 outline-none"><option>User Type</option></select>
//                   <select className="bg-gray-50 border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-500 outline-none"><option>Status</option></select>
//                   <button className="bg-[#8B0000] text-white px-4 py-2.5 rounded-md flex items-center justify-center gap-2 text-sm font-bold hover:bg-[#700000] transition-colors">
//                     <Download size={18} /> Download Excel
//                   </button>
//                 </div>
//               </div>

//               {/* Table */}
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left">
//                   <thead className="bg-gray-50 text-gray-500 text-[13px] font-semibold uppercase tracking-wider">
//                     <tr>
//                       <th className="px-6 py-4">S. No.</th>
//                       <th className="px-6 py-4">Username</th>
//                       <th className="px-6 py-4">Employee ID</th>
//                       <th className="px-6 py-4">Employee Name</th>
//                       <th className="px-6 py-4">Mobile Number</th>
//                       <th className="px-6 py-4">Email ID</th>
//                       <th className="px-6 py-4 text-center">Expand</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100">
//                     {tableData.map((row) => (
//                       <React.Fragment key={row.id}>
//                         <tr className="hover:bg-gray-50/50 transition-colors text-sm text-gray-600">
//                           <td className="px-6 py-5">{row.id}</td>
//                           <td className="px-6 py-5 font-medium">{row.username}</td>
//                           <td className="px-6 py-5">{row.empId}</td>
//                           <td className="px-6 py-5 flex items-center gap-2">
//                             <div className="w-8 h-8 rounded-full bg-gray-200"></div> {row.name}
//                           </td>
//                           <td className="px-6 py-5">{row.mobile}</td>
//                           <td className="px-6 py-5">{row.email}</td>
//                           <td className="px-6 py-5 text-center cursor-pointer" onClick={() => toggleRow(row.id)}>
//                             <div className={`p-1 inline-block transition-transform ${expandedRow === row.id ? 'rotate-180' : ''}`}><ChevronDown size={18} className="text-[#8B0000]" /></div>
//                           </td>
//                         </tr>
                        
//                         {/* Expanded Content */}
//                         {expandedRow === row.id && (
//                           <tr>
//                             <td colSpan="7" className="bg-gray-50/50 px-12 py-8">
//                               <div className="grid grid-cols-4 gap-y-8 text-sm">
//                                 <div><p className="text-gray-400 mb-1">User Role</p><p className="font-bold">Maker</p></div>
//                                 <div><p className="text-gray-400 mb-1">Employee Name</p><p className="font-bold">{row.name}</p></div>
//                                 <div><p className="text-gray-400 mb-1">Email Address</p><p className="font-bold">{row.email}</p></div>
//                                 <div><p className="text-gray-400 mb-1">Updated By</p><p className="font-bold">Admin</p></div>
//                                 <div><p className="text-gray-400 mb-1">Updated Date</p><p className="font-bold">12.09.2024</p></div>
//                                 <div><p className="text-gray-400 mb-1">Status</p><p className="font-bold">-</p></div>
//                                 <div><p className="text-gray-400 mb-1">Operation Type</p><p className="font-bold">-</p></div>
//                                 <div><p className="text-gray-400 mb-1">Created By</p><p className="font-bold">Admin</p></div>
//                               </div>
//                             </td>
//                           </tr>
//                         )}
//                       </React.Fragment>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           ) : (
//             <div className="h-full flex items-center justify-center text-gray-400">Select an item from the sidebar</div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;