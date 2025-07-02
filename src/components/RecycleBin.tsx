import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { RotateCcw, Trash2, Calendar } from 'lucide-react';

const RecycleBin: React.FC = () => {
  const { 
    getDeletedEntries, 
    restoreJournalEntry, 
    restorePositiveThought, 
    emptyRecycleBin,
    journalEntries
  } = useData();

  const deletedEntries = getDeletedEntries();

  const handleRestore = (entry: any) => {
    if ('content' in entry && journalEntries.find(j => j.id === entry.id)) {
      restoreJournalEntry(entry.id);
    } else {
      restorePositiveThought(entry.id);
    }
  };

  const handlePermanentDelete = (entry: any) => {
    // This would permanently delete the entry
    console.log('Permanently delete:', entry.id);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Recycle Bin</h3>
          {deletedEntries.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={emptyRecycleBin}
              className="bg-gradient-to-r from-red-400 to-red-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
            >
              <Trash2 size={20} />
              <span>Empty Recycle Bin</span>
            </motion.button>
          )}
        </div>

        {deletedEntries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🗑️</div>
            <h4 className="text-xl font-semibold text-gray-600 mb-2">Recycle Bin is Empty</h4>
            <p className="text-gray-500">Deleted entries will appear here and be automatically removed after 30 days.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {deletedEntries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/40 rounded-2xl p-4 border border-white/30"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-800">{entry.title}</h4>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                        {'content' in entry && journalEntries.find(j => j.id === entry.id) ? 'Journal' : 'Thought'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>Created: {new Date(entry.date).toLocaleDateString()}</span>
                      </div>
                      {entry.deleted_date && (
                        <div className="flex items-center space-x-1">
                          <Trash2 size={14} />
                          <span>Deleted: {new Date(entry.deleted_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleRestore(entry)}
                      className="p-2 text-gray-600 hover:text-green-500 transition-colors"
                      title="Restore"
                    >
                      <RotateCcw size={16} />
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(entry)}
                      className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                      title="Delete Permanently"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="text-gray-600 text-sm bg-gray-50 rounded-lg p-3 mt-2">
                  <div 
                    className="prose prose-sm max-w-none line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: entry.content }}
                  />
                </div>
                
                <div className="mt-3 text-xs text-gray-500">
                  Items in recycle bin are automatically deleted after 30 days
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RecycleBin;