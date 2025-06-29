import { Link } from 'react-router-dom';
import { useScrollAnimation, useStaggeredAnimation } from '../../../hooks/useScrollAnimation';

const ProjectHighlights = () => {
  // Scroll-triggered animations
  const { elementRef: headerRef, isInView: headerInView } = useScrollAnimation();
  const { elementRef: cardsRef, visibleItems: animatedCards } = useStaggeredAnimation(3, 200);
  // SVG Icons as React components
  const GraduationCapIcon = () => (
    <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
    </svg>
  );

  const SyncIcon = () => (
    <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
    </svg>
  );

  const HealthcareIcon = () => (
    <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8zM4 6h5v2h2V6h1V4H4v2zm0 5h3v2h2v-2h3V9H4v2zm0 5h5v2h2v-2h1v-2H4v2z" />
      <path d="M12.5 2c-5.33 0-9.67 4.34-9.67 9.67 0 5.33 4.34 9.67 9.67 9.67s9.67-4.34 9.67-9.67S17.83 2 12.5 2zm0 17.33c-4.24 0-7.67-3.43-7.67-7.67S8.26 4 12.5 4s7.67 3.43 7.67 7.67-3.43 7.66-7.67 7.66z" />
    </svg>
  );

  const projectHighlights = [
    {
      title: 'Enterprise Learning Platform',
      description:
        'Delivered a comprehensive WordPress platform integrating technology training, certification, and AV staffing management systems with seamless user experience.',
      client: 'OfficePro Inc.',
      technologies: ['WordPress', 'LearnPress', 'PHP', 'MySQL', 'Custom API'],
      outcome: 'Streamlined operations and enhanced user experience',
      icon: <GraduationCapIcon />,
      link: 'https://officepro.on.thinkred.tech',
    },
    {
      title: 'Epic Learning Sync Plugin',
      description:
        'Developed a robust WordPress plugin for seamless API integration and data synchronization between LearnPress and external learning management systems.',
      client: 'OfficePro Inc.',
      technologies: ['WordPress Plugin', 'API Integration', 'Data Sync', 'PHP'],
      outcome: 'Automated course management and improved efficiency',
      icon: <SyncIcon />,
      link: 'https://github.com/thinkredtech/epic-learning-sync',
    },
    {
      title: 'Healthcare Portfolio Platform',
      description:
        'Built a comprehensive WordPress-based platform for digital content management, course delivery, and healthcare services portfolio showcase.',
      client: 'Zeomed Services',
      technologies: ['WordPress', 'Content Management', 'Course Delivery', 'Responsive Design'],
      outcome: 'Enhanced content management and training capabilities',
      icon: <HealthcareIcon />,
      link: 'https://zeomedservices.com',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          ref={headerRef as React.RefObject<HTMLDivElement>}
        >
          <h2 className="heading-1 mb-4 text-secondary">Recent Project Highlights</h2>
          <p className="text-secondary max-w-3xl mx-auto">
            Discover how we've helped businesses transform their digital presence with custom solutions and cutting-edge
            technology implementations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" ref={cardsRef as React.RefObject<HTMLDivElement>}>
          {projectHighlights.map((project, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-regular hover:shadow-lg transition-all duration-500 overflow-hidden group ${
                animatedCards.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Header with icon and client */}
              <div className="bg-gradient-to-r from-primary/5 to-accent1/5 p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center justify-center">{project.icon}</div>
                  <span className="body-3 text-primary bg-primary/10 px-3 py-1 rounded-full">{project.client}</span>
                </div>
                <h3 className="font-bold body-1-medium text-secondary group-hover:text-primary transition-colors duration-300">
                  {project.title}
                </h3>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-secondary mb-6 leading-relaxed">{project.description}</p>

                {/* Technologies */}
                <div className="mb-6">
                  <h4 className="mb-3">Technologies Used:</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="text-xs bg-gray-100 text-secondary px-2 py-1 rounded-md font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Outcome */}
                <div className="mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm font-medium">
                      <span className="text-primary">Result:</span> {project.outcome}
                    </p>
                  </div>
                </div>

                {/* Action button */}
                <div className="pt-4 border-t border-gray-100">
                  {project.link.startsWith('http') ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary hover:text-primary-dark font-medium text-sm transition-colors duration-300"
                    >
                      View Live Project
                      <svg
                        className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  ) : (
                    <Link
                      to={project.link}
                      className="inline-flex items-center text-primary hover:text-primary-dark font-medium text-sm transition-colors duration-300"
                    >
                      View Case Study
                      <svg
                        className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectHighlights;
