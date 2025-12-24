import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Plus, Trash2 } from 'lucide-react';

export const SettingsPayment: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-5 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-800">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-dark">Payment Methods</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Card List */}
        <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saved Cards</h3>
            
            {/* Visa Mock */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                <div className="relative z-10 flex justify-between items-start mb-8">
                    <CreditCard size={24} className="text-brand" />
                    <button className="text-white/50 hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
                </div>
                <div className="relative z-10">
                    <p className="font-mono text-lg tracking-widest mb-1">•••• •••• •••• 4242</p>
                    <div className="flex justify-between items-end">
                        <p className="text-xs text-slate-400">Exp. 12/25</p>
                        <span className="font-bold text-sm">VISA</span>
                    </div>
                </div>
            </div>

            {/* Mastercard Mock */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-6 bg-slate-200 rounded-md"></div>
                    <div>
                        <p className="font-bold text-slate-700 text-sm">Mastercard ending in 8899</p>
                        <p className="text-xs text-slate-400">Expires 09/26</p>
                    </div>
                </div>
                <button className="text-slate-300 hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
            </div>
        </div>

        <button className="w-full border-2 border-dashed border-slate-200 text-slate-500 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300 transition-all">
            <Plus size={20} />
            Add New Method
        </button>
      </div>
    </div>
  );
};