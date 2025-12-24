
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Map, ShieldCheck, WifiOff } from 'lucide-react';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: "Plan Complex Trips in Minutes",
      desc: "Stop juggling 10 apps. Build your perfect itinerary with AI assistance in one place.",
      icon: <Map size={64} className="text-brand" />,
      color: "bg-black"
    },
    {
      title: "Visa Intelligence at your fingertips",
      desc: "Know exactly what documents you need before you book. No more border surprises.",
      icon: <ShieldCheck size={64} className="text-white" />,
      color: "bg-brand"
    },
    {
      title: "Travel Confidently Offline",
      desc: "Access your plans, maps, and tickets anywhere. No internet? No problem.",
      icon: <WifiOff size={64} className="text-brand" />,
      color: "bg-slate-800"
    }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('innroutes_onboarding_done', 'true');
      navigate('/login');
    }
  };

  return (
    <div className={`h-screen w-full flex flex-col relative transition-colors duration-500 ${slides[step].color}`}>
      {/* Visual Section */}
      <div className="flex-1 flex items-center justify-center p-10 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        
        <div className="relative z-10 p-10 bg-white/10 backdrop-blur-md rounded-full shadow-2xl animate-in zoom-in duration-500">
           {slides[step].icon}
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-t-3xl p-8 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-10 duration-500 min-h-[40vh] flex flex-col">
        {/* Indicators */}
        <div className="flex gap-2 mb-8">
            {slides.map((_, idx) => (
                <div 
                    key={idx} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === step ? 'w-8 bg-brand' : 'w-2 bg-slate-200'}`} 
                />
            ))}
        </div>

        <h1 className="text-3xl font-extrabold text-dark mb-4 leading-tight">
            {slides[step].title}
        </h1>
        <p className="text-slate-500 text-base leading-relaxed mb-auto">
            {slides[step].desc}
        </p>

        <div className="mt-8 flex justify-between items-center">
            {step < slides.length - 1 ? (
                <button 
                    onClick={() => { localStorage.setItem('innroutes_onboarding_done', 'true'); navigate('/login'); }}
                    className="text-slate-400 font-bold text-sm hover:text-dark"
                >
                    Skip
                </button>
            ) : <div />}
            
            <button 
                onClick={handleNext}
                className="bg-black text-white p-4 rounded-full hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200 flex items-center justify-center gap-2 group"
            >
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
      </div>
    </div>
  );
};
