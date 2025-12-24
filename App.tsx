
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { DestinationDetail } from './pages/DestinationDetail';
import { CreateTrip } from './pages/CreateTrip';
import { BudgetTracker } from './pages/BudgetTracker';
import { MyTrips } from './pages/MyTrips';
import { TripDetails } from './pages/TripDetails';
import { SocialFeed } from './pages/SocialFeed';
import { CreatePost } from './pages/CreatePost';
import { ExploreMap } from './pages/ExploreMap';
import { Account } from './pages/Account';
import { SettingsPersonalInfo } from './pages/SettingsPersonalInfo';
import { SettingsPayment } from './pages/SettingsPayment';
import { SettingsNotifications } from './pages/SettingsNotifications';
import { SettingsPrivacy } from './pages/SettingsPrivacy';
import { SettingsSupport } from './pages/SettingsSupport';
import { AdminLogin } from './pages/AdminLogin';
import { Onboarding } from './pages/Onboarding';
import { Login } from './pages/Login';
import { OTPVerification } from './pages/OTPVerification';
import { Signup } from './pages/Signup';
import { DestinationData, UserPlan } from './types';
import { Loader2 } from 'lucide-react';
import { client, authService } from './services/appwrite';

const App: React.FC = () => {
  const [currentTrip, setCurrentTrip] = useState<DestinationData | null>(null);
  const [userPlan, setUserPlan] = useState<UserPlan>('Free');
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // 1. Verify connection
        await (client as any).ping();
        
        // 2. Check for active session
        const user = await authService.getCurrentUser();
        if (user) {
            setIsAuthenticated(true);
            // Sync local storage flag just in case
            localStorage.setItem('innroutes_auth_token', 'secure_session');
        } else {
            // Check if guest mode was enabled locally
            const localToken = localStorage.getItem('innroutes_auth_token');
            if (localToken === 'guest_token') {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        }
      } catch (e) {
        console.warn("Initialization Check Failed", e);
      }

      // Splash delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white relative overflow-hidden">
         {/* Splash Screen */}
         <div className="relative z-10 flex flex-col items-center animate-in fade-in duration-700">
             <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center text-brand font-black text-3xl shadow-2xl mb-6 transform rotate-3">
                 IR
             </div>
             <h1 className="text-2xl font-extrabold text-dark tracking-tight">INNROUTES</h1>
             <p className="text-slate-400 text-sm mt-2 font-medium tracking-wide">Plan Your Trip. Your Way.</p>
         </div>
         
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand/5 rounded-full blur-3xl pointer-events-none" />
      </div>
    );
  }

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              <Dashboard setTripData={setCurrentTrip} userPlan={userPlan} setUserPlan={setUserPlan} />
            </RequireAuth>
          } />
          
          <Route path="/dashboard" element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              <Dashboard setTripData={setCurrentTrip} userPlan={userPlan} setUserPlan={setUserPlan} />
            </RequireAuth>
          } />
          
          {/* Auth Flow */}
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/otp" element={<OTPVerification />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route path="/destination" element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              <DestinationDetail data={currentTrip} userPlan={userPlan} setUserPlan={setUserPlan} />
            </RequireAuth>
          } />
          <Route path="/create-trip" element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              <CreateTrip data={currentTrip} />
            </RequireAuth>
          } />
          <Route path="/trips" element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              <MyTrips />
            </RequireAuth>
          } />
          <Route path="/trip/:id" element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              <TripDetails />
            </RequireAuth>
          } />
          <Route path="/community" element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              <SocialFeed />
            </RequireAuth>
          } />
          <Route path="/create-post" element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              <CreatePost />
            </RequireAuth>
          } />
          <Route path="/map" element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              <ExploreMap />
            </RequireAuth>
          } />
          <Route path="/budget" element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              <BudgetTracker />
            </RequireAuth>
          } />
          <Route path="/account" element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              <Account userPlan={userPlan} />
            </RequireAuth>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />

          {/* Settings Routes */}
          <Route path="/account/personal-info" element={<RequireAuth isAuthenticated={isAuthenticated}><SettingsPersonalInfo /></RequireAuth>} />
          <Route path="/account/payment" element={<RequireAuth isAuthenticated={isAuthenticated}><SettingsPayment /></RequireAuth>} />
          <Route path="/account/notifications" element={<RequireAuth isAuthenticated={isAuthenticated}><SettingsNotifications /></RequireAuth>} />
          <Route path="/account/privacy" element={<RequireAuth isAuthenticated={isAuthenticated}><SettingsPrivacy /></RequireAuth>} />
          <Route path="/account/support" element={<RequireAuth isAuthenticated={isAuthenticated}><SettingsSupport /></RequireAuth>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

// Updated Guard Component
const RequireAuth: React.FC<{ children: React.ReactElement, isAuthenticated: boolean }> = ({ children, isAuthenticated }) => {
  const isOnboarded = localStorage.getItem('innroutes_onboarding_done');
  
  // We check the prop passed from App state which is verified against Appwrite
  // We also check localStorage as a fallback for immediate redirects before state updates
  const hasLocalToken = localStorage.getItem('innroutes_auth_token');

  if (!isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  if (!isAuthenticated && !hasLocalToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default App;
