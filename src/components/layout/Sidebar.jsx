import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
    LayoutDashboard, Users, FileText, BarChart3,
    Wallet, ChevronDown, ChevronUp
} from 'lucide-react';
import nsdl_logo from '../../assets/nsdl_logo.png';

const Sidebar = ({ isOpen }) => {
    const location = useLocation();
    const [isUserMgmtOpen, setIsUserMgmtOpen] = useState(true);
    const [isReportsOpen, setIsReportsOpen] = useState(false);
    // Helper to check if a link is active
    const isActive = (path) => location.pathname === path;

    return (
        <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col z-20`}>
            <div className="p-6 border-b border-gray-100 flex justify-center">
                <img src={nsdl_logo} alt="NSDL" className="h-8 object-contain" />
            </div>

            <nav className="flex-1 mt-4 overflow-y-auto">
                <ul className="space-y-1">
                    {/* Dashboard Home */}
                    <Link to="/dashboard">
                        <li className={`flex items-center gap-3 px-6 py-3 cursor-pointer ${isActive('/dashboard') ? 'bg-[#FDF2F2] border-r-4 border-[#8B0000] text-[#8B0000]' : 'text-gray-600 hover:bg-gray-50'}`}>
                            <LayoutDashboard size={20} />
                            {isOpen && <span className="font-medium">Dashboard</span>}
                        </li>
                    </Link>

                    {/* Bank User Management Dropdown */}
                    <li>
                        <div
                            onClick={() => setIsUserMgmtOpen(!isUserMgmtOpen)}
                            className={`flex items-center justify-between px-6 py-3 cursor-pointer text-gray-600 hover:bg-gray-50 ${location.pathname.includes('user') && 'text-[#8B0000]'}`}
                        >
                            <div className="flex items-center gap-3">
                                <Users size={20} />
                                {isOpen && <span className="font-medium">Bank User Management</span>}
                            </div>
                            {isOpen && (isUserMgmtOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                        </div>

                        {isOpen && isUserMgmtOpen && (
                            <ul className="bg-gray-50/50">
                                <Link to="/dashboard/user-request">
                                    <li className={`pl-14 py-2 text-[14px] cursor-pointer ${isActive('/dashboard/user-request') ? 'text-[#8B0000] font-bold border-r-4 border-[#8B0000] bg-[#FDF2F2]' : 'text-gray-500 hover:text-[#8B0000]'}`}>
                                        User Request
                                    </li>
                                </Link>
                                <Link to="/dashboard/user-list">
                                    <li className={`pl-14 py-2 text-[14px] cursor-pointer ${isActive('/dashboard/user-list') ? 'text-[#8B0000] font-bold border-r-4 border-[#8B0000] bg-[#FDF2F2]' : 'text-gray-500 hover:text-[#8B0000]'}`}>
                                        User List Report
                                    </li>
                                </Link>
                            </ul>
                        )}
                    </li>

                    {/* Audit Trail */}
                    <Link to="/dashboard/audit-trail">
                        <li className={`flex items-center gap-3 px-6 py-3 cursor-pointer ${isActive('/dashboard/audit-trail') ? 'bg-[#FDF2F2] border-r-4 border-[#8B0000] text-[#8B0000]' : 'text-gray-600 hover:bg-gray-50'}`}>
                            <FileText size={20} />
                            {isOpen && <span className="font-medium">Audit Trail</span>}
                        </li>
                    </Link>
                    {/* Reports Dropdown */}
                    <li>
                        <div
                            onClick={() => setIsReportsOpen(!isReportsOpen)}
                            className={`flex items-center justify-between px-6 py-3 cursor-pointer text-gray-600 hover:bg-gray-50 ${location.pathname.includes('reports') && 'text-[#8B0000]'}`}
                        >
                            <div className="flex items-center gap-3">
                                <BarChart3 size={20} />
                                {isOpen && <span className="font-medium">Reports</span>}
                            </div>
                            {isOpen && (isReportsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                        </div>

                        {isOpen && isReportsOpen && (
                            <ul className="bg-gray-50/50">
                                <Link to="/dashboard/reports/onboarding">
                                    <li className={`pl-14 py-2 text-[14px] cursor-pointer ${isActive('/dashboard/reports/onboarding') ? 'text-[#8B0000] font-bold border-r-4 border-[#8B0000] bg-[#FDF2F2]' : 'text-gray-500'}`}>
                                        Onboarding Reports
                                    </li>
                                </Link>
                                <Link to="/dashboard/reports/transaction">
                                    <li className={`pl-14 py-2 text-[14px] cursor-pointer ${isActive('/dashboard/reports/transaction') ? 'text-[#8B0000] font-bold border-r-4 border-[#8B0000] bg-[#FDF2F2]' : 'text-gray-500'}`}>
                                        Transaction Reports
                                    </li>
                                </Link>
                            </ul>
                        )}
                    </li>
                </ul>
                {/* Wallet Adjustment Link */}
                                <Link to="/dashboard/wallet-adjustment">
                                    <li className={`flex items-center gap-3 px-6 py-3 cursor-pointer ${isActive('/dashboard/wallet-adjustment') ? 'bg-[#FDF2F2] border-r-4 border-[#8B0000] text-[#8B0000]' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        <Wallet size={20} />
                                        {isOpen && <span className="font-medium">Wallet Adjustment</span>}
                                    </li>
                                </Link>
            </nav>
        </aside>
    );
};

export default Sidebar;