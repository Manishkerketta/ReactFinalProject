import React, { useState } from 'react';
import { Search, CheckCircle2 } from 'lucide-react';
import nsdl_logo from '../../assets/nsdl_logo.png';

const WalletAdjustment = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [userFound, setUserFound] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Wallet Adjustment</h2>

      {/* STEP 1: USER SEARCH */}
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col gap-2 max-w-[500px]">
          <label className="text-sm font-medium text-gray-500">User Name</label>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Enter User Name" 
              className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-md outline-none focus:border-[#8B0000]"
              onChange={(e) => setUserFound(e.target.value.length > 5)}
            />
            <button className="bg-[#8B0000] text-white px-8 py-2.5 rounded-md font-bold hover:bg-[#700000]">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* STEP 2: ADJUSTMENT FORM (Visible after search) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-8 py-4 border-b border-gray-100">
          <p className="text-sm font-bold text-gray-800 tracking-wide uppercase">Please Enter all the Details</p>
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-400">User Name</label>
            <input type="text" value="AG7435421" disabled className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-md text-gray-500" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-400">Name</label>
            <input type="text" value="Pabitra Hota" disabled className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-md text-gray-500" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-400">Types of Operations</label>
            <select className="px-4 py-3 bg-white border border-gray-200 rounded-md outline-none focus:border-[#8B0000]">
              <option>Select Operations</option>
              <option>Credit</option>
              <option>Debit</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-400">Amount</label>
            <input type="text" placeholder="Enter Amount" className="px-4 py-3 bg-white border border-gray-200 rounded-md outline-none focus:border-[#8B0000]" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-400">Wallet</label>
            <input type="text" value="Wallet 2" disabled className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-md text-gray-500" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-400">Remark</label>
            <input type="text" placeholder="Enter Remark" className="px-4 py-3 bg-white border border-gray-200 rounded-md outline-none focus:border-[#8B0000]" />
          </div>
        </div>

        <div className="p-8 pt-0 flex justify-end gap-6">
          <button className="text-red-700 font-bold px-4 hover:underline">Cancel</button>
          <button 
            onClick={() => setShowSuccess(true)}
            className="bg-[#8B0000] text-white px-10 py-2.5 rounded-md font-bold shadow-md hover:bg-[#700000]"
          >
            Save
          </button>
        </div>
      </div>

      {/* WALLET SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[420px] p-10 flex flex-col items-center text-center">
            <img src={nsdl_logo} alt="NSDL" className="h-8 mb-8" />
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={44} className="text-green-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-8">Wallet Updated Successfully!</h3>
            <button 
              onClick={() => setShowSuccess(false)}
              className="w-full py-3 bg-[#8B0000] text-white font-bold rounded-md uppercase tracking-wider shadow-lg"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletAdjustment;