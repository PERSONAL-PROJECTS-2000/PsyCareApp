import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { Plus, Edit, Trash2, ExternalLink, Upload } from 'lucide-react';

const SelfHelpResources: React.FC = () => {
  const { resources, addResource, updateResource, deleteResource } = useData();
  const [activeTab, setActiveTab] = useState<'healthcare' | 'emergency' | 'music' | 'hobbies'>('healthcare');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingResource, setEditingResource] = useState<string | null>(null);
  const [newResource, setNewResource] = useState({
    title: '',
    type: 'link',
    content: ''
  });

  const handleSaveResource = () => {
    if (newResource.title.trim() && newResource.content.trim()) {
      if (editingResource) {
        updateResource(editingResource, { ...newResource, category: activeTab });
      } else {
        addResource({ ...newResource, category: activeTab });
      }
      
      setNewResource({ title: '', type: 'link', content: '' });
      setShowAddDialog(false);
      setEditingResource(null);
    }
  };

  const handleEdit = (resource: any) => {
    setNewResource({
      title: resource.title,
      type: resource.type,
      content: resource.content
    });
    setEditingResource(resource.id);
    setShowAddDialog(true);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Request storage permission if not already granted
      if ('permissions' in navigator) {
        try {
          const permission = await navigator.permissions.query({ name: 'persistent-storage' as PermissionName });
          if (permission.state !== 'granted') {
            // Request permission
            await (navigator as any).storage?.persist();
          }
        } catch (error) {
          console.log('Permission API not supported');
        }
      }

      // Create a URL for the file
      const fileUrl = URL.createObjectURL(file);
      setNewResource(prev => ({ ...prev, content: fileUrl }));
    }
  };

  const getResourcesByCategory = (category: string) => {
    return resources.filter(resource => resource.category === category);
  };

  const getTypeOptions = () => {
    if (activeTab === 'music') {
      return ['link', 'text', 'image', 'document'];
    }
    return ['link', 'text', 'image', 'document'];
  };

  const renderResource = (resource: any) => {
    const isLink = resource.type === 'link' && (resource.content.startsWith('http') || resource.content.startsWith('www'));
    
    return (
      <motion.div
        key={resource.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/40 rounded-2xl p-4 border border-white/30"
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800">{resource.title}</h4>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {resource.type}
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(resource)}
              className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => deleteResource(resource.id)}
              className="p-2 text-gray-600 hover:text-red-500 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        
        <div className="mt-2">
          {isLink ? (
            <a
              href={resource.content}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline flex items-center space-x-1"
            >
              <span>{resource.content}</span>
              <ExternalLink size={14} />
            </a>
          ) : (
            <p className="text-gray-700">{resource.content}</p>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20"
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Self Help Resources</h3>
          <div className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-2xl p-4 border border-pink-200">
            <p className="text-lg font-semibold text-pink-800">
              ALWAYS REMEMBER THAT YOU ARE IRREPLACEABLE AND A GEM OF CREATION.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          {[
            { key: 'healthcare', label: 'Healthcare Resources' },
            { key: 'emergency', label: 'Emergency Resources' },
            { key: 'music', label: 'Music' },
            { key: 'hobbies', label: 'Hobbies' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-3 px-4 rounded-xl font-semibold transition-all duration-300 text-sm ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg'
                  : 'bg-white/40 text-gray-600 hover:bg-white/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Add Resource Button */}
        <div className="mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddDialog(true)}
            className="bg-gradient-to-r from-green-400 to-emerald-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>{activeTab === 'music' ? 'Add Music' : 'Add Resource'}</span>
          </motion.button>
        </div>

        {/* Resources List */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {getResourcesByCategory(activeTab).map(renderResource)}
        </div>

        {/* Hobbies Section */}
        {activeTab === 'hobbies' && (
          <div className="mt-6 bg-white/40 rounded-2xl p-4 border border-white/30">
            <h4 className="font-semibold text-gray-800 mb-4">Weekly Hobby Schedule</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <div key={day} className="flex items-center space-x-3">
                  <span className="font-medium text-gray-700 w-20">{day}:</span>
                  <input
                    type="text"
                    placeholder="Add hobby"
                    className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Add/Edit Resource Dialog */}
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
              className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {editingResource ? 'Edit' : 'Add'} {activeTab === 'music' ? 'Music' : 'Resource'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
                  <input
                    type="text"
                    value={newResource.title}
                    onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                    placeholder="Enter title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Type</label>
                  <select
                    value={newResource.type}
                    onChange={(e) => setNewResource(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                  >
                    {getTypeOptions().map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Content</label>
                  {(newResource.type === 'audio' || newResource.type === 'video') && activeTab === 'music' ? (
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept={newResource.type === 'audio' ? 'audio/*' : 'video/*'}
                        onChange={handleFileUpload}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500">
                        Upload {newResource.type} files from your device
                      </p>
                    </div>
                  ) : (
                    <textarea
                      value={newResource.content}
                      onChange={(e) => setNewResource(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent h-24 resize-none"
                      placeholder={newResource.type === 'link' ? 'Enter URL' : 'Enter content'}
                    />
                  )}
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddDialog(false);
                    setEditingResource(null);
                    setNewResource({ title: '', type: 'link', content: '' });
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveResource}
                  className="flex-1 bg-gradient-to-r from-pink-400 to-rose-400 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SelfHelpResources;