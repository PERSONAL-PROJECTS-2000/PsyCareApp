import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  showAuth: boolean;
  showProfileSetup: boolean;
  showGreeting: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<Profile>) => Promise<void>;
  completeGreeting: () => void;
  changePassword: (newPassword: string) => Promise<void>;
  setShowAuth: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);

  // Diagnostic logging for render
  console.log('🔍 AuthProvider render:', {
    loading,
    user: user ? 'exists' : 'null',
    profile: profile ? 'exists' : 'null',
    showAuth,
    showProfileSetup,
    showGreeting
  });

  // ADD THESE NEW LOGS HERE
  console.log('--- Debugging Supabase Client ---');
  console.log('Supabase client object:', supabase);
  console.log('Supabase auth object:', supabase.auth);
  if (supabase && supabase.auth && typeof supabase.auth.onAuthStateChange === 'function') {
    console.log('supabase.auth.onAuthStateChange is a function.');
  } else {
    console.error('ERROR: supabase.auth.onAuthStateChange is NOT a function or supabase client is not properly initialized!');
  }
  console.log('--- End Debugging Supabase Client ---');

  useEffect(() => {
    console.log('🚀 AuthProvider useEffect starting');
    
    // Check for an initial session immediately
    const checkInitialSession = async () => {
        try {
            const { data, error } = await supabase.auth.getSession();
            console.log('✅ Initial getSession result:', { session: data.session ? 'exists' : 'null', error });
            if (error) {
                console.error('Error getting initial session:', error);
            }
            // Manually trigger the auth state change logic if session is found
            // This is a fallback/diagnostic, onAuthStateChange should handle this
            if (data.session) {
                // We don't want to duplicate the listener's work, but this helps debug if listener is stuck
                // The listener should fire for INITIAL_SESSION, but if it's not, this helps
            }
        } catch (err) {
            console.error('Error in checkInitialSession:', err);
        }
    };
    checkInitialSession(); // Run this once on mount

    // Listen for auth changes (handles both initial session and subsequent changes)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state change:', { event, session: session ? 'exists' : 'null' });
      
      try {
        console.log('📝 Setting user:', session?.user ? 'exists' : 'null');
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('👤 User found, loading profile for:', session.user.id);
          await loadProfile(session.user.id);
        } else {
          console.log('❌ No user, resetting state');
          setProfile(null);
          setShowAuth(false);
          setShowProfileSetup(false);
          setShowGreeting(false);
        }
      } catch (error) {
        console.error('Error in auth state change callback:', error);
        // Reset to safe state on error
        console.log('🔄 Resetting to safe state due to error');
        setUser(null);
        setProfile(null);
        setShowAuth(false);
        setShowProfileSetup(false);
        setShowGreeting(false);
      } finally {
        console.log('✅ Setting loading to false');
        setLoading(false);
      }
    });

    console.log('🎧 Auth listener setup complete');
    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    console.log('📊 Loading profile for user:', userId);
    
    try {
     console.log('🔍 About to query Supabase for profile...');
     console.log('🌐 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
     console.log('🔑 Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
     
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        // .single(); // Temporarily remove .single() to debug

     console.log('📥 Supabase query completed');
     console.log('📊 Query result - data:', data);
     console.log('❌ Query result - error:', error);

      if (error) { // Check for any error
        console.error('❌ Error loading profile:', error);
        console.error('Error loading profile:', error);
        return;
      }

      if (data && data.length > 0) { // Check if data exists and is not empty
        console.log('✅ Profile loaded:', data);
        setProfile(data[0]); // Assuming we expect one profile, take the first one
        setShowGreeting(true);
      } else {
        // No profile exists, show profile setup
        console.log('📝 No profile found, showing profile setup');
        setShowProfileSetup(true);
      }
    } catch (error) {
     console.log('💥 Exception caught in loadProfile:', error);
      console.error('💥 Exception in loadProfile:', error);
      console.error('Error loading profile:', error);
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    setShowAuth(false);
  };

  const signup = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    setShowAuth(false);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  };

  const updateProfile = async (profileData: Partial<Profile>) => {
    if (!user) return;

    // Convert empty date_of_birth string to null for database compatibility
    const processedProfileData = {
      ...profileData,
      date_of_birth: profileData.date_of_birth === '' ? null : profileData.date_of_birth
    };

    const updates = {
      id: user.id,
      ...processedProfileData,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert(updates)
      .select()
      .single();

    if (error) {
      throw error;
    }

    setProfile(data);
    setShowProfileSetup(false);
    setShowGreeting(true);

    // Insert default resources for new users
    if (!profile) {
      await insertDefaultResources(user.id);
    }
  };

  const insertDefaultResources = async (userId: string) => {
    const defaultResources = [
      {
        user_id: userId,
        title: 'National Alliance Mental Illness',
        type: 'link',
        content: 'https://www.nami.org/',
        category: 'healthcare'
      },
      {
        user_id: userId,
        title: 'Mental Health America',
        type: 'link',
        content: 'https://mhanational.org/',
        category: 'healthcare'
      },
      {
        user_id: userId,
        title: 'Call/Text',
        type: 'text',
        content: '988',
        category: 'emergency'
      },
      {
        user_id: userId,
        title: 'Call',
        type: 'text',
        content: '1-800-950-6264 or 1-800-662-4357',
        category: 'emergency'
      }
    ];

    await supabase.from('resources').insert(defaultResources);
  };

  const completeGreeting = () => {
    setShowGreeting(false);
  };

  const changePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      showAuth,
      showProfileSetup,
      showGreeting,
      login,
      signup,
      logout,
      updateProfile,
      completeGreeting,
      changePassword,
      setShowAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};