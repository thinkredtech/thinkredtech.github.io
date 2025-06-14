import React, { useState, useEffect } from 'react';

interface PageHeroProps {
  /** The main title/heading for the page */
  title: string;
  /** The subtitle/tagline description */
  subtitle: string;
  /** Optional custom background variant */
  variant?: 'default' | 'gradient' | 'minimal';
  /** Optional additional CSS classes */
  className?: string;
  /** Optional children for custom content */
  children?: React.ReactNode;
}

const PageHero: React.FC<PageHeroProps> = ({
  title,
  subtitle,
  variant = 'default',
  className = '',
  children,
}) => {
  const [animateInView, setAnimateInView] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => {
      setAnimateInView(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Background variant styles
  const getBackgroundElements = () => {
    switch (variant) {
      case 'gradient':
        return (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-backgroundAlt to-accent2/10"></div>
            <div className="absolute inset-0 hero-grid-bg opacity-10"></div>
            <div className="absolute top-20 left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-10 w-56 h-56 bg-accent1/20 rounded-full blur-3xl animate-float animate-delay-1000"></div>
          </>
        );
      case 'minimal':
        return (
          <>
            <div className="absolute inset-0 bg-backgroundAlt"></div>
            <div className="absolute inset-0 hero-grid-bg opacity-3"></div>
          </>
        );
      default:
        return (
          <>
            <div className="absolute inset-0 bg-backgroundAlt"></div>
            <div className="absolute inset-0 hero-grid-bg opacity-5"></div>
            <div className="absolute top-20 left-10 w-40 h-40 bg-primary/15 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-10 w-56 h-56 bg-accent2/15 rounded-full blur-3xl animate-float animate-delay-1000"></div>
          </>
        );
    }
  };

  return (
    <section
      className={`relative pt-32 pb-8 md:pt-40 md:pb-12 overflow-hidden ${className}`}
    >
      {/* Animated background elements */}
      {getBackgroundElements()}

      <div className="container mx-auto px-4 relative z-10">
        {/* Page Header */}
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className={`font-comfortaa text-3xl md:text-4xl font-bold mb-6 text-primary transition-all duration-1000 ${
              animateInView
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            {title}
          </h1>
          <p
            className={`text-xl md:text-2xl text-secondary mb-8 leading-relaxed transition-all duration-1000 delay-300 ${
              animateInView
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            {subtitle}
          </p>

          {/* Optional children content */}
          {children && (
            <div
              className={`transition-all duration-1000 delay-500 ${
                animateInView
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageHero;
