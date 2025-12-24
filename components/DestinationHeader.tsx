import React from 'react';
import { DestinationData } from '../types';
import { MapPin, Calendar, Info } from 'lucide-react';

interface DestinationHeaderProps {
  data: DestinationData;
}

export const DestinationHeader: React.FC<DestinationHeaderProps> = ({ data }) => {
  // Use a deterministic placeholder based on name length to vary images slightly
  const imageId = data.name.length % 10; 
  
  return (
    <div className="relative">
      <div className="h-64 w-full overflow-hidden">
        <img 
          src={`https://picsum.photos/800/600?random=${imageId}`} 
          alt={data.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
      </div>
      
      <div className="absolute bottom-0 left-0 w-full p-5 text-white">
        <div className="flex items-center gap-1 text-indigo-300 text-sm font-medium mb-1">
          <MapPin size={16} />
          <span>Destination Guide</span>
        </div>
        <h1 className="text-3xl font-bold mb-1">{data.name}</h1>
        <p className="text-slate-200 text-sm opacity-90 line-clamp-1">{data.tagline}</p>
      </div>

      <div className="px-5 py-4 bg-white border-b border-slate-100 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 p-2 rounded-full text-indigo-600">
            <Calendar size={18} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-semibold uppercase">Best Time</p>
            <p className="text-xs font-medium text-slate-800">{data.timeInfo.bestTimeToVisit}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 p-2 rounded-full text-emerald-600">
            <Info size={18} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-semibold uppercase">Daily Budget</p>
            <p className="text-xs font-medium text-slate-800">{data.economics.dailyCostHome} {data.economics.homeCurrency} / day</p>
          </div>
        </div>
      </div>
    </div>
  );
};