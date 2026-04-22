// import React, { useEffect, useState } from 'react';
// import { Users, Activity, Wallet, BarChart3 } from 'lucide-react';

// const DashboardHome = () => {
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     // 1. Get the decrypted dashboard data we saved in AuthSystem
//     const savedData = localStorage.getItem('dashboard_stats');
//     if (savedData) {
//       try {
//         setData(JSON.parse(savedData));
//       } catch (err) {
//         console.error("Error parsing dashboard data", err);
//       }
//     }
//   }, []);

//   // Helper component for the stat cards
//   const StatCard = ({ title, value, icon: Icon, color }) => (
//     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
//       <div>
//         <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
//         <h3 className="text-2xl font-bold text-gray-800">{value || 0}</h3>
//       </div>
//       <div className={`p-3 rounded-lg ${color}`}>
//         <Icon size={24} className="text-white" />
//       </div>
//     </div>
//   );

//   return (
//     <div className="p-2">
//       {/* Header Section */}
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
//         <p className="text-gray-500">
//           Banking made easy - <span className="text-[#8B0000] font-semibold">JUST IN A JIFFY</span>
//         </p>
//       </div>

//       {/* 2. STATS GRID (Mapping to your decrypted API fields) */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard 
//           title="Total Users" 
//           value={data?.totalUsers} 
//           icon={Users} 
//           color="bg-blue-500" 
//         />
//         <StatCard 
//           title="Active Requests" 
//           value={data?.activeRequests} 
//           icon={Activity} 
//           color="bg-orange-500" 
//         />
//         <StatCard 
//           title="Wallet Balance" 
//           value={data?.totalWalletBalance} 
//           icon={Wallet} 
//           color="bg-green-500" 
//         />
//         <StatCard 
//           title="Total Transactions" 
//           value={data?.totalTransactions} 
//           icon={BarChart3} 
//           color="bg-purple-500" 
//         />
//       </div>

//       {/* Placeholder for Charts/Recent Activity */}
//       <div className="mt-8 bg-white p-8 rounded-xl border border-dashed border-gray-200 flex items-center justify-center min-h-[300px]">
//         <p className="text-gray-400 font-medium italic">Graphical data will appear here once integrated.</p>
//       </div>
//     </div>
//   );
// };

// export default DashboardHome;
import React from 'react';

const DashboardHome = () => {
  return (
    <div className="h-[calc(100vh-100px)] w-full flex items-center justify-center bg-[#FBFBFB] font-sans">
      <div className="text-center animate-fadeIn">
        {/* Main Heading */}
        <h1 className="text-[42px] font-bold text-[#1A1A1A] mb-3 tracking-tight">
          Welcome to NSDL
        </h1>
        
        {/* Sub-heading with specific phrasing */}
        <p className="text-[18px] text-gray-500 font-medium">
          Banking made easy - <span className="text-gray-600">Just in a jiffy</span>
        </p>
      </div>

      {/* Adding custom animation style for the smooth entrance */}
      <style>
        {`
          @keyframes fadeIn {
            from { 
              opacity: 0; 
              transform: translateY(10px); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default DashboardHome;