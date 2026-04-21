import React, { useState } from 'react';
import { Search, Calendar, Download, RefreshCcw, Lock } from 'lucide-react';
import DownloadModal from '../shared/DownloadModal';

const TransactionReports = () => {
  const [showModal, setShowModal] = useState(false);

  // --- ROLE CHECK LOGIC ---
  const savedUser = JSON.parse(localStorage.getItem('user_details'));
  const isOpsChecker = savedUser?.roleName === "ROLE_OPS_CHECKER";

  if (!isOpsChecker) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-white rounded-lg border border-gray-100 shadow-sm">
        <div className="w-20 h-20 bg-red-50 text-[#8B0000] rounded-full flex items-center justify-center mb-4">
          <Lock size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Access Restricted</h2>
        <p className="text-gray-500 max-w-md mt-2">Transaction sensitive data is restricted to Ops Checker roles. Please contact support if you believe this is an error.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 min-h-full">
      <div className="p-6">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
          <span>Reports</span> / <span className="text-gray-600 font-medium">Transaction Reports</span>
        </div>
        
        <h2 className="text-xl font-bold text-gray-800 mb-6">Transaction Reports</h2>
        
        <div className="flex items-center gap-6 mb-8">
          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
            <input type="radio" name="tr-rep" defaultChecked className="accent-[#8B0000]" /> Today Report
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input type="radio" name="tr-rep" className="accent-[#8B0000]" /> Older Report
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="relative"><Search className="absolute left-3 top-3 text-gray-400" size={18} /><input type="text" placeholder="Search here" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-md text-sm outline-none" /></div>
          <div className="relative"><Calendar className="absolute left-3 top-3 text-gray-400" size={18} /><input type="text" placeholder="Start date → End date" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-md text-sm outline-none" /></div>
          
          <select className="bg-gray-50 border rounded-md px-3 text-sm text-gray-500 outline-none">
            <option>Transaction Type</option><option>AEPS</option><option>DMT</option>
          </select>

          <select className="bg-gray-50 border rounded-md px-3 text-sm text-gray-500 outline-none">
            <option>Status</option><option>Success</option><option>Failed</option>
          </select>

          <button disabled className="bg-gray-200 text-gray-400 px-4 py-2.5 rounded-md flex items-center justify-center gap-2 text-sm font-bold cursor-not-allowed transition-all shadow-sm">
            <Download size={18} /> Download
          </button>
        </div>

        {/* --- PROFESSIONAL EMPTY STATE --- */}
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/30">
            <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-4">
                <RefreshCcw className="text-gray-300 animate-spin-slow" size={32} />
            </div>
            <h3 className="text-gray-800 font-bold text-lg">Transaction Data Unavailable</h3>
            <p className="text-gray-400 text-sm max-w-sm text-center mt-1">
                Real-time transaction logs and reconciliation reports will be populated as soon as active transactions are initiated in the system.
            </p>
        </div>
      </div>

      <DownloadModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default TransactionReports;