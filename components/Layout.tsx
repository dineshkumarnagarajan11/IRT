
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Users, PlusCircle, Briefcase, User } from 'lucide-react';
import { OfflineIndicator } from './OfflineIndicator';
import { SimulatedSMS } from './SimulatedSMS';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const hideNavPaths = ['/admin', '/login-admin', '/login', '/otp', '/signup', '/onboarding', '/splash'];
  const isAuthPage = hideNavPaths.some(path => location.pathname.startsWith(path));

  const isActive = (path: string) => location.pathname === path ? 'text-black font-bold' : 'text-slate-400';

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      {/* Mobile Container Simulator */}
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col">
        
        {/* Global Offline Indicator & SMS Simulation */}
        <OfflineIndicator />
        <SimulatedSMS />

        {/* Content Area */}
        <main className={`flex-1 overflow-y-auto custom-scrollbar ${!isAuthPage ? 'pb-20' : ''}`}>
          {children}
        </main>

        {/* Bottom Navigation */}
        {!isAuthPage && (
          <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center z-50">
            <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/')}`}>
              <Home size={24} />
              <span className="text-[10px] font-medium">Home</span>
            </Link>
            <Link to="/trips" className={`flex flex-col items-center gap-1 ${isActive('/trips')}`}>
              <Briefcase size={24} />
              <span className="text-[10px] font-medium">Trips</span>
            </Link>
            <div className="relative -top-5">
              <Link to="/create-post" className="bg-brand text-black p-4 rounded-full shadow-lg flex items-center justify-center hover:bg-[#eebb33] transition-colors border-4 border-white">
                <PlusCircle size={28} />
              </Link>
            </div>
            <Link to="/community" className={`flex flex-col items-center gap-1 ${isActive('/community')}`}>
              <Users size={24} />
              <span className="text-[10px] font-medium">Community</span>
            </Link>
            <Link to="/account" className={`flex flex-col items-center gap-1 ${isActive('/account')}`}>
              <User size={24} />
              <span className="text-[10px] font-medium">Account</span>
            </Link>
          </nav>
        )}
      </div>
    </div>
  );
};
