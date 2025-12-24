import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, CreditCard, Bell, Shield, HelpCircle, LogOut, ChevronRight, Crown, Mail } from 'lucide-react';
import { UserPlan } from '../types';

interface AccountProps {
  userPlan: UserPlan;
}

export const Account: React.FC<AccountProps> = ({ userPlan }) => {
  const navigate = useNavigate();

  const settingsGroups = [
    {
      title: "Settings",
      items: [
        { icon: <User size={18} />, label: "Personal Information", path: "/account/personal-info" },
        { icon: <CreditCard size={18} />, label: "Payment Methods", path: "/account/payment" },
        { icon: <Bell size={18} />, label: "Notifications", path: "/account/notifications" },
      ]
    },
    {
      title: "Support",
      items: [
        { icon: <Shield size={18} />, label: "Privacy & Security", path: "/account/privacy" },
        { icon: <HelpCircle size={18} />, label: "Help & Support", path: "/account/support" },
      ]
    }
  ];

  return (
    <div className="p-6 pt-10 min-h-screen bg-white pb-24">
      <h1 className="text-3xl font-extrabold text-dark mb-6">Account</h1>

      {/* Profile Card */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 overflow-hidden">
            <img src="https://i.pravatar.cc/300" alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div>
            <h2 className="text-xl font-bold text-dark">Traveler One</h2>
            <div className="flex items-center gap-1 text-slate-500 text-sm">
                <Mail size={12} />
                <span>traveler@innroutes.com</span>
            </div>
        </div>
      </div>

      {/* Plan Card */}
      <div className={`rounded-2xl p-5 mb-8 relative overflow-hidden ${userPlan === 'Premium' ? 'bg-black text-brand' : 'bg-slate-50 border border-slate-100'}`}>
        {userPlan === 'Premium' && (
             <div className="absolute top-0 right-0 w-24 h-24 bg-brand/20 rounded-bl-full -mr-6 -mt-6 pointer-events-none"></div>
        )}
        
        <div className="relative z-10 flex justify-between items-center mb-2">
            <div>
                <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${userPlan === 'Premium' ? 'text-brand/80' : 'text-slate-400'}`}>Current Plan</p>
                <h3 className={`text-2xl font-extrabold ${userPlan === 'Premium' ? 'text-brand' : 'text-dark'}`}>{userPlan}</h3>
            </div>
            {userPlan === 'Premium' ? (
                <div className="bg-brand text-black p-2 rounded-full">
                    <Crown size={24} className="fill-black" />
                </div>
            ) : (
                <button className="bg-brand text-black text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm hover:bg-[#eebb33] transition-colors">
                    Upgrade
                </button>
            )}
        </div>
        <p className={`text-sm ${userPlan === 'Premium' ? 'text-slate-400' : 'text-slate-500'}`}>
            {userPlan === 'Free' ? 'Unlock visa insights & more.' : userPlan === 'Plus' ? 'Visa intelligence active.' : 'All premium features unlocked.'}
        </p>
      </div>

      {/* Settings List */}
      <div className="space-y-6">
        {settingsGroups.map((group, idx) => (
            <div key={idx}>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-2">{group.title}</h3>
                <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                    {group.items.map((item, itemIdx) => (
                        <button 
                            key={itemIdx}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center justify-between p-4 hover:bg-slate-100 transition-colors text-left ${itemIdx !== group.items.length - 1 ? 'border-b border-slate-100' : ''}`}
                        >
                            <div className="flex items-center gap-3 text-slate-700">
                                {item.icon}
                                <span className="font-medium">{item.label}</span>
                            </div>
                            <ChevronRight size={18} className="text-slate-400" />
                        </button>
                    ))}
                </div>
            </div>
        ))}
      </div>

      <button className="w-full mt-8 flex items-center justify-center gap-2 text-red-500 font-bold p-4 rounded-xl hover:bg-red-50 transition-colors">
        <LogOut size={18} />
        Log Out
      </button>

      <div className="mt-8 text-center text-xs text-slate-300">
        <p>Version 1.0.0 (MVP)</p>
        <p className="mt-1">INNROUTES TravelOS</p>
      </div>
    </div>
  );
};