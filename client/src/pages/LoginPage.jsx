import React, { useState } from 'react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import { Building2, User, Mail, Phone, Lock, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const { login, register, switchAccount } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('user'); // 'user' or 'owner'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) throw new Error('Please enter your name');
        if (!email.trim()) throw new Error('Please enter your email');
        await register({ name, email, role, phone });
      } else {
        if (!email.trim()) throw new Error('Please enter your email');
        await login(email, role);
      }
      setLoading(false);
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const handleDemoSelect = (acc) => {
    switchAccount(acc);
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      
      {/* Brand logo */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-md shadow-brand-500/20">
          <Building2 className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          {isRegister ? 'Create your LendMate account' : 'Welcome to LendMate'}
        </h2>
        <p className="text-xs text-slate-500">
          Find a space. Book it by the hour.
        </p>
      </div>

      {/* 1-Click Fast Demo Logins */}
      <div className="bg-brand-50/70 border border-brand-200/80 rounded-3xl p-5 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-brand-900 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Hackathon 1-Click Instant Login</span>
        </div>
        <p className="text-[11px] text-slate-600">
          Skip credentials and test the app immediately as either persona:
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleDemoSelect(DEMO_ACCOUNTS[0])}
            className="p-3 bg-white hover:bg-slate-50 border border-brand-200 rounded-2xl text-left shadow-xs transition-all group"
          >
            <div className="font-bold text-xs text-slate-900 group-hover:text-brand-600">
              Priya Sharma
            </div>
            <div className="text-[10px] text-brand-600 font-semibold mt-0.5">
              🎓 Student / Renter
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleDemoSelect(DEMO_ACCOUNTS[1])}
            className="p-3 bg-white hover:bg-slate-50 border border-indigo-200 rounded-2xl text-left shadow-xs transition-all group"
          >
            <div className="font-bold text-xs text-slate-900 group-hover:text-indigo-600">
              Rajesh Kumar
            </div>
            <div className="text-[10px] text-indigo-600 font-semibold mt-0.5">
              👑 Space Owner
            </div>
          </button>
        </div>
      </div>

      {/* Custom Auth Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
        
        {/* Toggle Login vs Register */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(''); }}
            className={`py-2 rounded-lg transition-all ${
              !isRegister ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(''); }}
            className={`py-2 rounded-lg transition-all ${
              isRegister ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Role selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Account Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                  role === 'user'
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                🎓 Student / Renter
              </button>
              <button
                type="button"
                onClick={() => setRole('owner')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                  role === 'owner'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                👑 Space Owner
              </button>
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
}
