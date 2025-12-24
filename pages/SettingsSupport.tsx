import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, ChevronDown, BookOpen } from 'lucide-react';

export const SettingsSupport: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
        q: "How accurate is the visa information?",
        a: "Our visa data is updated weekly from official embassy sources. However, immigration rules can change instantly, so we always recommend verifying with the embassy."
    },
    {
        q: "Can I book flights directly in the app?",
        a: "Currently, we compare prices and redirect you to trusted partners (airlines or booking platforms) to complete the booking."
    },
    {
        q: "Does the offline mode work for maps?",
        a: "Yes! You can download itinerary maps for offline use. Full city navigation is coming in Phase 2."
    },
    {
        q: "How do I upgrade to Premium?",
        a: "Go to your Account page and tap the 'Upgrade' button on your plan card. Premium unlocks full visa details and unlimited AI planning."
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-5 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-800">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-dark">Help & Support</h1>
      </div>

      <div className="p-6 space-y-8">
        {/* Contact Support */}
        <div className="bg-brand rounded-2xl p-6 text-center shadow-lg shadow-yellow-100">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 text-black">
                <MessageCircle size={24} />
            </div>
            <h2 className="font-bold text-lg text-black mb-1">Need help?</h2>
            <p className="text-sm text-slate-800/80 mb-4">Our support team is available 24/7 for premium members.</p>
            <button className="bg-black text-brand font-bold py-2 px-6 rounded-xl text-sm hover:bg-slate-800 transition-colors">
                Contact Support
            </button>
        </div>

        {/* FAQs */}
        <div>
            <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
                <BookOpen size={18} className="text-brand" />
                Frequently Asked Questions
            </h3>
            <div className="space-y-3">
                {faqs.map((faq, idx) => (
                    <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden">
                        <button 
                            onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                            className="w-full flex items-center justify-between p-4 bg-slate-50 text-left hover:bg-slate-100 transition-colors"
                        >
                            <span className="font-bold text-sm text-slate-700">{faq.q}</span>
                            <ChevronDown size={16} className={`text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                        </button>
                        {openFaq === idx && (
                            <div className="p-4 bg-white text-sm text-slate-500 leading-relaxed border-t border-slate-100 animate-in slide-in-from-top-1 fade-in">
                                {faq.a}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};