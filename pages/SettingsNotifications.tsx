import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Tag, Plane, Users } from 'lucide-react';

export const SettingsNotifications: React.FC = () => {
  const navigate = useNavigate();
  const [toggles, setToggles] = useState({
    tripUpdates: true,
    priceAlerts: true,
    community: false,
    marketing: false
  });

  const toggle = (key: keyof typeof toggles) => {
    setToggles({ ...toggles, [key]: !toggles[key] });
  };

  const NotificationItem = ({ icon, title, subtitle, id }: { icon: React.ReactNode, title: string, subtitle: string, id: keyof typeof toggles }) => (
    <div className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center">
                {icon}
            </div>
            <div>
                <p className="font-bold text-sm text-slate-800">{title}</p>
                <p className="text-xs text-slate-400">{subtitle}</p>
            </div>
        </div>
        <button 
            onClick={() => toggle(id)}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${toggles[id] ? 'bg-brand' : 'bg-slate-200'}`}
        >
            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${toggles[id] ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-5 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-800">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-dark">Notifications</h1>
      </div>

      <div className="p-6">
        <div className="space-y-2">
            <NotificationItem 
                id="tripUpdates"
                icon={<Plane size={18} />}
                title="Trip Updates"
                subtitle="Flight changes, visa alerts, and itinerary reminders."
            />
            <NotificationItem 
                id="priceAlerts"
                icon={<Tag size={18} />}
                title="Price Alerts"
                subtitle="Get notified when tracked flight prices drop."
            />
             <NotificationItem 
                id="community"
                icon={<Users size={18} />}
                title="Community Activity"
                subtitle="Likes, comments, and new follower alerts."
            />
             <NotificationItem 
                id="marketing"
                icon={<Bell size={18} />}
                title="Promotions & Tips"
                subtitle="Occasional travel tips and exclusive offers."
            />
        </div>
      </div>
    </div>
  );
};