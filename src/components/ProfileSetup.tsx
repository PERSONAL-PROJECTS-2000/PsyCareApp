import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
//import { DateTime } from 'luxon';

const countries = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 
  'France', 'Spain', 'Italy', 'Japan', 'China', 'India', 'Brazil'
];

const languages = [
  'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 
  'Arabic', 'Hindi', 'Portuguese', 'Russian', 'Italian'
];

const countryTimezones: { [key: string]: string } = {
  'United States': 'America/New_York',
  'Canada': 'America/Toronto',
  'United Kingdom': 'Europe/London',
  'Australia': 'Australia/Sydney',
  'Germany': 'Europe/Berlin',
  'France': 'Europe/Paris',
  'Spain': 'Europe/Madrid',
  'Italy': 'Europe/Rome',
  'Japan': 'Asia/Tokyo',
  'China': 'Asia/Shanghai',
  'India': 'Asia/Kolkata',
  'Brazil': 'America/Sao_Paulo'
};

const ProfileSetup: React.FC = () => {
  const { updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState({
    name: '',
    date_of_birth: '',
    country: '',
    language: 'English'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const timezone = countryTimezones[profileData.country] || 'UTC';
      await updateProfile({
        ...profileData,
        timezone
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-rose-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 bg-clip-text text-transparent mb-2">
            Create Your Profile
          </h1>
          <p className="text-gray-600">Tell us a bit about yourself</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Name
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Date of Birth (Optional)
            </label>
            <input
              type="date"
              value={profileData.date_of_birth}
              onChange={(e) => setProfileData(prev => ({ ...prev, date_of_birth: e.target.value }))}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Country of Residence
            </label>
            <select
              value={profileData.country}
              onChange={(e) => setProfileData(prev => ({ ...prev, country: e.target.value }))}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent"
              required
            >
              <option value="">Select Country</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Language
            </label>
            <select
              value={profileData.language}
              onChange={(e) => setProfileData(prev => ({ ...prev, language: e.target.value }))}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent"
              required
            >
              {languages.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-xl">
              {error}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-400 to-rose-400 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Creating Profile...' : 'Complete Profile'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ProfileSetup;