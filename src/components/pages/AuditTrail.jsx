import React from 'react';
import { Download, Search, ArrowLeft, ShieldAlert, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuditTrail = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 min-h-[600px]">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
        <span>Bank User Management</span> / <span className="text-gray-600 font-medium">Audit Trail</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">Audit Trail</h2>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input type="text" placeholder="Search logs..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:border-[#8B0000]" />
        </div>
        <input type="text" placeholder="Start date → End date" className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:border-[#8B0000]" />
        <input type="text" placeholder="Username" className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:border-[#8B0000]" />
        
        <button disabled className="bg-gray-200 text-gray-400 py-2 rounded-md font-bold flex items-center justify-center gap-2 cursor-not-allowed text-sm">
          <Download size={18} /> Download Excel
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden border border-gray-100 rounded-xl">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-6 py-4">S. No.</th>
              <th className="px-6 py-4">Field Name</th>
              <th className="px-6 py-4">Username</th>
              <th className="px-6 py-4">Admin Name</th>
              <th className="px-6 py-4">Created Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="5" className="py-24">
                {/* --- PROFESSIONAL EMPTY STATE --- */}
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 shadow-inner border border-gray-100">
                    <History size={40} className="text-gray-300" />
                  </div>
                  <h3 className="text-gray-800 font-bold text-lg mb-2">No Audit Records Found</h3>
                  <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                    Comprehensive audit logs, including system changes and user activities, will be generated and accessible here once the initial onboarding cycle and live transactions commence.
                  </p>
                  <div className="mt-6 flex gap-2">
                    <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-full uppercase tracking-widest border border-orange-100">
                      System Ready
                    </span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-widest border border-blue-100">
                      Logging Active
                    </span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditTrail;