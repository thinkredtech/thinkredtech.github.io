import { Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';

const ServicesPage = () => {
  const services = [
    {
      title: 'Web & Mobile Application Development',
      description:
        'Custom web and mobile solutions tailored to your business needs with modern technologies and responsive design.',
      features: ['React & React Native', 'Vue.js & Nuxt.js', 'Progressive Web Apps', 'Responsive Design'],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      features: ['Full-Stack Development', 'Microservices Architecture', 'API Development', 'Database Design'],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      features: ['CI/CD Pipelines', 'Container Orchestration', 'Cloud Infrastructure', 'Monitoring & Logging'],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      features: ['Technology Strategy', 'Architecture Review', 'Performance Optimization', 'Security Assessment'],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      features: ['UI/UX Design', 'Brand Identity', 'Design Systems', 'User Research'],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      features: ['Machine Learning', 'Data Analytics', 'AI Integration', 'Data Visualization'],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <section className="pt-8 pb-16 md:pt-12 md:pb-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-700 border border-gray-100 hover:border-primary/30 transform hover:-translate-y-4 overflow-hidden"
              >
                {/* Animated Background Elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-full transform translate-x-20 -translate-y-20 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full transform -translate-x-12 translate-y-12 group-hover:scale-150 transition-all duration-700"></div>

                {/* Icon Container with Enhanced Design */}
                <div className="relative z-10 flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary via-primary to-primary/90 rounded-xl mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                  <div className="text-white transform group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  {/* Icon background glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="heading-1 text-secondary mb-4 group-hover:text-primary transition-colors duration-300 leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-secondary leading-relaxed mb-8 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                    {service.description}
                  </p>

                  {/* Features with Enhanced Styling */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-secondary text-sm uppercase tracking-wider border-b border-gray-200 group-hover:border-primary/30 pb-3 transition-colors duration-300">
                      Key Features
                    </h4>
                    <ul className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center text-secondary group-hover:text-secondary transition-all duration-300 transform group-hover:translate-x-1"
                        >
                          <div className="w-3 h-3 bg-gradient-to-r from-primary to-primary/70 rounded-full mr-4 flex-shrink-0 group-hover:scale-125 group-hover:shadow-md transition-all duration-300 shadow-primary/20"></div>
                          <span className="font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Subtle hover glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Tiers Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="heading-1 mb-4 text-secondary">Service Tiers</h2>
            <p className="max-w-3xl mx-auto text-secondary ">
              Choose the service level that best fits your project requirements and budget. All tiers include our
              commitment to quality and open-source best practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Essential Tier */}
            <div className="bg-white rounded-xl shadow-regular border-2 border-gray-100 p-8 relative hover:shadow-lg transition-all duration-300">
              <div className="text-center mb-6">
                <h3 className="heading-2 text-secondary mb-2">Essential</h3>
                <p className="text-secondary text-sm mb-4">Perfect for startups and small projects</p>
                <div className="heading-1 text-primary">Contact for Quote</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-secondary">Core development features</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-secondary">Basic testing & QA</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-secondary">Standard deployment</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-secondary">Email support</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-secondary">30-day warranty</span>
                </li>
              </ul>
              <Link
                to="/contact"
                className="w-full btn btn-outline text-center py-3 hover:scale-105 transition-transform duration-300"
              >
                Get Quote
              </Link>
            </div>

            {/* Professional Tier - Highlighted */}
            <div className="bg-white rounded-xl shadow-xl border-2 border-primary p-8 relative hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary text-white px-4 py-2 rounded-full label-1">Most Popular</div>
              </div>
              <div className="text-center mb-6">
                <h3 className="heading-2 text-secondary mb-2">Professional</h3>
                <p className="text-secondary text-sm mb-4">Ideal for growing businesses and comprehensive projects</p>
                <div className="heading-1 text-primary">Contact for Quote</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-secondary">All Essential features</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-secondary">Advanced testing & QA</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-secondary">CI/CD pipeline setup</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-secondary">Performance optimization</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-secondary">Priority support</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-secondary">90-day warranty</span>
                </li>
              </ul>
              <Link
                to="/contact"
                className="w-full btn btn-primary text-center py-3 hover:scale-105 transition-transform duration-300"
              >
                Get Started
              </Link>
            </div>

            {/* Enterprise Tier */}
            <div className="bg-white rounded-xl shadow-regular border-2 border-gray-100 p-8 relative hover:shadow-lg transition-all duration-300">
              <div className="text-center mb-6">
                <h3 className="heading-2 text-secondary mb-2">Enterprise</h3>
                <p className="text-secondary text-sm mb-4">For large-scale projects requiring maximum support</p>
                <div className="heading-1 text-primary">Contact for Quote</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-secondary">All Professional features</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-secondary">Dedicated project manager</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-secondary">24/7 support availability</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-secondary">Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-secondary">Scalability planning</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-secondary">1-year warranty</span>
                </li>
              </ul>
              <Link
                to="/portfolio"
                className="w-full btn btn-outline text-center py-3 hover:scale-105 transition-transform duration-300"
              >
                View Portfolio
              </Link>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-secondary mb-6">
              All service tiers include our open-source first approach, modern development practices, and comprehensive
              documentation.
            </p>
            <Link to="/contact" className="btn btn-primary inline-flex items-center">
              Discuss Your Requirements
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Open Source Focus Section */}
      <section className="py-16 md:py-24 bg-backgroundAlt">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-regular p-8">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="heading-1 mb-6 text-secondary">Open Source First Approach</h2>
              <p className="mb-8 text-secondary">
                At ThinkRED, we prioritize open source solutions wherever possible in our development process. Our team
                has deep roots in open source communities including Mozilla, Fedora, and Red Hat, bringing this
                collaborative mindset to every project we deliver.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-6 bg-backgroundAlt rounded-lg">
                  <div className="heading-1 text-primary mb-2">Open Source</div>
                  <div className="text-sm text-secondary">Prioritized Development</div>
                </div>
                <div className="p-6 bg-backgroundAlt rounded-lg">
                  <div className="heading-1 text-primary mb-2">Community</div>
                  <div className="text-sm text-secondary">Driven Innovation</div>
                </div>
                <div className="p-6 bg-backgroundAlt rounded-lg">
                  <div className="heading-1 text-primary mb-2">Collaborative</div>
                  <div className="text-sm text-secondary">Engineering Approach</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="display-2 mb-6">Ready to Get Started?</h2>
            <p className="mb-8 opacity-90">Let's discuss your project and how we can help you achieve your goals.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="btn bg-white text-primary hover:bg-white/90 px-8 py-4 body-1-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Start Your Project
              </Link>
              <Link
                to="/portfolio"
                className="btn border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 body-1-semibold transition-all duration-300"
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
