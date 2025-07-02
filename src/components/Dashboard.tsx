import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const { moodEntries, mindfulnessActivities, goals, habits } = useData();
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  // Mood Analytics
  const getMoodData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const entry = moodEntries.find(e => e.date === date);
      const avgMood = entry ? 
        Object.values(entry.moods).reduce((sum, mood) => sum + mood, 0) / Object.values(entry.moods).length 
        : 0;
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        mood: Math.round(avgMood * 10) / 10
      };
    });
  };

  // Mindfulness Progress
  const getMindfulnessProgress = () => {
    const targetActivities = mindfulnessActivities.filter(activity => activity.is_target);
    const completedActivities = targetActivities.filter(activity => activity.is_completed);
    const percentage = targetActivities.length > 0 ? (completedActivities.length / targetActivities.length) * 100 : 0;
    
    return [
      { name: 'Completed', value: completedActivities.length, color: '#ec4899' },
      { name: 'Remaining', value: targetActivities.length - completedActivities.length, color: '#e5e7eb' }
    ];
  };

  // Goals Progress
  const getGoalsProgress = () => {
    const categories = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
    return categories.map(category => {
      const categoryGoals = goals.filter(goal => goal.category === category);
      const completedGoals = categoryGoals.filter(goal => goal.is_completed);
      const percentage = categoryGoals.length > 0 ? (completedGoals.length / categoryGoals.length) * 100 : 0;
      
      return {
        category,
        completed: completedGoals.length,
        total: categoryGoals.length,
        percentage: Math.round(percentage)
      };
    });
  };

  // Habits Progress
  const getHabitsProgress = () => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const completedCount = habits.filter(habit => 
        habit.completed_dates.includes(date)
      ).length;
      
      const percentage = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        completed: completedCount,
        total: habits.length,
        percentage: Math.round(percentage)
      };
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Progress Dashboard</h3>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as 'daily' | 'weekly' | 'monthly')}
            className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-white/50"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {/* Mood Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/40 rounded-2xl p-6 border border-white/30 mb-6"
        >
          <h4 className="text-xl font-bold text-gray-800 mb-4">Mood Trends</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getMoodData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis domain={[0, 7]} stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="#ec4899" 
                  strokeWidth={3}
                  dot={{ fill: '#ec4899', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#ec4899', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Progress Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mindfulness Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/40 rounded-2xl p-6 border border-white/30"
          >
            <h4 className="text-lg font-bold text-gray-800 mb-4">Mindfulness Progress</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getMindfulnessProgress()}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {getMindfulnessProgress().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Goals Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/40 rounded-2xl p-6 border border-white/30"
          >
            <h4 className="text-lg font-bold text-gray-800 mb-4">Goals Progress by Category</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getGoalsProgress()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="category" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Bar dataKey="percentage" fill="#ec4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Habits Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/40 rounded-2xl p-6 border border-white/30 mt-6"
        >
          <h4 className="text-lg font-bold text-gray-800 mb-4">Self-Care Habits Progress</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getHabitsProgress()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Bar dataKey="percentage" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-pink-400 to-rose-400 rounded-2xl p-4 text-white"
          >
            <h5 className="font-semibold mb-1">Mood Entries</h5>
            <p className="text-2xl font-bold">{moodEntries.length}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl p-4 text-white"
          >
            <h5 className="font-semibold mb-1">Active Goals</h5>
            <p className="text-2xl font-bold">{goals.filter(g => !g.is_completed).length}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl p-4 text-white"
          >
            <h5 className="font-semibold mb-1">Habits Tracked</h5>
            <p className="text-2xl font-bold">{habits.length}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl p-4 text-white"
          >
            <h5 className="font-semibold mb-1">Mindfulness Activities</h5>
            <p className="text-2xl font-bold">{mindfulnessActivities.length}</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;