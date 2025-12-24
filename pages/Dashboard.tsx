
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, Loader2, FileText, Map, Crown, Check, X, Settings } from 'lucide-react';
import { fetchDestinationIntelligence } from '../services/geminiService';
import { DestinationData, UserPlan, UserProfile } from '../types';

interface DashboardProps {
  setTripData: (data: DestinationData) => void;
  userPlan: UserPlan;
  setUserPlan: (plan: UserPlan) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setTripData, userPlan, setUserPlan }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedProfile = localStorage.getItem('innroutes_profile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      // Use profile or defaults
      const home = userProfile?.homeCountry || 'India';
      const passport = userProfile?.passportCountry || 'India';
      const curr = userProfile?.currency || 'INR';

      const data = await fetchDestinationIntelligence(query, home, curr, passport);
      setTripData(data);
      navigate('/destination');
    } catch (error) {
      alert("Failed to load destination data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const trending = ['Japan', 'Bali', 'Portugal', 'Vietnam'];

  const getPlanBadge = () => {
    if (userPlan === 'Premium') return 'bg-brand text-black border-black';
    if (userPlan === 'Plus') return 'bg-dark text-brand border-dark';
    return 'bg-slate-100 text-slate-500 border-slate-200';
  };

  return (
    <div className="p-6 pt-10">
      <header className="mb-8 flex justify-between items-start">
        <div>
            <h1 className="text-3xl font-extrabold text-dark leading-tight">
            Where to next,<br />
            <span className="text-brand drop-shadow-sm" style={{textShadow: '1px 1px 0 #000'}}>Traveler?</span>
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-slate-500 text-sm">
                Planning for <span className="font-bold text-slate-700">{userProfile?.passportCountry || 'India'}</span> Passport
              </p>
              <button 
                onClick={() => navigate('/account/personal-info')}
                className="text-brand hover:text-dark transition-colors"
              >
                <Settings size={14} />
              </button>
            </div>
        </div>
        <button 
            onClick={() => setShowPlanModal(true)}
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getPlanBadge()}`}
        >
            {userPlan} Plan
        </button>
      </header>

      {/* Search Box */}
      <form onSubmit={handleSearch} className="relative mb-8">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Thailand, Peru..."
          className="w-full bg-white pl-12 pr-4 py-4 rounded-2xl shadow-lg shadow-slate-200/50 border-none outline-none focus:ring-2 focus:ring-brand text-slate-800 placeholder-slate-400 font-medium transition-all"
        />
        <button 
          type="submit"
          disabled={loading || !query}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-brand p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
        </button>
      </form>

      {/* Trending */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4">Trending Now</h2>
        <div className="grid grid-cols-2 gap-4">
          {trending.map((place) => (
            <button
              key={place}
              onClick={() => {
                setQuery(place);
              }}
              className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-brand transition-all text-left"
            >
              <div>
                <span className="block font-bold text-slate-700">{place}</span>
                <span className="text-[10px] text-slate-400">Popular for solos</span>
              </div>
              <div className="bg-slate-50 p-1.5 rounded-full text-slate-300 group-hover:bg-brand group-hover:text-black transition-colors">
                <MapPin size={14} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Explore Map Banner */}
      <button 
        onClick={() => navigate('/map')}
        className="w-full mb-8 bg-black rounded-2xl p-5 text-white flex items-center justify-between relative overflow-hidden group shadow-lg shadow-slate-300"
      >
        <div className="relative z-10 text-left">
          <h3 className="font-bold text-lg flex items-center gap-2 text-brand">
            <Map size={20} />
            Explore Map
          </h3>
          <p className="text-slate-400 text-xs mt-1">Discover hidden gems around the world</p>
        </div>
        <div className="relative z-10 bg-white/10 p-2 rounded-full backdrop-blur-sm group-hover:scale-110 transition-transform text-brand">
          <ArrowRight size={20} />
        </div>
        {/* Decor */}
        <div className="absolute -right-4 -bottom-8 opacity-20 text-brand">
          <Map size={100} />
        </div>
      </button>

      {/* Visa Intelligence / Plan Trigger */}
      <button 
        onClick={() => setShowPlanModal(true)}
        className="w-full bg-dark rounded-2xl p-5 text-white relative overflow-hidden text-left shadow-xl shadow-slate-300 hover:scale-[1.02] transition-transform active:scale-95 border-l-4 border-brand"
      >
        <div className="relative z-10">
          <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
            {userPlan === 'Premium' ? <Crown size={20} className="text-brand" /> : <FileText size={20} />}
            Visa Intelligence
          </h3>
          <p className="text-slate-400 text-xs mb-3">
            {userPlan === 'Free' ? 'Unlock Visa requirements & detailed plans.' : 'Check requirements instantly for your trip.'}
          </p>
          <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-semibold border ${userPlan === 'Premium' ? 'bg-brand text-black border-brand' : 'bg-slate-800 text-brand border-slate-700'}`}>
            {userPlan === 'Free' ? 'Upgrade to Unlock' : `${userPlan} Active`}
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 text-brand">
          <FileText size={120} />
        </div>
      </button>

      {/* Plan Selection Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 relative overflow-hidden">
                <button 
                    onClick={() => setShowPlanModal(false)}
                    className="absolute top-4 right-4 bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200"
                >
                    <X size={20} />
                </button>
                
                <h2 className="text-2xl font-extrabold text-dark mb-2">Choose your Plan</h2>
                <p className="text-slate-500 text-sm mb-6">Unlock the full power of TravelOS.</p>

                <div className="space-y-3">
                    {/* Free Tier */}
                    <button 
                        onClick={() => { setUserPlan('Free'); setShowPlanModal(false); }}
                        className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${userPlan === 'Free' ? 'border-dark bg-slate-50' : 'border-slate-100 hover:border-slate-300'}`}
                    >
                        <div className="text-left">
                            <h3 className="font-bold text-dark">Free</h3>
                            <p className="text-xs text-slate-500">Idea Only + Route</p>
                        </div>
                        <div className="text-right">
                             <span className="block font-bold text-lg">₹0</span>
                             {userPlan === 'Free' && <span className="text-[10px] bg-dark text-white px-2 py-0.5 rounded-full">Current</span>}
                        </div>
                    </button>

                    {/* Plus Tier */}
                    <button 
                        onClick={() => { setUserPlan('Plus'); setShowPlanModal(false); }}
                        className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${userPlan === 'Plus' ? 'border-dark bg-slate-100' : 'border-slate-100 hover:border-slate-300'}`}
                    >
                        <div className="text-left">
                            <h3 className="font-bold text-dark">Plus</h3>
                            <p className="text-xs text-slate-600">Idea + Route + <span className="font-bold text-black bg-brand/30 px-1 rounded">Visa</span></p>
                        </div>
                        <div className="text-right">
                             <span className="block font-bold text-lg text-dark">₹99</span>
                             {userPlan === 'Plus' && <span className="text-[10px] bg-dark text-white px-2 py-0.5 rounded-full">Current</span>}
                        </div>
                    </button>

                    {/* Premium Tier */}
                    <button 
                        onClick={() => { setUserPlan('Premium'); setShowPlanModal(false); }}
                        className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all relative overflow-hidden ${userPlan === 'Premium' ? 'border-brand bg-brand/10' : 'border-slate-100 hover:border-brand/50'}`}
                    >
                         {/* Shine effect */}
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-brand/40 to-transparent rounded-bl-full -mr-4 -mt-4 pointer-events-none"></div>

                        <div className="text-left relative z-10">
                            <h3 className="font-bold text-black flex items-center gap-1">
                                Premium <Crown size={14} className="fill-brand text-black" />
                            </h3>
                            <p className="text-xs text-slate-700">Idea + Route + Visa + <span className="font-bold bg-brand px-1 rounded text-black">All In One</span></p>
                        </div>
                        <div className="text-right relative z-10">
                             <span className="block font-bold text-lg text-black">₹199</span>
                             {userPlan === 'Premium' && <span className="text-[10px] bg-brand text-black px-2 py-0.5 rounded-full">Current</span>}
                        </div>
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
