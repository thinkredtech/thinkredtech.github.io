import { useState, useEffect } from "react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      setIsVisible(scrollPosition > windowHeight * 0.5);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 left-8 z-40 bg-gradient-to-r from-primary to-primary/80 text-white w-10 h-10 rounded-lg shadow-2xl hover:shadow-[0_25px_50px_rgba(228,9,62,0.3)] transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-primary/30 backdrop-blur-sm border border-white/10 group ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      aria-label="Scroll to top"
    >
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <svg
        className="w-4 h-4 mx-auto transition-transform duration-300 group-hover:scale-110"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
};

export default ScrollToTop;
