import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Functionalities = () => {
  const navigate = useNavigate();
  const selected = ["Account Opening", "BBPS", "MATM", "UPI", "POS"];
  const notSelected = ["DMT", "AePS", "Card"];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <span>Bank User Management</span> / <span>User List Report</span> / <span className="text-gray-600">Functionalities</span>
      </div>

      <button 
        onClick={() => navigate('/dashboard/user-list')} 
        className="flex items-center gap-2 text-gray-800 mb-10 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        <span className="font-bold text-xl">Functionalities</span>
      </button>

      <div className="space-y-16">
        {/* Selected Section */}
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-8">Selected Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12">
            {selected.map(item => (
              <p key={item} className="font-bold text-gray-800 text-md">{item}</p>
            ))}
          </div>
        </div>

        {/* Not Selected Section */}
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-8">Not Selected Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12">
            {notSelected.map(item => (
              <p key={item} className="font-bold text-gray-800 text-md">{item}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Functionalities;