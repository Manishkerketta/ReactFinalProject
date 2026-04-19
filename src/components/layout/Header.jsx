import React from 'react';
import { Menu, Bell, ChevronDown } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
      <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
        <Menu size={24} />
      </button>

      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer">
          <Bell size={22} className="text-gray-500" />
          <span className="absolute -top-1 -right-1 bg-[#8B0000] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">9</span>
        </div>
        <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
          <div className="w-8 h-8 rounded-full bg-[#FFE4E4] border border-gray-200 overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Stebin" alt="user" />
          </div>
          <span className="text-sm font-semibold text-gray-700">Stebin Ben</span>
          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </div>
    </header>
  );
};

export default Header;