import React, { useState } from 'react';
import { Save, RotateCcw, UploadCloud, CheckCircle2, X, FileText, Calendar } from 'lucide-react';

// --- SUB-COMPONENTS MOVED OUTSIDE TO PREVENT FOCUS LOSS ---

const InputField = ({ label, name, type = "text", placeholder, required = true, value, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-[#8B0000] transition-colors placeholder:text-gray-300"
      />
      {type === 'date' && <Calendar size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />}
    </div>
  </div>
);

const SelectField = ({ label, name, options, required = true, value, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-[#8B0000] transition-colors"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const FileUpload = ({ label, name, fileName, onFileChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-all relative cursor-pointer group">
      <input 
        type="file" 
        className="absolute inset-0 opacity-0 cursor-pointer z-10" 
        accept=".pdf" 
        onChange={(e) => onFileChange(name, e.target.files[0])} 
      />
      {fileName ? (
        <div className="flex flex-col items-center gap-1">
          <FileText size={24} className="text-green-600" />
          <span className="text-[10px] text-green-700 font-bold truncate max-w-[150px]">{fileName}</span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1">
          <UploadCloud size={24} className="text-gray-400 group-hover:text-[#8B0000]" />
          <span className="text-[10px] text-gray-500 font-medium italic">Upload {label} (.pdf only)</span>
        </div>
      )}
    </div>
  </div>
);

const CreateCBCUser = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '', middleName: '', lastName: '', ceoName: '',
    companyName: '', emailId: '', pan: '', mobileNumber: '',
    faxNumber: '', adminName: '', adminEmail: '', adminMobile: '',
    businessAddress: '', country: 'India', pinCode: '', state: '',
    district: '', city: '', accountNumber: '', gstNumber: '',
    institutionType: '', telephoneNumber: '', affiliateFee: '', staffCount: '',
    agreementFromDate: '', agreementToDate: '', entityPanCard: '',
    incorporationAddress: '', productFeatures: ''
  });

  const [files, setFiles] = useState({
    bankResolution: null,
    authSignatoryKyc: null,
    certIncorporation: null,
    firstPageAgreement: null,
    lastPageAgreement: null,
    businessProposal: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (name, file) => {
    if (file) setFiles(prev => ({ ...prev, [name]: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!termsAccepted) return alert("Please accept the terms and conditions");
    
    // Check files
    const missingFiles = Object.keys(files).filter(key => !files[key]);
    if(missingFiles.length > 0) return alert("Please upload all mandatory documents.");

    console.log("Final Submission:", { ...formData, files });
    setShowSuccessModal(true);
  };

  const handleReset = () => {
    setFormData(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: key === 'country' ? 'India' : '' }), {}));
    setFiles({ bankResolution: null, authSignatoryKyc: null, certIncorporation: null, firstPageAgreement: null, lastPageAgreement: null, businessProposal: null });
    setTermsAccepted(false);
  };

  return (
    <div className="p-6 bg-[#F8F9FA] min-h-screen">
      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[420px] p-10 text-center animate-modalIn">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border-4 border-white">
              <CheckCircle2 size={48} strokeWidth={3} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">User Created!</h2>
            <p className="text-gray-500 text-sm mb-10 leading-relaxed">CBC User has been successfully registered in the system with all documents.</p>
            <button onClick={() => setShowSuccessModal(false)} className="w-full py-3.5 bg-[#8B0000] text-white font-bold rounded-md uppercase tracking-widest text-xs hover:bg-[#700000] transition-all">
              Finish
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50">
          <h2 className="text-2xl font-bold text-gray-800">Create CBC User</h2>
          <p className="text-gray-400 text-sm mt-1">Please provide all business and legal information for onboarding</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          {/* SECTION: BASIC DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Enter First Name" />
            <InputField label="Middle Name" name="middleName" required={false} value={formData.middleName} onChange={handleInputChange} placeholder="Enter Middle Name" />
            <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Enter Last Name" />
            <InputField label="CEO Name" name="ceoName" value={formData.ceoName} onChange={handleInputChange} placeholder="Enter CEO Name" />
            <InputField label="Company Name" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Enter Company Name" />
            <InputField label="Email ID" name="emailId" type="email" value={formData.emailId} onChange={handleInputChange} placeholder="Enter Email ID" />
            <InputField label="PAN" name="pan" value={formData.pan} onChange={handleInputChange} placeholder="Enter PAN" />
            <InputField label="Mobile Number" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} placeholder="Enter Mobile" />
            <InputField label="Fax Number" name="faxNumber" required={false} value={formData.faxNumber} onChange={handleInputChange} placeholder="Enter Fax Number" />
            <InputField label="Admin Name" name="adminName" value={formData.adminName} onChange={handleInputChange} placeholder="Enter Admin Name" />
            <InputField label="Admin Email" name="adminEmail" value={formData.adminEmail} onChange={handleInputChange} placeholder="Enter Admin Email" />
            <InputField label="Admin Mobile Number" name="adminMobile" value={formData.adminMobile} onChange={handleInputChange} placeholder="Enter Admin Mobile" />
          </div>

          <div className="h-px bg-gray-100" />

          {/* SECTION: ADDRESS & BANK */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            <InputField label="Business Address Line" name="businessAddress" value={formData.businessAddress} onChange={handleInputChange} placeholder="Enter Business Address" />
            <InputField label="Country" name="country" value={formData.country} onChange={handleInputChange} />
            <InputField label="PIN Code" name="pinCode" value={formData.pinCode} onChange={handleInputChange} placeholder="Enter PIN Code" />
            <InputField label="State" name="state" value={formData.state} onChange={handleInputChange} placeholder="Enter State" />
            <InputField label="District" name="district" value={formData.district} onChange={handleInputChange} placeholder="Enter District" />
            <InputField label="City" name="city" value={formData.city} onChange={handleInputChange} placeholder="Enter City" />
            <InputField label="Account Number" name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} placeholder="Enter Account Number" />
            <InputField label="GST Number" name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} placeholder="Enter GST Number" />
            <SelectField label="Institution Type" name="institutionType" value={formData.institutionType} onChange={handleInputChange} options={[{value:'INDIVIDUAL', label:'INDIVIDUAL'}, {value:'PVT_LTD', label:'PVT LTD'}]} />
            <InputField label="Telephone Number" name="telephoneNumber" required={false} value={formData.telephoneNumber} onChange={handleInputChange} placeholder="Enter Telephone" />
            <InputField label="Affiliate Fee" name="affiliateFee" value={formData.affiliateFee} onChange={handleInputChange} placeholder="Enter Fee" />
            <InputField label="Number of Staff" name="staffCount" value={formData.staffCount} onChange={handleInputChange} placeholder="Enter staff count" />
          </div>

          <div className="h-px bg-gray-100" />

          {/* SECTION: AGREEMENT & EXTRAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            <InputField label="Agreement From Date" name="agreementFromDate" type="date" value={formData.agreementFromDate} onChange={handleInputChange} />
            <InputField label="Agreement To Date" name="agreementToDate" type="date" value={formData.agreementToDate} onChange={handleInputChange} />
            <InputField label="Entity PAN Card" name="entityPanCard" value={formData.entityPanCard} onChange={handleInputChange} placeholder="Enter Entity PAN" />
            <InputField label="Incorporation Address Line 1" name="incorporationAddress" value={formData.incorporationAddress} onChange={handleInputChange} placeholder="Enter Incorporation Address" />
            <SelectField label="Product Features" name="productFeatures" value={formData.productFeatures} onChange={handleInputChange} options={[{value:'AEPS', label:'AEPS'}, {value:'DMT', label:'DMT'}, {value:'MATM', label:'MATM'}]} />
          </div>

          <div className="h-px bg-gray-100" />

          {/* SECTION: UPLOADS (2x3 Grid) */}
          <div>
            <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-6">Mandatory Document Uploads (.PDF Only)</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <FileUpload label="Bank Resolution" name="bankResolution" fileName={files.bankResolution?.name} onFileChange={handleFileChange} />
              <FileUpload label="Authorized Signatory KYC" name="authSignatoryKyc" fileName={files.authSignatoryKyc?.name} onFileChange={handleFileChange} />
              <FileUpload label="Certificate of Incorporation" name="certIncorporation" fileName={files.certIncorporation?.name} onFileChange={handleFileChange} />
              <FileUpload label="First Page of Agreement" name="firstPageAgreement" fileName={files.firstPageAgreement?.name} onFileChange={handleFileChange} />
              <FileUpload label="Last Page of Agreement" name="lastPageAgreement" fileName={files.lastPageAgreement?.name} onFileChange={handleFileChange} />
              <FileUpload label="Business Proposal" name="businessProposal" fileName={files.businessProposal?.name} onFileChange={handleFileChange} />
            </div>
          </div>

          {/* SECTION: TERMS */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex gap-4 items-start">
            <input 
              type="checkbox" 
              checked={termsAccepted} 
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 w-5 h-5 accent-[#8B0000] cursor-pointer" 
            />
            <p className="text-[11px] text-gray-500 leading-relaxed">
              By using our services, you confirm that you are at least 18 years old and legally capable of entering into agreements. You are responsible for securing your account details. Services are provided for personal, lawful purposes only. Your data will be handled in accordance with our Privacy Policy.
            </p>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <button type="button" onClick={handleReset} className="flex items-center gap-2 px-6 py-2.5 text-gray-500 font-bold hover:bg-gray-100 rounded-md uppercase text-xs transition-all">
              <RotateCcw size={16} /> Reset
            </button>
            <button type="submit" className="flex items-center gap-2 px-10 py-3 bg-[#8B0000] text-white font-bold rounded-md hover:bg-[#700000] uppercase text-xs shadow-lg transition-all active:scale-95">
              <Save size={16} /> Save & Create CBC User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCBCUser;