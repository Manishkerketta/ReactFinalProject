

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import nsdl_logo from '../assets/nsdl_logo.png'
import nsdlWatermark from '../assets/nsdl_watermark.png'

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: 'ops_maker',
        password: ''
    });

    return (
        // Changed to flex-col for mobile, flex-row for large screens
        <div className="flex flex-col lg:flex-row min-h-screen w-full bg-white font-sans">

            {/* LEFT/TOP SECTION: Branding & Illustration */}
            <div className="flex flex-col w-full lg:w-1/2 items-center justify-center p-8 lg:p-12 bg-gray-50 lg:bg-white">
                <div className="max-w-[550px] w-full flex flex-col items-center">
                    {/* Brand Logo - Made bigger and centered for mobile */}
                    <div className="flex items-center lg:self-start mb-6 lg:mb-8">
                        <img
                            src={nsdl_logo}
                            alt="NSDL Logo"
                            className="h-16 lg:h-20 object-contain" // Increased size
                        />
                    </div>

                    {/* Visual Placeholder Box - Hidden on very small mobile if needed, or kept for branding */}
                    <div className="w-full aspect-video lg:aspect-[4/3] bg-[#F1F3F4] rounded-sm flex items-center justify-center relative border border-gray-100 overflow-hidden shadow-sm">
                        {/* WATERMARK LOGO */}
                        <img
                            src={nsdlWatermark}
                            alt="watermark"
                            className="absolute w-full h-full object-contain pointer-events-none select-none z-0 scale-110"
                        />

                        {/* Existing circular graphic */}
                        <div className="relative z-10 w-24 h-24 lg:w-32 lg:h-32 rounded-full border-[10px] lg:border-[12px] border-gray-200 opacity-40 flex items-center justify-center">
                            <div className="w-12 h-12 lg:w-16 lg:h-16 border-[6px] lg:border-[8px] border-gray-200 rounded-full rotate-45"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT/BOTTOM SECTION: Login Form */}
            <div className="flex flex-col w-full lg:w-1/2 items-center justify-center p-6 md:p-12">
                {/* Increased max-width from 440px to 520px for a wider look */}
                <div className="max-w-[520px] w-full bg-white p-2 lg:p-0">
                    <h1 className="text-[32px] lg:text-[40px] font-bold text-[#1A1A1A] mb-1">Welcome Back!</h1>
                    <p className="text-[#666666] text-[15px] mb-10">Please enter your details</p>

                    <form className="space-y-8"> {/* Increased spacing between rows */}

                        {/* Username Field */}
                        <div className="relative">
                            <label className="absolute -top-2.5 left-3 px-1 bg-white text-[12px] font-medium text-gray-600 z-10">
                                Username*
                            </label>
                            <input
                                type="text"
                                defaultValue="ops_maker"
                                className="w-full px-4 py-4 bg-[#E8F0FE] border border-gray-300 rounded-[4px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-red-800 transition-all text-lg"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="relative">
                            <label className="absolute -top-2.5 left-3 px-1 bg-white text-[12px] font-medium text-gray-600 z-10">
                                Password*
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••••••••"
                                className="w-full px-4 py-4 bg-[#E8F0FE] border border-gray-300 rounded-[4px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-red-800 transition-all text-lg"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                            </button>
                        </div>

                        {/* Bottom Links */}
                        <div className="flex items-center justify-between text-[14px]">
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded border-gray-300 text-red-800 focus:ring-red-800 cursor-pointer"
                                />
                                <span className="ml-2 text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="font-medium text-gray-600 hover:text-red-800 transition-colors">
                                Forgot Password?
                            </a>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="w-full py-4 bg-[#800000] hover:bg-[#600000] text-white font-bold rounded-[4px] shadow-md transition-all text-[18px] mt-4 uppercase tracking-wide"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default LoginPage;

