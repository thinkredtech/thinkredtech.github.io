import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  useScrollAnimation,
  useStaggeredAnimation,
} from "../../../hooks/useScrollAnimation";

const Hero = () => {
  const [currentTagline, setCurrentTagline] = useState(0);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  // Scroll-triggered animations
  const { elementRef: heroRef, isInView: heroInView } = useScrollAnimation();
  const { elementRef: ctaRef, visibleItems: animatedCTAItems } =
    useStaggeredAnimation(2, 200);

  const taglines = [
    "Simplify Technology & Experience",
    "Transform Ideas into Reality",
    "Build the Future, Today",
    "Engineering Excellence, Delivered",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTagline(prev => (prev + 1) % taglines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [taglines.length]);

  // Handle scroll to show/hide scroll indicator
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      // Hide scroll indicator when user scrolls down more than 50px
      // Show it again when they're back at the top
      if (scrollPosition > 50) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToServices = () => {
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col bg-backgroundAlt overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          <div
            className="text-center lg:text-left space-y-8"
            ref={heroRef as React.RefObject<HTMLDivElement>}
          >
            {/* Animated tagline */}
            <div
              className={`min-h-[120px] md:min-h-[140px] lg:min-h-[160px] flex items-center transition-all duration-1000 ${
                heroInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <h1 className="display-2">
                <span className="inline-block transition-all duration-500 ease-in-out">
                  {taglines[currentTagline].split(" ").map((word, index) => (
                    <span
                      key={`${currentTagline}-${index}`}
                      className={`inline-block mr-3 ${
                        word === "&" ||
                        word === "Technology" ||
                        word === "Experience" ||
                        word === "Ideas" ||
                        word === "Reality" ||
                        word === "Future" ||
                        word === "Excellence"
                          ? "text-primary"
                          : "text-secondary"
                      }`}
                    >
                      {word}
                    </span>
                  ))}
                </span>
              </h1>
            </div>

            <div className="space-y-6">
              <p className="text-secondary max-w-lg mx-auto lg:mx-0">
                We're a team of passionate engineers who specialize in
                transforming complex challenges into elegant solutions. From
                startups to enterprises, we build technology that matters.
              </p>

              {/* Key differentiators */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full border border-primary/10">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-secondary font-medium">
                    Full-Stack Expertise
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full border border-primary/10">
                  <div className="w-2 h-2 bg-accent1 rounded-full"></div>
                  <span className="text-secondary font-medium">
                    Quality-Driven Development
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full border border-primary/10">
                  <div className="w-2 h-2 bg-accent2 rounded-full"></div>
                  <span className="text-secondary font-medium">
                    Open Source Heritage
                  </span>
                </div>
              </div>
            </div>

            <div
              className="flex flex-wrap justify-center lg:justify-start gap-4"
              ref={ctaRef as React.RefObject<HTMLDivElement>}
            >
              <Link
                to="/contact"
                className={`btn btn-primary px-8 py-4 group relative overflow-hidden transition-all duration-1000 delay-200 ${
                  animatedCTAItems.includes(0)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <span className="relative z-10">Start Your Project</span>
                <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                to="/portfolio"
                className={`btn btn-secondary px-8 py-4 group transition-all duration-1000 delay-400 ${
                  animatedCTAItems.includes(1)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                View Our Work
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0">
            {/* Interactive showcase card */}
            <div className="relative group">
              <div className="relative w-full h-80 lg:h-96 bg-white/20 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden transform transition-all duration-500 group-hover:scale-105 border border-white/30">
                {/* Clean showcase area */}
                <div className="absolute inset-0 p-8">
                  {/* Central logo */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <img
                        src="/assets/logos/thinkRED-np.svg"
                        alt="ThinkRED Logo"
                        className="w-72 h-auto filter drop-shadow-lg"
                        width="288"
                        height="120"
                        fetchPriority="high"
                        loading="eager"
                      />
                      <div className="absolute -inset-6 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500"></div>
                    </div>
                  </div>
                </div>

                {/* Natural bubble particles gently rising from bottom */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute w-1 h-1 bg-primary/30 rounded-full animate-bubble-gentle left-[15%] top-full bubble-delay-neg-2000"></div>
                  <div className="absolute w-1.5 h-1.5 bg-accent1/25 rounded-full animate-bubble-pop-early left-[75%] top-full bubble-delay-0"></div>
                  <div className="absolute w-0.5 h-0.5 bg-primary/40 rounded-full animate-bubble-right left-[25%] top-full bubble-delay-neg-3000"></div>
                  <div className="absolute w-1 h-1 bg-accent2/30 rounded-full animate-bubble-pop-mid left-[85%] top-full bubble-delay-1500"></div>
                  <div className="absolute w-1.5 h-1.5 bg-primary/25 rounded-full animate-bubble-left left-[45%] top-full bubble-delay-neg-1000"></div>
                  <div className="absolute w-0.5 h-0.5 bg-accent1/35 rounded-full animate-bubble-gentle left-[65%] top-full bubble-delay-2700"></div>
                  <div className="absolute w-1 h-1 bg-primary/30 rounded-full animate-bubble-pop-mid left-[10%] top-full bubble-delay-neg-4000"></div>
                  <div className="absolute w-1.5 h-1.5 bg-accent2/25 rounded-full animate-bubble-right left-[90%] top-full bubble-delay-1100"></div>
                  <div className="absolute w-0.5 h-0.5 bg-primary/40 rounded-full animate-bubble left-[35%] top-full bubble-delay-neg-5000"></div>
                  <div className="absolute w-1 h-1 bg-accent1/30 rounded-full animate-bubble-pop-early left-[55%] top-full bubble-delay-2300"></div>
                  <div className="absolute w-1.5 h-1.5 bg-primary/25 rounded-full animate-bubble-gentle left-[20%] top-full bubble-delay-3800"></div>
                  <div className="absolute w-0.5 h-0.5 bg-accent2/35 rounded-full animate-bubble-left left-[80%] top-full bubble-delay-neg-1500"></div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-primary/10 -z-10"></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-accent2/10 -z-10"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced scroll indicator */}
      <div
        className={`relative z-10 pb-8 flex justify-center transition-all duration-500 ${
          showScrollIndicator
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <button
          onClick={scrollToServices}
          className="group flex flex-col items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg p-4 hover:bg-white/50 transition-all duration-300"
          aria-label="Scroll to services section"
        >
          <div className="flex items-center space-x-2 text-secondary group-hover:text-primary transition-colors duration-300 mb-2">
            <span>Scroll to learn more</span>
          </div>
          <div className="flex justify-center">
            <svg
              className="w-6 h-6 text-primary animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </button>
      </div>

      {/* Animated background grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute inset-0 hero-grid-bg"></div>
      </div>
    </section>
  );
};

export default Hero;
