import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import nsdl_logo from '../../assets/nsdl_logo.png';

const DownloadModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[450px] p-10 flex flex-col items-center text-center">
        <img src={nsdl_logo} alt="NSDL" className="h-10 mb-8" />
        
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2">Download Complete!</h3>
        <p className="text-gray-500 text-sm mb-10">Report has been downloaded successfully.</p>

        <div className="flex gap-4 w-full">
          <button onClick={onClose} className="flex-1 py-3 text-red-800 font-bold hover:bg-gray-50 rounded-lg transition-colors">
            Cancel
          </button>
          <button onClick={onClose} className="flex-1 py-3 bg-[#8B0000] text-white font-bold rounded-lg hover:bg-[#700000] shadow-lg">
            Open
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;