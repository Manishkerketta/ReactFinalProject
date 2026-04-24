import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchLocationByPin } from '../../utils/authService'; // Ensure this returns result.data
import { Save, RotateCcw, UploadCloud, CheckCircle2, FileText, Calendar, Loader2, AlertCircle } from 'lucide-react';

// --- SUB-COMPONENTS ---
const InputField = ({ label, name, type = "text", placeholder, required = true, value, onChange, error, disabled = false, maxLength }) => (
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
        disabled={disabled}
        maxLength={maxLength}
        className={`w-full px-4 py-2.5 bg-white border ${error ? 'border-red-500' : 'border-gray-200'} ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''} rounded-md text-sm outline-none focus:border-[#8B0000] transition-colors placeholder:text-gray-300`}
      />
      {type === 'date' && <Calendar size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />}
      {error && <span className="text-[10px] text-red-500 font-medium mt-1">{error}</span>}
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
    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-all relative cursor-pointer group min-h-[80px]">
      <input 
        type="file" 
        className="absolute inset-0 opacity-0 cursor-pointer z-10" 
        accept=".pdf" 
        onChange={(e) => onFileChange(name, e.target.files[0])} 
      />
      {fileName ? (
        <div className="flex flex-col items-center gap-1 text-center">
          <FileText size={20} className="text-green-600" />
          <span className="text-[9px] text-green-700 font-bold truncate max-w-[120px]">{fileName}</span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1">
          <UploadCloud size={20} className="text-gray-400 group-hover:text-[#8B0000]" />
          <span className="text-[9px] text-gray-400 font-medium italic">PDF Only</span>
        </div>
      )}
    </div>
  </div>
);

