import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ContactIcon,
  PortfolioIcon,
  BlogIcon,
  CareerIcon,
  AboutIcon,
  WebDevIcon,
  AIIcon,
  PlatformIcon,
  DevOpsIcon,
  TechIcon,
  StarIcon,
  ChartIcon,
  RocketIcon,
  ArticleIcon,
  InsightIcon,
  QuoteIcon,
  TargetIcon,
  LearnIcon,
  BuildIcon,
  SparkleIcon,
  TheaterIcon,
  SleepIcon,
} from './SvgIcons';

// Message Duration Constants - Centralized timing configuration
const MESSAGE_TIMINGS = {
  // Main message cycling
  MAIN_CYCLE_INTERVAL: 15000, // 15 seconds - increased slightly for better pacing
  MAIN_ANIMATION_DURATION: 1000, // 1 second for avatar excitement

  // Message change animations
  COMIC_ANIMATION_TOTAL: 960, // Shrink + delay + grow
  SUBTLE_ANIMATION_TOTAL: 810, // Shorter for subtle changes

  // Special messages - standardized durations
  ENGAGEMENT_DURATION: 2500, // 2.5 seconds for engagement messages
  ATTENTION_SEEKING_DURATION: 2000, // 2 seconds for attention-seeking
  IDLE_ENCOURAGEMENT_DURATION: 3000, // 3 seconds for idle messages
  PAGE_WELCOME_DURATION: 2500, // 2.5 seconds for page welcomes

  // Interaction feedback
  USER_INTERACTION_DURATION: 800, // User click feedback
  HOVER_RESUME_DELAY: 1000, // Delay before resuming after hover

  // Intervals for different behaviors
  ATTENTION_SEEKING_INTERVAL: 25000, // 25 seconds - increased to avoid overlap
  IDLE_CHECK_INTERVAL: 10000, // Check idle status every 10 seconds
  IDLE_NUDGE_THRESHOLD: 45000, // 45 seconds for new users (increased)
  IDLE_ENCOURAGEMENT_THRESHOLD: 120000, // 2 minutes for active users

  // Sleep/wake transitions
  SLEEP_TRANSITION_DURATION: 400, // Sleep animation duration
  WAKE_TRANSITION_DURATION: 390, // Wake animation duration (slightly before completion)
  WAKE_RESET_DELAY: 2000, // Delay before resetting wake up flag

  // Demo animations
  DEMO_ANIMATION_STEP: 500, // Time between demo animation steps
} as const;

