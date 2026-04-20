import React, { useState } from 'react';
import { Search, Calendar, ChevronDown, Loader2, AlertCircle, X } from 'lucide-react';
import { getEncryptedData, fetchUserList, getDecryptedData } from "../../utils/authService";

const UserRequest = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [searchType, setSearchType] = useState('date'); // 'date' or 'username'

  // DYNAMIC FILTERS STATE
  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    role: "ALL",
    status: "ALL",
    searchUsername: ""
  });

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      // Get logged-in user from local storage
      const savedUser = localStorage.getItem('user_details');
      const userData = savedUser ? JSON.parse(savedUser) : null;
      const loggedInUserName = userData?.user_name || "";

      let payload = {};

      if (searchType === 'date') {
        // Payload for Date Range Search
        payload = {
          status: filters.status,
          username: loggedInUserName,
          startDate: filters.startDate,
          endDate: filters.endDate,
          role: filters.role
        };
      } else {
        // Payload for Username Search
        // Note: role is required here too, defaults to Retailer if ALL is selected
        payload = {
          searchUsername: filters.searchUsername,
          role: filters.role === "ALL" ? "Retailer" : filters.role
        };

        if (!filters.searchUsername) {
          alert("Please enter a username to search");
          setLoading(false);
          return;
        }
      }

      // 1. ENCRYPT based on selected search type
      const encryptedReq = await getEncryptedData(payload);

      // 2. FETCH
      const response = await fetchUserList(encryptedReq);

      // 3. DECRYPT
      const decrypted = await getDecryptedData(response.data);

      const results = decrypted?.resultObj?.result || [];
      
      if (results.length > 0) {
        setTableData(results);
        setShowAlert(false);
      } else {
        setTableData([]);
        setShowAlert(true);
      }
    } catch (err) {
      console.error("Search Error:", err);
      setTableData([]);
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 relative min-h-[500px]">
      
      {/* THEMED CUSTOM ALERT MODAL */}
      {showAlert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-[380px] overflow-hidden animate-modalIn border-t-4 border-[#8B0000]">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 text-[#8B0000] rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Records Found</h3>
              <p className="text-gray-500 text-sm mb-8">
                We couldn't find any data matching your criteria. Please try different filters.
              </p>
              <button 
                onClick={() => setShowAlert(false)}
                className="w-full py-3 bg-[#8B0000] text-white font-bold rounded-md hover:bg-[#700000] transition-colors uppercase tracking-widest text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
          <span>User Management</span> / <span className="text-gray-600 font-medium">User Request</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-6">User Request</h2>

        {/* Search Type Toggle */}
        <div className="flex items-center gap-6 mb-6 px-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer font-medium text-gray-700">
            <input 
              type="radio" 
              checked={searchType === 'date'} 
              onChange={() => setSearchType('date')}
              className="w-4 h-4 accent-[#8B0000]" 
            /> 
            Search by Date Range
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer font-medium text-gray-700">
            <input 
              type="radio" 
              checked={searchType === 'username'} 
              onChange={() => setSearchType('username')}
              className="w-4 h-4 accent-[#8B0000]" 
            /> 
            Search by User Name
          </label>
        </div>

        <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end">
            
            {searchType === 'date' ? (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-gray-500 uppercase">From Date*</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-[#8B0000]"
                    value={filters.startDate}
                    onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-gray-500 uppercase">To Date*</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-[#8B0000]"
                    value={filters.endDate}
                    onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                  />
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[12px] font-bold text-gray-500 uppercase">Search Username*</label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Enter username..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-[#8B0000]"
                    value={filters.searchUsername}
                    onChange={(e) => setFilters({...filters, searchUsername: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-gray-500 uppercase">User Role</label>
              <select 
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-md text-sm outline-none"
                value={filters.role}
                onChange={(e) => setFilters({...filters, role: e.target.value})}
              >
                <option value="ALL">ALL</option>
                <option value="CBC">CBC</option>
                <option value="CBC Maker">CBC Maker</option>
                <option value="Master Distributor">Master Distributor</option>
                <option value="Distributor">Distributor</option>
                <option value="Retailer">Retailer</option>
              </select>
            </div>

            {searchType === 'date' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-gray-500 uppercase">Status</label>
                <select 
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-md text-sm outline-none"
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="ALL">ALL</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>
            )}

            <button 
              onClick={handleSearch}
              disabled={loading}
              className={`bg-[#8B0000] text-white h-[40px] px-6 rounded-md font-bold hover:bg-[#700000] transition-all flex items-center justify-center gap-2 ${searchType === 'username' ? 'md:col-start-4' : ''}`}
            >
              {loading ? <Loader2 className="animate-spin" size={18}/> : "Submit"}
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {tableData.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">S. No.</th>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Employee Name</th>
                <th className="px-6 py-4">Mobile Number</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Expand</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tableData.map((row, index) => {
                const info = row["1"] || {};
                return (
                  <React.Fragment key={row._id}>
                    <tr className="hover:bg-gray-50/50 text-sm text-gray-600 transition-colors">
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4 font-bold text-[#8B0000]">{row.username}</td>
                      <td className="px-6 py-4 font-medium">{info.firstName} {info.lastName}</td>
                      <td className="px-6 py-4">{info.mobileNumber}</td>
                      <td className="px-6 py-4 text-[10px]">
                        <span className={`px-2 py-0.5 rounded-full font-bold ${row.status === 'REJECTED' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => setExpandedRow(expandedRow === row._id ? null : row._id)}>
                          <ChevronDown size={18} className={`text-[#8B0000] transition-transform ${expandedRow === row._id ? 'rotate-180' : ''}`} />
                        </button>
                      </td>
                    </tr>
                    {expandedRow === row._id && (
                      <tr className="bg-gray-50/30">
                        <td colSpan="6" className="px-10 py-6 border-b border-gray-100">
                           <div className="grid grid-cols-4 gap-y-6 text-xs animate-modalIn">
                              <div><p className="text-gray-400 font-medium mb-1 uppercase">Pan ID</p><p className="font-bold text-gray-800">{row["4"]?.pan || 'N/A'}</p></div>
                              <div><p className="text-gray-400 font-medium mb-1 uppercase">Email</p><p className="font-bold text-gray-800">{info.email}</p></div>
                              <div><p className="text-gray-400 font-medium mb-1 uppercase">State</p><p className="font-bold text-gray-800">{info.state}</p></div>
                              <div><p className="text-gray-400 font-medium mb-1 uppercase">District</p><p className="font-bold text-gray-800">{info.district}</p></div>
                              <div className="col-span-4 p-3 bg-red-50/50 border border-red-100 rounded-md">
                                 <p className="text-red-800 font-bold mb-1">Remarks</p>
                                 <p className="text-gray-600 italic">"{row.remarks?.comments || 'No remarks provided'}"</p>
                              </div>
                           </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-300">
            <Search size={48} className="mb-2 opacity-20" />
            <p className="font-medium italic">Enter filters and click Submit to fetch data</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRequest;