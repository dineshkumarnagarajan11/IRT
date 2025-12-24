
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Smartphone, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { authService } from '../services/appwrite';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState<'email' | 'phone'>('phone'); 
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
  }, [inputValue, method]);

  const validateInput = () => {
    if (method === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inputValue)) {
        setError('Please enter a valid email address.');
        return false;
      }
    } else {
      // Allow digits, spaces, dashes, parentheses, plus
      const cleaned = inputValue.replace(/\D/g, '');
      if (cleaned.length < 10) {
        setError('Please enter a valid mobile number (min 10 digits).');
        return false;
      }
    }
    return true;
  };

  const formatContact = (input: string, type: 'email' | 'phone') => {
      if (type === 'email') return input.trim();
      
      // Phone: Ensure E.164 format
      let phone = input.replace(/[\s\-\(\)]/g, '');
      // If no country code provided, assume India (+91) for MVP
      if (!phone.startsWith('+')) {
          return `+91${phone}`;
      }
      return phone;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInput()) return;

    setLoading(true);
    setError('');

    try {
        // Format contact for service (E.164 for SMS)
        const contact = formatContact(inputValue, method);

        await authService.initiateLogin(contact, method);

        // Navigate to OTP page
        navigate('/otp', { 
            state: { 
                contact: contact, 
                mode: method 
            } 
        });

    } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  const handleGuest = () => {
    localStorage.setItem('innroutes_auth_token', 'guest_token');
    localStorage.setItem('innroutes_onboarding_done', 'true');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col pb-10">
      <div className="flex-1 flex flex-col justify-center">
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-brand font-black text-xl mb-6 shadow-lg shadow-slate-200">
                IR
             </div>
             <h1 className="text-3xl font-extrabold text-dark mb-2">Welcome Back</h1>
             <p className="text-slate-500">Plan your next trip with confidence.</p>
        </div>

        <div className="bg-slate-50 p-1 rounded-xl flex mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
             <button 
                onClick={() => { setMethod('phone'); setInputValue(''); }}
                className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${method === 'phone' ? 'bg-white shadow text-black' : 'text-slate-400'}`}
             >
                <Smartphone size={16} /> Phone
             </button>
             <button 
                onClick={() => { setMethod('email'); setInputValue(''); }}
                className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${method === 'email' ? 'bg-white shadow text-black' : 'text-slate-400'}`}
             >
                <Mail size={16} /> Email
             </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                    {method === 'email' ? 'Email Address' : 'Phone Number'}
                </label>
                <div className="relative">
                    <input 
                        type={method === 'email' ? 'email' : 'tel'}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className={`w-full bg-slate-50 border rounded-2xl px-5 py-4 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-brand focus:bg-white transition-all placeholder:text-slate-300 text-lg ${error ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                        placeholder={method === 'email' ? 'hello@example.com' : '9876543210'}
                        autoFocus
                    />
                </div>
                {method === 'phone' && (
                    <p className="text-[10px] text-slate-400 ml-1 mt-1">
                        If country code is omitted, <span className="font-bold">+91 (India)</span> will be used.
                    </p>
                )}
                {error && (
                    <div className="flex items-center gap-1 text-red-500 text-xs font-medium ml-1 animate-in slide-in-from-left-2">
                        <AlertCircle size={12} />
                        {error}
                    </div>
                )}
             </div>

             <button 
                type="submit"
                disabled={!inputValue || loading}
                className="w-full bg-black text-brand font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
             >
                {loading ? <Loader2 size={20} className="animate-spin" /> : (
                    <>
                        Get OTP
                        <ArrowRight size={20} />
                    </>
                )}
             </button>
        </form>

        <div className="mt-8 text-center animate-in fade-in duration-1000 delay-300">
             <p className="text-xs text-slate-400 mb-4">Or continue without an account</p>
             <button 
                onClick={handleGuest}
                className="text-sm font-bold text-slate-600 hover:text-black border-b border-transparent hover:border-black transition-colors pb-0.5"
             >
                Continue as Guest
             </button>
        </div>
      </div>

      <p className="text-center text-[10px] text-slate-300 leading-tight">
        By continuing, you agree to INNROUTES <br/>Terms of Service & Privacy Policy.
      </p>
    </div>
  );
};
