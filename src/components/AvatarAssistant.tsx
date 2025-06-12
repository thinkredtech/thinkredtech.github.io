import React, { useState, useEffect, useRef, useMemo } from 'react';

const AvatarAssistant: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isSleeping, setIsSleeping] = useState(false); // Track if user manually hid the assistant
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [animationType, setAnimationType] = useState<
    'pulse' | 'wiggle' | 'bounce' | 'enhanced' | 'heartbeat'
  >('pulse');
  const [isBreathingEnhanced, setIsBreathingEnhanced] = useState(false);
  const [attentionSeekingActive, setAttentionSeekingActive] = useState(false);
  const [avatarAnimationState, setAvatarAnimationState] = useState<
    'floating' | 'attention' | 'excited' | 'bouncing'
  >('floating');
  const [showContextualOptions, setShowContextualOptions] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  // Calculate optimal bubble width based on message length and screen size
  const calculateBubbleWidth = (
    text: string,
    isExpandedContent: boolean = false
  ) => {
    if (isExpandedContent) {
      // For expanded menu with enhanced layout, use wider responsive sizes
      return 'w-80 sm:w-96 lg:w-[26rem]';
    }

    const baseCharWidth = 7.5; // More accurate character width in pixels
    const padding = 32; // Padding (p-4 = 16px * 2)
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
  const messages = useMemo(
    () => [
      "Hello! I'm RED, your friendly ThinkRED assistant! 🤖",
      'I love helping visitors explore our amazing services! ✨',
      'Want to see our cool projects? Check out our portfolio! 🚀',
      'Need a custom solution? I can connect you with our team! 💡',
      'We make technology simple and delightful! 🎯',
      'Psst... Click on me for more options! 😊',
      'DevOps, web development, platforms - we do it all! 🛠️',
      'I respond to your interactions with my lively emotions! ✨',
    ],
    []
  );

  // Change message periodically with enhanced animations
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * messages.length);
      setMessage(messages[randomIndex]);
      setIsAnimating(true);

      // Enhanced animation variety with more options
      const animations: (
        | 'pulse'
        | 'wiggle'
        | 'bounce'
        | 'enhanced'
        | 'heartbeat'
      )[] = ['pulse', 'wiggle', 'bounce', 'enhanced', 'heartbeat'];
      const randomAnimation =
        animations[Math.floor(Math.random() * animations.length)];
      setAnimationType(randomAnimation);

      // Set avatar state to excited during message changes
      setAvatarAnimationState('excited');

      // Randomly toggle enhanced breathing for more variety
      setIsBreathingEnhanced(Math.random() > 0.6);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
        setAnimationType('pulse'); // Return to default after animation
        setAvatarAnimationState('floating'); // Return avatar to floating
      }, 800);
    }, 8000);

    // Set initial message
    setMessage(messages[0]);

    return () => {
      clearInterval(interval);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [messages]);

  // Handle scroll events to show/hide avatar
  useEffect(() => {
    const handleScroll = () => {
      if (isSleeping) {
        // Don't auto-show/hide when user has put assistant to sleep
        return;
      }

      const scrollPosition = window.scrollY;
      if (scrollPosition > 1000) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSleeping]);

  // Add attention-seeking behavior
  useEffect(() => {
    const attentionInterval = setInterval(() => {
      // Randomly trigger attention-seeking behavior (10% chance every 15 seconds)
      if (Math.random() < 0.1 && isVisible && !isExpanded && !isAnimating) {
        setAttentionSeekingActive(true);
        setAvatarAnimationState('attention');
        setTimeout(() => {
          setAttentionSeekingActive(false);
          setAvatarAnimationState('floating');
        }, 1200);
      }
    }, 15000);

    return () => clearInterval(attentionInterval);
  }, [isVisible, isExpanded, isAnimating]);

  // Toggle expanded state
  const toggleExpanded = () => {
    if (showContextualOptions) {
      // If contextual options are showing, close them first
      setShowContextualOptions(false);
      return;
    }

    setIsExpanded(!isExpanded);
    setIsAnimating(true);

    // Use enhanced animations for user interactions
    const interactionAnimations = ['wiggle', 'enhanced', 'heartbeat'];
    const randomInteractionAnim =
      interactionAnimations[
        Math.floor(Math.random() * interactionAnimations.length)
      ];
    setAnimationType(
      randomInteractionAnim as
        | 'pulse'
        | 'wiggle'
        | 'bounce'
        | 'enhanced'
        | 'heartbeat'
    );

    // Set avatar to bouncing state for user interactions
    setAvatarAnimationState('bouncing');

    // Reset attention seeking when user interacts
    setAttentionSeekingActive(false);
    setShowContextualOptions(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
      setAnimationType('pulse'); // Return to default after interaction
      setAvatarAnimationState('floating'); // Return avatar to floating
    }, 800);
  };

  // Function to get synchronized bubble animation class
  const getSyncedBubbleAnimation = () => {
    if (isAnimating) {
      // During active animations, use enhanced specific animations
      if (animationType === 'wiggle' || animationType === 'enhanced') {
        return 'bubble-sync-wiggle';
      } else if (animationType === 'bounce') {
        return 'bubble-sync-bounce';
      } else if (animationType === 'heartbeat') {
        return 'bubble-heartbeat';
      } else {
        return 'bubble-content-pulse';
      }
    } else if (attentionSeekingActive) {
      // During attention seeking, sync with gentle bounce
      return 'bubble-sync-attention bubble-attention-seeking';
    } else if (avatarAnimationState === 'floating') {
      // During normal floating, sync with genie float
      return isBreathingEnhanced
        ? 'bubble-sync-genie-float message-bubble-enhanced-breathing'
        : 'bubble-sync-genie-float message-bubble-breathing';
    } else {
      // Fallback to breathing
      return 'message-bubble-breathing';
    }
  };

  // Function to get contextual options based on current message
  const getContextualOptions = (currentMessage: string) => {
    if (currentMessage.includes('services')) {
      return [
        {
          label: 'View All Services',
          action: () => (window.location.href = '/services'),
          icon: '🛠️',
        },
        {
          label: 'DevOps Solutions',
          action: () => (window.location.href = '/services#devops'),
          icon: '⚙️',
        },
        {
          label: 'Web Development',
          action: () => (window.location.href = '/services#web'),
          icon: '💻',
        },
      ];
    } else if (
      currentMessage.includes('portfolio') ||
      currentMessage.includes('projects')
    ) {
      return [
        {
          label: 'View Portfolio',
          action: () => (window.location.href = '/portfolio'),
          icon: '🚀',
        },
        {
          label: 'Case Studies',
          action: () => (window.location.href = '/portfolio#case-studies'),
          icon: '📊',
        },
        {
          label: 'Client Reviews',
          action: () => (window.location.href = '/portfolio#reviews'),
          icon: '⭐',
        },
      ];
    } else if (
      currentMessage.includes('team') ||
      currentMessage.includes('custom solution')
    ) {
      return [
        {
          label: 'Contact Us',
          action: () => (window.location.href = '/contact'),
          icon: '📧',
        },
        {
          label: 'Schedule Call',
          action: () => (window.location.href = '/contact#schedule'),
          icon: '📞',
        },
        {
          label: 'About Our Team',
          action: () => (window.location.href = '/about'),
          icon: '👥',
        },
      ];
    } else if (
      currentMessage.includes('technology') ||
      currentMessage.includes('delightful')
    ) {
      return [
        {
          label: 'Our Approach',
          action: () => (window.location.href = '/about#approach'),
          icon: '🎯',
        },
        {
          label: 'Technologies',
          action: () => (window.location.href = '/services#tech-stack'),
          icon: '⚡',
        },
        {
          label: 'Learn More',
          action: () => (window.location.href = '/about'),
          icon: '📚',
        },
      ];
    } else if (
      currentMessage.includes('DevOps') ||
      currentMessage.includes('platforms')
    ) {
      return [
        {
          label: 'DevOps Services',
          action: () => (window.location.href = '/services#devops'),
          icon: '🛠️',
        },
        {
          label: 'Platform Solutions',
          action: () => (window.location.href = '/services#platforms'),
          icon: '🏗️',
        },
        {
          label: 'Get Quote',
          action: () => (window.location.href = '/contact#quote'),
          icon: '💰',
        },
      ];
    } else if (
      currentMessage.includes('animations') ||
      currentMessage.includes('interactions')
    ) {
      return [
        {
          label: 'See More Animations',
          action: () => setIsAnimating(true),
          icon: '✨',
        },
        {
          label: 'Toggle Enhanced Mode',
          action: () => setIsBreathingEnhanced(!isBreathingEnhanced),
          icon: '🎭',
        },
        {
          label: 'Put Assistant to Sleep',
          action: putAssistantToSleep,
          icon: '😴',
        },
      ];
    } else {
      // Default options for greeting and general messages
      return [
        {
          label: 'View Services',
          action: () => (window.location.href = '/services'),
          icon: '🛠️',
        },
        {
          label: 'See Portfolio',
          action: () => (window.location.href = '/portfolio'),
          icon: '🚀',
        },
        {
          label: 'Contact Us',
          action: () => (window.location.href = '/contact'),
          icon: '📧',
        },
      ];
    }
  };

  // Handle message bubble click
  const handleMessageBubbleClick = () => {
    if (!isExpanded) {
      setShowContextualOptions(true);
      setIsAnimating(true);
      setAnimationType('enhanced');
      setAvatarAnimationState('excited');

      setTimeout(() => {
        setIsAnimating(false);
        setAnimationType('pulse');
        setAvatarAnimationState('floating');
      }, 800);
    }
  };

  // Put assistant to sleep (user-initiated hide)
  const putAssistantToSleep = () => {
    setIsSleeping(true);
    setIsVisible(false);
    setIsExpanded(false);
    setShowContextualOptions(false);
  };

  // Wake up assistant (user-initiated show)
  const wakeUpAssistant = () => {
    setIsSleeping(false);
    setIsVisible(true);
    setIsAnimating(true);
    setAnimationType('bounce');
    setAvatarAnimationState('excited');

    setTimeout(() => {
      setIsAnimating(false);
      setAnimationType('pulse');
      setAvatarAnimationState('floating');
    }, 1000);
  };

  // Simplified Genie Avatar component
  const GenieAvatar = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        className={`w-full h-full relative overflow-hidden genie-container ${
          avatarAnimationState === 'excited' || isAnimating ? 'excited' : ''
        } ${isHovered ? 'hovered' : ''}`}
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
      {isSleeping ? (
        /* Sleeping Avatar - show when assistant is put to sleep by user */
        <div
          className="w-12 h-12 sm:w-14 sm:h-14 cursor-pointer hover:scale-110 transition-all duration-300 pointer-events-auto opacity-60 hover:opacity-80"
          onClick={wakeUpAssistant}
          title="Click to wake up your assistant"
        >
          <img
            src="/assets/images/assistant-reddy-sleeping.png"
            alt="Sleeping Assistant"
            className="w-full h-full object-contain animate-pulse"
          />
        </div>
      ) : (
        isVisible && (
          <>
            {/* Message bubble */}
            {(message || isExpanded || showContextualOptions) && (
              <div
                ref={messageRef}
                className={`absolute bottom-20 sm:bottom-24 right-0 bg-white/75 backdrop-blur-md shadow-xl rounded-2xl p-4 border-2 border-[#E4093E]/60 pointer-events-auto message-bubble-stable ${calculateBubbleWidth(isExpanded ? 'Quick Actions menu' : showContextualOptions ? 'Contextual options' : message, isExpanded || showContextualOptions)} max-w-[calc(100vw-7rem)] ${getSyncedBubbleAnimation()} ${!isVisible ? 'hidden' : 'visible'} ${!isExpanded && !showContextualOptions ? 'cursor-pointer hover:scale-105' : ''}`}
                onClick={
                  !isExpanded && !showContextualOptions
                    ? handleMessageBubbleClick
                    : undefined
                }
              >
                <div className="text-sm text-gray-800 font-medium">
                  {isExpanded ? (
                    <div className="space-y-4">
                      {/* Header with icon and title */}
                      <div className="flex items-center gap-3 pb-3 border-b border-gray-200/60">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#E4093E] to-[#B8072E] rounded-full flex items-center justify-center animate-pulse">
                          <span className="text-white text-lg">⚡</span>
                        </div>
                        <div>
                          <p className="font-bold text-[#E4093E] text-base">
                            Quick Actions
                          </p>
                          <p className="text-xs text-gray-500 font-normal">
                            Choose what you'd like to do
                          </p>
                        </div>
                      </div>

                      {/* Action cards grid */}
                      <div className="grid grid-cols-1 gap-3">
                        <button
                          className="group relative overflow-hidden p-4 bg-gradient-to-br from-red-50 to-red-100/50 hover:from-red-100 hover:to-red-200/60 rounded-xl border border-red-200/60 hover:border-red-300/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                          onClick={() => (window.location.href = '/contact')}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white text-lg group-hover:scale-110 transition-transform duration-200">
                              📧
                            </div>
                            <div className="text-left flex-1">
                              <p className="font-semibold text-red-700 group-hover:text-red-800">
                                Contact Us
                              </p>
                              <p className="text-xs text-red-600/80 font-normal">
                                Get in touch with our team
                              </p>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <svg
                                className="w-4 h-4 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </div>
                        </button>

                        <button
                          className="group relative overflow-hidden p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-200/60 rounded-xl border border-blue-200/60 hover:border-blue-300/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                          onClick={() => (window.location.href = '/portfolio')}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-lg group-hover:scale-110 transition-transform duration-200">
                              🚀
                            </div>
                            <div className="text-left flex-1">
                              <p className="font-semibold text-blue-700 group-hover:text-blue-800">
                                View Portfolio
                              </p>
                              <p className="text-xs text-blue-600/80 font-normal">
                                See our amazing projects
                              </p>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <svg
                                className="w-4 h-4 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </div>
                        </button>

                        <button
                          className="group relative overflow-hidden p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 hover:from-purple-100 hover:to-purple-200/60 rounded-xl border border-purple-200/60 hover:border-purple-300/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                          onClick={() => (window.location.href = '/services')}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-lg group-hover:scale-110 transition-transform duration-200">
                              🛠️
                            </div>
                            <div className="text-left flex-1">
                              <p className="font-semibold text-purple-700 group-hover:text-purple-800">
                                Our Services
                              </p>
                              <p className="text-xs text-purple-600/80 font-normal">
                                Discover what we offer
                              </p>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <svg
                                className="w-4 h-4 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </div>
                        </button>

                        <button
                          className="group relative overflow-hidden p-3 bg-gradient-to-br from-gray-50 to-gray-100/50 hover:from-gray-100 hover:to-gray-200/60 rounded-xl border border-gray-200/60 hover:border-gray-300/80 transition-all duration-300 hover:scale-[1.02]"
                          onClick={putAssistantToSleep}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center text-white text-sm group-hover:scale-110 transition-transform duration-200">
                              😴
                            </div>
                            <div className="text-left flex-1">
                              <p className="font-medium text-gray-600 group-hover:text-gray-700 text-sm">
                                Put Assistant to Sleep
                              </p>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <svg
                                className="w-3 h-3 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  ) : showContextualOptions ? (
                    <div className="space-y-4">
                      {/* Header for contextual options */}
                      <div className="flex items-center gap-3 pb-3 border-b border-gray-200/60">
                        <div className="w-7 h-7 bg-gradient-to-br from-[#E4093E] to-[#B8072E] rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">💡</span>
                        </div>
                        <div>
                          <p className="font-bold text-[#E4093E] text-base">
                            Quick Actions
                          </p>
                          <p className="text-xs text-gray-500 font-normal">
                            Based on "
                            {message.length > 30
                              ? `${message.substring(0, 30)}...`
                              : message}
                            "
                          </p>
                        </div>
                      </div>

                      {/* Contextual action cards */}
                      <div className="grid grid-cols-1 gap-3">
                        {getContextualOptions(message).map((option, index) => (
                          <button
                            key={index}
                            className="group relative overflow-hidden p-3 bg-gradient-to-br from-[#E4093E]/5 to-[#E4093E]/10 hover:from-[#E4093E]/10 hover:to-[#E4093E]/20 rounded-xl border border-[#E4093E]/20 hover:border-[#E4093E]/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                            onClick={() => {
                              option.action();
                              setShowContextualOptions(false);
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-[#E4093E] to-[#B8072E] rounded-lg flex items-center justify-center text-white text-sm group-hover:scale-110 transition-transform duration-200">
                                {option.icon}
                              </div>
                              <div className="text-left flex-1">
                                <p className="font-medium text-gray-700 group-hover:text-gray-800 text-sm">
                                  {option.label}
                                </p>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <svg
                                  className="w-3 h-3 text-[#E4093E]"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </div>
                            </div>
                          </button>
                        ))}

                        {/* Back button */}
                        <button
                          className="group relative overflow-hidden p-2 bg-gradient-to-br from-gray-50 to-gray-100/50 hover:from-gray-100 hover:to-gray-200/60 rounded-xl border border-gray-200/60 hover:border-gray-300/80 transition-all duration-300 hover:scale-[1.02]"
                          onClick={() => setShowContextualOptions(false)}
                        >
                          <div className="flex items-center gap-2 justify-center">
                            <svg
                              className="w-4 h-4 text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                              />
                            </svg>
                            <span className="font-medium text-gray-600 text-sm">
                              Back to message
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <p className="text-gray-800 leading-relaxed font-medium text-sm mb-2">
                        {message}
                      </p>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200/50">
                        <div className="flex items-center gap-1 text-xs text-[#E4093E]/80 font-medium">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                            />
                          </svg>
                          <span>Click for options</span>
                        </div>
                        <div className="w-1 h-1 bg-[#E4093E]/60 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Arrow pointing to avatar */}
                <div className="absolute -bottom-2 right-4 sm:right-6 w-4 h-4 bg-white/75 border-r-2 border-b-2 border-[#E4093E]/60 transform rotate-45 backdrop-blur-md"></div>
              </div>
            )}

            {/* Avatar - Fixed position without round backdrop */}
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 cursor-pointer hover:scale-105 transition-all duration-300 flex items-center justify-center pointer-events-auto ${
                avatarAnimationState === 'bouncing' ||
                (isAnimating &&
                  (animationType === 'bounce' || animationType === 'enhanced'))
                  ? 'animate-bounce'
                  : avatarAnimationState === 'attention' ||
                      attentionSeekingActive
                    ? 'show-assistant-float'
                    : 'genie-float-animation'
              }`}
              onClick={toggleExpanded}
            >
              <div className="w-full h-full">
                <GenieAvatar />
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
};

export default AvatarAssistant;
