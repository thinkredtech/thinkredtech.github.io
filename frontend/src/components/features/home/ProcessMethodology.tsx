import {
  useScrollAnimation,
  useStaggeredAnimation,
} from '../../../hooks/useScrollAnimation';

const ProcessMethodology = () => {
  const { elementRef: headerRef, isInView: headerVisible } =
    useScrollAnimation();
  const { elementRef: timelineRef, isInView: timelineVisible } =
    useScrollAnimation();
  const { elementRef: desktopStepsRef, visibleItems: visibleSteps } =
    useStaggeredAnimation(4, 300);
  const { elementRef: principlesRef, isInView: principlesVisible } =
    useScrollAnimation();
  const methodologies = [
    {
      phase: '01',
      title: 'Discovery & Strategy',
      description:
        'Deep-dive analysis of your current state, business objectives, and technical landscape to craft a tailored transformation roadmap.',
      activities: [
        'Architecture Assessment',
        'Stakeholder Alignment',
        'Technology Audit',
        'Strategic Planning',
      ],
      icon: (
        <svg
          className="w-8 h-8 text-primary"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      ),
    },
    {
      phase: '02',
      title: 'Design & Architecture',
      description:
        'Collaborative design sessions to architect scalable, maintainable solutions that align with industry best practices and your business goals.',
      activities: [
        'System Design',
        'API Architecture',
        'Security Framework',
        'Scalability Planning',
      ],
      icon: (
        <svg
          className="w-8 h-8 text-primary"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
    },
    {
      phase: '03',
      title: 'Agile Development',
      description:
        'Iterative development with continuous feedback loops, ensuring rapid delivery while maintaining quality and alignment with evolving requirements.',
      activities: [
        'Sprint Planning',
        'Continuous Integration',
        'Code Reviews',
        'Quality Assurance',
      ],
      icon: (
        <svg
          className="w-8 h-8 text-primary"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18a8 8 0 0 1-8-8 8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8m.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
        </svg>
      ),
    },
    {
      phase: '04',
      title: 'Deployment & Optimization',
      description:
        'Seamless deployment strategies with comprehensive monitoring, performance optimization, and knowledge transfer for sustainable operations.',
      activities: [
        'DevOps Pipeline',
        'Performance Tuning',
        'Knowledge Transfer',
        'Ongoing Support',
      ],
      icon: (
        <svg
          className="w-8 h-8 text-primary"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-backgroundAlt">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            headerVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="heading-1 mb-4 text-secondary">
            Our Process & Methodology
          </h2>
          <p className="text-secondary max-w-4xl mx-auto">
            We follow a proven, iterative methodology that combines enterprise
            best practices with agile principles, ensuring successful delivery
            while maintaining flexibility and continuous value creation
            throughout your transformation journey.
          </p>
        </div>

        {/* Process Timeline */}
        <div
          ref={timelineRef as React.RefObject<HTMLDivElement>}
          className={`relative mb-16 transition-all duration-1000 ease-out ${
            timelineVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Desktop Timeline */}
          <div className="hidden lg:block">
            <div className="flex justify-between items-center mb-12">
              {methodologies.map((methodology, index) => (
                <div key={index} className="flex-1 relative">
                  <div className="flex flex-col items-center">
                    {/* Phase Number */}
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 relative z-10">
                      <span className="text-white font-bold text-lg">
                        {methodology.phase}
                      </span>
                    </div>

                    {/* Connecting Line */}
                    {index < methodologies.length - 1 && (
                      <div className="absolute top-8 left-1/2 w-full h-0.5 bg-primary/20 -z-10 transform translate-x-8"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Phase Details */}
            <div
              ref={desktopStepsRef as React.RefObject<HTMLDivElement>}
              className="grid grid-cols-4 gap-8"
            >
              {methodologies.map((methodology, index) => (
                <div
                  key={index}
                  className={`text-center transition-all duration-700 ease-out ${
                    visibleSteps.includes(index)
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{
                    transitionDelay: `${index * 300}ms`,
                  }}
                >
                  <div className="bg-backgroundAlt rounded-lg p-6 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex justify-center mb-4">
                      {methodology.icon}
                    </div>
                    <h3 className="heading-2 text-secondary mb-3 group-hover:text-primary transition-colors duration-300">
                      {methodology.title}
                    </h3>
                    <p className="text-secondary mb-4 text-sm leading-relaxed">
                      {methodology.description}
                    </p>
                    <div className="space-y-2">
                      {methodology.activities.map((activity, activityIndex) => (
                        <div
                          key={activityIndex}
                          className="flex items-center justify-center"
                        >
                          <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                          <span className="text-xs text-secondary font-medium">
                            {activity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="lg:hidden">
            <div className="space-y-8">
              {methodologies.map((methodology, index) => (
                <div key={index} className="relative">
                  {/* Timeline Line */}
                  {index < methodologies.length - 1 && (
                    <div className="absolute left-8 top-16 w-0.5 h-full bg-primary/20 -z-10"></div>
                  )}

                  <div className="flex items-start">
                    {/* Phase Circle */}
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                      <span className="text-white font-bold text-lg">
                        {methodology.phase}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-backgroundAlt rounded-lg p-6">
                      <div className="flex items-center mb-3">
                        {methodology.icon}
                        <h3 className="heading-2 text-dark ml-3">
                          {methodology.title}
                        </h3>
                      </div>
                      <p className="text-secondary mb-4 leading-relaxed">
                        {methodology.description}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {methodology.activities.map(
                          (activity, activityIndex) => (
                            <div
                              key={activityIndex}
                              className="flex items-center"
                            >
                              <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                              <span className="text-sm text-dark font-medium">
                                {activity}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Methodology Principles */}
        <div
          ref={principlesRef as React.RefObject<HTMLDivElement>}
          className={`bg-primary/5 rounded-lg p-8 md:p-12 transition-all duration-1000 ease-out ${
            principlesVisible
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-8 scale-95'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="heading-1 text-dark mb-6">
                Core Methodology Principles
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold text-dark mb-1">
                      Collaborative Approach
                    </h4>
                    <p className="text-secondary text-sm">
                      Deep partnership with your team ensuring knowledge
                      transfer and sustainable solutions
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold text-dark mb-1">
                      Risk Mitigation
                    </h4>
                    <p className="text-secondary text-sm">
                      Proactive identification and management of technical and
                      business risks
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold text-dark mb-1">
                      Continuous Value Delivery
                    </h4>
                    <p className="text-secondary text-sm">
                      Regular deliverables and feedback loops ensuring
                      continuous value creation
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold text-dark mb-1">
                      Quality & Performance Focus
                    </h4>
                    <p className="text-secondary text-sm">
                      Enterprise-grade quality standards with performance
                      optimization built-in
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-lg shadow-regular p-6">
                <h4 className="font-bold text-dark mb-4 text-center">
                  Delivery Excellence
                </h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="heading-1 text-primary mb-1">Quality</div>
                    <div className="text-xs text-secondary">
                      Focused Delivery
                    </div>
                  </div>
                  <div>
                    <div className="heading-1 text-primary mb-1">Client</div>
                    <div className="text-xs text-secondary">
                      Satisfaction Focus
                    </div>
                  </div>
                  <div>
                    <div className="heading-1 text-primary mb-1">Agile</div>
                    <div className="text-xs text-secondary">Methodology</div>
                  </div>
                  <div>
                    <div className="heading-1 text-primary mb-1">Zero</div>
                    <div className="text-xs text-secondary">Downtime Goals</div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-sm text-secondary mb-2">Certified in</p>
                    <div className="flex justify-center space-x-2 text-xs">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                        Agile
                      </span>
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                        DevOps
                      </span>
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                        Cloud
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessMethodology;
