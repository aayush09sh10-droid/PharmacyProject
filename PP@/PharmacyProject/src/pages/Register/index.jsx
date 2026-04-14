import React, { useState } from 'react';
import { Mail, Lock, Phone, User, Store, ArrowRight, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        pharmacyName: '',
        ownerName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const steps = [
        { id: 1, label: 'Account' },
        { id: 2, label: 'Pharmacy' }
    ];

    return (
        <div className="min-h-screen bg-[#F0FDF4] flex flex-col items-center py-12 px-4">
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-12">
                <div className="w-10 h-10 bg-[#10B981] rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100">
                    <div className="w-5 h-5 border-[3px] border-white rounded-full"></div>
                </div>
                <div>
                    <h1 className="text-xl font-black text-gray-900 leading-tight">PharmaCare</h1>
                </div>
            </div>

            {/* Registration Card */}
            <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl shadow-emerald-100/30 overflow-hidden border border-emerald-50">
                <div className="p-8 md:p-12">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Vendor Registration</h2>
                        <p className="text-gray-500 font-medium">Register your pharmacy on PharmaCare</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative mb-12 px-4 md:px-20">
                        <div className="absolute top-5 left-20 right-20 h-0.5 bg-gray-100 -z-0"></div>
                        <div className="flex justify-between relative z-10">
                            {steps.map((s) => (
                                <div key={s.id} className="flex flex-col items-center group">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-all duration-300 ${
                                        step >= s.id ? 'bg-[#10B981] text-white' : 'bg-gray-100 text-gray-400'
                                    }`}>
                                        {step > s.id ? <Check size={20} /> : <span className="font-bold">{s.id}</span>}
                                    </div>
                                    <span className={`mt-3 text-[10px] font-black uppercase tracking-widest ${
                                        step >= s.id ? 'text-emerald-600' : 'text-gray-400'
                                    }`}>
                                        {s.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step 1: Account Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Pharmacy Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none transition-all font-medium text-gray-900"
                                    placeholder="HealthPlus Pharmacy"
                                />
                                <Store className="absolute left-4 top-4 text-gray-400" size={20} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Owner Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none transition-all font-medium text-gray-900"
                                    placeholder="John Doe"
                                />
                                <User className="absolute left-4 top-4 text-gray-400" size={20} />
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none transition-all font-medium text-gray-900"
                                    placeholder="pharmacy@example.com"
                                />
                                <Mail className="absolute left-4 top-4 text-gray-400" size={20} />
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none transition-all font-medium text-gray-900"
                                    placeholder="+1 (555) 123-4567"
                                />
                                <Phone className="absolute left-4 top-4 text-gray-400" size={20} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none transition-all font-medium text-gray-900"
                                    placeholder="••••••••"
                                />
                                <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none transition-all font-medium text-gray-900"
                                    placeholder="••••••••"
                                />
                                <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
                            </div>
                        </div>
                    </div>

                    <div className="mt-12">
                        <button className="w-full py-5 bg-[#10B981] text-white rounded-3xl font-black text-xl shadow-2xl shadow-emerald-200 hover:bg-[#059669] transform transition-all active:scale-[0.98] flex items-center justify-center space-x-3">
                            <span>Next Step</span>
                            <ArrowRight size={22} />
                        </button>
                    </div>

                    <div className="mt-10 text-center">
                        <p className="text-gray-500 font-medium">
                            Already have an account? <Link to="/login" className="text-emerald-600 font-bold hover:underline">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
