
import React, { useEffect, useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

export const SimulatedSMS: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleOTP = (e: CustomEvent) => {
      setMessage(e.detail.code);
      setVisible(true);
      
      // Auto hide after 8 seconds
      const timer = setTimeout(() => {
        setVisible(false);
      }, 8000);
      
      return () => clearTimeout(timer);
    };

    window.addEventListener('innroutes-otp' as any, handleOTP as any);
    return () => window.removeEventListener('innroutes-otp' as any, handleOTP as any);
  }, []);

  if (!visible || !message) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-[100] animate-in slide-in-from-top-4 fade-in duration-500">
      <div 
        className="bg-white/95 backdrop-blur-md text-black p-3 rounded-2xl shadow-2xl border border-slate-200 flex gap-3 items-start cursor-pointer hover:scale-[1.02] transition-transform" 
        onClick={() => {
            navigator.clipboard.writeText(message);
            // Optional: Provide visual feedback? For now just stay open or close
        }}
      >
        <div className="bg-green-500 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white shadow-sm">
           <MessageSquare size={20} fill="currentColor" />
        </div>
        <div className="flex-1 min-w-0">
           <div className="flex justify-between items-baseline mb-0.5">
              <h4 className="text-xs font-bold text-slate-900">Messages</h4>
              <span className="text-[10px] text-slate-500">now</span>
           </div>
           <p className="text-sm font-medium text-slate-800 leading-tight">
             INNROUTES: Your verification code is <span className="font-bold text-black">{message}</span>
           </p>
           <p className="text-[10px] text-slate-400 mt-1">Tap to copy code</p>
        </div>
        <button 
            onClick={(e) => { e.stopPropagation(); setVisible(false); }}
            className="text-slate-300 hover:text-slate-500"
        >
            <X size={14} />
        </button>
      </div>
    </div>
  );
};
