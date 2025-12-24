
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
        setLoading(false);
        alert("Admin dashboard not implemented in MVP scope.");
    }, 1500);
  };

  return (
    <div className="min-h-full flex flex-col justify-center p-8 bg-white h-full">
      <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-20 h-20 bg-black rounded-3xl mx-auto flex items-center justify-center text-brand shadow-xl mb-6 transform -rotate-6">
            <ShieldCheck size={40} />
        </div>
        <h1 className="text-3xl font-extrabold text-dark mb-2">Admin Login</h1>
        <p className="text-slate-500 text-sm">Secure access for INNROUTES staff</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
        <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 uppercase ml-1">Email</label>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors">
                    <Mail size={20} />
                </div>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-brand focus:bg-white transition-all placeholder:text-slate-300"
                    placeholder="admin@innroutes.com"
                />
            </div>
        </div>

        <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 uppercase ml-1">Password</label>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors">
                    <Lock size={20} />
                </div>
                <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-12 py-4 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-brand focus:bg-white transition-all placeholder:text-slate-300"
                    placeholder="••••••••"
                />
                <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-dark p-1"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
        </div>

        <div className="pt-4">
            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-black text-brand font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
            >
                {loading ? 'Verifying...' : 'Login'}
                {!loading && <ArrowRight size={20} />}
            </button>
        </div>
      </form>

      <div className="mt-8 text-center animate-in fade-in duration-1000 delay-300">
        <button className="text-sm font-semibold text-slate-400 hover:text-dark transition-colors">
            Forgot Password?
        </button>
      </div>

      <div className="mt-auto pt-10 text-center">
        <button onClick={() => navigate('/')} className="text-xs font-bold text-slate-300 hover:text-slate-400 uppercase tracking-wider">
            Back to App
        </button>
      </div>
    </div>
  );
};
