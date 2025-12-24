
import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-center gap-2 text-xs font-bold animate-in slide-in-from-top-full z-50 sticky top-0">
      <WifiOff size={14} />
      <span>No Internet Connection. Viewing offline data.</span>
    </div>
  );
};
