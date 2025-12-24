import React, { useState } from 'react';
import { DayPlan } from '../types';
import { Map, Coffee, Camera, Bus } from 'lucide-react';

interface ItineraryViewProps {
  days: DayPlan[];
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({ days }) => {
  const [activeDay, setActiveDay] = useState(1);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'food': return <Coffee size={14} />;
      case 'transport': return <Bus size={14} />;
      case 'relax': return <Map size={14} />;
      default: return <Camera size={14} />;
    }
  };

  const currentPlan = days.find(d => d.day === activeDay) || days[0];

  return (
    <div className="space-y-4">
      {/* Day Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
        {days.map((d) => (
          <button
            key={d.day}
            onClick={() => setActiveDay(d.day)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeDay === d.day 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Day {d.day}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative border-l-2 border-indigo-100 ml-3 space-y-6 pb-4">
        {currentPlan?.activities.map((activity, idx) => (
          <div key={activity.id} className="relative pl-6 group">
            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-indigo-500 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:border-indigo-100 transition-colors">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {activity.time}
                </span>
                <span className="text-xs text-slate-400 capitalize flex items-center gap-1">
                  {getActivityIcon(activity.type)}
                  {activity.type}
                </span>
              </div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">{activity.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};