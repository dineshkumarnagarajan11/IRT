import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Smartphone, ShieldAlert, Trash2 } from 'lucide-react';

export const SettingsPrivacy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-5 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-800">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-dark">Privacy & Security</h1>
      </div>

      <div className="p-6 space-y-8">
        <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Security</h3>
            
            <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                    <Lock size={20} className="text-slate-600" />
                    <span className="font-bold text-slate-800 text-sm">Change Password</span>
                </div>
                <span className="text-xs text-slate-400">Last changed 3mo ago</span>
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                    <Smartphone size={20} className="text-slate-600" />
                    <span className="font-bold text-slate-800 text-sm">Two-Factor Authentication</span>
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">Enabled</span>
            </button>
        </div>

        <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Data Privacy</h3>
            
            <div className="p-4 bg-slate-50 rounded-xl flex items-start gap-3">
                <ShieldAlert size={20} className="text-slate-600 shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-bold text-slate-800 text-sm">Data Sharing</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        We only share data with essential partners (e.g. visa processing info if applicable). 
                        We do not sell your personal data to third parties.
                    </p>
                </div>
            </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
             <button className="w-full flex items-center justify-start gap-3 p-4 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                <Trash2 size={20} />
                <div className="text-left">
                    <p className="font-bold text-sm">Delete Account</p>
                    <p className="text-xs opacity-70">Permanently remove all your data</p>
                </div>
             </button>
        </div>
      </div>
    </div>
  );
};