const CreateCBCUser = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [statusModal, setStatusModal] = useState({ show: false, message: '' });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
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
    bankResolution: null, authSignatoryKyc: null, certIncorporation: null,
    firstPageAgreement: null, lastPageAgreement: null, businessProposal: null
  });

  // --- PINCODE API EFFECT ---
  useEffect(() => {
    // const getAddressDetails = async () => {
    //   // Basic 6-digit validation check before API call
    //   if (formData.pinCode.length === 6) {
    //     setPinLoading(true);
    //     try {
    //       const result = await fetchLocationByPin(formData.pinCode);

    //       if (result.statusCode === 0 && result.data?.data) {
    //         const loc = result.data.data;
    //         setFormData(prev => ({
    //           ...prev,
    //           state: loc.state || '',
    //           district: loc.district || '',
    //           city: loc.city || ''
    //         }));
    //         setErrors(prev => ({ ...prev, pinCode: "" }));
    //       } else {
    //         // Show custom small modal for non-zero statusCodes (e.g., 5)
    //         setStatusModal({
    //           show: true,
    //           message: result.data?.statusDesc || "Pincode data isn't found!"
    //         });
    //         setFormData(prev => ({ ...prev, state: '', district: '', city: '' }));
    //         setErrors(prev => ({ ...prev, pinCode: "Invalid PIN" }));
    //       }
    //     } catch (err) {
    //       setStatusModal({ show: true, message: "Service connection failed. Check your network." });
    //     } finally {
    //       setPinLoading(false);
    //     }
    //   } else if (formData.pinCode.length > 0 && formData.pinCode.length < 6) {
    //       setErrors(prev => ({ ...prev, pinCode: "Pincode must be 6 digits" }));
    //   }
    // };
const getAddressDetails = async () => {
  if (formData.pinCode.length === 6) {
    setPinLoading(true);
    try {
      const result = await fetchLocationByPin(formData.pinCode);

      // Success Path
      if (result.statusCode === 0 && result.data?.data) {
        const loc = result.data.data;
        setFormData(prev => ({
          ...prev,
          state: loc.state || '',
          district: loc.district || '',
          city: loc.city || ''
        }));
        setErrors(prev => ({ ...prev, pinCode: "" }));
      } 
      // Dynamic Error Path
      else {
        setStatusModal({
          show: true,
          // Extracting result.data.statusDesc dynamically
          message: result.data?.statusDesc || "Something went wrong" 
        });
        setFormData(prev => ({ ...prev, state: '', district: '', city: '' }));
      }
    } catch (err) {
      setStatusModal({ show: true, message: "Service connection failed" });
    } finally {
      setPinLoading(false);
    }
  }
};
    getAddressDetails();
  }, [formData.pinCode]);

  // --- VALIDATION LOGIC ---
  const validateField = (name, value) => {
    let error = "";
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;
    const accRegex = /^\d{9,18}$/;

    if (name === 'emailId' || name === 'adminEmail') {
      if (!emailRegex.test(value)) error = "Invalid email format";
    } else if (name === 'pan' || name === 'entityPanCard') {
      if (!panRegex.test(value.toUpperCase())) error = "Invalid PAN format (ABCDE1234F)";
    } else if (name === 'mobileNumber' || name === 'adminMobile') {
      if (!mobileRegex.test(value)) error = "Invalid 10-digit mobile number";
    } else if (name === 'accountNumber') {
      if (!accRegex.test(value)) error = "Account number must be 9-18 digits";
    } else if (name === 'pinCode') {
      if (!/^\d{6}$/.test(value)) error = "Pincode must be 6 digits";
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Pincode restriction: only numbers and max 6 digits
    if (name === 'pinCode') {
      const val = value.replace(/\D/g, '').slice(0, 6);
      setFormData(prev => ({ ...prev, [name]: val }));
      validateField(name, val);
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleFileChange = (name, file) => {
    if (file) setFiles(prev => ({ ...prev, [name]: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasErrors = Object.values(errors).some(err => err !== "");
    if (hasErrors) return alert("Please correct the errors in the form.");
    if (!termsAccepted) return alert("Please accept the terms and conditions");
    
    const missingFiles = Object.keys(files).filter(key => !files[key]);
    if (missingFiles.length > 0) return alert("Please upload all mandatory documents.");

    console.log("Submitting:", { ...formData, files });
    setShowSuccessModal(true);
  };

  const handleReset = () => {
    setFormData(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: key === 'country' ? 'India' : '' }), {}));
    setFiles({ bankResolution: null, authSignatoryKyc: null, certIncorporation: null, firstPageAgreement: null, lastPageAgreement: null, businessProposal: null });
    setTermsAccepted(false);
    setErrors({});
  };

  return (
    <div className="p-6 bg-[#F8F9FA] min-h-screen font-sans">
      
      {/* PINCODE ERROR MODAL (Small Custom Modal) */}
      {statusModal.show && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-[350px] overflow-hidden animate-modalIn relative border-t-4 border-[#8B0000]">
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-red-50 text-[#8B0000] rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Invalid Pincode</h3>
              <p className="text-gray-500 text-sm mb-6 px-2">{statusModal.message}</p>
              <button onClick={() => setStatusModal({ show: false, message: '' })} className="px-8 py-2 bg-[#8B0000] text-white font-bold rounded uppercase text-[11px] tracking-widest hover:bg-[#700000] transition-colors">
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[420px] p-10 text-center animate-modalIn">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-sm">
              <CheckCircle2 size={40} strokeWidth={3} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">User Created!</h2>
            <p className="text-gray-500 text-sm mb-10">CBC User registration completed successfully.</p>
            <button onClick={() => setShowSuccessModal(false)} className="w-full py-3.5 bg-[#8B0000] text-white font-bold rounded-md uppercase text-xs tracking-widest hover:bg-[#700000]">Finish</button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Create CBC User</h2>
            <p className="text-gray-400 text-sm mt-1">Complete the onboarding form below</p>
          </div>
          {pinLoading && <div className="flex items-center gap-2 text-[#8B0000] text-xs font-bold"><Loader2 className="animate-spin" size={16} /> Fetching Location...</div>}
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          {/* BASIC DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Enter First Name" />
            <InputField label="Middle Name" name="middleName" required={false} value={formData.middleName} onChange={handleInputChange} placeholder="Enter Middle Name" />
            <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Enter Last Name" />
            <InputField label="CEO Name" name="ceoName" value={formData.ceoName} onChange={handleInputChange} placeholder="Enter CEO Name" />
            <InputField label="Company Name" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Enter Company Name" />
            <InputField label="Email ID" name="emailId" type="email" value={formData.emailId} onChange={handleInputChange} error={errors.emailId} placeholder="example@mail.com" />
            <InputField label="Personal PAN" name="pan" value={formData.pan} onChange={handleInputChange} error={errors.pan} placeholder="ABCDE1234F" maxLength={10} />
            <InputField label="Mobile Number" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} error={errors.mobileNumber} placeholder="10-digit mobile" maxLength={10} />
            <InputField label="Admin Name" name="adminName" value={formData.adminName} onChange={handleInputChange} placeholder="Enter Admin Name" />
            <InputField label="Admin Email" name="adminEmail" value={formData.adminEmail} onChange={handleInputChange} error={errors.adminEmail} placeholder="admin@mail.com" />
            <InputField label="Admin Mobile" name="adminMobile" value={formData.adminMobile} onChange={handleInputChange} error={errors.adminMobile} placeholder="10-digit mobile" maxLength={10} />
          </div>

          <div className="h-px bg-gray-100" />

          {/* ADDRESS & BANK */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InputField label="Business Address" name="businessAddress" value={formData.businessAddress} onChange={handleInputChange} placeholder="Street, Area..." />
            <InputField label="Country" name="country" value={formData.country} disabled={true} />
            <InputField label="PIN Code" name="pinCode" value={formData.pinCode} onChange={handleInputChange} placeholder="6-digit PIN" maxLength={6} error={errors.pinCode} />
            <InputField label="State" name="state" value={formData.state} onChange={handleInputChange} placeholder="Auto-fetched" disabled />
            <InputField label="District" name="district" value={formData.district} onChange={handleInputChange} placeholder="Auto-fetched" disabled />
            <InputField label="City" name="city" value={formData.city} onChange={handleInputChange} placeholder="Auto-fetched" disabled />
            <InputField label="Account Number" name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} error={errors.accountNumber} placeholder="Bank Account Number" maxLength={18} />
            <InputField label="GST Number" name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} placeholder="GSTIN" maxLength={15} />
            <SelectField label="Institution Type" name="institutionType" value={formData.institutionType} onChange={handleInputChange} options={[{value:'INDIVIDUAL', label:'INDIVIDUAL'}, {value:'PVT_LTD', label:'PVT LTD'}, {value:'PARTNERSHIP', label:'PARTNERSHIP'}]} />
            <InputField label="Telephone Number" name="telephoneNumber" required={false} value={formData.telephoneNumber} onChange={handleInputChange} placeholder="Enter Telephone" />
            <InputField label="Affiliate Fee" name="affiliateFee" value={formData.affiliateFee} onChange={handleInputChange} placeholder="Enter Amount" />
            <InputField label="Number of Staff" name="staffCount" value={formData.staffCount} onChange={handleInputChange} placeholder="Count" />
          </div>

          <div className="h-px bg-gray-100" />

          {/* AGREEMENT & EXTRAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InputField label="Agreement From" name="agreementFromDate" type="date" value={formData.agreementFromDate} onChange={handleInputChange} />
            <InputField label="Agreement To" name="agreementToDate" type="date" value={formData.agreementToDate} onChange={handleInputChange} />
            <InputField label="Entity PAN" name="entityPanCard" value={formData.entityPanCard} onChange={handleInputChange} error={errors.entityPanCard} placeholder="Company PAN" maxLength={10} />
            <InputField label="Incorporation Address" name="incorporationAddress" value={formData.incorporationAddress} onChange={handleInputChange} placeholder="Address on cert" />
            <SelectField label="Product" name="productFeatures" value={formData.productFeatures} onChange={handleInputChange} options={[{value:'AEPS', label:'AEPS'}, {value:'DMT', label:'DMT'}, {value:'MATM', label:'MATM'}]} />
          </div>

          <div className="h-px bg-gray-100" />

          {/* UPLOADS */}
          <div>
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6 underline decoration-[#8B0000] underline-offset-8">Mandatory PDF Documents</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <FileUpload label="Bank Resolution" name="bankResolution" fileName={files.bankResolution?.name} onFileChange={handleFileChange} />
              <FileUpload label="Signatory KYC" name="authSignatoryKyc" fileName={files.authSignatoryKyc?.name} onFileChange={handleFileChange} />
              <FileUpload label="Incorporation Cert" name="certIncorporation" fileName={files.certIncorporation?.name} onFileChange={handleFileChange} />
              <FileUpload label="Agreement P1" name="firstPageAgreement" fileName={files.firstPageAgreement?.name} onFileChange={handleFileChange} />
              <FileUpload label="Agreement Last" name="lastPageAgreement" fileName={files.lastPageAgreement?.name} onFileChange={handleFileChange} />
              <FileUpload label="Proposal" name="businessProposal" fileName={files.businessProposal?.name} onFileChange={handleFileChange} />
            </div>
          </div>

          {/* TERMS */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex gap-4 items-start shadow-inner">
            <input 
              type="checkbox" 
              checked={termsAccepted} 
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 w-5 h-5 accent-[#8B0000] cursor-pointer" 
            />
            <p className="text-[10px] text-gray-500 leading-normal">
              I hereby declare that the information provided is true and correct to the best of my knowledge. I understand that any discrepancy found may lead to immediate rejection of the onboarding request.
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-end gap-4">
            <button type="button" onClick={handleReset} className="flex items-center gap-2 px-6 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded uppercase text-xs transition-all">
              <RotateCcw size={16} /> Reset
            </button>
            <button type="submit" className="flex items-center gap-2 px-10 py-3 bg-[#8B0000] text-white font-bold rounded uppercase text-xs shadow-lg hover:shadow-red-900/20 active:scale-95 transition-all">
              <Save size={16} /> Create CBC User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCBCUser;