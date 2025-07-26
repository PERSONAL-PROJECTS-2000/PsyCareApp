import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { DateTime } from 'luxon';
//import { LocaleSwitcher } from 'lingo.dev/react/client';

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

const Profile: React.FC = () => {
  const { user, profile, updateProfile, changePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState({
    name: profile?.name || '',
    date_of_birth: profile?.date_of_birth || '',
    country: profile?.country || '',
    language: profile?.language || 'English'
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const handleSaveProfile = async () => {
    setLoading(true);
    setError('');

    try {
      const timezone = countryTimezones[profileData.country] || 'UTC';
      await updateProfile({
        ...profileData,
        timezone
      });
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await changePassword(passwordData.newPassword);
      setPasswordData({ newPassword: '', confirmPassword: '' });
      setShowPasswordDialog(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentTime = () => {
    const timezone = profile?.timezone || 'UTC';
    return DateTime.now().setZone(timezone).toFormat('HH:mm:ss');
  };

  const getCurrentDate = () => {
    const timezone = profile?.timezone || 'UTC';
    return DateTime.now().setZone(timezone).toFormat('DDDD');
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Profile Settings</h3>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowPasswordDialog(true)}
              className="bg-gradient-to-r from-blue-400 to-indigo-400 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Change Password
            </button>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-pink-400 to-rose-400 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-400 to-emerald-400 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 text-red-600 text-sm bg-red-50 p-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Current Time & Date */}
        <div className="bg-white/40 rounded-2xl p-4 border border-white/30 mb-6">
          <h4 className="font-semibold text-gray-800 mb-2">Current Time & Date</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Local Time</label>
              <div className="text-2xl font-bold text-pink-600">{getCurrentTime()}</div>
            </div>
            <div>
              <label className="text-sm text-gray-600">Date</label>
              <div className="text-lg font-semibold text-gray-800">{getCurrentDate()}</div>
            </div>
          </div>
          {profile?.timezone && (
            <div className="mt-2 text-sm text-gray-500">
              Timezone: {profile.timezone}
            </div>
          )}
        </div>

                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                />
              ) : (
                <div className="bg-white/40 rounded-xl p-3 border border-white/30">
                  {profile?.name || 'Not set'}
                </div>
              )}

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
              <div className="bg-white/40 rounded-xl p-3 border border-white/30">
                {user?.email}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Date of Birth (Optional)</label>
              {isEditing ? (
                <input
                  type="date"
                  value={profileData.date_of_birth}
                  onChange={(e) => setProfileData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                />
              ) : (
                <div className="bg-white/40 rounded-xl p-3 border border-white/30">
                  {profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : 'Not set'}
                </div>
              )

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Country of Residence</label>}}}}}}}}}}
              {isEditing ? (
                <select
                  value={profileData.country}
                  onChange={(e) => setProfileData(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              ) : (
                <div className="bg-white/40 rounded-xl p-3 border border-white/30">
                  {profile?.country || 'Not set'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Language</label>
              {isEditing ? (
                <select
                  value={profileData.language}
                  onChange={(e) => setProfileData(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                >
                  {languages.map(language => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
              ) : (
                <div className="bg-white/40 rounded-xl p-3 border border-white/30">
                  {profile?.language || 'Not set'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Language Switcher</label>
              <div className="bg-white/40 rounded-xl p-3 border border-white/30">
                <LocaleSwitcher locales={["en", "es", "fr", "de", "zh", "ja", "ar", "hi", "pt", "ru", "it"]} />
              </div>
            </div>
      </motion.div>

      {/* Change Password Dialog */}
      {showPasswordDialog && (
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
            <h3 className="text-xl font-bold text-gray-800 mb-4">Change Password</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">
                  {error}
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowPasswordDialog(false);
                  setPasswordData({ newPassword: '', confirmPassword: '' });
                  setError('');
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={loading || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
                className="flex-1 bg-gradient-to-r from-pink-400 to-rose-400 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Profile;