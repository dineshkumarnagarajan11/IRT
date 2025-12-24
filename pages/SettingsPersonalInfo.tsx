
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Mail, Phone, MapPin, Globe, Coins, FileText } from 'lucide-react';
import { UserProfile } from '../types';

export const SettingsPersonalInfo: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserProfile>({
    fullName: '',
    email: '',
    phone: '',
    homeCountry: 'India',
    passportCountry: 'India',
    currency: 'INR'
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem('innroutes_profile');
    if (savedProfile) {
      setFormData(JSON.parse(savedProfile));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem('innroutes_profile', JSON.stringify(formData));
    // Also update a global event or context if we had one, for now localStorage is sufficient
    // as Dashboard reads from it on mount/focus
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-5 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-800">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-dark">Personal Information</h1>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex justify-center mb-6">
             <div className="relative">
                <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden">
                    <img src="https://i.pravatar.cc/300" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <button className="absolute bottom-0 right-0 bg-brand text-black p-2 rounded-full shadow-md border-2 border-white">
                    <User size={14} />
                </button>
             </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Basic Info</h3>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 ml-1">Full Name</label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><User size={18} /></div>
                <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-brand outline-none transition-all"
                />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 ml-1">Email Address</label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={18} /></div>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-brand outline-none transition-all"
                />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 ml-1">Phone Number</label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Phone size={18} /></div>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 8900"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-brand outline-none transition-all"
                />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
             <Globe size={14} /> Global Travel Profile
           </h3>
           <p className="text-xs text-slate-500 -mt-2 mb-2">
             Used to calculate visa requirements, currency conversions, and time differences automatically.
           </p>

           <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 ml-1">Home Country</label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><MapPin size={18} /></div>
                <input
                    type="text"
                    name="homeCountry"
                    value={formData.homeCountry}
                    onChange={handleChange}
                    placeholder="e.g. India"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-brand outline-none transition-all"
                />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 ml-1">Passport Country</label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><FileText size={18} /></div>
                <input
                    type="text"
                    name="passportCountry"
                    value={formData.passportCountry}
                    onChange={handleChange}
                    placeholder="e.g. India"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-brand outline-none transition-all"
                />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 ml-1">Preferred Currency</label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Coins size={18} /></div>
                <input
                    type="text"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    placeholder="e.g. INR"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-brand outline-none transition-all"
                />
            </div>
          </div>
        </div>

        <button 
            onClick={handleSave}
            className="w-full bg-black text-brand font-bold py-4 rounded-xl shadow-lg mt-8 flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
        >
            <Save size={20} />
            Save Profile
        </button>
      </div>
    </div>
  );
};
