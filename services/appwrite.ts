
import { createClient } from '@supabase/supabase-js';

// --- Configuration ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const USE_REAL_AUTH = !!(SUPABASE_URL && SUPABASE_KEY);

// --- Supabase Client ---
// Only initialize if keys are present
const supabase = USE_REAL_AUTH 
    ? createClient(SUPABASE_URL!, SUPABASE_KEY!) 
    : null;

// --- Mock Implementation (Fallback) ---
export const ID = {
    unique: () => Date.now().toString(36) + Math.random().toString(36).substring(2)
};

// --- Service Implementation ---
export const client = {
    ping: async () => {
        if (USE_REAL_AUTH && supabase) {
            // Check connection by getting session
            const { data, error } = await supabase.auth.getSession();
            if (error) console.warn("Supabase connection warning:", error);
            return !error;
        }
        console.log("Mock Connection: Online 🟢");
        return true;
    }
};

export const authService = {
    // Step 1: Initiate Login (Send OTP)
    async initiateLogin(contact: string, method: 'email' | 'phone') {
        if (USE_REAL_AUTH && supabase) {
            console.log(`[Real Auth] Sending OTP to ${contact} via ${method}`);
            
            const { error } = await supabase.auth.signInWithOtp({
                [method]: contact,
                options: {
                    // For phone, if you have an SMS provider configured (Twilio), it sends SMS.
                    shouldCreateUser: true
                }
            } as any);

            if (error) {
                console.error("Supabase OTP Error:", error);
                // Enhance error message for common issues
                if (error.message.includes("sms_provider_not_found")) {
                   throw new Error("SMS Provider not configured in Supabase.");
                }
                throw new Error(error.message);
            }
            return true;
        } else {
            // --- MOCK FLOW ---
            await new Promise(resolve => setTimeout(resolve, 1500));
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            console.log(`[Mock Auth] Generated OTP for ${contact}: ${code}`);
            
            const otpData = {
                code,
                expiry: Date.now() + 5 * 60 * 1000,
                contact
            };
            sessionStorage.setItem('innroutes_otp_session', JSON.stringify(otpData));

            // Trigger Simulated SMS
            setTimeout(() => {
                if (typeof window !== 'undefined') {
                    const event = new CustomEvent('innroutes-otp', { detail: { code } });
                    window.dispatchEvent(event);
                }
            }, 500);

            return true;
        }
    },

    // Step 2: Verify Login (Check OTP)
    async verifyLogin(contact: string, secret: string, method: 'email' | 'phone') {
        if (USE_REAL_AUTH && supabase) {
            console.log(`[Real Auth] Verifying OTP for ${contact}`);
            
            const { data, error } = await supabase.auth.verifyOtp({
                [method]: contact,
                token: secret,
                type: method === 'phone' ? 'sms' : 'email'
            } as any);

            if (error) {
                console.error("Supabase Verify Error:", error);
                throw new Error(error.message);
            }

            if (data.session) {
                // Map Supabase User to App User format
                const user = {
                    $id: data.user?.id || ID.unique(),
                    name: data.user?.user_metadata?.full_name || '',
                    email: data.user?.email || '',
                    phone: data.user?.phone || '',
                    contact: contact
                };
                
                // Persist session locally for app compatibility
                localStorage.setItem('innroutes_mock_user', JSON.stringify(user));
                return user;
            }
            throw new Error("Verification failed. No session created.");
        } else {
             // --- MOCK FLOW ---
            await new Promise(resolve => setTimeout(resolve, 1000));
            const stored = sessionStorage.getItem('innroutes_otp_session');
            
            if (!stored) throw new Error("Session expired. Please request a new code.");

            const { code, expiry, contact: storedContact } = JSON.parse(stored);

            if (storedContact !== contact) throw new Error("Invalid session. Please login again.");
            if (Date.now() > expiry) throw new Error("Code expired. Please request a new one.");
            if (secret !== code) throw new Error("Invalid verification code. Please try again.");
            
            sessionStorage.removeItem('innroutes_otp_session');
            return await this._createMockSession(contact, method);
        }
    },

    // Internal helper for Mock
    async _createMockSession(contact: string, method: string) {
        const user = {
            $id: 'user_' + ID.unique(),
            name: '',
            email: method === 'email' ? contact : '',
            phone: method === 'phone' ? contact : '',
            contact: contact
        };
        localStorage.setItem('innroutes_mock_user', JSON.stringify(user));
        return user;
    },

    // Get Current User
    async getCurrentUser() {
        if (USE_REAL_AUTH && supabase) {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Ensure local storage matches current auth state
                const appUser = {
                    $id: user.id,
                    name: user.user_metadata?.full_name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    contact: user.phone || user.email || ''
                };
                 return appUser;
            }
            return null;
        }

        // Mock Fallback
        try {
            const userStr = localStorage.getItem('innroutes_mock_user');
            if (userStr) return JSON.parse(userStr);
            return null;
        } catch (error) {
            return null;
        }
    },

    // Update Profile
    async updateProfile(name: string) {
        if (USE_REAL_AUTH && supabase) {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: name }
            });
            if (error) throw error;
            
            // Update local cache
            const user = await this.getCurrentUser();
            if (user) localStorage.setItem('innroutes_mock_user', JSON.stringify(user));
            return user;
        }

        // Mock Fallback
        await new Promise(resolve => setTimeout(resolve, 500));
        const userStr = localStorage.getItem('innroutes_mock_user');
        if (userStr) {
            const user = JSON.parse(userStr);
            user.name = name;
            localStorage.setItem('innroutes_mock_user', JSON.stringify(user));
            return user;
        }
        throw new Error("User not found");
    },

    // Logout
    async logout() {
        if (USE_REAL_AUTH && supabase) {
            await supabase.auth.signOut();
        }
        localStorage.removeItem('innroutes_mock_user');
        localStorage.removeItem('innroutes_auth_token');
        sessionStorage.removeItem('innroutes_otp_session');
        return true;
    }
};

export const account = {};
export const databases = {};
export const storage = {};
