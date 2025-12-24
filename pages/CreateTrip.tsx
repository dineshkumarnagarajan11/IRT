
import React, { useState, useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { DestinationData, UserTrip } from '../types';
import { fetchDestinationIntelligence } from '../services/geminiService';
import { Calendar, IndianRupee, ArrowLeft, Check, MapPin, PenTool, Loader2, AlertCircle } from 'lucide-react';

declare var mappls: any;

interface CreateTripProps {
  data: DestinationData | null;
}

export const CreateTrip: React.FC<CreateTripProps> = ({ data }) => {
  const navigate = useNavigate();
  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingText, setLoadingText] = useState('Creating Trip...');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // Set default trip name when data is available
  useEffect(() => {
    if (data) {
      setTripName(`Trip to ${data.name}`);
    }
  }, [data]);

  // Calculate duration whenever dates change
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setDuration(diffDays > 0 ? diffDays : 0);
    } else {
      setDuration(0);
    }
  }, [startDate, endDate]);

  // Ensure End Date is valid relative to Start Date
  useEffect(() => {
    if (startDate && endDate) {
        if (new Date(startDate) > new Date(endDate)) {
            setEndDate('');
        }
    }
  }, [startDate]);


  // Initialize Map
  useEffect(() => {
    if (data?.coordinates && mapContainerRef.current && !mapInstanceRef.current && typeof mappls !== 'undefined') {
        try {
             mapInstanceRef.current = new mappls.Map(mapContainerRef.current, {
                center: { lat: data.coordinates.lat, lng: data.coordinates.lng },
                zoom: 10,
                draggable: false,
                zoomControl: false,
                scrollZoom: false,
                clickableIcons: false,
                disableDoubleClickZoom: true,
                fullScreenControl: false,
                location: false,
                scaleControl: false
            });
            // Add marker
             new mappls.Marker({
                map: mapInstanceRef.current,
                position: { lat: data.coordinates.lat, lng: data.coordinates.lng }
            });
        } catch(e) { console.error("Mini map init error", e); }
    }
  }, [data]);

  if (!data) return <Navigate to="/" replace />;

  const isDurationValid = duration >= 3 && duration <= 15;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDurationValid) return;

    setIsSubmitting(true);
    setLoadingText('Finalizing Details...');

    let finalData = data;
    
    // If duration differs from current data itinerary length, regenerate itinerary
    if (duration !== data.itinerary.length) {
        setLoadingText(`Generating ${duration}-Day Itinerary...`);
        try {
            // Retrieve profile to pass correct params, or default.
            const savedProfile = localStorage.getItem('innroutes_profile');
            const profile = savedProfile ? JSON.parse(savedProfile) : {};

            // Requesting specific duration intelligence
            const freshData = await fetchDestinationIntelligence(
                data.name, 
                profile.homeCountry || 'India', 
                profile.currency || 'INR', 
                profile.passportCountry || 'India', 
                duration
            );
            // Merge critical static info just in case, ensuring coordinates persist
            finalData = { 
                ...freshData, 
                coordinates: data.coordinates,
                visa: freshData.visa || data.visa,
                localTransport: freshData.localTransport || data.localTransport
            }; 
        } catch (error) {
            console.error("Error generating custom itinerary, falling back to default", error);
            // Fallback to existing data if AI fails
        }
    }

    const newTrip: UserTrip = {
      id: Date.now().toString(),
      destination: finalData.name,
      startDate,
      endDate,
      budget: Number(budget),
      expenses: [],
      data: finalData
    };

    // Save to local storage
    const existingTrips = JSON.parse(localStorage.getItem('innroutes_trips') || '[]');
    localStorage.setItem('innroutes_trips', JSON.stringify([newTrip, ...existingTrips]));

    console.log("Trip Created:", newTrip);
    navigate('/trips');
  };

  return (
    <div className="min-h-full bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-5 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-800">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-dark">Create Trip</h1>
      </div>

      <div className="p-6 space-y-8">
        {/* Destination Summary */}
        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand shadow-sm">
            <MapPin size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Destination</p>
            <h2 className="text-xl font-bold text-dark">{data.name}</h2>
          </div>
        </div>

        {/* Embedded Map */}
        {data.coordinates && (
            <div className="h-32 w-full rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative">
                <div ref={mapContainerRef} className="w-full h-full bg-slate-200" />
                {/* Transparent overlay to disable interaction completely */}
                <div className="absolute inset-0 z-10 bg-transparent" />
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trip Name */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-dark flex items-center gap-2">
              <PenTool size={18} className="text-brand" />
              Name your trip
            </h3>
            <input
              type="text"
              required
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              placeholder="e.g. Summer Vacation"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-brand outline-none transition-all"
            />
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-dark flex items-center gap-2">
              <Calendar size={18} className="text-brand" />
              When are you going?
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 ml-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-brand outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 ml-1">End Date</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-brand outline-none transition-all"
                />
              </div>
            </div>
            {/* Duration Feedback */}
            {startDate && endDate && (
                <div className={`flex items-center gap-2 text-xs font-medium p-3 rounded-lg border ${isDurationValid ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-red-50 border-red-100 text-red-600'}`}>
                    {isDurationValid ? (
                        <Check size={14} className="shrink-0" />
                    ) : (
                        <AlertCircle size={14} className="shrink-0" />
                    )}
                    <span>
                        Duration: {duration} Days
                        {!isDurationValid && " (Must be 3-15 days)"}
                    </span>
                </div>
            )}
          </div>

          {/* Budget */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-dark flex items-center gap-2">
              <IndianRupee size={18} className="text-brand" />
              What is your budget?
            </h3>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <IndianRupee size={20} />
              </div>
              <input
                type="number"
                required
                placeholder="20000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-16 py-4 text-lg font-bold text-slate-800 focus:ring-2 focus:ring-brand outline-none placeholder-slate-300 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">{data.economics.homeCurrency}</span>
            </div>
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 flex gap-2 items-start">
               <div className="text-amber-500 mt-0.5"><IndianRupee size={14} /></div>
               <p className="text-xs text-amber-800 leading-tight">
                 Estimated daily cost for {data.name} is <span className="font-bold">{data.economics.dailyCostHome} {data.economics.homeCurrency}</span>. 
                 Recommended budget: <span className="font-bold">{data.economics.dailyCostHome * (duration || 7)} {data.economics.homeCurrency}</span> for {duration || 7} days.
               </p>
            </div>
          </div>

          <div className="pt-6 pb-6">
            <button
              type="submit"
              disabled={isSubmitting || (duration > 0 && !isDurationValid)}
              className="w-full bg-brand text-black font-bold py-4 rounded-2xl shadow-xl shadow-yellow-100 flex items-center justify-center gap-3 hover:bg-[#eebb33] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  {loadingText}
                </>
              ) : (
                <>
                  <Check size={20} />
                  Confirm Trip
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