const AvatarAssistant = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [isSleeping, setIsSleeping] = useState(false); // Track if assistant is sleeping
  const [isManualSleep, setIsManualSleep] = useState(false); // Track if user manually put assistant to sleep
  const [isGoingToSleep, setIsGoingToSleep] = useState(false); // Track transition to sleep state
  const [isWakingUp, setIsWakingUp] = useState(false); // Track transition from sleep to awake
  const [justWokeUp, setJustWokeUp] = useState(false); // Track if just completed wake up to skip fade-in
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [animationType, setAnimationType] = useState<
    'pulse' | 'wiggle' | 'bounce' | 'enhanced' | 'heartbeat'
  >('pulse');
  const [isBreathingEnhanced, setIsBreathingEnhanced] = useState(false);
  const [attentionSeekingActive, setAttentionSeekingActive] = useState(false);
  const [avatarAnimationState, setAvatarAnimationState] = useState<
    | 'floating'
    | 'attention'
    | 'excited'
    | 'bouncing'
    | 'anticipating'
    | 'excited-pop'
    | 'excited-bounce'
    | 'excited-wiggle'
    | 'excited-zoom'
    | 'excited-explode'
  >('floating');
  const [showContextualOptions, setShowContextualOptions] = useState(false);
  const [isMessageHovered, setIsMessageHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [messageAnimation, setMessageAnimation] = useState<
    | 'pop-in'
    | 'bounce-in'
    | 'typewriter'
    | 'explode-in'
    | 'flip-in'
    | 'zoom-in'
    | 'wobble-in'
    | 'shrink'
    | 'grow-pop'
    | 'grow-bounce'
    | 'grow-wiggle'
    | 'grow-zoom'
    | 'grow-explode'
    | 'grow-subtle'
    | 'none'
  >('none');
  const [isMessageChanging, setIsMessageChanging] = useState(false);
  const [userInteractionCount, setUserInteractionCount] = useState(0);
  const [lastInteractionTime, setLastInteractionTime] = useState<number>(0);
  const [pageVisitCount, setPageVisitCount] = useState(0);
  const [hasShownSpecialMessage, setHasShownSpecialMessage] = useState(false);
  const [sleepScrollDistance] = useState(() => {
    // Generate random distance between 2000px and 4000px
    return Math.floor(Math.random() * (4000 - 2000 + 1)) + 2000;
  });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const hasBeenRenderedRef = useRef(false); // Track if avatar has been shown before

  // Function to change message with shrink-then-grow animation
  const changeMessageWithAnimation = useCallback(
    (newMessage: string) => {
      if (newMessage === message || isMessageChanging) return; // Prevent rapid changes

      // Clear any existing timeouts to prevent conflicts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Use shrink-grow animations 70% of the time for more noticeable changes
      const useComicAnimation = Math.random() < 0.7;

      if (useComicAnimation) {
        // Choose a random grow animation style
        const growAnimations: (
          | 'grow-pop'
          | 'grow-bounce'
          | 'grow-wiggle'
          | 'grow-zoom'
          | 'grow-explode'
        )[] = [
          'grow-pop',
          'grow-bounce',
          'grow-wiggle',
          'grow-zoom',
          'grow-explode',
        ];
        const randomGrowAnimation =
          growAnimations[Math.floor(Math.random() * growAnimations.length)];

        // Phase 1: Start shrinking
        setIsMessageChanging(true);
        setMessageAnimation('shrink');

        // Add subtle avatar anticipation during shrink
        setIsAnimating(true);
        setAnimationType('pulse');
        setAvatarAnimationState('anticipating'); // Anticipation during shrink

        // Phase 2: After shrink completes, change message and start growing
        setTimeout(() => {
          setMessage(newMessage); // Change message while bubble is invisible
          setMessageAnimation(randomGrowAnimation); // Start growing with style

          // Delay avatar animation to prevent jumping in front of bubble
          setTimeout(() => {
            // Clear any conflicting states before setting new animation
            setIsAnimating(false);
            setAttentionSeekingActive(false);

            // Now animate avatar in sync with specific bubble growth
            const animationMap: Record<string, typeof avatarAnimationState> = {
              'grow-pop': 'excited-pop',
              'grow-bounce': 'excited-bounce',
              'grow-wiggle': 'excited-wiggle',
              'grow-zoom': 'excited-zoom',
              'grow-explode': 'excited-explode',
            };
            setAvatarAnimationState(
              animationMap[randomGrowAnimation] || 'excited'
            );
            setAnimationType('bounce');
            setIsAnimating(true);
          }, MESSAGE_TIMINGS.COMIC_ANIMATION_TOTAL / 10); // Slight delay to ensure bubble starts growing first
        }, MESSAGE_TIMINGS.COMIC_ANIMATION_TOTAL / 3); // Allow shrink to complete

        // Phase 3: Complete the animation
        setTimeout(() => {
          setIsMessageChanging(false);
          setMessageAnimation('none');
          setIsAnimating(false);
          setAvatarAnimationState('floating');
        }, MESSAGE_TIMINGS.COMIC_ANIMATION_TOTAL); // Total comic animation duration
      } else {
        // For subtle changes, use gentle shrink-grow
        setIsMessageChanging(true);
        setMessageAnimation('shrink');

        // Add subtle avatar anticipation
        setIsAnimating(true);
        setAnimationType('pulse');
        setAvatarAnimationState('anticipating'); // Gentle anticipation        // Change message and grow back subtly
        setTimeout(() => {
          setMessage(newMessage);
          setMessageAnimation('grow-subtle');

          // Increased delay for better sync with subtle changes
          setTimeout(() => {
            // Gentle avatar animation in sync with subtle grow
            setAnimationType('pulse');
            setAvatarAnimationState('floating'); // Stay calm for subtle changes
          }, MESSAGE_TIMINGS.SUBTLE_ANIMATION_TOTAL / 10); // Slightly more delay for subtle sync
        }, MESSAGE_TIMINGS.SUBTLE_ANIMATION_TOTAL / 2.5); // Match the shrink timing with comic animations

        // Complete subtle animation
        setTimeout(() => {
          setIsMessageChanging(false);
          setMessageAnimation('none');
          setIsAnimating(false);
        }, MESSAGE_TIMINGS.SUBTLE_ANIMATION_TOTAL); // Total subtle animation duration
      }
    },
    [message, isMessageChanging]
  );

  // Track user engagement and show special messages
  useEffect(() => {
    // Only increment page visit count once when component mounts
    setPageVisitCount(prev => prev + 1);
  }, []); // Empty dependency array to run only once

  // Separate effect for engagement messages
  useEffect(() => {
    // Show special messages based on interaction patterns
    const showEngagementMessage = () => {
      if (userInteractionCount >= 3 && !hasShownSpecialMessage) {
        setHasShownSpecialMessage(true);
        changeMessageWithAnimation(
          "🎉 You're really exploring! I love the enthusiasm. Need a direct line to our team?"
        );
        setIsAnimating(true);
        setAnimationType('enhanced');
        setAvatarAnimationState('excited');

        setTimeout(() => {
          setIsAnimating(false);
          setAvatarAnimationState('floating');
        }, MESSAGE_TIMINGS.ENGAGEMENT_DURATION);

        // Don't automatically clear the message - let it persist
      } else if (pageVisitCount >= 5 && userInteractionCount === 0) {
        changeMessageWithAnimation(
          "👋 Hey there! I'm here if you need any guidance navigating our site."
        );
        // Don't automatically clear this message - let it persist
      }
    };

    // Only show engagement message if we have page visits and no current message
    if (pageVisitCount > 0) {
      showEngagementMessage();
    }
  }, [
    userInteractionCount,
    pageVisitCount,
    hasShownSpecialMessage,
    changeMessageWithAnimation,
  ]);

  // Add seasonal and special occasion messages
  const getSpecialOccasionMessage = () => {
    const now = new Date();
    const month = now.getMonth() + 1; // 1-based month
    const day = now.getDate();

    // New Year
    if (month === 1 && day <= 7) {
      return '🎊 Happy New Year! Ready to make this year your most innovative yet?';
    }

    // Valentine's Day
    if (month === 2 && day === 14) {
      return "💝 Happy Valentine's Day! We love building amazing tech solutions.";
    }

    // Tech appreciation days
    if (month === 10 && day >= 8 && day <= 14) {
      return "👩‍💻👨‍💻 It's Ada Lovelace Day! Celebrating the pioneers of programming.";
    }

    // World Programmer Day (256th day of year, usually Sept 13)
    if (month === 9 && day === 13) {
      return "🚀 Happy World Programmer Day! Let's code the future together.";
    }

    // Friday motivation
    if (now.getDay() === 5) {
      return "🎉 It's Friday! Perfect time to start planning your next big project.";
    }

    // Monday motivation
    if (now.getDay() === 1) {
      return '☕ Monday motivation: Every great project starts with a single line of code.';
    }

    return null;
  };

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

  // Dynamic messages based on time, context, and user behavior
  const messages = useMemo(() => {
    const currentPath = location.pathname;

    // Time-based greetings (cached by hour to prevent constant recreation)
    const getTimeBasedGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12)
        return '🌅 Good morning! Ready to build something amazing today?';
      if (hour >= 12 && hour < 17)
        return "☀️ Good afternoon! Let's explore what ThinkRED can do for you.";
      if (hour >= 17 && hour < 22)
        return '🌆 Good evening! Discover our innovative tech solutions.';
      return '🌙 Working late? Our team is passionate about what we do too!';
    };

    // Context-aware messages based on current page
    const getContextMessages = () => {
      switch (currentPath) {
        case '/':
          return [
            'Welcome to ThinkRED Technologies - where innovation meets execution!',
            'From startups to enterprises - we scale with your ambitions.',
            "Ready to transform your digital presence? Let's start the conversation.",
          ];
        case '/services':
          return [
            "Platform engineering, web development, AI solutions - we've got you covered!",
            'Modern tech stack, proven methodologies, scalable architectures.',
            'Custom solutions tailored to your unique business challenges.',
          ];
        case '/portfolio':
          return [
            'Every project tells a story of innovation and client success.',
            "See how we've helped businesses achieve their digital goals.",
            'From concept to deployment - witness our development excellence.',
          ];
        case '/blog':
          return [
            'Stay ahead with the latest in tech trends and best practices.',
            'Deep insights from our engineering team and industry experts.',
            'Knowledge sharing is at the heart of the open source community.',
          ];
        case '/about':
          return [
            'From open source roots to enterprise excellence - our journey.',
            "Meet the passionate team behind ThinkRED's innovative solutions.",
            'Values-driven development with a focus on client success.',
          ];
        case '/contact':
          return [
            "Ready to discuss your next big idea? We're all ears!",
            'Your project deserves a team that cares about your success.',
            "Let's explore how we can bring your vision to life.",
          ];
        case '/careers':
          return [
            'Join a team that values innovation, growth, and collaboration.',
            'Build the future of technology with passionate professionals.',
            'Your next career adventure starts with ThinkRED.',
          ];
        default:
          return [];
      }
    };

    // Core universal messages with special occasion integration
    const coreMessages = [
      "Hello! I'm RED, your friendly ThinkRED assistant!",
      getTimeBasedGreeting(),
      'Need help navigating? Click on me for quick actions!',
      'Professional. Innovative. Reliable. Experience the ThinkRED difference!',
      'From React 19 and TypeScript to AI and DevOps - we build scalable solutions.',
      'Looking for custom solutions? Our team specializes in tailored development.',
      'Click my message bubble for contextual options, or click me for quick links!',
    ];

    // Add special occasion message if available (only check once per hour to avoid constant recreation)
    try {
      const specialMessage = getSpecialOccasionMessage();
      if (specialMessage) {
        coreMessages.splice(1, 0, specialMessage); // Insert after greeting
      }
    } catch {
      // Silently handle any date/time related errors
    }

    // Combine context-aware and core messages
    return [...coreMessages, ...getContextMessages()];
  }, [location.pathname]);

  // Improved message changing logic with hover pause
  useEffect(() => {
    const startMessageInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        // Don't change message if paused, expanded, manually asleep, or if a message animation is currently playing
        if (
          isPaused ||
          isExpanded ||
          isSleeping ||
          isGoingToSleep ||
          isWakingUp ||
          isManualSleep ||
          !isVisible ||
          isMessageChanging // Added guard to prevent message changes during animations
        ) {
          return;
        }

        const randomIndex = Math.floor(Math.random() * messages.length);
        const newMessage = messages[randomIndex];

        // Prevent setting the same message consecutively to avoid flicker
        if (newMessage === message) {
          const nextIndex = (randomIndex + 1) % messages.length;
          changeMessageWithAnimation(messages[nextIndex]);
        } else {
          changeMessageWithAnimation(newMessage);
        }

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
        setIsBreathingEnhanced(Math.random() > 0.4);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          setIsAnimating(false);
          setAnimationType('pulse');
          setAvatarAnimationState('floating');
        }, MESSAGE_TIMINGS.MAIN_ANIMATION_DURATION); // Main animation duration
      }, MESSAGE_TIMINGS.MAIN_CYCLE_INTERVAL); // Main message cycling interval
    };

    // Set initial message only if visible and not sleeping
    if (
      isVisible &&
      !isSleeping &&
      !isGoingToSleep &&
      !isWakingUp &&
      !isManualSleep &&
      messages.length > 0
    ) {
      // Only set initial message if no message is currently displayed
      if (!message) {
        const randomIndex = Math.floor(Math.random() * messages.length);
        setMessage(messages[randomIndex]);
      }
      // Start the interval for message changes
      startMessageInterval();
    } else if (
      isSleeping ||
      isGoingToSleep ||
      isWakingUp ||
      isManualSleep ||
      !isVisible
    ) {
      // Only clear message and stop interval when going to sleep or becoming invisible
      if (isSleeping || isGoingToSleep || isManualSleep) {
        setMessage('');
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    messages,
    isPaused,
    isExpanded,
    isAnimating,
    isSleeping,
    isGoingToSleep,
    isWakingUp,
    isManualSleep,
    isVisible,
    message,
    changeMessageWithAnimation,
    isMessageChanging,
  ]);

  // Handle hover pause functionality with UI updates
  const handleMessageHover = () => {
    setIsMessageHovered(true);
    setIsPaused(true);
  };

  const handleMessageUnhover = () => {
    setIsMessageHovered(false);
    // Wait for resume delay after unhover before resuming message changes
    setTimeout(() => {
      setIsPaused(false);
    }, MESSAGE_TIMINGS.HOVER_RESUME_DELAY);
  };

  // Idle detection for proactive assistance
  useEffect(() => {
    const checkIdleTime = () => {
      if (lastInteractionTime === 0) return;

      const idleTime = Date.now() - lastInteractionTime;
      const thirtySeconds = MESSAGE_TIMINGS.IDLE_NUDGE_THRESHOLD;
      const twoMinutes = MESSAGE_TIMINGS.IDLE_ENCOURAGEMENT_THRESHOLD;

      if (idleTime > twoMinutes && !isSleeping && !isManualSleep && isVisible) {
        // Show encouragement after 2 minutes of no interaction
        changeMessageWithAnimation(
          "💡 Still browsing? I can help you find exactly what you're looking for!"
        );
        setIsAnimating(true);
        setAnimationType('heartbeat');
        setAvatarAnimationState('attention');

        setTimeout(() => {
          setIsAnimating(false);
          setAvatarAnimationState('floating');
          // Don't clear the message automatically
        }, MESSAGE_TIMINGS.IDLE_ENCOURAGEMENT_DURATION);
      } else if (
        idleTime > thirtySeconds &&
        userInteractionCount === 0 &&
        !isSleeping &&
        !isManualSleep &&
        isVisible
      ) {
        // Show gentle nudge for new users after 30 seconds
        changeMessageWithAnimation(
          '👋 New here? Click on me for quick navigation!'
        );
        // Don't automatically clear this message
      }
    };

    const idleInterval = setInterval(
      checkIdleTime,
      MESSAGE_TIMINGS.IDLE_CHECK_INTERVAL
    ); // Check for idle status
    return () => clearInterval(idleInterval);
  }, [
    lastInteractionTime,
    userInteractionCount,
    isSleeping,
    isManualSleep,
    isVisible,
    changeMessageWithAnimation,
  ]);

  // Handle scroll events to put avatar to sleep/wake up
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      const scrollY = window.scrollY;

      // If user manually put assistant to sleep, don't change its state on scroll
      if (isManualSleep) return;

      // Clear any pending scroll timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Put assistant to sleep when scrolled down more than random distance, wake up when back up
      if (
        scrollY > sleepScrollDistance &&
        !isSleeping &&
        !isGoingToSleep &&
        !isWakingUp
      ) {
        // Debounce the sleep transition to prevent jank
        scrollTimeout = setTimeout(() => {
          // Smooth transition to sleep - clear all states that might interfere
          setIsExpanded(false);
          setShowContextualOptions(false);
          setIsAnimating(false);
          setMessage(''); // Clear any existing message
          setIsVisible(false); // Hide message bubble first

          // Clear any pending timeouts that might cause state conflicts
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          // Start transition to sleep for automatic scroll sleep
          setTimeout(() => {
            setIsGoingToSleep(true);

            setTimeout(() => {
              setIsGoingToSleep(false);
              setIsSleeping(true);
              // Don't set isManualSleep for automatic sleep
            }, 400);
          }, 150);
        }, 100); // Small debounce to prevent rapid state changes
      } else if (
        scrollY <= sleepScrollDistance &&
        (isSleeping || isGoingToSleep) &&
        !isManualSleep &&
        !isWakingUp
      ) {
        // Debounce the wake transition
        scrollTimeout = setTimeout(() => {
          setIsGoingToSleep(false); // Reset transition state
          setIsSleeping(false);
          setIsWakingUp(true); // Start wake up transition

          // Complete wake up after animation
          setTimeout(() => {
            setIsWakingUp(false);
            setIsVisible(true); // Show assistant when waking up
          }, 400);
        }, 50); // Minimal debounce for wake up
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [
    isSleeping,
    isManualSleep,
    isGoingToSleep,
    isWakingUp,
    sleepScrollDistance,
  ]);

  // Add attention-seeking behavior
  useEffect(() => {
    const attentionInterval = setInterval(() => {
      // Randomly trigger attention-seeking behavior (25% chance every 15 seconds)
      // Only require that assistant is visible and not expanded, allow other animations
      if (
        Math.random() < 0.25 &&
        isVisible &&
        !isExpanded &&
        !isSleeping &&
        !isGoingToSleep &&
        !isWakingUp &&
        !isManualSleep &&
        !isMessageChanging && // Don't interrupt message changes
        !isAnimating // Don't interrupt other animations
      ) {
        // Clear any conflicting states first
        setIsAnimating(false);

        setAttentionSeekingActive(true);
        setAvatarAnimationState('attention');

        // Show a playful message during attention-seeking
        const attentionMessages = [
          '👋 Hey there! Notice me?',
          '✨ I have ideas to share!',
          '🎯 Want to explore something cool?',
          '💡 I can help you navigate!',
          '🚀 Ready for a quick tour?',
        ];
        const randomMsg =
          attentionMessages[
            Math.floor(Math.random() * attentionMessages.length)
          ];
        changeMessageWithAnimation(randomMsg);

        setTimeout(() => {
          setAttentionSeekingActive(false);
          setAvatarAnimationState('floating');
          // Don't automatically clear attention messages - let message cycling handle it
        }, MESSAGE_TIMINGS.ATTENTION_SEEKING_DURATION);
      }
    }, MESSAGE_TIMINGS.ATTENTION_SEEKING_INTERVAL); // Attention-seeking interval

    return () => clearInterval(attentionInterval);
  }, [
    isVisible,
    isExpanded,
    isSleeping,
    isGoingToSleep,
    isWakingUp,
    isManualSleep,
    isMessageChanging,
    isAnimating,
    message,
    changeMessageWithAnimation,
  ]);

  // Page-specific welcome messages
  useEffect(() => {
    const showPageWelcome = () => {
      const currentPath = location.pathname;
      let welcomeMessage = '';

      switch (currentPath) {
        case '/':
          welcomeMessage =
            'Welcome to ThinkRED Technologies! Ready to explore our innovative solutions?';
          break;
        case '/services':
          welcomeMessage =
            'Discover our comprehensive technology services - from web development to AI solutions!';
          break;
        case '/portfolio':
          welcomeMessage =
            'Check out our amazing portfolio of successful projects and satisfied clients!';
          break;
        case '/blog':
          welcomeMessage =
            'Explore our latest tech insights, best practices, and thought leadership articles!';
          break;
        case '/careers':
          welcomeMessage =
            'Interested in joining our innovative team? Explore exciting career opportunities!';
          break;
        case '/contact':
          welcomeMessage =
            "Ready to start your project? Let's discuss how we can help you succeed!";
          break;
        case '/about':
          welcomeMessage =
            'Learn about our journey from open source roots to enterprise solutions!';
          break;
        default:
          return; // Don't show welcome for other pages
      }

      // Show welcome message after a brief delay
      setTimeout(() => {
        if (isVisible && !isSleeping) {
          changeMessageWithAnimation(welcomeMessage);
          setIsAnimating(true);
          setAnimationType('enhanced');
          setAvatarAnimationState('excited');

          setTimeout(() => {
            setIsAnimating(false);
            setAnimationType('pulse');
            setAvatarAnimationState('floating');
          }, MESSAGE_TIMINGS.MAIN_ANIMATION_DURATION);

          // Don't automatically clear welcome messages - let them persist
        }
      }, MESSAGE_TIMINGS.PAGE_WELCOME_DURATION);
    };

    showPageWelcome();
  }, [location.pathname, isVisible, isSleeping, changeMessageWithAnimation]);

  // Unified function to get avatar animation classes - prevents conflicts
  const getAvatarAnimationClass = () => {
    // Priority order to prevent conflicts (highest to lowest priority):

    // 1. Sleep/wake states take highest priority
    if (isSleeping || isGoingToSleep || isWakingUp || isManualSleep) {
      return '';
    }

    // 2. Message changing states take second priority (prevents interruption)
    if (isMessageChanging) {
      return 'genie-float-animation'; // Keep floating during message changes
    }

    // 3. User interaction states (bouncing) take third priority
    if (avatarAnimationState === 'bouncing') {
      return 'animate-bounce';
    }

    // 4. Attention-seeking takes fourth priority (but not during other animations)
    if (
      (avatarAnimationState === 'attention' || attentionSeekingActive) &&
      !isAnimating
    ) {
      return 'show-assistant-float';
    }

    // 5. Excited states during message changes
    if (avatarAnimationState.startsWith('excited-') && isAnimating) {
      return 'genie-float-animation'; // Use base float, let CSS handle excitement via container classes
    }

    // 6. Active animation types during interactions
    if (
      isAnimating &&
      (animationType === 'bounce' || animationType === 'enhanced')
    ) {
      return 'animate-bounce';
    }

    // 7. Default floating state
    return 'genie-float-animation';
  };

  // Toggle expanded state
  const toggleExpanded = () => {
    // Track user interaction
    setUserInteractionCount(prev => prev + 1);
    setLastInteractionTime(Date.now());

    if (showContextualOptions) {
      // If contextual options are showing, close them first
      setShowContextualOptions(false);
      return;
    }

    setIsExpanded(!isExpanded);

    // Clear any conflicting animation states first
    setAttentionSeekingActive(false);
    setShowContextualOptions(false);

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

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
      setAnimationType('pulse'); // Return to default after interaction
      setAvatarAnimationState('floating'); // Return avatar to floating
    }, MESSAGE_TIMINGS.USER_INTERACTION_DURATION); // User interaction feedback duration
  };

  // Function to get synchronized bubble animation class
  const getSyncedBubbleAnimation = () => {
    // Base breathing animation that should always be present
    const baseBreathing = isBreathingEnhanced
      ? 'bubble-sync-genie-float message-bubble-enhanced-breathing'
      : 'bubble-sync-genie-float message-bubble-breathing';

    // If a message is changing, add the comic book animation ON TOP of breathing
    if (isMessageChanging && messageAnimation !== 'none') {
      return `${baseBreathing} message-${messageAnimation}`;
    } else if (isMessageChanging && messageAnimation === 'none') {
      // For subtle non-comic changes, use a gentle content pulse
      return `${baseBreathing} bubble-content-pulse`;
    }

    // Synchronized avatar-bubble animations during excitement
    if (avatarAnimationState.startsWith('excited-')) {
      const excitementType = avatarAnimationState.replace('excited-', '');
      return `${baseBreathing} bubble-sync-excited-${excitementType}`;
    } else if (avatarAnimationState === 'anticipating') {
      return `${baseBreathing} bubble-sync-anticipating`;
    } else if (avatarAnimationState === 'excited') {
      return `${baseBreathing} bubble-sync-excited-pop`; // Default excited animation
    }

    if (isAnimating) {
      // During active animations, use enhanced specific animations but keep breathing
      if (animationType === 'wiggle' || animationType === 'enhanced') {
        return `${baseBreathing} bubble-sync-wiggle`;
      } else if (animationType === 'bounce') {
        return `${baseBreathing} bubble-sync-bounce`;
      } else if (animationType === 'heartbeat') {
        return `${baseBreathing} bubble-heartbeat`;
      } else {
        return `${baseBreathing} bubble-content-pulse`;
      }
    } else if (attentionSeekingActive) {
      // During attention seeking, combine with attention animation
      return `${baseBreathing} bubble-sync-attention bubble-attention-seeking`;
    } else if (avatarAnimationState === 'floating') {
      // During normal floating, just use the base breathing
      return baseBreathing;
    } else {
      // Fallback to breathing
      return 'message-bubble-breathing';
    }
  };

  // Function to get contextual options based on current message and filter out current page
  const getContextualOptions = (currentMessage: string) => {
    const currentPath = location.pathname;

    let options: {
      label: string;
      action: () => void;
      icon: React.ReactNode;
    }[] = [];

    if (
      currentMessage.includes('services') ||
      currentMessage.includes('comprehensive')
    ) {
      options = [
        {
          label: 'View All Services',
          action: () => navigate('/services'),
          icon: <TechIcon size="sm" className="text-current" />,
        },
        {
          label: 'Platform Engineering',
          action: () => navigate('/services'),
          icon: <PlatformIcon size="sm" className="text-current" />,
        },
        {
          label: 'Web Development',
          action: () => navigate('/services'),
          icon: <WebDevIcon size="sm" className="text-current" />,
        },
        {
          label: 'AI Solutions',
          action: () => navigate('/services'),
          icon: <AIIcon size="sm" className="text-current" />,
        },
      ];
    } else if (
      currentMessage.includes('portfolio') ||
      currentMessage.includes('projects')
    ) {
      options = [
        {
          label: 'View Portfolio',
          action: () => navigate('/portfolio'),
          icon: <PortfolioIcon size="sm" className="text-current" />,
        },
        {
          label: 'Our Projects',
          action: () => navigate('/portfolio'),
          icon: <StarIcon size="sm" className="text-current" />,
        },
        {
          label: 'View Services',
          action: () => navigate('/services'),
          icon: <ChartIcon size="sm" className="text-current" />,
        },
      ];
    } else if (
      currentMessage.includes('team') ||
      currentMessage.includes('join') ||
      currentMessage.includes('career')
    ) {
      options = [
        {
          label: 'Join Our Team',
          action: () => navigate('/careers'),
          icon: <CareerIcon size="sm" className="text-current" />,
        },
        {
          label: 'View Open Positions',
          action: () => navigate('/careers'),
          icon: <RocketIcon size="sm" className="text-current" />,
        },
        {
          label: 'About Our Team',
          action: () => navigate('/about'),
          icon: <AboutIcon size="sm" className="text-current" />,
        },
      ];
    } else if (
      currentMessage.includes('blog') ||
      currentMessage.includes('insights') ||
      currentMessage.includes('articles')
    ) {
      options = [
        {
          label: 'Read Blog',
          action: () => navigate('/blog'),
          icon: <BlogIcon size="sm" className="text-current" />,
        },
        {
          label: 'Latest Articles',
          action: () => navigate('/blog'),
          icon: <ArticleIcon size="sm" className="text-current" />,
        },
        {
          label: 'Tech Insights',
          action: () => navigate('/blog'),
          icon: <InsightIcon size="sm" className="text-current" />,
        },
      ];
    } else if (
      currentMessage.includes('contact') ||
      currentMessage.includes('consultation')
    ) {
      options = [
        {
          label: 'Contact Us',
          action: () => navigate('/contact'),
          icon: <ContactIcon size="sm" className="text-current" />,
        },
        {
          label: 'Get Quote',
          action: () => navigate('/contact?action=quote'),
          icon: <QuoteIcon size="sm" className="text-current" />,
        },
        {
          label: 'About Our Team',
          action: () => navigate('/about'),
          icon: <AboutIcon size="sm" className="text-current" />,
        },
      ];
    } else if (
      currentMessage.includes('technology') ||
      currentMessage.includes('delightful')
    ) {
      options = [
        {
          label: 'Our Approach',
          action: () => navigate('/about'),
          icon: <TargetIcon size="sm" className="text-current" />,
        },
        {
          label: 'Technologies',
          action: () => navigate('/services'),
          icon: <TechIcon size="sm" className="text-current" />,
        },
        {
          label: 'Learn More',
          action: () => navigate('/about'),
          icon: <LearnIcon size="sm" className="text-current" />,
        },
      ];
    } else if (
      currentMessage.includes('DevOps') ||
      currentMessage.includes('platforms')
    ) {
      options = [
        {
          label: 'DevOps Services',
          action: () => navigate('/services'),
          icon: <DevOpsIcon size="sm" className="text-current" />,
        },
        {
          label: 'Platform Solutions',
          action: () => navigate('/services'),
          icon: <BuildIcon size="sm" className="text-current" />,
        },
        {
          label: 'Get Quote',
          action: () => navigate('/contact?action=quote'),
          icon: <QuoteIcon size="sm" className="text-current" />,
        },
      ];
    } else if (
      currentMessage.includes('animations') ||
      currentMessage.includes('interactions')
    ) {
      options = [
        {
          label: 'See More Animations',
          action: () => {
            setIsAnimating(true);
            setAnimationType('enhanced');
            setAvatarAnimationState('excited');
            setIsBreathingEnhanced(true);

            // Create a sequence of impressive animations
            setTimeout(() => {
              setAnimationType('bounce');
              setAvatarAnimationState('bouncing');
            }, MESSAGE_TIMINGS.DEMO_ANIMATION_STEP);

            setTimeout(() => {
              setAnimationType('wiggle');
              setAvatarAnimationState('attention');
            }, MESSAGE_TIMINGS.DEMO_ANIMATION_STEP * 2);

            setTimeout(() => {
              setAnimationType('heartbeat');
              setAvatarAnimationState('excited');
            }, MESSAGE_TIMINGS.DEMO_ANIMATION_STEP * 3);

            setTimeout(() => {
              setIsAnimating(false);
              setAnimationType('pulse');
              setAvatarAnimationState('floating');
              setIsBreathingEnhanced(false);
              changeMessageWithAnimation(
                '✨ Amazing animations, right? I love showing off!'
              );
              // Let the message persist
            }, 2500);
          },
          icon: <SparkleIcon size="sm" className="text-current" />,
        },
        {
          label: 'Toggle Enhanced Mode',
          action: () => setIsBreathingEnhanced(!isBreathingEnhanced),
          icon: <TheaterIcon size="sm" className="text-current" />,
        },
        {
          label: 'Put Assistant to Sleep',
          action: putAssistantToSleep,
          icon: <SleepIcon size="sm" className="text-current" />,
        },
      ];
    } else {
      // Default options for greeting and general messages
      options = [
        {
          label: 'View Services',
          action: () => navigate('/services'),
          icon: <TechIcon size="sm" className="text-current" />,
        },
        {
          label: 'See Portfolio',
          action: () => navigate('/portfolio'),
          icon: <PortfolioIcon size="sm" className="text-current" />,
        },
        {
          label: 'Read Blog',
          action: () => navigate('/blog'),
          icon: <ArticleIcon size="sm" className="text-current" />,
        },
        {
          label: 'Join Our Team',
          action: () => navigate('/careers'),
          icon: <CareerIcon size="sm" className="text-current" />,
        },
        {
          label: 'Contact Us',
          action: () => navigate('/contact'),
          icon: <ContactIcon size="sm" className="text-current" />,
        },
        {
          label: 'About Us',
          action: () => navigate('/about'),
          icon: <AboutIcon size="sm" className="text-current" />,
        },
      ];
    }

    // Filter out options that lead to the current page or section
    return options.filter(option => {
      const actionString = option.action.toString();
      const navigateMatch = actionString.match(/navigate\(['"]([^'"]+)['"]\)/);

      if (!navigateMatch) return true; // Keep non-navigation actions

      const targetPath = navigateMatch[1];

      // Extract base path (before # or ?) for comparison
      const basePath = targetPath.split(/[#?]/)[0];

      // Handle root path comparison
      const currentBasePath = currentPath === '/' ? '/' : currentPath;

      return basePath !== currentBasePath;
    });
  };

  // Handle message bubble click
  const handleMessageBubbleClick = () => {
    // Track user interaction
    setUserInteractionCount(prev => prev + 1);
    setLastInteractionTime(Date.now());

    if (!isExpanded) {
      // Check if there are any contextual options available
      const availableOptions = getContextualOptions(message);

      if (availableOptions.length > 0) {
        setShowContextualOptions(true);
        setIsAnimating(true);
        setAnimationType('enhanced');
        setAvatarAnimationState('excited');

        setTimeout(() => {
          setIsAnimating(false);
          setAnimationType('pulse');
          setAvatarAnimationState('floating');
        }, MESSAGE_TIMINGS.USER_INTERACTION_DURATION);
      } else {
        // If no contextual options, just show animation feedback
        setIsAnimating(true);
        setAnimationType('pulse');
        setAvatarAnimationState('excited');

        setTimeout(() => {
          setIsAnimating(false);
          setAnimationType('pulse');
          setAvatarAnimationState('floating');
        }, MESSAGE_TIMINGS.USER_INTERACTION_DURATION);
      }
    }
  };

  // Put assistant to sleep (user-initiated hide)
  const putAssistantToSleep = () => {
    // Clear any pending timeouts that might interfere first
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Step 1: Close message bubble and start transition simultaneously
    setIsExpanded(false);
    setShowContextualOptions(false);
    setIsAnimating(false);
    setIsPaused(false);
    setAttentionSeekingActive(false);
    setAvatarAnimationState('floating');
    setMessage(''); // Clear message
    setIsVisible(false); // Hide message bubble
    setJustWokeUp(false); // Reset wake up flag

    // Start the avatar transition immediately to avoid flicker
    setIsGoingToSleep(true);

    // Step 2: Complete the sleep transition exactly when animation ends
    setTimeout(() => {
      setIsGoingToSleep(false);
      setIsSleeping(true);
      setIsManualSleep(true);
    }, MESSAGE_TIMINGS.SLEEP_TRANSITION_DURATION); // Exact animation duration
  };

  // Wake up assistant (user-initiated show)
  const wakeUpAssistant = () => {
    // Track user interaction
    setUserInteractionCount(prev => prev + 1);
    setLastInteractionTime(Date.now());

    // Step 1: Start wake up transition immediately (sleeping avatar grows)
    setIsGoingToSleep(false); // Reset transition state
    setIsSleeping(false); // Hide sleeping avatar
    setIsWakingUp(true); // Start wake up transition
    setIsManualSleep(false); // Reset manual sleep flag
    setIsVisible(true); // Ensure visibility is set immediately

    // Step 2: Complete wake up transition exactly when animation reaches full size
    setTimeout(() => {
      setIsWakingUp(false);
      setJustWokeUp(true); // Mark that we just woke up to skip fade-in
      setIsAnimating(true);
      setAnimationType('bounce');
      setAvatarAnimationState('excited');

      setTimeout(() => {
        setIsAnimating(false);
        setAnimationType('pulse');
        setAvatarAnimationState('floating');
        // Don't reset justWokeUp immediately to prevent fade-in animation from triggering
      }, MESSAGE_TIMINGS.MAIN_ANIMATION_DURATION);

      // Reset justWokeUp after a longer delay to prevent animation conflicts
      setTimeout(() => {
        setJustWokeUp(false);
      }, MESSAGE_TIMINGS.WAKE_RESET_DELAY);
    }, MESSAGE_TIMINGS.WAKE_TRANSITION_DURATION); // Slightly before animation completes to ensure smooth transition
  };

  // Simplified Genie Avatar component
  const GenieAvatar = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        className={`w-full h-full relative overflow-hidden genie-container ${
          avatarAnimationState === 'excited' ||
          avatarAnimationState.startsWith('excited-') ||
          isAnimating
            ? avatarAnimationState
            : ''
        } ${avatarAnimationState === 'anticipating' ? 'anticipating' : ''} ${
          avatarAnimationState === 'bouncing' ? 'bouncing' : ''
        } ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Magical smoke effect - improved with fade-out and extended area */}
        <div className="absolute -inset-8 pointer-events-none overflow-hidden">
          <div className="smoke-particle absolute w-2 h-2 bg-blue-300 rounded-full opacity-60 animate-float-fade"></div>
          <div className="smoke-particle absolute w-1 h-1 bg-purple-300 rounded-full opacity-40 animate-float-fade-delayed"></div>
          <div className="smoke-particle absolute w-1.5 h-1.5 bg-pink-300 rounded-full opacity-50 animate-float-fade-slow"></div>
          <div className="smoke-particle absolute w-1 h-1 bg-cyan-300 rounded-full opacity-30 animate-float-fade-fast"></div>
          <div className="smoke-particle absolute w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-35 animate-float-fade-medium"></div>
        </div>

        {/* Main Avatar PNG */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/assets/avatars/assistant-red.png"
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
      {/* Extended backdrop area for floating elements */}
      <div
        className="absolute -inset-16 pointer-events-none"
        aria-hidden="true"
      />

      {isSleeping ? (
        /* Sleeping Avatar - show when assistant is put to sleep by user */
        <div
          className="sleeping-avatar-size cursor-pointer transition-opacity duration-300 ease-in-out pointer-events-auto"
          onClick={wakeUpAssistant}
          title="Click to wake up your assistant"
        >
          <img
            src="/assets/avatars/assistant-red-sleeping.png"
            alt="Sleeping Assistant"
            className="w-full h-full object-contain animate-pulse transition-opacity duration-500 ease-in-out"
          />
        </div>
      ) : isGoingToSleep ? (
        /* Transitioning to Sleep - show normal avatar shrinking to sleep */
        <div className="w-16 h-16 sm:w-20 sm:h-20 pointer-events-auto animate-avatar-to-sleep">
          <div className="w-full h-full flex items-center justify-center">
            <GenieAvatar />
          </div>
        </div>
      ) : isWakingUp ? (
        /* Transitioning from Sleep - show normal avatar growing from sleep size */
        <div className="w-16 h-16 sm:w-20 sm:h-20 pointer-events-auto animate-avatar-wake-up">
          <div className="w-full h-full flex items-center justify-center">
            <GenieAvatar />
          </div>
        </div>
      ) : (
        !isSleeping &&
        !isManualSleep && (
          <div
            className={`relative ${
              justWokeUp || isAnimating || hasBeenRenderedRef.current
                ? ''
                : 'animate-smooth-fade-in'
            }`}
            ref={() => {
              hasBeenRenderedRef.current = true;
            }}
          >
            {/* Message bubble - positioned relative to this container */}
            {(message || isExpanded || showContextualOptions) && isVisible && (
              <div
                ref={messageRef}
                className={`absolute bottom-20 sm:bottom-24 right-0 bg-white/90 backdrop-blur-lg shadow-2xl rounded-lg p-4 border-2 border-[#E4093E]/60 pointer-events-auto transition-all duration-500 ease-out ${calculateBubbleWidth(isExpanded ? 'Quick Actions menu' : showContextualOptions ? 'Contextual options' : message, isExpanded || showContextualOptions)} max-w-[calc(100vw-7rem)] ${getSyncedBubbleAnimation()} ${!isVisible ? 'animate-smooth-fade-out pointer-events-none' : 'message-bubble-pop'} ${!isExpanded && !showContextualOptions ? 'cursor-pointer hover:scale-[1.02] hover:shadow-2xl' : ''}`}
                onClick={
                  !isExpanded && !showContextualOptions
                    ? handleMessageBubbleClick
                    : undefined
                }
              >
                <div className="text-sm text-secondary font-medium">
                  {isExpanded ? (
                    <div className="space-y-4">
                      {/* Header with icon and title */}
                      <div className="flex items-center gap-3 pb-3 border-b border-gray-200/60">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#E4093E] to-[#B8072E] rounded-full flex items-center justify-center animate-pulse">
                          <TechIcon size="sm" className="text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-[#E4093E] text-base">
                            Quick Actions
                          </p>
                          <p className="text-xs text-secondary/70 font-normal">
                            Choose what you'd like to do
                          </p>
                        </div>
                      </div>

                      {/* Action cards grid */}
                      <div className="grid grid-cols-1 gap-3">
                        <button
                          className="group relative overflow-hidden p-4 bg-gradient-to-br from-red-50 to-red-100/50 hover:from-red-100 hover:to-red-200/60 rounded-xl border border-red-200/60 hover:border-red-300/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                          onClick={() => navigate('/contact')}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white body-1-medium group-hover:scale-110 transition-transform duration-200">
                              <ContactIcon size="sm" className="text-white" />
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
                          onClick={() => navigate('/portfolio')}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white body-1-medium group-hover:scale-110 transition-transform duration-200">
                              <RocketIcon size="sm" className="text-white" />
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
                          onClick={() => navigate('/services')}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white body-1-medium group-hover:scale-110 transition-transform duration-200">
                              <DevOpsIcon size="sm" className="text-white" />
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
                              <SleepIcon size="sm" className="text-white" />
                            </div>
                            <div className="text-left flex-1">
                              <p className="font-medium text-secondary group-hover:text-secondary text-sm">
                                Put Assistant to Sleep
                              </p>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <svg
                                className="w-3 h-3 text-secondary/70"
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
                  ) : showContextualOptions &&
                    getContextualOptions(message).length > 0 ? (
                    <div className="space-y-4">
                      {/* Header for contextual options */}
                      <div className="flex items-center gap-3 pb-3 border-b border-gray-200/60">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#E4093E] to-[#B8072E] rounded-full flex items-center justify-center animate-pulse">
                          <InsightIcon size="sm" className="text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-[#E4093E] text-base">
                            Smart Suggestions
                          </p>
                          <p className="text-xs text-secondary/70 font-normal">
                            Tailored for "
                            {message.length > 25
                              ? `${message.substring(0, 25)}...`
                              : message}
                            "
                          </p>
                        </div>
                      </div>

                      {/* Contextual action cards */}
                      <div className="grid grid-cols-1 gap-3">
                        {getContextualOptions(message).map((option, index) => {
                          // Define color themes for different action types
                          const colorThemes = [
                            {
                              bg: 'from-emerald-50 to-emerald-100/50',
                              hoverBg:
                                'hover:from-emerald-100 hover:to-emerald-200/60',
                              border:
                                'border-emerald-200/60 hover:border-emerald-300/80',
                              iconBg: 'from-emerald-500 to-emerald-600',
                              textColor:
                                'text-emerald-700 group-hover:text-emerald-800',
                              descColor: 'text-emerald-600/80',
                              arrowColor: 'text-emerald-600',
                            },
                            {
                              bg: 'from-blue-50 to-blue-100/50',
                              hoverBg:
                                'hover:from-blue-100 hover:to-blue-200/60',
                              border:
                                'border-blue-200/60 hover:border-blue-300/80',
                              iconBg: 'from-blue-500 to-blue-600',
                              textColor:
                                'text-blue-700 group-hover:text-blue-800',
                              descColor: 'text-blue-600/80',
                              arrowColor: 'text-blue-600',
                            },
                            {
                              bg: 'from-purple-50 to-purple-100/50',
                              hoverBg:
                                'hover:from-purple-100 hover:to-purple-200/60',
                              border:
                                'border-purple-200/60 hover:border-purple-300/80',
                              iconBg: 'from-purple-500 to-purple-600',
                              textColor:
                                'text-purple-700 group-hover:text-purple-800',
                              descColor: 'text-purple-600/80',
                              arrowColor: 'text-purple-600',
                            },
                            {
                              bg: 'from-orange-50 to-orange-100/50',
                              hoverBg:
                                'hover:from-orange-100 hover:to-orange-200/60',
                              border:
                                'border-orange-200/60 hover:border-orange-300/80',
                              iconBg: 'from-orange-500 to-orange-600',
                              textColor:
                                'text-orange-700 group-hover:text-orange-800',
                              descColor: 'text-orange-600/80',
                              arrowColor: 'text-orange-600',
                            },
                            {
                              bg: 'from-teal-50 to-teal-100/50',
                              hoverBg:
                                'hover:from-teal-100 hover:to-teal-200/60',
                              border:
                                'border-teal-200/60 hover:border-teal-300/80',
                              iconBg: 'from-teal-500 to-teal-600',
                              textColor:
                                'text-teal-700 group-hover:text-teal-800',
                              descColor: 'text-teal-600/80',
                              arrowColor: 'text-teal-600',
                            },
                            {
                              bg: 'from-indigo-50 to-indigo-100/50',
                              hoverBg:
                                'hover:from-indigo-100 hover:to-indigo-200/60',
                              border:
                                'border-indigo-200/60 hover:border-indigo-300/80',
                              iconBg: 'from-indigo-500 to-indigo-600',
                              textColor:
                                'text-indigo-700 group-hover:text-indigo-800',
                              descColor: 'text-indigo-600/80',
                              arrowColor: 'text-indigo-600',
                            },
                          ];

                          const theme = colorThemes[index % colorThemes.length];

                          // Generate contextual descriptions for better UX
                          const getDescription = (label: string) => {
                            if (
                              label.includes('Services') ||
                              label.includes('All Services')
                            )
                              return 'Explore our comprehensive offerings';
                            if (
                              label.includes('Portfolio') ||
                              label.includes('Projects')
                            )
                              return 'See our successful work';
                            if (
                              label.includes('Contact') ||
                              label.includes('Quote')
                            )
                              return 'Get personalized assistance';
                            if (
                              label.includes('Career') ||
                              label.includes('Team') ||
                              label.includes('Join')
                            )
                              return 'Build your future with us';
                            if (
                              label.includes('Blog') ||
                              label.includes('Articles')
                            )
                              return 'Stay informed and inspired';
                            if (
                              label.includes('About') ||
                              label.includes('Learn')
                            )
                              return 'Discover our story';
                            if (
                              label.includes('Platform') ||
                              label.includes('Engineering')
                            )
                              return 'Scalable infrastructure solutions';
                            if (
                              label.includes('Web') ||
                              label.includes('Development')
                            )
                              return 'Modern web applications';
                            if (
                              label.includes('AI') ||
                              label.includes('Solutions')
                            )
                              return 'Intelligent automation tools';
                            if (label.includes('Featured'))
                              return 'Our most impressive work';
                            if (label.includes('Case Studies'))
                              return 'Detailed project insights';
                            if (label.includes('Open Positions'))
                              return 'Current opportunities';
                            if (label.includes('Latest'))
                              return 'Recent articles and updates';
                            if (
                              label.includes('Tech') ||
                              label.includes('Insights')
                            )
                              return 'Industry knowledge and trends';
                            if (label.includes('DevOps'))
                              return 'Deployment and operations';
                            if (label.includes('Technologies'))
                              return 'Our technical expertise';
                            return 'Click to explore more';
                          };

                          return (
                            <button
                              key={index}
                              className={`group relative overflow-hidden p-4 bg-gradient-to-br ${theme.bg} ${theme.hoverBg} rounded-xl border ${theme.border} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
                              onClick={() => {
                                option.action();
                                setShowContextualOptions(false);
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 bg-gradient-to-br ${theme.iconBg} rounded-lg flex items-center justify-center text-white body-1-medium group-hover:scale-110 transition-transform duration-200`}
                                >
                                  {option.icon}
                                </div>
                                <div className="text-left flex-1">
                                  <p
                                    className={`font-semibold ${theme.textColor}`}
                                  >
                                    {option.label}
                                  </p>
                                  <p
                                    className={`text-xs ${theme.descColor} font-normal`}
                                  >
                                    {getDescription(option.label)}
                                  </p>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <svg
                                    className={`w-4 h-4 ${theme.arrowColor}`}
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
                          );
                        })}

                        {/* Enhanced back button to match the new design */}
                        <button
                          className="group relative overflow-hidden p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 hover:from-gray-100 hover:to-gray-200/60 rounded-xl border border-gray-200/60 hover:border-gray-300/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                          onClick={() => setShowContextualOptions(false)}
                        >
                          <div className="flex items-center gap-3 justify-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200">
                              <svg
                                className="w-4 h-4 text-white"
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
                            </div>
                            <div className="text-left flex-1">
                              <p className="font-semibold text-gray-700 group-hover:text-gray-800">
                                Back to Message
                              </p>
                              <p className="text-xs text-gray-600/80 font-normal">
                                Return to the main message
                              </p>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`relative transition-all duration-200 ${
                        isMessageHovered ? 'scale-[1.02]' : ''
                      }`}
                      onMouseEnter={handleMessageHover}
                      onMouseLeave={handleMessageUnhover}
                    >
                      <p className="text-secondary leading-relaxed font-medium text-sm mb-2">
                        {message}
                      </p>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200/50">
                        <div
                          className={`flex items-center gap-1 body-3 transition-colors duration-200 ${
                            isMessageHovered
                              ? 'text-[#E4093E]'
                              : 'text-[#E4093E]/80'
                          }`}
                        >
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
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          <span>Click here for quick help</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-secondary/70">
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
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                          <span>Click RED for menu</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Arrow pointing to avatar */}
                <div className="absolute -bottom-2 right-4 sm:right-6 w-4 h-4 bg-white/75 border-r-2 border-b-2 border-[#E4093E]/60 transform rotate-45 backdrop-blur-md"></div>
              </div>
            )}

            {/* Avatar - positioned at the bottom-right of the relative container */}
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 cursor-pointer hover:scale-105 transition-all duration-300 flex items-center justify-center pointer-events-auto ${getAvatarAnimationClass()}`}
              onClick={toggleExpanded}
            >
              <div className="w-full h-full">
                <GenieAvatar />
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AvatarAssistant;
