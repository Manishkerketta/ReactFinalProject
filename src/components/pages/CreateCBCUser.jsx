import React, { useState } from 'react';
import { Save, RotateCcw, UploadCloud } from 'lucide-react';

const CreateCBCUser = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', companyName: '', pan: '', 
    emailId: '', mobileNumber: '', businessAddress: '',
    pinCode: '', state: '', city: '', district: ''
    // Add other fields as per your screenshot...
  });

  const InputField = ({ label, name, type = "text", placeholder, required = false }) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-gray-600 uppercase">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="px-4 py-2.5 border border-gray-200 rounded-md text-sm outline-none focus:border-[#8B0000] bg-white"
      />
    </div>
  );

  const FileUpload = ({ label }) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-gray-600 uppercase">{label} <span className="text-red-500">*</span></label>
      <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex items-center justify-center gap-3 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all">
        <UploadCloud size={20} className="text-gray-400" />
        <span className="text-xs text-gray-500 font-medium">Upload File (.pdf Only)</span>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Create CBC User</h2>
          <p className="text-sm text-gray-500">Fill in the details to register a new CBC partner</p>
        </div>
      </div>

      <form className="space-y-8">
        {/* Section 1: Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InputField label="First Name" required placeholder="Enter First Name" />
          <InputField label="Middle Name" placeholder="Enter Middle Name" />
          <InputField label="Last Name" required placeholder="Enter Last Name" />
          <InputField label="CEO Name" required placeholder="Enter CEO Name" />
          <InputField label="Company Name" required placeholder="Enter Company Name" />
          <InputField label="Email ID" required type="email" placeholder="Enter Email" />
          <InputField label="PAN" required placeholder="Enter PAN Number" />
          <InputField label="Mobile Number" required placeholder="Enter Mobile" />
        </div>

        <hr className="border-gray-100" />

        {/* Section 2: Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <InputField label="PIN Code" required placeholder="Enter PIN" />
          <InputField label="State" required placeholder="Enter State" />
          <InputField label="District" required placeholder="Enter District" />
          <InputField label="City" required placeholder="Enter City" />
        </div>

        <hr className="border-gray-100" />

        {/* Section 3: Documents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FileUpload label="Bank Resolution" />
          <FileUpload label="Authorized Signatory KYC" />
          <FileUpload label="Certificate of Incorporation" />
          <FileUpload label="First Page of Agreement" />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4 pt-6">
          <button type="button" className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 text-gray-600 font-bold rounded-md hover:bg-gray-50 uppercase text-sm">
            <RotateCcw size={18} /> Reset
          </button>
          <button type="submit" className="flex items-center gap-2 px-8 py-2.5 bg-[#8B0000] text-white font-bold rounded-md hover:bg-[#700000] uppercase text-sm shadow-lg">
            <Save size={18} /> Create User
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCBCUser;