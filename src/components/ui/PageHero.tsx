/**
 * PageHero Component
 *
 * A reusable hero section component that provides consistent styling and animation
 * across all pages of the ThinkRED website. Features customizable backgrounds,
 * smooth entrance animations, and flexible content support.
 *
 * @component
 * @example
 * ```tsx
 * <PageHero
 *   title="About ThinkRED"
 *   subtitle="Learn about our journey and mission"
 *   variant="gradient"
 * >
 *   <Button>Get Started</Button>
 * </PageHero>
 * ```
 */

import React, { useState, useEffect } from 'react';

/**
 * Props interface for the PageHero component
 *
 * @interface PageHeroProps
 */
interface PageHeroProps {
  /** The main title/heading for the page */
  title: string;
  /** The subtitle/tagline description that appears below the title */
  subtitle: string;
  /**
   * Optional background variant that determines the visual style
   * - 'default': Standard background with subtle animations
   * - 'gradient': Rich gradient background with enhanced visual effects
   * - 'minimal': Clean, minimal background with reduced visual elements
   */
  variant?: 'default' | 'gradient' | 'minimal';
  /** Optional additional CSS classes for custom styling */
  className?: string;
  /** Optional children components for custom content below the subtitle */
  children?: React.ReactNode;
}

/**
 * PageHero Component Implementation
 *
 * Renders a hero section with configurable styling and smooth animations.
 * The component automatically triggers entrance animations on mount and
 * provides three distinct visual variants for different page contexts.
 *
 * @param props - The component props
 * @returns JSX element representing the hero section
 */
const PageHero: React.FC<PageHeroProps> = ({
  title,
  subtitle,
  variant = 'default',
  className = '',
  children,
}) => {
  // State for controlling entrance animations
  const [animateInView, setAnimateInView] = useState(false);

  /**
   * Effect hook to trigger animations after component mount
   * Uses a small delay to ensure smooth animation timing
   */
  useEffect(() => {
    // Trigger animation on mount with a slight delay for better UX
    const timer = setTimeout(() => {
      setAnimateInView(true);
    }, 100);

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, []);

  /**
   * Generates background elements based on the selected variant
   * Each variant provides a different visual aesthetic while maintaining
   * brand consistency and accessibility standards.
   *
   * @returns JSX elements for the background styling
   */
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
