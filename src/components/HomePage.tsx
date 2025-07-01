import React, { useState } from 'react';
import Sidebar from './Sidebar';
import HomeOverview from './HomeOverview';
import Dashboard from './Dashboard';
import Profile from './Profile';
import Notifications from './Notifications';
import RecycleBin from './RecycleBin';

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeOverview />;
      case 'dashboard':
        return <Dashboard />;
      case 'profile':
        return <Profile />;
      case 'notifications':
        return <Notifications />;
      case 'recycle-bin':
        return <RecycleBin />;
      default:
        return <HomeOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-rose-100 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default HomePage;