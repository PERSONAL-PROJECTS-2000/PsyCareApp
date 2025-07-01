import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const AIAssistant: React.FC = () => {
  const { user } = useAuth();
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the ElevenLabs widget script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    
    script.onload = () => {
      // Create the widget element after script loads
      if (widgetRef.current) {
        const widget = document.createElement('elevenlabs-convai');
        widget.setAttribute('agent-id', 'agent_01jz0m68a3fvwb0xvjsf7fsq09');
        
        // Set language based on user profile
        if (user?.language) {
          const languageMap: { [key: string]: string } = {
            'English': 'en',
            'Spanish': 'es',
            'French': 'fr',
            'German': 'de',
            'Chinese': 'zh',
            'Japanese': 'ja',
            'Arabic': 'ar',
            'Hindi': 'hi',
            'Portuguese': 'pt',
            'Russian': 'ru',
            'Italian': 'it'
          };
          
          const languageCode = languageMap[user.language] || 'en';
          widget.setAttribute('override-language', languageCode);
        }
        
        // Clear any existing widget and add the new one
        widgetRef.current.innerHTML = '';
        widgetRef.current.appendChild(widget);
      }
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [user?.language]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Friendly AI Assistant</h3>
        
        <div className="bg-white/40 rounded-2xl p-6 border border-white/30 min-h-[500px]">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Your Personal Mental Health Companion
            </h4>
            <p className="text-gray-600 text-sm">
              Chat with our AI assistant for support, guidance, and mindfulness tips. 
              Available 24/7 to help you on your wellness journey.
            </p>
          </div>

          {/* ElevenLabs Widget Container */}
          <div 
            ref={widgetRef}
            className="w-full h-full min-h-[400px] flex items-center justify-center"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              borderRadius: '16px'
            }}
          >
            <div className="text-center text-gray-500">
              <div className="animate-spin w-8 h-8 border-4 border-pink-200 border-t-pink-500 rounded-full mx-auto mb-4"></div>
              <p>Loading AI Assistant...</p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Available 24/7</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Voice & Text Chat</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Multilingual Support</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/30 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">💭</div>
            <h5 className="font-semibold text-gray-800 mb-1">Mental Health Support</h5>
            <p className="text-sm text-gray-600">Get guidance on managing stress, anxiety, and emotional well-being</p>
          </div>
          <div className="bg-white/30 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">🧘</div>
            <h5 className="font-semibold text-gray-800 mb-1">Mindfulness Tips</h5>
            <p className="text-sm text-gray-600">Learn meditation techniques and mindfulness practices</p>
          </div>
          <div className="bg-white/30 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">🎯</div>
            <h5 className="font-semibold text-gray-800 mb-1">Goal Setting</h5>
            <p className="text-sm text-gray-600">Get help setting and achieving your wellness goals</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AIAssistant;