import { Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';

const ServicesPage = () => {
  const services = [
    {
      title: 'Web & Mobile Application Development',
      description:
        'Custom web and mobile solutions tailored to your business needs with modern technologies and responsive design.',
      features: [
        'React & React Native',
        'Vue.js & Nuxt.js',
        'Progressive Web Apps',
        'Responsive Design',
      ],
      icon: (
        <svg
          className="w-12 h-12 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: 'Product & Platform Engineering',
      description:
        'End-to-end product development and platform engineering services to build scalable and robust digital products.',
      features: [
        'Full-Stack Development',
        'Microservices Architecture',
        'API Development',
        'Database Design',
      ],
      icon: (
        <svg
          className="w-12 h-12 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      ),
    },
    {
      title: 'DevOps & Infrastructure Automation',
      description:
        'Streamline your development and operations with our DevOps expertise and infrastructure automation solutions.',
      features: [
        'CI/CD Pipelines',
        'Container Orchestration',
        'Cloud Infrastructure',
        'Monitoring & Logging',
      ],
      icon: (
        <svg
          className="w-12 h-12 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
          />
        </svg>
      ),
    },
    {
      title: 'Technology Consultation',
      description:
        'Expert guidance on technology strategy, architecture, and implementation to drive your business forward.',
      features: [
        'Technology Strategy',
        'Architecture Review',
        'Performance Optimization',
        'Security Assessment',
      ],
      icon: (
        <svg
          className="w-12 h-12 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: 'Design & Branding',
      description:
        'Create compelling visual identities and user experiences that resonate with your audience and strengthen your brand.',
      features: [
        'UI/UX Design',
        'Brand Identity',
        'Design Systems',
        'User Research',
      ],
      icon: (
        <svg
          className="w-12 h-12 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      ),
    },
    {
      title: 'Data & AI Services',
      description:
        'Harness the power of data and artificial intelligence to gain insights and create intelligent solutions for your business.',
      features: [
        'Machine Learning',
        'Data Analytics',
        'AI Integration',
        'Data Visualization',
      ],
      icon: (
        <svg
          className="w-12 h-12 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <PageHero
        title="Our Services"
        subtitle="Comprehensive technology solutions designed to accelerate your digital transformation and drive business growth."
      />

      {/* Services Grid */}
      <section className="pt-8 pb-16 md:pt-12 md:pb-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-xl shadow-regular hover:shadow-2xl transition-all duration-700 border border-gray-50 hover:border-primary/20 transform hover:-translate-y-2"
              >
                <div className="flex items-start space-x-4 mb-6">
                  <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                    {service.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-dark mb-3 group-hover:text-primary transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-secondary leading-relaxed mb-4">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-dark text-sm uppercase tracking-wide">
                    Key Features:
                  </h4>
                  <ul className="space-y-1">
                    {service.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-sm text-secondary"
                      >
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-backgroundAlt">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-regular p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">
                  6
                </div>
                <div className="text-sm text-secondary">Service Areas</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">
                  50+
                </div>
                <div className="text-sm text-secondary">
                  Technologies Mastered
                </div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">
                  15+
                </div>
                <div className="text-sm text-secondary">Projects Delivered</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">
                  12hr
                </div>
                <div className="text-sm text-secondary">Response Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="font-comfortaa text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Let's discuss your project and how we can help you achieve your
              goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="btn bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Start Your Project
              </Link>
              <Link
                to="/portfolio"
                className="btn border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold transition-all duration-300"
              >
                View Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
