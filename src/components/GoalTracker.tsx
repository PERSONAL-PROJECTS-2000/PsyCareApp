import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const GoalTracker: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal } = useData();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({
    name: '',
    category: 'Daily',
    deadline: ''
  });
  const [searchType, setSearchType] = useState<'record' | 'deadline'>('record');
  const [searchDate, setSearchDate] = useState('');
  const [applyFilters, setApplyFilters] = useState(false);

  const handleSaveGoal = () => {
    if (newGoal.name.trim()) {
      const today = new Date().toISOString().split('T')[0];
      
      if (editingGoal) {
        updateGoal(editingGoal, newGoal);
      } else {
        addGoal({
          ...newGoal,
          record_date: today,
          is_completed: false
        });
      }
      
      setNewGoal({ name: '', category: 'Daily', deadline: '' });
      setShowAddDialog(false);
      setEditingGoal(null);
    }
  };

  const handleEdit = (goal: any) => {
    setNewGoal({
      name: goal.name,
      category: goal.category,
      deadline: goal.deadline || ''
    });
    setEditingGoal(goal.id);
    setShowAddDialog(true);
  };

  const getFilteredGoals = () => {
    if (!applyFilters || !searchDate) {
      return goals;
    }

    return goals.filter(goal => {
      const targetDate = searchType === 'record' ? goal.record_date : goal.deadline;
      return targetDate === searchDate;
    });
  };

  const getProgressData = () => {
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

  const isDeadlineMissed = (goal: any) => {
    if (!goal.deadline) return false;
    const today = new Date().toISOString().split('T')[0];
    return goal.deadline < today && !goal.is_completed;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Goal Tracker</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddDialog(true)}
            className="bg-gradient-to-r from-pink-400 to-rose-400 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Goal</span>
          </motion.button>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-white/40 rounded-2xl">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-600">Search by:</label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as 'record' | 'deadline')}
              className="p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            >
              <option value="record">Record Date</option>
              <option value="deadline">Deadline</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="applyFilters"
              checked={applyFilters}
              onChange={(e) => setApplyFilters(e.target.checked)}
              className="w-4 h-4 text-pink-500 rounded focus:ring-pink-400"
            />
            <label htmlFor="applyFilters" className="text-sm font-medium text-gray-600">
              Apply filters
            </label>
          </div>
        </div>

        {/* Goals List */}
        <div className="space-y-4">
          {getFilteredGoals().map((goal) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/40 rounded-2xl p-4 border border-white/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <input
                    type="checkbox"
                    checked={goal.is_completed}
                    onChange={(e) => updateGoal(goal.id, { is_completed: e.target.checked })}
                    className="w-5 h-5 text-pink-500 rounded focus:ring-pink-400"
                  />
                  <div className="flex-1">
                    <h4 className={`font-semibold ${goal.is_completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {goal.name}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                        {goal.category}
                      </span>
                      <span>Recorded: {new Date(goal.record_date).toLocaleDateString()}</span>
                      {goal.deadline && (
                        <span className={isDeadlineMissed(goal) ? 'text-red-600 font-medium' : ''}>
                          Deadline: {new Date(goal.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {isDeadlineMissed(goal) && (
                      <div className="text-red-600 text-sm font-medium mt-1">
                        ⚠️ Deadline missed
                      </div>
                    )}
                    {goal.is_completed && (
                      <div className="text-green-600 text-sm font-medium mt-1">
                        ✅ Congratulations! Goal achieved!
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(goal)}
                    className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Progress Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">Goal Progress by Category</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getProgressData()}>
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

      {/* Add/Edit Goal Dialog */}
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
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingGoal ? 'Edit Goal' : 'Add New Goal'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Goal Name</label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                  placeholder="Enter goal name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Deadline (Optional)</label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddDialog(false);
                  setEditingGoal(null);
                  setNewGoal({ name: '', category: 'Daily', deadline: '' });
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveGoal}
                className="flex-1 bg-gradient-to-r from-pink-400 to-rose-400 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Save Goal
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default GoalTracker;