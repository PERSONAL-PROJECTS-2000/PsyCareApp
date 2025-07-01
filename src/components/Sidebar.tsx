import React from 'react';
import { motion } from 'framer-motion';
import { Home, BarChart3, User, Bell, Trash2 } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Progress Dashboard', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'recycle-bin', label: 'Recycle Bin', icon: Trash2 }
  ];

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 bg-white/40 backdrop-blur-sm border-r border-white/20 h-full overflow-y-auto"
    >
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">PsyCare</h2>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-white/50 hover:text-gray-800'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </motion.button>
            );
          })}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;