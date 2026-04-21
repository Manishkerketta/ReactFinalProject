import React, { useState } from 'react';
import { Search, CheckCircle2, AlertCircle, Loader2, XCircle } from 'lucide-react';
import nsdl_logo from '../../assets/nsdl_logo.png';
import { fetchUserForAdjustment, performWalletAdjustment } from '../../utils/authService';

const WalletAdjustment = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    operation: '',
    amount: '',
    remark: ''
  });

  const [modal, setModal] = useState({ show: false, type: '', message: '' });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    
    let role = "CBC MAKER";
    const firstChar = searchQuery.trim().toUpperCase().charAt(0);
    if (firstChar === 'C') role = "CBC";
    else if (firstChar === 'A') role = "Agent";

    try {
      const resp = await fetchUserForAdjustment({
        username: searchQuery.trim(),
        userRole: role
      });

      if (resp.data.success) {
        const data = resp.data.resultObj.data;
        setUserData({
          username: searchQuery.trim(),
          fullName: `${data?.["1"]?.firstName || ""} ${data?.["1"]?.lastName || ""}`.trim() || "User Found"
        });
      } else {
        setModal({ show: true, type: 'error', message: resp.data.message });
        setUserData(null);
      }
    } catch (err) {
      // Check if 400 error has a body
      const msg = err.response?.data?.message || "Search failed. Check connection.";
      setModal({ show: true, type: 'error', message: msg });
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.amount || !formData.operation || !formData.remark) {
      return setModal({
        show: true,
        type: 'error',
        message: "Please fill all mandatory fields (Operation, Amount, Remark)"
      });
    }

    setLoading(true);
    try {
      const payload = {
        userName: userData.username,
        amount: formData.amount,
        remarks: formData.remark,
        api_user: "WEBUSER",
        transaction: formData.operation.toUpperCase()
      };

      const resp = await performWalletAdjustment(payload);

      // This block runs for 2xx status codes
      setModal({ 
        show: true, 
        type: resp.data.status === 1 ? 'success' : 'error', 
        message: resp.data.message || "Update received."
      });

      if (resp.data.status === 1) setFormData({ operation: '', amount: '', remark: '' });

    } catch (err) {
      // --- THE FIX FOR 400 ERROR ---
      // Even if status is 400, the message "CREDIT Not allowed..." is inside err.response.data
      const apiErrorMessage = err.response?.data?.message;

      setModal({ 
        show: true, 
        type: 'error', 
        message: apiErrorMessage || "Network Error: Unable to process request." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <h2 className="text-xl font-bold text-gray-800 tracking-tight">Wallet Adjustment</h2>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col gap-2 max-w-[500px]">
          <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">Search User Name*</label>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Enter User Name (e.g. CBC000149)" 
              className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-md outline-none focus:border-[#8B0000] text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="bg-[#8B0000] text-white px-8 py-2.5 rounded-md font-bold hover:bg-[#700000] flex items-center gap-2 transition-all"
            >
              {loading ? <Loader2 className="animate-spin" size={18}/> : "Search"}
            </button>
          </div>
        </div>
      </div>

      <div className={`bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-500 ${userData ? 'opacity-100' : 'opacity-40 pointer-events-none select-none'}`}>
        <div className="bg-gray-50 px-8 py-4 border-b border-gray-100">
          <p className="text-xs font-bold text-gray-500 tracking-widest uppercase">Adjustment Details</p>
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <DetailInput label="User Name" value={userData?.username || "NA"} disabled />
          <DetailInput label="Full Name" value={userData?.fullName || "NA"} disabled />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase">Types of Operations*</label>
            <select 
              className="px-4 py-3 bg-white border border-gray-200 rounded-md outline-none focus:border-[#8B0000] text-sm"
              value={formData.operation}
              onChange={(e) => setFormData({...formData, operation: e.target.value})}
            >
              <option value="">Select Operations</option>
              <option value="CREDIT">Credit</option>
              <option value="DEBIT">Debit</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase">Amount*</label>
            <input 
              type="number" 
              placeholder="0.00" 
              className="px-4 py-3 bg-white border border-gray-200 rounded-md outline-none focus:border-[#8B0000] text-sm"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
            />
          </div>

          <DetailInput label="Wallet" value="Wallet 2" disabled />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase">Remark*</label>
            <input 
              type="text" 
              placeholder="Enter internal remark" 
              className="px-4 py-3 bg-white border border-gray-200 rounded-md outline-none focus:border-[#8B0000] text-sm"
              value={formData.remark}
              onChange={(e) => setFormData({...formData, remark: e.target.value})}
            />
          </div>
        </div>

        <div className="p-8 pt-0 flex justify-end gap-6">
          <button onClick={() => {setUserData(null); setSearchQuery('');}} className="text-gray-400 font-bold px-4 hover:text-red-700 uppercase text-xs tracking-widest">Cancel</button>
          <button 
            onClick={handleSave}
            disabled={loading || !userData}
            className="bg-[#8B0000] text-white px-12 py-3 rounded-md font-bold shadow-md hover:bg-[#700000] uppercase text-xs tracking-widest transition-all"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" size={18}/> : "Save Adjustment"}
          </button>
        </div>
      </div>

      {modal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[420px] overflow-hidden animate-modalIn">
            <div className={`h-1.5 w-full ${modal.type === 'success' ? 'bg-green-500' : 'bg-[#8B0000]'}`}></div>
            <div className="p-8 flex flex-col items-center text-center">
              <img src={nsdl_logo} alt="NSDL" className="h-8 mb-8" />
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${modal.type === 'success' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-[#8B0000]'}`}>
                {modal.type === 'success' ? <CheckCircle2 size={36} /> : <AlertCircle size={36} />}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-3 px-2">
                {modal.type === 'success' ? 'Transaction Successful' : 'Request Notice'}
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-8 w-full">
                <p className="text-sm text-gray-600 leading-relaxed font-medium italic">
                  "{modal.message}"
                </p>
              </div>
              <button 
                onClick={() => setModal({ ...modal, show: false })}
                className="w-full py-3.5 bg-[#8B0000] text-white font-bold rounded-md uppercase tracking-widest text-xs shadow-lg hover:bg-[#700000]"
              >
                Okay, Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailInput = ({ label, value, disabled }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-gray-400 uppercase tracking-tight">{label}</label>
    <input 
      type="text" 
      value={value} 
      disabled={disabled} 
      className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-md text-gray-600 font-semibold text-sm cursor-not-allowed" 
    />
  </div>
);

export default WalletAdjustment;