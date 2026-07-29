import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, LogIn, Key, PhoneCall, AlertCircle, ArrowLeft } from 'lucide-react';

interface StaffLoginProps {
  onBack: () => void;
  onLoginSuccess: (token: string, doctorInfo: any) => void;
}

export default function StaffLogin({ onBack, onLoginSuccess }: StaffLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/doctor/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials. Please try again.');
      }
      onLoginSuccess(data.token, data.doctor);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans flex flex-col justify-between py-12 px-6 relative">
      {/* Back Button */}
      <div className="max-w-md w-full mx-auto mb-2">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-semibold transition cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>
      </div>

      {/* Top logo */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-md mb-4">
          <span className="leading-none">+</span>
        </div>
        <h1 className="font-display font-bold text-2xl text-slate-900 tracking-tight">Specialist Portal</h1>
        <p className="text-slate-500 text-xs">Clinical Doctor & Staff Console</p>
      </div>

      {/* Main card */}
      <div className="max-w-md w-full mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl p-8 my-4">
        {/* Secure Environment Banner */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3.5 flex items-center gap-3 text-blue-800 text-xs font-semibold mb-6">
          <Key className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Secure Environment</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                placeholder="doctor@medcore.in"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => alert('Password recovery link sent to registered administrator email.')}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 rounded-md absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* MFA Prompt */}
          <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex gap-2.5 text-slate-600 text-[11px] leading-relaxed">
            <Lock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Multi-Factor Authentication (MFA) is required. You will be prompted for your security code on the next screen.
            </span>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-md hover:shadow-lg disabled:bg-blue-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Secure Login</span>
              </>
            )}
          </button>
        </form>

        <hr className="my-6 border-slate-100" />

        {/* HIPAA Compliance Header */}
        <div className="flex flex-col items-center text-center gap-1.5">
          <div className="flex items-center gap-1 text-teal-600 text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>HIPAA Compliant</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed max-w-xs">
            Hosted on secure AWS/Azure infrastructure. Unauthorized access is strictly prohibited and logged.
          </p>
        </div>
      </div>

      {/* HIPAA Footer */}
      <footer className="w-full text-center space-y-3 mt-4">
        <h2 className="font-display font-bold text-sm text-slate-700 tracking-wide">MedCore Clinic</h2>
        
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
          <button type="button" className="hover:text-slate-600">Privacy Policy</button>
          <span>•</span>
          <button type="button" className="hover:text-slate-600">Terms of Service</button>
          <span>•</span>
          <button type="button" className="hover:text-slate-600">Security Standards</button>
          <span>•</span>
          <button type="button" className="hover:text-slate-600">Contact Support</button>
        </div>

        <p className="text-[10px] text-slate-400">
          © 2026 MedCore Health Systems. HIPAA Compliant Secure Environment. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
