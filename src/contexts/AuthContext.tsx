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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await loadProfile(session.user.id);
      } else {
        setProfile(null);
        setShowAuth(false);
        setShowProfileSetup(false);
        setShowGreeting(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
        setShowGreeting(true);
      } else {
        // No profile exists, show profile setup
        setShowProfileSetup(true);
      }
    } catch (error) {
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

    const updates = {
      id: user.id,
      ...profileData,
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
      changePassword
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