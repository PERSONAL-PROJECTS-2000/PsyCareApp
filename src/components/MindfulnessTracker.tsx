import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Play, Pause, Settings, Trash2, Plus } from 'lucide-react';
import { DateTime } from 'luxon';

const activities = ['Meditation', 'Yoga', 'Exercise', 'Reading'];

const MindfulnessTracker: React.FC = () => {
  const { mindfulnessActivities, addMindfulnessActivity, updateMindfulnessActivity } = useData();
  const { user } = useAuth();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState<string | null>(null);
  const [newActivity, setNewActivity] = useState({
    name: '',
    activity: 'Meditation',
    alarm: '06:00',
    timer: 20
  });
  const [customActivities, setCustomActivities] = useState<string[]>([]);
  const [newCustomActivity, setNewCustomActivity] = useState('');
  const [showCustomActivityInput, setShowCustomActivityInput] = useState(false);

  // Timer functionality
  useEffect(() => {
    const interval = setInterval(() => {
      mindfulnessActivities.forEach(activity => {
        if (activity.is_running && activity.time_remaining > 0) {
          updateMindfulnessActivity(activity.id, {
            time_remaining: activity.time_remaining - 1
          });
        } else if (activity.is_running && activity.time_remaining <= 0) {
          updateMindfulnessActivity(activity.id, {
            is_running: false,
            is_completed: true,
            time_remaining: activity.timer * 60
          });
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [mindfulnessActivities, updateMindfulnessActivity]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimezoneTime = (time: string) => {
    if (!profile?.timezone) return time;
    
    const [hours, minutes] = time.split(':');
    const dt = DateTime.now()
      .setZone(profile.timezone)
      .set({ hour: parseInt(hours), minute: parseInt(minutes) });
    
    return dt.toFormat('HH:mm');
  };

  const handleStartTimer = (activityId: string) => {
    const activity = mindfulnessActivities.find(a => a.id === activityId);
    if (activity) {
      updateMindfulnessActivity(activityId, {
        is_running: !activity.is_running
      });
    }
  };

  const handleAddActivity = () => {
    addMindfulnessActivity({
      ...newActivity,
      alarm: getTimezoneTime(newActivity.alarm)
    });
    setNewActivity({
      name: '',
      activity: 'Meditation',
      alarm: '06:00',
      timer: 20
    });
    setShowAddDialog(false);
  };

  const handleAddCustomActivity = () => {
    if (newCustomActivity.trim()) {
      setCustomActivities(prev => [...prev, newCustomActivity.trim()]);
      setNewActivity(prev => ({ ...prev, activity: newCustomActivity.trim() }));
      setNewCustomActivity('');
      setShowCustomActivityInput(false);
    }
  };

  const allActivities = [...activities, ...customActivities];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Daily Mindfulness & Meditation</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddDialog(true)}
            className="bg-gradient-to-r from-pink-400 to-rose-400 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Activity</span>
          </motion.button>
        </div>

        <div className="space-y-4">
          {mindfulnessActivities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/40 rounded-2xl p-4 border border-white/30"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={activity.is_target}
                    onChange={(e) => updateMindfulnessActivity(activity.id, { is_target: e.target.checked })}
                    className="w-5 h-5 text-pink-500 rounded-full focus:ring-pink-400"
                  />
                  <h4 className="font-semibold text-gray-700">{activity.name}</h4>
                  <span className="text-sm text-gray-500">({activity.activity})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowSettingsDialog(activity.id)}
                    className="p-2 text-gray-600 hover:text-pink-500 transition-colors"
                  >
                    <Settings size={18} />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Alarm</label>
                  <div className="bg-white/50 rounded-lg p-2 text-center">
                    {getTimezoneTime(activity.alarm)}
                  </div>
                  <button className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 py-1 px-3 rounded-lg text-sm transition-colors">
                    Set Alarm
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Timer</label>
                  <div className="bg-white/50 rounded-lg p-2 text-center font-mono text-lg">
                    {formatTime(activity.time_remaining)}
                  </div>
                  <button
                    onClick={() => handleStartTimer(activity.id)}
                    className={`w-full py-1 px-3 rounded-lg text-sm transition-colors flex items-center justify-center space-x-1 ${
                      activity.is_running
                        ? 'bg-red-100 hover:bg-red-200 text-red-700'
                        : 'bg-green-100 hover:bg-green-200 text-green-700'
                    }`}
                  >
                    {activity.is_running ? <Pause size={16} /> : <Play size={16} />}
                    <span>{activity.is_running ? 'Pause' : 'Start'}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Completion</label>
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={activity.is_completed}
                      onChange={(e) => updateMindfulnessActivity(activity.id, { is_completed: e.target.checked })}
                      className="w-6 h-6 text-pink-500 rounded focus:ring-pink-400"
                    />
                  </div>
                  {activity.is_completed && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center text-sm text-green-600 font-medium"
                    >
                      ✨ Well done! ✨
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Add Activity Dialog */}
      <AnimatePresence>
        {showAddDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Activity</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Activity Name</label>
                  <input
                    type="text"
                    value={newActivity.name}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                    placeholder="Enter activity name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Activity Type</label>
                  <div className="space-y-2">
                    <select
                      value={newActivity.activity}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, activity: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                    >
                      {allActivities.map(activity => (
                        <option key={activity} value={activity}>{activity}</option>
                      ))}
                    </select>
                    
                    {!showCustomActivityInput ? (
                      <button
                        onClick={() => setShowCustomActivityInput(true)}
                        className="text-pink-500 text-sm hover:text-pink-600 transition-colors"
                      >
                        + Add custom activity
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newCustomActivity}
                          onChange={(e) => setNewCustomActivity(e.target.value)}
                          className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent text-sm"
                          placeholder="Custom activity name"
                        />
                        <button
                          onClick={handleAddCustomActivity}
                          className="bg-pink-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-pink-600 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Alarm Time</label>
                  <input
                    type="time"
                    value={newActivity.alarm}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, alarm: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Timer Duration (minutes)</label>
                  <input
                    type="number"
                    value={newActivity.timer}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, timer: parseInt(e.target.value) || 20 }))}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                    min="1"
                    max="120"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddDialog(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddActivity}
                  className="flex-1 bg-gradient-to-r from-pink-400 to-rose-400 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Add Activity
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Settings Dialog */}
      <AnimatePresence>
        {showSettingsDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Activity Settings
              </h3>
              
              <p className="text-gray-700 mb-4">Settings for activity ID: {showSettingsDialog}</p>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowSettingsDialog(null)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MindfulnessTracker;