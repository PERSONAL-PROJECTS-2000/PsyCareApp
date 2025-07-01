import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import MoodTracker from './MoodTracker';
import MindfulnessTracker from './MindfulnessTracker';
import PersonalEntries from './PersonalEntries';
import GoalTracker from './GoalTracker';
import SelfCareTracker from './SelfCareTracker';
import SelfHelpResources from './SelfHelpResources';
import Quiz from './Quiz';
import AIAssistant from './AIAssistant';

const HomeOverview: React.FC = () => {
  const { profile } = useAuth();
  const { loading } = useData();
  const [activeWidget, setActiveWidget] = useState<string | null>(null);

  const widgets = [
    { id: 'mood', title: 'Daily Mood Tracker', component: MoodTracker, color: 'from-pink-400 to-rose-400' },
    { id: 'mindfulness', title: 'Mindfulness & Meditation', component: MindfulnessTracker, color: 'from-blue-400 to-indigo-400' },
    { id: 'entries', title: 'Personal Entries', component: PersonalEntries, color: 'from-green-400 to-emerald-400' },
    { id: 'goals', title: 'Goal Tracker', component: GoalTracker, color: 'from-purple-400 to-pink-400' },
    { id: 'habits', title: 'Self-Care Habits', component: SelfCareTracker, color: 'from-yellow-400 to-orange-400' },
    { id: 'resources', title: 'Self Help Resources', component: SelfHelpResources, color: 'from-red-400 to-pink-400' },
    { id: 'quiz', title: 'Mental Health Quiz', component: Quiz, color: 'from-indigo-400 to-purple-400' },
    { id: 'ai', title: 'AI Assistant', component: AIAssistant, color: 'from-teal-400 to-cyan-400' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-pink-200 border-t-pink-500 rounded-full"></div>
      </div>
    );
  }

  if (activeWidget) {
    const widget = widgets.find(w => w.id === activeWidget);
    if (widget) {
      const Component = widget.component;
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">{widget.title}</h2>
            <button
              onClick={() => setActiveWidget(null)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-semibold transition-colors"
            >
              Back to Home
            </button>
          </div>
          <Component />
        </div>
      );
    }
  }

  return (
    <div className="space-y-6 relative">
      {/* Bolt.new Hackathon Badge - Positioned in top right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="fixed top-4 right-4 z-50"
      >
        <a
          href="https://bolt.new/"
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:scale-105 transition-transform duration-200"
          title="Powered by Bolt.new - Made in Bolt.new"
        >
          <img
            src="/images/white_circle_360x360.png"
            alt="Powered by Bolt.new"
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
            }}
          />
        </a>
      </motion.div>

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20"
      >
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 bg-clip-text text-transparent mb-4">
            Welcome back, {profile?.name || 'Friend'}!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Your journey to mental wellness continues. Choose an activity below to get started.
          </p>
        </div>
      </motion.div>

      {/* Widget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {widgets.map((widget, index) => (
          <motion.div
            key={widget.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveWidget(widget.id)}
            className={`bg-gradient-to-br ${widget.color} rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group`}
          >
            <div className="text-white">
              <h3 className="text-xl font-bold mb-2 group-hover:scale-105 transition-transform">
                {widget.title}
              </h3>
              <p className="text-white/80 text-sm">
                Click to explore this feature
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Progress</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-500">0</div>
            <div className="text-sm text-gray-600">Mood Entries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">0</div>
            <div className="text-sm text-gray-600">Mindfulness Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">0</div>
            <div className="text-sm text-gray-600">Journal Entries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">0</div>
            <div className="text-sm text-gray-600">Goals Completed</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomeOverview;