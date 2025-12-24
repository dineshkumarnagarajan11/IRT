
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle, Timer } from 'lucide-react';
import { authService } from '../services/appwrite';

export const OTPVerification: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']); 
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds countdown
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Retrieve passed state from Login page
  const { contact, mode } = location.state || {};

  useEffect(() => {
    // Redirect if no contact info
    if (!contact) {
        navigate('/login');
        return;
    }
    // Focus first input
    if (inputs.current[0]) inputs.current[0].focus();

    // Start countdown
    const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [contact, navigate]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto advance
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().slice(0, 6).split('');
    
    if (pastedData.length > 0 && pastedData.every(char => !isNaN(Number(char)))) {
        const newOtp = [...otp];
        pastedData.forEach((val, idx) => {
            if (idx < 6) newOtp[idx] = val;
        });
        setOtp(newOtp);
        setError('');
        
        // Focus the next empty input or the last one
        const focusIndex = Math.min(pastedData.length, 5);
        inputs.current[focusIndex]?.focus();
        
        // Optional: Auto-submit if full length
        if (pastedData.length === 6) {
           // We could trigger verify here, but let's let the user review
           inputs.current[5]?.focus();
        }
    }
  };

  const handleResend = async () => {
      if (timeLeft > 0 || resending) return;
      
      setResending(true);
      setError('');
      try {
          await authService.initiateLogin(contact, mode);
          // Reset timer
          setTimeLeft(30);
          // Clear inputs
          setOtp(['', '', '', '', '', '']);
          if (inputs.current[0]) inputs.current[0].focus();
      } catch (e) {
          setError('Failed to resend code.');
      } finally {
          setResending(false);
      }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) return;

    setVerifying(true);
    setError('');

    try {
        await authService.verifyLogin(contact, code, mode);
        
        // Set persistence flag
        localStorage.setItem('innroutes_auth_token', 'secure_session');
        localStorage.setItem('innroutes_onboarding_done', 'true');

        // Check if user profile is complete
        const user = await authService.getCurrentUser();
        
        if (user && user.name) {
            navigate('/');
        } else {
            navigate('/signup');
        }

    } catch (err: any) {
        console.error(err);
        setError(err.message || 'Verification failed.');
        setOtp(['', '', '', '', '', '']); // Clear inputs on error
        if (inputs.current[0]) inputs.current[0].focus();
    } finally {
        setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 pt-10">
       <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-black mb-8">
          <ArrowLeft size={24} />
       </button>

       <h1 className="text-3xl font-extrabold text-dark mb-2">Verify it's you</h1>
       <p className="text-slate-500 mb-8">
         Enter the 6-digit code sent to <br/>
         <span className="font-bold text-dark">{contact}</span>
       </p>

       <div className="flex gap-2 justify-center mb-6">
          {otp.map((digit, idx) => (
             <input
                key={idx}
                ref={(el) => { inputs.current[idx] = el; }}
                type="text"
                maxLength={1}
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={idx === 0 ? handlePaste : undefined} 
                className={`w-12 h-14 rounded-xl border-2 text-center text-xl font-bold outline-none transition-all ${digit ? 'border-brand bg-brand/5' : 'border-slate-100 bg-slate-50 focus:border-slate-300'} ${error ? 'border-red-200 bg-red-50' : ''}`}
             />
          ))}
       </div>

       {error && (
            <div className="flex justify-center items-center gap-2 text-red-500 text-sm font-medium mb-8 animate-in fade-in">
                <AlertCircle size={16} />
                {error}
            </div>
       )}

       <button 
          onClick={handleVerify}
          disabled={otp.join('').length < 6 || verifying}
          className="w-full bg-black text-brand font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
       >
          {verifying ? <Loader2 size={20} className="animate-spin" /> : 'Verify & Continue'}
       </button>

       <div className="text-center mt-6">
         {timeLeft > 0 ? (
             <p className="text-sm text-slate-400 flex items-center justify-center gap-1">
                <Timer size={14} /> Resend code in <span className="font-bold text-slate-600">{timeLeft}s</span>
             </p>
         ) : (
             <p className="text-sm text-slate-400">
                Didn't receive code?{' '}
                <button 
                    onClick={handleResend} 
                    disabled={resending}
                    className="font-bold text-dark hover:underline disabled:opacity-50"
                >
                    {resending ? 'Sending...' : 'Resend'}
                </button>
             </p>
         )}
       </div>
    </div>
  );
};
