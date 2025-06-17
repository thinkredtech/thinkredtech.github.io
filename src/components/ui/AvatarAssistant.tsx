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

          // Small delay to ensure message change is processed before starting sync animations
          setTimeout(() => {
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
          }, 50); // Very small delay to ensure bubble growth starts first
        }, 320); // Slightly longer to ensure shrink completes

        // Phase 3: Complete the animation
        setTimeout(() => {
          setIsMessageChanging(false);
          setMessageAnimation('none');
          setIsAnimating(false);
          setAvatarAnimationState('floating');
        }, 900); // Total animation time: 320ms shrink + 50ms delay + 530ms grow
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

          // Small delay for sync
          setTimeout(() => {
            // Gentle avatar animation in sync with subtle grow
            setAnimationType('pulse');
            setAvatarAnimationState('floating'); // Stay calm for subtle changes
          }, 50);
        }, 320);

        // Complete subtle animation
        setTimeout(() => {
          setIsMessageChanging(false);
          setMessageAnimation('none');
          setIsAnimating(false);
        }, 770); // 320ms shrink + 50ms delay + 400ms subtle grow
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
        }, 2000);

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
        }, 1200); // Increased duration for smoother transitions
      }, 18000); // Sweet spot - 18 seconds for noticeable but calm cycling
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
    // Wait 1 second after unhover before resuming message changes
    setTimeout(() => {
      setIsPaused(false);
    }, 1000);
  };

  // Idle detection for proactive assistance
  useEffect(() => {
    const checkIdleTime = () => {
      if (lastInteractionTime === 0) return;

      const idleTime = Date.now() - lastInteractionTime;
      const thirtySeconds = 30000;
      const twoMinutes = 120000;

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
        }, 6000);
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

    const idleInterval = setInterval(checkIdleTime, 10000); // Check every 10 seconds
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
        !isManualSleep
      ) {
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
        }, 1500);
      }
    }, 25000); // Reasonable attention-seeking frequency - 25 seconds

    return () => clearInterval(attentionInterval);
  }, [
    isVisible,
    isExpanded,
    isSleeping,
    isGoingToSleep,
    isWakingUp,
    isManualSleep,
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
          }, 1000);

          // Don't automatically clear welcome messages - let them persist
        }
      }, 2000);
    };

    showPageWelcome();
  }, [location.pathname, isVisible, isSleeping, changeMessageWithAnimation]);

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
          action: () => navigate('/services#platform'),
          icon: <PlatformIcon size="sm" className="text-current" />,
        },
        {
          label: 'Web Development',
          action: () => navigate('/services#web'),
          icon: <WebDevIcon size="sm" className="text-current" />,
        },
        {
          label: 'AI Solutions',
          action: () => navigate('/services#ai'),
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
          label: 'Featured Projects',
          action: () => navigate('/portfolio#featured'),
          icon: <StarIcon size="sm" className="text-current" />,
        },
        {
          label: 'Case Studies',
          action: () => navigate('/portfolio#case-studies'),
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
          label: 'Open Positions',
          action: () => navigate('/careers#positions'),
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
          action: () => navigate('/blog#latest'),
          icon: <ArticleIcon size="sm" className="text-current" />,
        },
        {
          label: 'Tech Insights',
          action: () => navigate('/blog#technology'),
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
          action: () => navigate('/contact#quote'),
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
          action: () => navigate('/about#approach'),
          icon: <TargetIcon size="sm" className="text-current" />,
        },
        {
          label: 'Technologies',
          action: () => navigate('/services#tech-stack'),
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
          action: () => navigate('/services#devops'),
          icon: <DevOpsIcon size="sm" className="text-current" />,
        },
        {
          label: 'Platform Solutions',
          action: () => navigate('/services#platforms'),
          icon: <BuildIcon size="sm" className="text-current" />,
        },
        {
          label: 'Get Quote',
          action: () => navigate('/contact#quote'),
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
            }, 500);

            setTimeout(() => {
              setAnimationType('wiggle');
              setAvatarAnimationState('attention');
            }, 1000);

            setTimeout(() => {
              setAnimationType('heartbeat');
              setAvatarAnimationState('excited');
            }, 1500);

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
      const targetPath = option.action
        .toString()
        .match(/navigate\('([^']+)'\)/)?.[1];
      if (!targetPath) return true; // Keep non-navigation actions

      // Extract base path (before #) for comparison
      const basePath = targetPath.split('#')[0];
      return basePath !== currentPath;
    });
  };

  // Handle message bubble click
  const handleMessageBubbleClick = () => {
    // Track user interaction
    setUserInteractionCount(prev => prev + 1);
    setLastInteractionTime(Date.now());

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
    }, 400); // Exact animation duration
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
      }, 1000);

      // Reset justWokeUp after a longer delay to prevent animation conflicts
      setTimeout(() => {
        setJustWokeUp(false);
      }, 2000);
    }, 390); // Slightly before animation completes to ensure smooth transition
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
        {/* Magical smoke effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="smoke-particle absolute w-2 h-2 bg-blue-300 rounded-full opacity-60 animate-pulse"></div>
          <div className="smoke-particle absolute w-1 h-1 bg-purple-300 rounded-full opacity-40 animate-bounce"></div>
          <div className="smoke-particle absolute w-1.5 h-1.5 bg-pink-300 rounded-full opacity-50"></div>
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
                className={`absolute bottom-20 sm:bottom-24 right-0 bg-white/85 backdrop-blur-md shadow-xl rounded-lg p-4 border-2 border-[#E4093E]/60 pointer-events-auto transition-all duration-500 ease-out ${calculateBubbleWidth(isExpanded ? 'Quick Actions menu' : showContextualOptions ? 'Contextual options' : message, isExpanded || showContextualOptions)} max-w-[calc(100vw-7rem)] ${getSyncedBubbleAnimation()} ${!isVisible ? 'animate-smooth-fade-out pointer-events-none' : 'message-bubble-pop'} ${!isExpanded && !showContextualOptions ? 'cursor-pointer hover:scale-[1.02] hover:shadow-2xl' : ''}`}
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
                  ) : showContextualOptions ? (
                    <div className="space-y-4">
                      {/* Header for contextual options */}
                      <div className="flex items-center gap-3 pb-3 border-b border-gray-200/60">
                        <div className="w-7 h-7 bg-gradient-to-br from-[#E4093E] to-[#B8072E] rounded-full flex items-center justify-center">
                          <InsightIcon size="sm" className="text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-[#E4093E] text-base">
                            Quick Actions
                          </p>
                          <p className="text-xs text-secondary/70 font-normal">
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
                                <p className="font-medium text-secondary group-hover:text-secondary text-sm">
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
                              className="w-4 h-4 text-secondary"
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
                            <span className="font-medium text-secondary text-sm">
                              Back to message
                            </span>
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
          </div>
        )
      )}
    </div>
  );
};

export default AvatarAssistant;
