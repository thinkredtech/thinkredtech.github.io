import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-backgroundAlt overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="font-comfortaa text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Simplify Technology <span className="text-primary">&</span> Experience
            </h1>
            <p className="text-lg md:text-xl text-secondary mb-8 max-w-lg mx-auto lg:mx-0">
              We build cutting-edge web applications, platforms, and infrastructure solutions that transform businesses and delight users.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-12 md:mb-0">
              <a href="/services" className="btn btn-primary">
                Explore Our Services
              </a>
              <a href="/contact" className="btn btn-secondary">
                Start a Project
              </a>
            </div>
          </div>
          <div className="relative mt-16 lg:mt-0"> {/* Increased top margin for mobile */}
            <div className="aspect-w-1 aspect-h-1 bg-white rounded-lg shadow-xl overflow-hidden">
              {/* This would be replaced with the actual 3D animation in production */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent1/5">
                <img 
                  src="/assets/images/thinkRED-optimized.svg" 
                  alt="ThinkRED Logo" 
                  className="w-3/4 h-auto animate-float"
                />
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-primary/10 -z-10"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-accent2/10 -z-10"></div>
          </div>
        </div>
      </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 -ml-[56px] flex flex-col items-center animate-bounce">
          <span className="text-secondary text-sm mb-2">Scroll to explore</span>
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-accent1/5"></div>
      </div>
    </section>
  );
};

export default Hero;
