import React, { useState } from 'react';
import { Search, ChevronDown, Loader2, AlertCircle, Eye, Download, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx'; // Import for Excel Export
import nsdl_logo from '../../assets/nsdl_logo.png'; // Ensure path to your logo is correct
import { getEncryptedData, fetchUserList, getDecryptedData, fetchUserListPlain } from "../../utils/authService";

const UserRequest = () => {
  const navigate = useNavigate();
  const [expandedRow, setExpandedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [searchType, setSearchType] = useState('date');
  
  // --- NEW: DOWNLOAD MODAL STATE ---
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // --- ROLE CHECK LOGIC ---
  const savedUser = localStorage.getItem('user_details');
  const userData = savedUser ? JSON.parse(savedUser) : null;
  const isOpsMaker = userData?.roleName === "ROLE_OPS_MAKER";
  const loggedInUserName = userData?.user_name || userData?.userType || "";

  // DYNAMIC FILTERS STATE
  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    role: isOpsMaker ? "CBC" : "ALL",
    status: "ALL",
    searchUsername: ""
  });

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setCurrentPage(1); // Reset to page 1 on new search

    try {
      let payload = {};
      if (searchType === 'date') {
        payload = { status: filters.status, username: loggedInUserName, startDate: filters.startDate, endDate: filters.endDate, role: filters.role };
      } else {
        if (!filters.searchUsername) {
          alert("Please enter a username to search");
          setLoading(false);
          return;
        }
        payload = { searchUsername: filters.searchUsername, role: filters.role === "ALL" ? "Agent" : filters.role };
      }

      let results = [];
      if (isOpsMaker) {
        const response = await fetchUserListPlain(payload);
        results = response.data?.resultObj?.result || [];
      } else {
        const encryptedReq = await getEncryptedData(payload);
        const response = await fetchUserList(encryptedReq);
        const decrypted = await getDecryptedData(response.data);
        results = decrypted?.resultObj?.result || [];
      }

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

  // --- NEW: EXCEL EXPORT LOGIC ---
  const downloadExcel = () => {
    try {
      const dataToExport = tableData.map((row, index) => {
        const info = row["1"] || {};
        return {
          "S.No": index + 1,
          "User Name": row.username,
          "User Type": row.userRole || 'Maker',
          "First Name": info.firstName || "NA",
          "Last Name": info.lastName || "NA",
          "Mobile Number": info.mobileNumber || "NA",
          "Email ID": info.email || "NA",
          "Status": row.status,
          "Created Date": new Date(row.createdAt).toLocaleDateString('en-GB')
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "UserRequests");
      XLSX.writeFile(workbook, `User_Details_Report_${new Date().getTime()}.xlsx`);
      
      // Open the Success Modal after download
      setShowDownloadModal(true);
    } catch (error) {
      console.error("Download Error:", error);
      alert("Failed to export Excel.");
    }
  };

  // --- PAGINATION CALCULATION ---
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(tableData.length / rowsPerPage);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 relative min-h-[500px]">

      {/* --- NEW: DOWNLOAD SUCCESS MODAL (Matches image_bd8501.png) --- */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-[450px] animate-modalIn text-center p-8 relative">
             <div className="flex justify-center mb-6">
                <img src={nsdl_logo} alt="NSDL" className="h-10 object-contain" />
             </div>
             <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border-4 border-white">
                <CheckCircle2 size={48} strokeWidth={3} />
             </div>
             <h3 className="text-xl font-bold text-gray-800 mb-2">Download Complete!</h3>
             <p className="text-gray-500 text-sm mb-10">User details report has been downloaded successfully.</p>
             <div className="flex gap-4 justify-end">
                <button 
                  onClick={() => setShowDownloadModal(false)} 
                  className="px-6 py-2 text-red-500 font-bold hover:bg-gray-50 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowDownloadModal(false)} 
                  className="px-8 py-2 bg-[#8B0000] text-white font-bold rounded-md shadow-md hover:bg-[#700000] transition-all"
                >
                  Open
                </button>
             </div>
          </div>
        </div>
      )}

      {/* THEMED CUSTOM ALERT MODAL */}
      {showAlert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-[380px] overflow-hidden animate-modalIn border-t-4 border-[#8B0000]">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 text-[#8B0000] rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Records Found</h3>
              <p className="text-gray-500 text-sm mb-8">No data matching your criteria. Try different filters.</p>
              <button onClick={() => setShowAlert(false)} className="w-full py-3 bg-[#8B0000] text-white font-bold rounded-md uppercase tracking-widest text-sm">Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
              <span>User Management</span> / <span className="text-gray-600 font-medium">User Request</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">User Request</h2>
          </div>
          
          {/* NEW: DOWNLOAD BUTTON */}
          {tableData.length > 0 && (
            <button 
              onClick={downloadExcel}
              className="flex items-center gap-2 bg-[#8B0000] text-white px-4 py-2 rounded-md font-bold text-sm hover:bg-[#700000] transition-all shadow-sm"
            >
              <Download size={18} /> Download Excel
            </button>
          )}
        </div>

        <div className="flex items-center gap-6 mb-6 px-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer font-medium text-gray-700">
            <input type="radio" checked={searchType === 'date'} onChange={() => setSearchType('date')} className="w-4 h-4 accent-[#8B0000]" />
            Search by Date Range
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer font-medium text-gray-700">
            <input type="radio" checked={searchType === 'username'} onChange={() => setSearchType('username')} className="w-4 h-4 accent-[#8B0000]" />
            Search by User Name
          </label>
        </div>

        <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end">
            {searchType === 'date' ? (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-gray-500 uppercase">From Date*</label>
                  <input type="date" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-gray-500 uppercase">To Date*</label>
                  <input type="date" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[12px] font-bold text-gray-500 uppercase">Search Username*</label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input type="text" placeholder="Enter username..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-md text-sm outline-none" value={filters.searchUsername} onChange={(e) => setFilters({ ...filters, searchUsername: e.target.value })} />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-gray-500 uppercase">User Role</label>
              <select className="w-full px-4 py-2 bg-white border border-gray-200 rounded-md text-sm outline-none" value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })} >
                {isOpsMaker ? <option value="CBC">CBC</option> :
                  <><option value="ALL">ALL</option><option value="CBC">CBC</option><option value="Retailer">Retailer</option></>}
              </select>
            </div>

            {searchType === 'date' && !isOpsMaker && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-gray-500 uppercase">Status</label>
                <select className="w-full px-4 py-2 bg-white border border-gray-200 rounded-md text-sm outline-none" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} >
                  <option value="ALL">ALL</option><option value="APPROVED">APPROVED</option><option value="PENDING">PENDING</option><option value="REJECTED">REJECTED</option>
                </select>
              </div>
            )}

            <button onClick={handleSearch} disabled={loading} className={`bg-[#8B0000] text-white h-[40px] px-6 rounded-md font-bold hover:bg-[#700000] flex items-center justify-center gap-2 ${searchType === 'username' || isOpsMaker ? 'md:col-start-4' : ''}`}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Submit"}
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto min-h-[300px]">
        {tableData.length > 0 ? (
          <>
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-4">User Name</th>
                  <th className="px-4 py-4">User Type</th>
                  <th className="px-4 py-4">First Name</th>
                  <th className="px-4 py-4">Last Name</th>
                  <th className="px-4 py-4">Date Created</th>
                  <th className="px-4 py-4">Created By</th>
                  <th className="px-4 py-4">Mobile No.</th>
                  <th className="px-4 py-4">Email ID</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-center">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentRows.map((row) => {
                  const info = row["1"] || {};
                  return (
                    <tr key={row._id} className="hover:bg-gray-50/50 text-[12px] text-gray-600">
                      <td className="px-4 py-4 font-bold text-[#8B0000]">{row.username}</td>
                      <td className="px-4 py-4">{row.userRole || 'Maker'}</td>
                      <td className="px-4 py-4">{info.firstName}</td>
                      <td className="px-4 py-4">{info.lastName}</td>
                      <td className="px-4 py-4">{new Date(row.createdAt).toLocaleDateString('en-GB')}</td>
                      <td className="px-4 py-4">{row.createdBy || 'System'}</td>
                      <td className="px-4 py-4">{info.mobileNumber}</td>
                      <td className="px-4 py-4">{info.email}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold ${row.status === 'REJECTED' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => {
                            const targetRole = isOpsMaker ? "CBC" : (row.userRole || 'Retailer');
                            navigate('/dashboard/profile-details', { state: { username: row.username, role: targetRole } });
                          }}
                          className="flex items-center gap-1 text-[#8B0000] font-bold hover:underline mx-auto"
                        >
                          View Details <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* --- PAGINATION FOOTER (Matching image_9f9f62.png) --- */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium bg-white">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span>Row per page</span>
                  <select 
                    value={rowsPerPage} 
                    onChange={(e) => {setRowsPerPage(Number(e.target.value)); setCurrentPage(1);}}
                    className="border rounded px-2 py-1 outline-none bg-white"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span>Go to</span>
                  <input 
                    type="number" 
                    className="w-12 border rounded px-2 py-1 text-center outline-none" 
                    min={1} 
                    max={totalPages}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = Math.max(1, Math.min(totalPages, Number(e.target.value)));
                        setCurrentPage(val);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-50 disabled:opacity-30 transition-colors"
                >
                  {"<"}
                </button>
                
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  // Standard pagination dots logic
                  if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded border flex items-center justify-center transition-all ${currentPage === pageNum ? 'bg-[#8B0000] text-white border-[#8B0000] font-bold' : 'hover:bg-gray-50'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  if (pageNum === currentPage - 2 || pageNum === currentPage + 2) return <span key={pageNum} className="px-1 text-gray-300">...</span>;
                  return null;
                })}

                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-50 disabled:opacity-30 transition-colors"
                >
                  {">"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-300">
            <Search size={48} className="mb-2 opacity-20" />
            <p className="font-medium italic">Click Submit to fetch data</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRequest;