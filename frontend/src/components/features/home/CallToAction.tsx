import { Link } from 'react-router-dom';
import { useScrollAnimation, useStaggeredAnimation } from '../../../hooks/useScrollAnimation';

const CallToAction = () => {
  const { elementRef: ctaRef, isInView: ctaVisible } = useScrollAnimation();
  const { elementRef: buttonsRef, visibleItems: visibleButtons } = useStaggeredAnimation(2, 200);

  return (
    <section className="py-16 md:py-24 bg-primary text-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div
          ref={ctaRef as React.RefObject<HTMLDivElement>}
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 ease-out ${
            ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="display-2-white mb-6">Ready to build something amazing together?</h2>
          <p className="mb-8 opacity-90">
            Let's transform your ideas into reality with our engineering expertise and innovative solutions.
          </p>
          <div ref={buttonsRef as React.RefObject<HTMLDivElement>} className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className={`btn bg-white text-primary hover:bg-opacity-90 hover:transform hover:scale-105 transition-all duration-500 ${
                visibleButtons.includes(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Talk to Us
            </Link>
            <Link
              to="/services"
              className={`btn border-2 border-white text-white hover:bg-white hover:bg-opacity-10 hover:transform hover:scale-105 transition-all duration-500 ${
                visibleButtons.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{
                transitionDelay: '200ms',
              }}
            >
              Explore Services
            </Link>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div
          className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white transition-all duration-2000 ease-out ${
            ctaVisible ? 'opacity-10 scale-100' : 'opacity-0 scale-75'
          }`}
        ></div>
        <div
          className={`absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-white transition-all duration-2000 ease-out ${
            ctaVisible ? 'opacity-10 scale-100' : 'opacity-0 scale-75'
          }`}
          style={{
            transitionDelay: '300ms',
          }}
        ></div>
      </div>
    </section>
  );
};

export default CallToAction;
