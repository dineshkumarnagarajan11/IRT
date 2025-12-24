
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { DestinationData, UserPlan } from '../types';
import { DestinationHeader } from '../components/DestinationHeader';
import { VisaCard } from '../components/VisaCard';
import { ItineraryView } from '../components/ItineraryView';
import { Compass, Shield, Calendar, IndianRupee, Plus, Bus, Train, Car, Info, Lock, Check, FileCheck, Clock, Sun, CloudRain, Coins, ArrowRightLeft } from 'lucide-react';

interface DestinationDetailProps {
  data: DestinationData | null;
  userPlan: UserPlan;
  setUserPlan: (plan: UserPlan) => void;
}

export const DestinationDetail: React.FC<DestinationDetailProps> = ({ data, userPlan, setUserPlan }) => {
  const [tab, setTab] = useState<'overview' | 'visa' | 'plan' | 'transport'>('overview');
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [currentTime, setCurrentTime] = useState<string>('');
  const navigate = useNavigate();

  // Clock Logic
  useEffect(() => {
    if (data?.timeInfo) {
      const updateTime = () => {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const destTime = new Date(utc + (3600000 * data.timeInfo.gmtOffset));
        setCurrentTime(destTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
      };
      
      updateTime();
      const timer = setInterval(updateTime, 1000 * 60); // Update every minute
      return () => clearInterval(timer);
    }
  }, [data]);

  if (!data) return <Navigate to="/" replace />;

  const toggleDoc = (doc: string) => {
    setCheckedDocs(prev => ({...prev, [doc]: !prev[doc]}));
  };

  const getTransportIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('train') || t.includes('metro') || t.includes('subway') || t.includes('rail')) return <Train size={24} />;
    if (t.includes('bus') || t.includes('shuttle')) return <Bus size={24} />;
    return <Car size={24} />;
  };

  const isVisaLocked = userPlan === 'Free';
  const isTransportLocked = userPlan === 'Free' || userPlan === 'Plus';

  const UnlockOverlay = ({ title, requiredPlan, price, btnColorClass }: { title: string, requiredPlan: string, price: string, btnColorClass: string }) => (
    <div className="py-16 px-6 text-center bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-slate-200 text-slate-500">
            <Lock size={32} />
        </div>
        <h3 className="text-xl font-bold mb-2 text-dark">{title} Locked</h3>
        <p className="text-slate-500 text-sm mb-6 max-w-xs">
            Upgrade to the <span className="font-bold">{requiredPlan} Plan</span> to access {title.toLowerCase()}.
        </p>
        <button 
            onClick={() => {
                setUserPlan(requiredPlan as UserPlan);
            }}
            className={`${btnColorClass} text-black font-bold py-3 px-8 rounded-xl shadow-lg transition-transform active:scale-95`}
        >
            Unlock for {price}
        </button>
    </div>
  );

  return (
    <div className="pb-10">
      <DestinationHeader data={data} />

      {/* Intelligence Bar */}
      <div className="px-5 py-4 bg-slate-900 text-white overflow-x-auto no-scrollbar">
          <div className="flex gap-6 min-w-max">
            {/* Time */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-brand">
                    <Clock size={18} />
                </div>
                <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Local Time</p>
                    <p className="text-sm font-bold flex items-center gap-1">
                        {currentTime} <span className="text-[10px] font-normal text-slate-400 bg-slate-800 px-1 rounded">{data.timeInfo.timeZoneName}</span>
                    </p>
                    <p className="text-[10px] text-brand">{data.timeInfo.timeDifference}</p>
                </div>
            </div>

            <div className="w-px bg-slate-800" />

            {/* Currency */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-brand">
                    <Coins size={18} />
                </div>
                <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Exchange</p>
                    <p className="text-sm font-bold flex items-center gap-1">
                        1 {data.economics.homeCurrency} <ArrowRightLeft size={10} className="text-slate-500" /> {data.economics.exchangeRate} {data.economics.localCurrency}
                    </p>
                    <p className="text-[10px] text-slate-400">Approx. Rate</p>
                </div>
            </div>

            <div className="w-px bg-slate-800" />

             {/* Weather */}
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-brand">
                    {data.weatherInfo.temperature.includes("Rain") ? <CloudRain size={18} /> : <Sun size={18} />}
                </div>
                <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Weather</p>
                    <p className="text-sm font-bold">{data.weatherInfo.temperature}</p>
                    <p className="text-[10px] text-slate-400">{data.weatherInfo.season}</p>
                </div>
            </div>
          </div>
      </div>

      {/* Tabs - Refined Pill Design */}
      <div className="sticky top-0 bg-white z-40 px-5 py-4 shadow-sm border-b border-slate-100 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setTab('overview')}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
              tab === 'overview'
                ? 'bg-black text-brand shadow-lg scale-105'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setTab('plan')}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
              tab === 'plan'
                ? 'bg-black text-brand shadow-lg scale-105'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            Itinerary
          </button>
          <button
            onClick={() => setTab('visa')}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
              tab === 'visa'
                ? 'bg-black text-brand shadow-lg scale-105'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            Visa
            {isVisaLocked && <Lock size={12} className="opacity-70" />}
          </button>
          <button
            onClick={() => setTab('transport')}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
              tab === 'transport'
                ? 'bg-black text-brand shadow-lg scale-105'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            Local Transport
            {isTransportLocked && <Lock size={12} className="opacity-70" />}
          </button>
        </div>
      </div>

      {/* Create Trip Action */}
      <div className="px-5 py-4 bg-white border-b border-slate-50">
        <button 
          onClick={() => navigate('/create-trip')}
          className="w-full bg-brand text-black font-bold py-4 rounded-xl shadow-xl shadow-yellow-100 hover:bg-[#eebb33] transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-lg"
        >
          <Plus size={24} className="stroke-[3px]" />
          Create Trip
        </button>
      </div>

      <div className="p-5 min-h-[400px]">
        {tab === 'overview' && (
          <div key="overview" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section>
              <h3 className="font-bold text-dark mb-3 flex items-center gap-2">
                <Compass size={18} className="text-brand" />
                Cultural Tips
              </h3>
              <div className="grid gap-3">
                {data.cultureTips.map((tip, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-sm text-slate-600 leading-relaxed hover:border-brand/30 transition-colors">
                    {tip}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="font-bold text-dark mb-3 flex items-center gap-2">
                <IndianRupee size={18} className="text-brand" />
                Budget Intelligence
              </h3>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-4">
                 <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase">Cost Comparison</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${data.economics.budgetComparison === 'Cheaper' ? 'bg-green-100 text-green-700' : data.economics.budgetComparison === 'Expensive' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-700'}`}>
                        {data.economics.budgetComparison} than home
                    </span>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-slate-400 mb-1">Daily Avg (Local)</p>
                        <p className="text-lg font-bold text-slate-800">{data.economics.dailyCostLocal} <span className="text-xs font-medium">{data.economics.localCurrency}</span></p>
                    </div>
                     <div>
                        <p className="text-xs text-slate-400 mb-1">Daily Avg (Home)</p>
                        <p className="text-lg font-bold text-brand">{data.economics.dailyCostHome} <span className="text-xs font-medium text-black">{data.economics.homeCurrency}</span></p>
                    </div>
                 </div>
              </div>
            </section>
          </div>
        )}

        {tab === 'transport' && (
           <div key="transport" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           {isTransportLocked ? (
               <UnlockOverlay 
                    title="Transport & Tools" 
                    requiredPlan="Premium" 
                    price="₹199" 
                    btnColorClass="bg-brand hover:bg-[#eebb33]"
                />
           ) : (
          <div className="space-y-4">
             <div className="bg-blue-50 p-4 rounded-xl flex gap-3 mb-4">
                <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
                <div>
                   <h4 className="font-bold text-blue-900 text-sm">Getting Around</h4>
                   <p className="text-xs text-blue-800/80 mt-1">
                     Estimated fares and route information for local transport options.
                   </p>
                </div>
             </div>

             {data.localTransport && data.localTransport.length > 0 ? (
                 data.localTransport.map((option, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex gap-4">
                       <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                          {getTransportIcon(option.type)}
                       </div>
                       <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                             <h4 className="font-bold text-slate-800 capitalize">{option.type}</h4>
                             <div className="text-right">
                                <span className="text-xs font-bold block text-slate-800">
                                    {option.costLocal} {data.economics.localCurrency}
                                </span>
                                <span className="text-[10px] text-slate-400 block">
                                    ~ {option.costHome} {data.economics.homeCurrency}
                                </span>
                             </div>
                          </div>
                          <p className="text-sm text-slate-500 leading-relaxed">{option.routeInfo}</p>
                       </div>
                    </div>
                 ))
             ) : (
                <div className="text-center py-10 bg-slate-50 rounded-xl">
                   <p className="text-slate-400 text-sm">No transport information available.</p>
                </div>
             )}
          </div>
           )}
           </div>
        )}

        {tab === 'visa' && (
          <div key="visa" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {isVisaLocked ? (
              <UnlockOverlay 
                  title="Visa Intelligence" 
                  requiredPlan="Plus" 
                  price="₹99" 
                  btnColorClass="bg-dark text-white hover:bg-black"
              />
          ) : (
          <div className="space-y-6">
            <VisaCard visa={data.visa} hideDocuments={true} />
            
            {/* Detailed Checklist */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <FileCheck size={18} className="text-indigo-600" />
                        <h3 className="font-bold text-dark text-sm">Document Checklist</h3>
                    </div>
                    <span className="text-xs text-slate-500 font-medium bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm">
                        {Object.values(checkedDocs).filter(Boolean).length}/{data.visa.documents.length} Ready
                    </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-100 h-1">
                    <div 
                        className="bg-indigo-600 h-1 transition-all duration-300"
                        style={{ width: `${(Object.values(checkedDocs).filter(Boolean).length / Math.max(data.visa.documents.length, 1)) * 100}%` }}
                    />
                </div>

                <div className="divide-y divide-slate-50">
                    {data.visa.documents.map((doc, idx) => (
                        <button 
                            key={idx}
                            onClick={() => toggleDoc(doc)}
                            className="w-full text-left px-5 py-4 flex items-start gap-3 hover:bg-slate-50 transition-colors group"
                        >
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${checkedDocs[doc] ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white group-hover:border-indigo-400'}`}>
                                {checkedDocs[doc] && <Check size={14} strokeWidth={3} />}
                            </div>
                            <span className={`text-sm transition-colors ${checkedDocs[doc] ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}`}>
                                {doc}
                            </span>
                        </button>
                    ))}
                </div>
                <div className="bg-indigo-50/50 p-4 text-xs text-slate-500 text-center border-t border-slate-50">
                    Tap items to mark them as collected.
                </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl flex gap-3">
              <Shield size={20} className="text-slate-600 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Safe Travel Guarantee</h4>
                <p className="text-xs text-slate-700/80 mt-1">
                  INNROUTES data is cross-referenced with general embassy guidelines.
                </p>
              </div>
            </div>
          </div>
          )}
          </div>
        )}

        {tab === 'plan' && (
          <div key="plan" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-dark flex items-center gap-2">
                <Calendar size={18} className="text-brand" />
                Your Trip
              </h3>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">
                {data.itinerary.length} Days Plan
              </span>
            </div>
            <ItineraryView days={data.itinerary} />
          </div>
        )}
      </div>
    </div>
  );
};
