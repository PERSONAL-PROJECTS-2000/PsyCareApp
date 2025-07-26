import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LandingPage from './LandingPage';
import AuthPage from './AuthPage';
import ProfileSetup from './ProfileSetup';
import GreetingPage from './GreetingPage';
import HomePage from './HomePage';
import LoadingSpinner from './LoadingSpinner';

const AppContent: React.FC = () => {
  const { user, loading, showAuth, showProfileSetup, showGreeting } = useAuth();

  // Diagnostic logging for render decisions
  console.log('🎯 AppContent render decision:', {
    loading,
    user: user ? 'exists' : 'null',
    showAuth,
    showProfileSetup,
    showGreeting,
    decision: loading ? 'LOADING' : 
              !user && !showAuth ? 'LANDING' :
              !user && showAuth ? 'AUTH' :
              user && showProfileSetup ? 'PROFILE_SETUP' :
              user && showGreeting ? 'GREETING' :
              user ? 'HOME' : 'FALLBACK_LANDING'
  });

  if (loading) {
    console.log('🔄 Rendering LoadingSpinner');
    return <LoadingSpinner />;
  }

  if (!user && !showAuth) {
    console.log('🏠 Rendering LandingPage');
    return <LandingPage />;
  }

  if (!user && showAuth) {
    console.log('🔐 Rendering AuthPage');
    return <AuthPage />;
  }

  if (user && showProfileSetup) {
    console.log('👤 Rendering ProfileSetup');
    return <ProfileSetup />;
  }

  if (user && showGreeting) {
    console.log('👋 Rendering GreetingPage');
    return <GreetingPage />;
  }

  if (user) {
    console.log('🏡 Rendering HomePage');
    return <HomePage />;
  }

  console.log('🔄 Fallback to LandingPage');
  return <LandingPage />;
};

export default AppContent;