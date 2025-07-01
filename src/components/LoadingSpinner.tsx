import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-rose-100 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full mx-auto mb-4"
        />
        <h2 className="text-xl font-semibold text-gray-700">Loading PsyCare...</h2>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;