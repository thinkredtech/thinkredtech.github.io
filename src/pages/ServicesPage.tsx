import React from 'react';

const ServicesPage: React.FC = () => {
  const services = [
    {
      title: 'Web & Mobile Application Development',
      description:
        'Custom web and mobile solutions tailored to your business needs with modern technologies and responsive design.',
      features: [
        'Custom web application development',
        'Progressive web apps (PWAs)',
        'Mobile app development (iOS & Android)',
        'E-commerce solutions',
        'Content management systems',
      ],
      icon: (
        <svg
          className="w-12 h-12 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
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
        'Internal developer platforms (IDPs)',
        'Custom software product development',
        'API design and development',
        'Microservices architecture',
        'Platform modernization',
      ],
      icon: (
        <svg
          className="w-12 h-12 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
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
        'CI/CD pipeline implementation',
        'Infrastructure as Code (IaC)',
        'Container orchestration (Kubernetes)',
        'Cloud migration and optimization',
        'Monitoring and observability',
      ],
      icon: (
        <svg
          className="w-12 h-12 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
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
        'Technology strategy development',
        'Architecture design and review',
        'Technical due diligence',
        'Legacy system modernization',
        'Technology stack selection',
      ],
      icon: (
        <svg
          className="w-12 h-12 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
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
        'UI/UX design',
        'Brand identity development',
        'Design systems',
        'Prototyping and wireframing',
        'User research and testing',
      ],
      icon: (
        <svg
          className="w-12 h-12 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
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
        'Data analytics and visualization',
        'Machine learning implementation',
        'AI-powered automation',
        'Natural language processing',
        'Predictive analytics',
      ],
      icon: (
        <svg
          className="w-12 h-12 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
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

  const serviceTiers = [
    {
      name: 'Basic',
      description: 'Essential services for small businesses and startups',
      features: [
        'Initial consultation',
        'Basic implementation',
        'Standard support',
        '1 revision round',
        '30-day warranty',
      ],
    },
    {
      name: 'Standard',
      description: 'Comprehensive solutions for growing businesses',
      features: [
        'Detailed consultation',
        'Custom implementation',
        'Priority support',
        '3 revision rounds',
        '90-day warranty',
        'Performance optimization',
        'Basic training',
      ],
      highlighted: true,
    },
    {
      name: 'Premium',
      description: 'Enterprise-grade services for established organizations',
      features: [
        'Strategic consultation',
        'Enterprise implementation',
        '24/7 dedicated support',
        'Unlimited revisions',
        '1-year warranty',
        'Advanced optimization',
        'Comprehensive training',
        'Ongoing maintenance',
        'Quarterly reviews',
      ],
    },
  ];

  return (
    <div>
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-backgroundAlt">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-1 mb-6">Our Services</h1>
            <p className="text-lg text-secondary">
              We offer a comprehensive range of technology services to help
              businesses transform their digital presence and operations.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-backgroundAlt p-8 rounded-lg shadow-regular hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-6">{service.icon}</div>
                <h3 className="heading-3 mb-4">{service.title}</h3>
                <p className="text-secondary mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-primary mt-0.5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-backgroundAlt">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="heading-1 mb-4">Service Tiers</h2>
            <p className="text-lg text-secondary max-w-3xl mx-auto">
              Choose the service level that best fits your business needs and
              budget.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {serviceTiers.map((tier, index) => (
              <div
                key={index}
                className={`bg-white p-8 rounded-lg ${
                  tier.highlighted
                    ? 'ring-2 ring-primary shadow-lg relative'
                    : 'shadow-regular'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                    Recommended
                  </div>
                )}
                <h3 className="heading-2 mb-2">{tier.name}</h3>
                <p className="text-secondary mb-6">{tier.description}</p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-primary mt-0.5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="/contact"
                  className={`btn w-full text-center ${
                    tier.highlighted ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-1 mb-6">Our Approach</h2>
              <p className="text-lg text-secondary mb-6">
                At ThinkRED, we follow a collaborative and transparent approach
                to ensure that we deliver solutions that meet your specific
                needs and exceed your expectations.
              </p>
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-dark mb-2">
                      Discovery & Planning
                    </h3>
                    <p className="text-secondary">
                      We start by understanding your business goals,
                      requirements, and challenges to create a tailored plan.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-dark mb-2">
                      Design & Development
                    </h3>
                    <p className="text-secondary">
                      Our team designs and develops solutions using modern
                      technologies and best practices.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-dark mb-2">
                      Testing & Refinement
                    </h3>
                    <p className="text-secondary">
                      We rigorously test and refine our solutions to ensure
                      quality, performance, and security.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <span className="text-primary font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-dark mb-2">
                      Deployment & Support
                    </h3>
                    <p className="text-secondary">
                      We deploy your solution and provide ongoing support and
                      maintenance to ensure long-term success.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 bg-backgroundAlt rounded-lg shadow-regular overflow-hidden">
                <div className="inset-0 flex items-center justify-center">
                  <div className="p-8 text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
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
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <h3 className="heading-3 mb-2">Quality Assurance</h3>
                    <p className="text-secondary">
                      Our rigorous quality assurance process ensures that we
                      deliver reliable and high-performing solutions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-accent1/10 -z-10"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-accent2/10 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-comfortaa text-3xl md:text-4xl font-bold mb-6">
              Ready to transform your digital experience?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Contact us today to discuss your project requirements and how we
              can help you achieve your business goals.
            </p>
            <a
              href="/contact"
              className="btn bg-white text-primary hover:bg-opacity-90"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
