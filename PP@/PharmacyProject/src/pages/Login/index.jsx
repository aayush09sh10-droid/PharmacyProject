import React, { useState } from 'react';
import { Mail, Lock, Info, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/vendors/login', { email, password });
            const { accessToken, vendor } = response.data.data;
            
            // Store token and vendor info
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('vendor', JSON.stringify(vendor));
            
            navigate('/'); // Redirect to dashboard
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0FDF4] flex flex-col items-center justify-center p-4">
            {/* Header / Logo */}
            <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-[#10B981] rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                    <div className="w-6 h-6 border-4 border-white rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                </div>
                <div>
                    <h1 className="text-2xl font-black text-gray-900 leading-tight">PharmaCare</h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Health Partner</p>
                </div>
            </div>

            {/* Login Card */}
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl shadow-emerald-100/50 p-8 border border-emerald-50">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Vendor Login</h2>
                    <p className="text-gray-500 font-medium">Manage your pharmacy</p>
                </div>

                {/* Demo Credentials Alert */}
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6">
                    <div className="flex items-start space-x-3">
                        <div className="mt-0.5">
                            <Info size={18} className="text-amber-500" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-amber-800">Demo Credentials:</h4>
                            <div className="mt-1 text-xs text-amber-700 space-y-0.5">
                                <p><span className="font-semibold text-amber-900">Email:</span> vendor@demo.com</p>
                                <p><span className="font-semibold text-amber-900">Password:</span> vendor123</p>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative">
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none transition-all font-medium text-gray-900"
                                placeholder="you@example.com"
                            />
                            <Mail className="absolute left-4 top-4 text-gray-400" size={20} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative">
                            <input
                                required
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none transition-all font-medium text-gray-900"
                                placeholder="••••••••"
                            />
                            <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-4 text-gray-400 hover:text-emerald-500 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-[#10B981] text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-200 hover:bg-[#059669] transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        {loading && <Loader2 className="animate-spin" size={20} />}
                        <span>Sign In</span>
                    </button>
                </form>

                <div className="mt-8 text-center text-sm">
                    <p className="text-gray-500 font-medium">
                        Want to list your pharmacy? <Link to="/register" className="text-emerald-600 font-bold hover:underline">Register as Vendor</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
