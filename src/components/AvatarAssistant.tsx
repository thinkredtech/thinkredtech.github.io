import React, { useState, useEffect, useRef } from 'react';

const AvatarAssistant: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  // Calculate optimal bubble width based on message length and screen size
  const calculateBubbleWidth = (text: string, isExpandedContent: boolean = false) => {
    if (isExpandedContent) {
      // For expanded menu, use compact responsive sizes to minimize whitespace
      return 'w-56 sm:w-64 lg:w-72';
    }
    
    const baseCharWidth = 7.5; // More accurate character width in pixels
    const padding = 32; // Padding (p-4 = 16px * 2)
    const minWidth = 160; // Reduced minimum width for very short messages
    const estimatedWidth = text.length * baseCharWidth + padding;
    
    // More granular width calculation to minimize whitespace
    if (estimatedWidth <= 180) {
      return 'w-44 sm:w-48 lg:w-52'; // Very short messages (176px - 208px)
    } else if (estimatedWidth <= 220) {
      return 'w-52 sm:w-56 lg:w-60'; // Short messages (208px - 240px)
    } else if (estimatedWidth <= 260) {
      return 'w-60 sm:w-64 lg:w-72'; // Medium-short messages (240px - 288px)
    } else if (estimatedWidth <= 320) {
      return 'w-70 sm:w-80 lg:w-88'; // Medium messages (280px - 352px)
    } else if (estimatedWidth <= 400) {
      return 'w-80 sm:w-88 lg:w-96'; // Medium-long messages (320px - 384px)
    } else if (estimatedWidth <= 480) {
      return 'w-88 sm:w-96 lg:w-[28rem]'; // Long messages (352px - 448px)
    } else {
      return 'w-96 sm:w-[28rem] lg:w-[32rem]'; // Very long messages (384px - 512px)
    }
  };

  // Messages that the avatar can display
  const messages = [
    "Hello! I'm RED, your friendly ThinkRED assistant! 🤖",
    'I love helping visitors explore our amazing services! ✨',
    'Want to see our cool projects? Check out our portfolio! 🚀',
    'Need a custom solution? I can connect you with our team! 💡',
    'We make technology simple and delightful! 🎯',
    'Psst... Click on me for more options! 😊',
    'DevOps, web development, platforms - we do it all! 🛠️',
    "I'm powered by magical SVG and lots of creativity! 🎨",
  ];

  // Change message periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * messages.length);
      setMessage(messages[randomIndex]);
      setIsAnimating(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    }, 8000);

    // Set initial message
    setMessage(messages[0]);

    return () => {
      clearInterval(interval);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Handle scroll events to show/hide avatar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 1000) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle expanded state
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    setIsAnimating(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // Simplified Genie Avatar component
  const GenieAvatar = () => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <div 
        className={`w-full h-full relative overflow-hidden genie-container ${isAnimating ? 'excited' : ''} ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Magical smoke effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="smoke-particle absolute w-2 h-2 bg-blue-300 rounded-full opacity-60 animate-pulse"></div>
          <div className="smoke-particle absolute w-1 h-1 bg-purple-300 rounded-full opacity-40 animate-bounce"></div>
          <div className="smoke-particle absolute w-1.5 h-1.5 bg-pink-300 rounded-full opacity-50"></div>
        </div>
        
        {/* Main Avatar PNG */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/assets/images/assistant-reddy.png"
            alt="RED Assistant"
            className="w-full h-full object-contain avatar-image"
          />
        </div>
        
        {/* Sparkles around the avatar */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="sparkle absolute top-2 left-2 w-1 h-1 bg-yellow-400 rounded-full opacity-80 animate-pulse"></div>
            <div className="sparkle absolute top-4 right-3 w-1 h-1 bg-pink-400 rounded-full opacity-80 animate-bounce"></div>
            <div className="sparkle absolute bottom-3 left-3 w-1 h-1 bg-cyan-400 rounded-full opacity-80 animate-ping"></div>
            <div className="sparkle absolute bottom-2 right-2 w-1 h-1 bg-yellow-400 rounded-full opacity-80 animate-pulse"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 pointer-events-none">
      {isVisible && (
        <>
          {/* Message bubble */}
          {(message || isExpanded) && (
            <div 
              ref={messageRef}
              className={`absolute bottom-20 sm:bottom-24 right-0 bg-white/75 backdrop-blur-md shadow-xl rounded-2xl p-4 border-2 border-[#E4093E]/60 transition-all duration-300 pointer-events-auto ${calculateBubbleWidth(isExpanded ? 'Quick Actions menu' : message, isExpanded)} max-w-[calc(100vw-7rem)] ${isAnimating ? 'animate-pulse' : ''}`}
            >
              <div className="text-sm text-gray-800 font-medium">
                {isExpanded ? (
                  <div className="space-y-2">
                    <p className="font-semibold text-[#E4093E]">Quick Actions:</p>
                    <div className="grid grid-cols-1 gap-2">
                      <button className="text-left p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => window.location.href = '/contact'}>
                        📧 Contact Us
                      </button>
                      <button className="text-left p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => window.location.href = '/portfolio'}>
                        🚀 View Portfolio
                      </button>
                      <button className="text-left p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => window.location.href = '/services'}>
                        🛠️ Our Services
                      </button>
                      <button className="text-left p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setIsVisible(false)}>
                        👋 Hide Assistant
                      </button>
                    </div>
                  </div>
                ) : (
                  message
                )}
              </div>
              {/* Arrow pointing to avatar */}
              <div className="absolute -bottom-2 right-4 sm:right-6 w-4 h-4 bg-white/75 border-r-2 border-b-2 border-[#E4093E]/60 transform rotate-45 backdrop-blur-md"></div>
            </div>
          )}

          {/* Avatar - Fixed position */}
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 flex items-center justify-center pointer-events-auto ${isAnimating ? 'animate-bounce' : 'genie-float-animation'}`}
            onClick={toggleExpanded}
          >
            <div className="w-full h-full">
              <GenieAvatar />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AvatarAssistant;
