
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserTrip } from '../types';
import { Calendar, DollarSign, Plus, ChevronRight, Briefcase, PieChart, Filter } from 'lucide-react';

export const MyTrips: React.FC = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<UserTrip[]>([]);
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');
  const [destinationFilter, setDestinationFilter] = useState<string>('All');

  useEffect(() => {
    const savedTrips = localStorage.getItem('innroutes_trips');
    if (savedTrips) {
      try {
        const parsed = JSON.parse(savedTrips);
        setTrips(parsed);
      } catch (e) {
        console.error("Failed to parse trips", e);
      }
    }
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isPast = (endDateStr: string) => {
    return new Date(endDateStr) < new Date();
  };

  // Extract unique destinations
  const uniqueDestinations = Array.from(new Set(trips.map(t => t.destination))).sort();

  const filteredTrips = trips.filter(t => {
    const past = isPast(t.endDate);
    const timeMatch = filter === 'upcoming' ? !past : past;
    const destMatch = destinationFilter === 'All' || t.destination === destinationFilter;
    return timeMatch && destMatch;
  });

  return (
    <div className="p-6 pt-10 min-h-screen pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-dark">My Trips</h1>
        <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/budget')} 
              className="bg-white border border-slate-200 px-3 py-2 rounded-full text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2 text-xs font-bold shadow-sm"
            >
              <PieChart size={16} />
              Spending
            </button>
            <button 
            onClick={() => navigate('/')} 
            className="bg-brand p-2 rounded-full text-black hover:bg-[#eebb33] transition-colors shadow-md shadow-yellow-100"
            >
            <Plus size={24} />
            </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
        <button
          onClick={() => setFilter('upcoming')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
            filter === 'upcoming' ? 'bg-white text-dark shadow-sm' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilter('past')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
            filter === 'past' ? 'bg-white text-dark shadow-sm' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Past
        </button>
      </div>

      {/* Destination Filter */}
      {uniqueDestinations.length > 0 && (
        <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
                <Filter size={14} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Filter by Destination</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                <button
                    onClick={() => setDestinationFilter('All')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
                    destinationFilter === 'All'
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                >
                    All
                </button>
                {uniqueDestinations.map((dest) => (
                    <button
                    key={dest}
                    onClick={() => setDestinationFilter(dest)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
                        destinationFilter === dest
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                    >
                    {dest}
                    </button>
                ))}
            </div>
        </div>
      )}

      {filteredTrips.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
            <Briefcase size={40} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            No {filter} trips found
          </h3>
          <p className="text-sm text-slate-400 max-w-xs mx-auto mb-6">
            {destinationFilter !== 'All' 
                ? `You don't have any ${filter} trips to ${destinationFilter}.`
                : filter === 'upcoming' 
                    ? "Ready for your next adventure? Start planning a new journey today." 
                    : "You haven't completed any trips with us yet."
            }
          </p>
          {filter === 'upcoming' && destinationFilter === 'All' && (
            <button
              onClick={() => navigate('/')}
              className="bg-brand text-black font-bold py-3 px-6 rounded-xl shadow-lg shadow-yellow-100 hover:bg-[#eebb33] transition-all active:scale-95"
            >
              Plan a Trip
            </button>
          )}
          {destinationFilter !== 'All' && (
             <button
                onClick={() => setDestinationFilter('All')}
                className="text-brand font-bold text-sm hover:underline"
             >
                Clear Filters
             </button>
          )}
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {filteredTrips.map((trip) => (
            <div 
              key={trip.id}
              onClick={() => navigate(`/trip/${trip.id}`)}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="h-32 w-full relative">
                 <img 
                    src={`https://picsum.photos/800/600?random=${trip.destination.length % 10}`} 
                    alt={trip.destination} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 text-white">
                    <h3 className="font-bold text-xl">{trip.destination}</h3>
                  </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      <Calendar size={16} className="text-brand" />
                      <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                   </div>
                   <div className="flex items-center gap-1 text-xs font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded-md">
                      <DollarSign size={12} />
                      {trip.budget}
                   </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                   <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                      {trip.data.itinerary.length} Days Plan
                   </span>
                   <span className="text-brand group-hover:translate-x-1 transition-transform">
                      <ChevronRight size={18} />
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
