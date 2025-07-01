import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { Plus, Edit, Trash2, CheckSquare } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const SelfCareTracker: React.FC = () => {
  const { habits, addHabit, updateHabit, deleteHabit } = useData();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingHabit, setEditingHabit] = useState<string | null>(null);
  const [newHabit, setNewHabit] = useState({
    name: '',
    time: '09:00'
  });
  const [selectAll, setSelectAll] = useState(false);

  const handleSaveHabit = () => {
    if (newHabit.name.trim()) {
      if (editingHabit) {
        updateHabit(editingHabit, newHabit);
      } else {
        addHabit({
          ...newHabit,
          isCompleted: false
        });
      }
      
      setNewHabit({ name: '', time: '09:00' });
      setShowAddDialog(false);
      setEditingHabit(null);
    }
  };

  const handleEdit = (habit: any) => {
    setNewHabit({
      name: habit.name,
      time: habit.time
    });
    setEditingHabit(habit.id);
    setShowAddDialog(true);
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    habits.forEach(habit => {
      updateHabit(habit.id, { isCompleted: newSelectAll });
      
      if (newSelectAll) {
        const today = new Date().toISOString().split('T')[0];
        const updatedDates = habit.completedDates.includes(today) 
          ? habit.completedDates 
          : [...habit.completedDates, today];
        updateHabit(habit.id, { completedDates: updatedDates });
      }
    });
  };

  const handleHabitToggle = (habitId: string, isCompleted: boolean) => {
    updateHabit(habitId, { isCompleted });
    
    const today = new Date().toISOString().split('T')[0];
    const habit = habits.find(h => h.id === habitId);
    
    if (habit) {
      let updatedDates = [...habit.completedDates];
      
      if (isCompleted && !updatedDates.includes(today)) {
        updatedDates.push(today);
      } else if (!isCompleted) {
        updatedDates = updatedDates.filter(date => date !== today);
      }
      
      updateHabit(habitId, { completedDates: updatedDates });
    }
  };

  const getProgressData = () => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const completedCount = habits.filter(habit => 
        habit.completedDates.includes(date)
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

  const getHabitProgressData = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return [];

    const today = new Date();
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const completedDays = last30Days.filter(date => 
      habit.completedDates.includes(date)
    ).length;

    return [
      { name: 'Completed', value: completedDays, color: '#ec4899' },
      { name: 'Missed', value: 30 - completedDays, color: '#e5e7eb' }
    ];
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Self-Care Habits</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddDialog(true)}
            className="bg-gradient-to-r from-pink-400 to-rose-400 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Habit</span>
          </motion.button>
        </div>

        {/* Select All */}
        <div className="flex items-center space-x-3 mb-6 p-4 bg-white/40 rounded-2xl">
          <input
            type="checkbox"
            id="selectAll"
            checked={selectAll}
            onChange={handleSelectAll}
            className="w-5 h-5 text-pink-500 rounded focus:ring-pink-400"
          />
          <label htmlFor="selectAll" className="font-semibold text-gray-700">
            Select All Habits for Today
          </label>
        </div>

        {/* Habits List */}
        <div className="space-y-4">
          {habits.map((habit) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/40 rounded-2xl p-4 border border-white/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <input
                    type="checkbox"
                    checked={habit.isCompleted}
                    onChange={(e) => handleHabitToggle(habit.id, e.target.checked)}
                    className="w-5 h-5 text-pink-500 rounded focus:ring-pink-400"
                  />
                  <div className="flex-1">
                    <h4 className={`font-semibold ${habit.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {habit.name}
                    </h4>
                    <p className="text-sm text-gray-600">Time: {habit.time}</p>
                    <p className="text-sm text-gray-500">
                      Completed {habit.completedDates.length} times
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(habit)}
                    className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => deleteHabit(habit.id)}
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

      {/* Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Weekly Progress</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getProgressData()}>
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
                <Bar dataKey="percentage" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Individual Habit Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Habit Progress (30 Days)</h3>
          {habits.length > 0 ? (
            <div className="space-y-4">
              <select className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent">
                {habits.map(habit => (
                  <option key={habit.id} value={habit.id}>{habit.name}</option>
                ))}
              </select>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getHabitProgressData(habits[0]?.id)}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {getHabitProgressData(habits[0]?.id).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center">No habits added yet</p>
          )}
        </motion.div>
      </div>

      {/* Add/Edit Habit Dialog */}
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
              {editingHabit ? 'Edit Habit' : 'Add New Habit'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Habit Name</label>
                <input
                  type="text"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                  placeholder="Enter habit name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Time</label>
                <input
                  type="time"
                  value={newHabit.time}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddDialog(false);
                  setEditingHabit(null);
                  setNewHabit({ name: '', time: '09:00' });
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveHabit}
                className="flex-1 bg-gradient-to-r from-pink-400 to-rose-400 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Save Habit
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default SelfCareTracker;