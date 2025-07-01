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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user && !showAuth) {
    return <LandingPage />;
  }

  if (!user && showAuth) {
    return <AuthPage />;
  }

  if (user && showProfileSetup) {
    return <ProfileSetup />;
  }

  if (user && showGreeting) {
    return <GreetingPage />;
  }

  if (user) {
    return <HomePage />;
  }

  return <LandingPage />;
};

export default AppContent;