import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const motivationalQuotes = [
  "Every day is a new beginning. Take a deep breath and start again.",
  "You are stronger than you think and more capable than you imagine.",
  "Progress, not perfection, is the goal. Every small step counts.",
  "Your mental health is just as important as your physical health.",
  "Be kind to yourself. You're doing the best you can.",
  "Healing is not linear. Be patient with your journey.",
  "You have survived 100% of your worst days. You're doing great.",
  "Self-care isn't selfish. It's essential for your well-being.",
  "Your feelings are valid, and it's okay to not be okay sometimes.",
  "You are worthy of love, happiness, and peace of mind."
];

const GreetingPage: React.FC = () => {
  const { profile, completeGreeting } = useAuth();
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // Select a random quote
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setQuote(randomQuote);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-rose-100 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 bg-clip-text text-transparent mb-4">
            {getGreeting()}, {profile?.name || 'Friend'}!
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed italic">
              "{quote}"
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
        >
          <button
            onClick={completeGreeting}
            className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Continue to PsyCare
          </button>
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 left-10 w-20 h-20 bg-pink-200/30 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-20 right-10 w-32 h-32 bg-rose-200/30 rounded-full blur-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default GreetingPage;