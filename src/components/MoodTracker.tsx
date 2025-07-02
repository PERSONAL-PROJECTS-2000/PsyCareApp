import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const moodRanges = [
  {
    id: 'sadness-happiness',
    name: 'Sadness to Happiness',
    color: 'from-blue-400 to-yellow-400',
    emojis: ['😢', '😔', '😐', '🙂', '😊', '😄', '😁']
  },
  {
    id: 'agitated-calm',
    name: 'Agitated to Calm',
    color: 'from-red-400 to-blue-400',
    emojis: ['😤', '😠', '😑', '😌', '😇', '🧘', '☮️']
  },
  {
    id: 'angry-peaceful',
    name: 'Angry to Peaceful',
    color: 'from-red-500 to-green-400',
    emojis: ['😡', '😠', '😤', '😐', '😌', '😊', '☮️']
  },
  {
    id: 'depressed-lively',
    name: 'Depressed to Lively',
    color: 'from-gray-500 to-orange-400',
    emojis: ['😞', '😔', '😐', '🙂', '😊', '😄', '🤩']
  },
  {
    id: 'unmotivated-motivated',
    name: 'Unmotivated to Motivated',
    color: 'from-purple-400 to-green-400',
    emojis: ['😴', '😑', '😐', '🙂', '😊', '💪', '🔥']
  },
  {
    id: 'anxious-relaxed',
    name: 'Anxious to Relaxed',
    color: 'from-yellow-500 to-blue-400',
    emojis: ['😰', '😟', '😐', '🙂', '😌', '😊', '🧘']
  },
  {
    id: 'bored-entertained',
    name: 'Bored to Entertained',
    color: 'from-gray-400 to-pink-400',
    emojis: ['😴', '😑', '😐', '🙂', '😊', '😄', '🎉']
  },
  {
    id: 'displeased-pleased',
    name: 'Displeased to Pleased',
    color: 'from-red-400 to-green-400',
    emojis: ['😒', '😔', '😐', '🙂', '😊', '😄', '😍']
  },
  {
    id: 'tired-energetic',
    name: 'Tired to Energetic',
    color: 'from-blue-600 to-yellow-400',
    emojis: ['😴', '😪', '😐', '🙂', '😊', '😄', '⚡']
  },
  {
    id: 'confused-clear',
    name: 'Confused to Clear',
    color: 'from-purple-500 to-blue-400',
    emojis: ['😵', '😕', '😐', '🙂', '😊', '😄', '🧠']
  }
];

const MoodTracker: React.FC = () => {
  const { moodEntries, addMoodEntry } = useData();
  const [selectedMoods, setSelectedMoods] = useState<{ [key: string]: number }>({});
  const [checkedRanges, setCheckedRanges] = useState<{ [key: string]: boolean }>({});

  const handleMoodSelect = (rangeId: string, value: number) => {
    setSelectedMoods(prev => ({ ...prev, [rangeId]: value }));
    setCheckedRanges(prev => ({ ...prev, [rangeId]: true }));
  };

  const saveMoodEntry = () => {
    const today = new Date().toISOString().split('T')[0];
    const filteredMoods = Object.fromEntries(
      Object.entries(selectedMoods).filter(([key]) => checkedRanges[key])
    );
    
    addMoodEntry({
      date: today,
      moods: filteredMoods
    });

    setSelectedMoods({});
    setCheckedRanges({});
  };

  const getWeeklyData = () => {
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

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Daily Mood Tracker</h3>
        
        <div className="space-y-6">
          {moodRanges.map((range) => (
            <motion.div
              key={range.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/40 rounded-2xl p-4 border border-white/30"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-700">{range.name}</h4>
                <input
                  type="checkbox"
                  checked={checkedRanges[range.id] || false}
                  readOnly
                  className="w-5 h-5 text-pink-500 rounded focus:ring-pink-400"
                />
              </div>
              
              <div className="flex items-center space-x-2 mb-3">
                {range.emojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => handleMoodSelect(range.id, index + 1)}
                    className={`text-2xl p-2 rounded-full transition-all duration-200 ${
                      selectedMoods[range.id] === index + 1
                        ? 'bg-pink-200 scale-110 shadow-md'
                        : 'hover:bg-pink-100 hover:scale-105'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={selectedMoods[range.id] || 4}
                  onChange={(e) => handleMoodSelect(range.id, parseInt(e.target.value))}
                  className={`w-full h-3 rounded-lg appearance-none cursor-pointer bg-gradient-to-r ${range.color}`}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                  <span>6</span>
                  <span>7</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={saveMoodEntry}
          className="w-full mt-6 bg-gradient-to-r from-pink-400 to-rose-400 text-white py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Save Today's Mood
        </motion.button>
      </motion.div>

      {/* Weekly Mood Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">Weekly Mood Trends</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getWeeklyData()}>
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
    </div>
  );
};

export default MoodTracker;