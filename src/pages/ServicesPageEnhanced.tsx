import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ServicesPageEnhanced = () => {
  const [selectedService, setSelectedService] = useState(0);
  const [animateInView, setAnimateInView] = useState(false);

  useEffect(() => {
    setAnimateInView(true);
  }, []);

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
      technologies: [
        'React',
        'Vue.js',
        'React Native',
        'Node.js',
        'TypeScript',
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
      technologies: [
        'Spring Boot',
        'Kubernetes',
        'Docker',
        'AWS',
        'Microservices',
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
      technologies: ['Kubernetes', 'Terraform', 'Jenkins', 'Docker', 'AWS/GCP'],
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
      technologies: [
        'Architecture',
        'Strategy',
        'Consulting',
        'Migration',
        'Planning',
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
      technologies: [
        'Figma',
        'Adobe XD',
        'Sketch',
        'Prototyping',
        'User Research',
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
      technologies: [
        'Python',
        'TensorFlow',
        'PyTorch',
        'Data Analytics',
        'ML/AI',
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
      price: 'Contact for Quote',
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
      price: 'Contact for Quote',
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
      price: 'Contact for Quote',
    },
  ];

  return (
    <div>
      {/* Enhanced Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 hero-grid-bg opacity-10"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent1/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-br from-accent2/20 to-primary/20 rounded-full blur-3xl animate-float animate-delay-1000"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1
              className={`font-comfortaa text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent1 to-accent2 bg-clip-text text-transparent transition-all duration-1000 ${animateInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              Our Services
            </h1>
            <p
              className={`text-xl md:text-2xl text-secondary mb-8 transition-all duration-1000 delay-300 ${animateInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              Comprehensive technology solutions to transform your business and
              accelerate growth
            </p>

            {/* Service categories pills */}
            <div
              className={`flex flex-wrap justify-center gap-3 mb-8 transition-all duration-1000 delay-500 ${animateInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              {[
                'Development',
                'Platform Engineering',
                'DevOps',
                'Consulting',
                'Design',
                'AI/ML',
              ].map((category, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-dark border border-primary/20 hover:border-primary/40 transition-colors"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Services Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Do</h2>
            <p className="text-lg text-secondary max-w-3xl mx-auto">
              From ideation to deployment, we provide end-to-end technology
              solutions tailored to your business objectives
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className={`group relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-regular hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 ${
                  selectedService === index ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedService(index)}
              >
                {/* Service icon with animated background */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent1/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-br from-primary/5 to-accent1/5 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-4 text-dark group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-secondary mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features list */}
                <ul className="space-y-2 mb-6">
                  {service.features.slice(0, 3).map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-dark">{feature}</span>
                    </li>
                  ))}
                  {service.features.length > 3 && (
                    <li className="text-sm text-primary font-medium">
                      +{service.features.length - 3} more features
                    </li>
                  )}
                </ul>

                {/* Technology badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {service.technologies.slice(0, 3).map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-gray-100 text-xs font-medium text-dark rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Hover indicator */}
                <div className="flex items-center text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Learn More</span>
                  <svg
                    className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Service Tiers */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-backgroundAlt to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Service Tiers
            </h2>
            <p className="text-lg text-secondary max-w-3xl mx-auto">
              Flexible service options designed to scale with your business
              needs and objectives
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {serviceTiers.map((tier, index) => (
              <div
                key={index}
                className={`relative bg-white p-8 rounded-2xl transition-all duration-300 ${
                  tier.highlighted
                    ? 'ring-2 ring-primary shadow-2xl scale-105 z-10'
                    : 'shadow-regular hover:shadow-lg'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-gradient-to-r from-primary to-accent1 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2 text-dark">
                    {tier.name}
                  </h3>
                  <p className="text-secondary mb-4">{tier.description}</p>
                  <div className="text-3xl font-bold text-primary">
                    {tier.price}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 mr-3">
                        <svg
                          className="w-3 h-3 text-primary"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-dark">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className={`btn w-full text-center transition-all duration-300 ${
                    tier.highlighted
                      ? 'btn-primary shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'btn-secondary hover:bg-primary hover:text-white'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Process Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-dark">
                Our Proven Process
              </h2>
              <p className="text-lg text-secondary mb-8">
                We follow a structured, collaborative approach that ensures
                transparency, quality, and successful project delivery every
                time.
              </p>

              <div className="space-y-8">
                {[
                  {
                    step: '01',
                    title: 'Discovery & Strategy',
                    description:
                      'Deep-dive analysis of your business goals, technical requirements, and success metrics to create a comprehensive roadmap.',
                  },
                  {
                    step: '02',
                    title: 'Design & Architecture',
                    description:
                      'Collaborative design sessions and technical architecture planning to ensure scalable, maintainable solutions.',
                  },
                  {
                    step: '03',
                    title: 'Agile Development',
                    description:
                      'Iterative development with regular feedback loops, ensuring the solution evolves with your needs.',
                  },
                  {
                    step: '04',
                    title: 'Launch & Optimize',
                    description:
                      'Seamless deployment with ongoing monitoring, optimization, and support for long-term success.',
                  },
                ].map((process, index) => (
                  <div key={index} className="flex items-start group">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent1 flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-lg">
                        {process.step}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark mb-2 group-hover:text-primary transition-colors duration-300">
                        {process.title}
                      </h3>
                      <p className="text-secondary leading-relaxed">
                        {process.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              {/* Interactive process visualization */}
              <div className="relative bg-gradient-to-br from-backgroundAlt to-white p-8 rounded-2xl shadow-xl">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: '🎯', label: 'Strategy' },
                    { icon: '🎨', label: 'Design' },
                    { icon: '⚡', label: 'Development' },
                    { icon: '🚀', label: 'Launch' },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <div className="font-medium text-dark">{item.label}</div>
                    </div>
                  ))}
                </div>

                {/* Connecting lines */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-px h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent"></div>
                  <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br from-accent1/20 to-primary/20 blur-xl animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-gradient-to-br from-accent2/20 to-accent1/20 blur-xl animate-pulse animate-delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent1 to-accent2"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float animate-delay-1000"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="font-comfortaa text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Digital Future?
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Let's discuss how our expertise can accelerate your business goals
              and create exceptional digital experiences
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

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
              <div className="text-center">
                <div className="text-2xl font-bold">15+</div>
                <div className="text-sm">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">100+</div>
                <div className="text-sm">Projects Delivered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPageEnhanced;
