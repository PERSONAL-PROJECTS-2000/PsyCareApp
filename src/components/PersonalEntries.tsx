import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { Calendar, Edit, Trash2, Plus, Bold, Italic, Underline, List } from 'lucide-react';

const PersonalEntries: React.FC = () => {
  const { 
    journalEntries, 
    positiveThoughts, 
    addJournalEntry, 
    updateJournalEntry, 
    deleteJournalEntry,
    addPositiveThought,
    updatePositiveThought,
    deletePositiveThought
  } = useData();
  
  const [activeTab, setActiveTab] = useState<'journal' | 'thoughts'>('journal');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState({ title: '', content: '' });

  const activeEntries = journalEntries.filter(entry => !entry.is_deleted);
  const activeThoughts = positiveThoughts.filter(thought => !thought.is_deleted);

  const formatText = (command: string) => {
    document.execCommand(command, false);
  };

  const handleSaveEntry = () => {
    if (newEntry.title.trim() && newEntry.content.trim()) {
      const today = new Date().toISOString().split('T')[0];
      
      if (activeTab === 'journal') {
        if (editingEntry) {
          updateJournalEntry(editingEntry, newEntry);
        } else {
          addJournalEntry({ ...newEntry, date: today });
        }
      } else {
        if (editingEntry) {
          updatePositiveThought(editingEntry, newEntry);
        } else {
          addPositiveThought({ ...newEntry, date: today });
        }
      }
      
      setNewEntry({ title: '', content: '' });
      setShowCreateDialog(false);
      setEditingEntry(null);
    }
  };

  const handleEdit = (entry: any) => {
    setNewEntry({ title: entry.title, content: entry.content });
    setEditingEntry(entry.id);
    setShowCreateDialog(true);
  };

  const handleDelete = (id: string) => {
    if (activeTab === 'journal') {
      deleteJournalEntry(id);
    } else {
      deletePositiveThought(id);
    }
  };

  const getEntriesWithDates = () => {
    const entries = activeTab === 'journal' ? activeEntries : activeThoughts;
    const dates = [...new Set(entries.map(entry => entry.date))];
    return dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  };

  const getEntriesForDate = (date: string) => {
    const entries = activeTab === 'journal' ? activeEntries : activeThoughts;
    return entries.filter(entry => entry.date === date);
  };

  const renderCalendar = () => {
    const datesWithEntries = getEntriesWithDates();
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const hasEntries = datesWithEntries.includes(date);
      
      days.push(
        <button
          key={day}
          onClick={() => hasEntries && setShowCalendar(false)}
          className={`p-2 text-center rounded-lg transition-colors ${
            hasEntries 
              ? 'bg-pink-200 text-pink-800 hover:bg-pink-300 cursor-pointer' 
              : 'text-gray-400 cursor-default'
          }`}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="bg-white rounded-2xl p-4">
        <div className="text-center font-semibold text-gray-800 mb-4">
          {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-600 mb-2">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Personal Entries</h3>
        
        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('journal')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'journal'
                ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg'
                : 'bg-white/40 text-gray-600 hover:bg-white/60'
            }`}
          >
            Daily Journal
          </button>
          <button
            onClick={() => setActiveTab('thoughts')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'thoughts'
                ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg'
                : 'bg-white/40 text-gray-600 hover:bg-white/60'
            }`}
          >
            Daily Positive Thoughts
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateDialog(true)}
            className="flex-1 bg-gradient-to-r from-green-400 to-emerald-400 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Plus size={20} />
            <span>Create {activeTab === 'journal' ? 'Journal Entry' : 'Positive Thought'}</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCalendar(true)}
            className="bg-gradient-to-r from-blue-400 to-indigo-400 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
          >
            <Calendar size={20} />
            <span>View Entry Calendar</span>
          </motion.button>
        </div>

        {/* Entries List */}
        <div className="space-y-4">
          {(activeTab === 'journal' ? activeEntries : activeThoughts).map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/40 rounded-2xl p-4 border border-white/30"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-800">{entry.title}</h4>
                  <p className="text-sm text-gray-500">{new Date(entry.date).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div 
                className="text-gray-700 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: entry.content }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Create/Edit Dialog */}
      <AnimatePresence>
        {showCreateDialog && (
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
              className="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {editingEntry ? 'Edit' : 'Create'} {activeTab === 'journal' ? 'Journal Entry' : 'Positive Thought'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
                  <input
                    type="text"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                    placeholder="Enter title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Content</label>
                  
                  {/* Formatting Toolbar */}
                  <div className="flex space-x-2 mb-2 p-2 bg-gray-50 rounded-lg">
                    <button
                      onClick={() => formatText('bold')}
                      className="p-2 hover:bg-gray-200 rounded transition-colors"
                      title="Bold"
                    >
                      <Bold size={16} />
                    </button>
                    <button
                      onClick={() => formatText('italic')}
                      className="p-2 hover:bg-gray-200 rounded transition-colors"
                      title="Italic"
                    >
                      <Italic size={16} />
                    </button>
                    <button
                      onClick={() => formatText('underline')}
                      className="p-2 hover:bg-gray-200 rounded transition-colors"
                      title="Underline"
                    >
                      <Underline size={16} />
                    </button>
                    <button
                      onClick={() => formatText('insertUnorderedList')}
                      className="p-2 hover:bg-gray-200 rounded transition-colors"
                      title="Bullet List"
                    >
                      <List size={16} />
                    </button>
                  </div>

                  <div
                    contentEditable
                    className="w-full min-h-[200px] p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent prose prose-sm max-w-none"
                    style={{ outline: 'none' }}
                    dangerouslySetInnerHTML={{ __html: newEntry.content }}
                    onInput={(e) => {
                      const target = e.target as HTMLDivElement;
                      setNewEntry(prev => ({ ...prev, content: target.innerHTML }));
                    }}
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateDialog(false);
                    setEditingEntry(null);
                    setNewEntry({ title: '', content: '' });
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEntry}
                  className="flex-1 bg-gradient-to-r from-pink-400 to-rose-400 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendar Dialog */}
      <AnimatePresence>
        {showCalendar && (
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
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                {activeTab === 'journal' ? 'Journal' : 'Thoughts'} Calendar
              </h3>
              
              {renderCalendar()}

              <button
                onClick={() => setShowCalendar(false)}
                className="w-full mt-4 bg-gradient-to-r from-pink-400 to-rose-400 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PersonalEntries;