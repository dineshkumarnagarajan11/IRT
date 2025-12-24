
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Check, Loader2 } from 'lucide-react';
import { authService } from '../services/appwrite';
import { UserProfile } from '../types';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    homeCountry: 'India'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName) return;

    setLoading(true);

    try {
        // 1. Update Appwrite Account Name
        await authService.updateProfile(formData.fullName);

        // 2. Cache detailed profile locally for the app to use
        // In a full implementation, this would be stored in Appwrite Database
        const profile: UserProfile = {
            fullName: formData.fullName,
            homeCountry: formData.homeCountry,
            passportCountry: formData.homeCountry,
            email: '', // Appwrite holds the actual contact
            phone: '', 
            currency: formData.homeCountry === 'India' ? 'INR' : 'USD'
        };
        
        localStorage.setItem('innroutes_profile', JSON.stringify(profile));
        
        // Navigate Home
        navigate('/');

    } catch (error) {
        console.error("Signup Error:", error);
        // Fallback or show alert
        alert("Could not update profile. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 pt-10">
      <h1 className="text-3xl font-extrabold text-dark mb-2">Create Profile</h1>
      <p className="text-slate-500 mb-8">This helps us personalize your trip plans.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors">
                    <User size={20} />
                </div>
                <input 
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-brand focus:bg-white transition-all placeholder:text-slate-300"
                    placeholder="John Doe"
                />
            </div>
        </div>

        <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Home Country</label>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors">
                    <MapPin size={20} />
                </div>
                <select
                    value={formData.homeCountry}
                    onChange={(e) => setFormData({...formData, homeCountry: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-brand focus:bg-white transition-all appearance-none"
                >
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Australia">Australia</option>
                    <option value="Canada">Canada</option>
                    <option value="Germany">Germany</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs font-bold">
                    CHANGE
                </div>
            </div>
        </div>

        <div className="pt-4">
            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-black text-brand font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 size={20} className="animate-spin" /> : (
                    <>
                        Start Exploring
                        <Check size={20} />
                    </>
                )}
            </button>
        </div>
      </form>
    </div>
  );
};
