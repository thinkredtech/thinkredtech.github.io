import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import { DiscoveryCallScheduler, QuoteRequestForm } from '../components/forms/ContactForms';
import { submitContactForm, checkRateLimit, validateHoneypot } from '../utils/api';
import { sanitizeInput, validateEmail, validatePhone, validateTextLength } from '../utils/security';
import { useSEO, useStructuredData, SEOConfigs, StructuredDataSchemas } from '../hooks/useSEO';

const ContactPage = () => {
  // Apply SEO configuration for contact page
  useSEO({
    ...SEOConfigs.contact,
    url: `${window.location.origin}/contact`,
  });

  // Add breadcrumb structured data
  useStructuredData(
    StructuredDataSchemas.breadcrumb([
      { name: 'Home', url: window.location.origin },
      { name: 'Contact', url: `${window.location.origin}/contact` },
    ])
  );

  // Add LocalBusiness structured data for local SEO
  useStructuredData({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://thinkred.tech/#organization',
    name: 'ThinkRED Technologies LLP',
    alternateName: 'ThinkRED Technologies',
    description:
      'Expert web development, mobile app development, DevOps automation, and technology consultation services.',
    url: 'https://thinkred.tech',
    logo: 'https://thinkred.tech/assets/logos/thinkRED-logo.png',
    image: 'https://thinkred.tech/assets/logos/thinkRED-og-image.png',
    telephone: '+91-XXXXXXXXXX', // Replace with actual phone number
    email: 'hello@thinkred.tech',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressRegion: 'India',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '20.5937', // India center coordinates as placeholder
      longitude: '78.9629',
    },
    areaServed: ['India', 'United States', 'Europe', 'Asia', 'Worldwide'],
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: '20.5937',
        longitude: '78.9629',
      },
      geoRadius: '10000000', // Global service radius
    },
    openingHours: 'Mo-Fr 09:00-18:00',
    paymentAccepted: 'Credit Card, Bank Transfer, Online Payment',
    currenciesAccepted: 'INR, USD, EUR',
    priceRange: '$$-$$$',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Technology Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Web Application Development',
            description: 'Custom web application development using modern technologies',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Mobile App Development',
            description: 'Native and cross-platform mobile application development',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'DevOps & Infrastructure Automation',
            description: 'DevOps services and cloud infrastructure automation',
          },
        },
      ],
    },
    sameAs: ['https://github.com/thinkredtech', 'https://www.linkedin.com/company/thinkred-technologies'],
  });
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'contact' | 'discovery' | 'quote'>('contact');

  // Check URL parameters for direct access to specific forms
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const action = params.get('action');

    if (action === 'discovery') {
      setActiveTab('discovery');
    } else if (action === 'quote') {
      setActiveTab('quote');
    }
  }, [location]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: '',
    honeypot: '', // Spam prevention field
  });

  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Spam prevention: Check honeypot field
      if (!validateHoneypot(formData.honeypot)) {
        setSubmitError('Spam detected. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Rate limiting: Check for rapid successive submissions
      if (!checkRateLimit(formData.email, 5000)) {
        setSubmitError('Please wait before submitting another message.');
        setIsSubmitting(false);
        return;
      }

      // Input validation
      if (!validateEmail(formData.email)) {
        setSubmitError('Please enter a valid email address.');
        setIsSubmitting(false);
        return;
      }

      if (formData.phone && !validatePhone(formData.phone)) {
        setSubmitError('Please enter a valid phone number.');
        setIsSubmitting(false);
        return;
      }

      if (!validateTextLength(formData.name, 100, 1)) {
        setSubmitError('Name must be between 1 and 100 characters.');
        setIsSubmitting(false);
        return;
      }

      if (!validateTextLength(formData.message, 2000, 10)) {
        setSubmitError('Message must be between 10 and 2000 characters.');
        setIsSubmitting(false);
        return;
      }

      if (!formData.projectType) {
        setSubmitError('Please select a project type.');
        setIsSubmitting(false);
        return;
      }

      // Sanitize inputs
      const sanitizedData = {
        formType: 'Contact Us',
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email),
        company: sanitizeInput(formData.company),
        phone: sanitizeInput(formData.phone),
        projectType: sanitizeInput(formData.projectType),
        budget: sanitizeInput(formData.budget),
        timeline: sanitizeInput(formData.timeline),
        message: sanitizeInput(formData.message),
      };

      // Submit to backend
      await submitContactForm(sanitizedData);

      // Show success message
      setSubmitSuccess(true);

      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        projectType: '',
        budget: '',
        timeline: '',
        message: '',
        honeypot: '',
      });
    } catch {
      // Error sending message - handled gracefully
      setSubmitError('There was an error sending your message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Options for select inputs
  const projectTypes = [
    'Web Application Development',
    'Mobile Application Development',
    'Platform Engineering',
    'DevOps & Infrastructure Automation',
    'Technology Consultation',
    'Design & Branding',
    'Data & AI Services',
    'Other',
  ];

  const budgetRanges = [
    'Less than $1,000',
    '$1,000 - $10,000',
    '$10,000 - $25,000',
    '$25,000 - $50,000',
    '$50,000 - $100,000',
    '$100,000+',
  ];

  const timelineOptions = ['Less than 1 month', '1-3 months', '3-6 months', '6+ months', 'Ongoing support'];

  return (
    <div>
      {/* Enhanced Hero Section */}
      <PageHero
        title="Contact Us"
        subtitle="Ready to start your project or have questions? We're here to help. Choose an option below to get started."
      />

      {/* Enhanced Tab Navigation and Content */}
      <div className="pt-8 pb-16 md:pt-12 md:pb-24 bg-white">
        <div className="container mx-auto px-4">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center mb-12">
            <div className="bg-white rounded-lg shadow-xl p-2 inline-flex border border-gray-100">
              <button
                onClick={() => setActiveTab('contact')}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform ${
                  activeTab === 'contact'
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'text-secondary hover:bg-gray-50 hover:scale-105'
                }`}
              >
                Contact Us
              </button>
              <button
                onClick={() => setActiveTab('discovery')}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform ${
                  activeTab === 'discovery'
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'text-secondary hover:bg-gray-50 hover:scale-105'
                }`}
              >
                Discovery Call
              </button>
              <button
                onClick={() => setActiveTab('quote')}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform ${
                  activeTab === 'quote'
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'text-secondary hover:bg-gray-50 hover:scale-105'
                }`}
              >
                Request Quote
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Enhanced Contact Information - Shown after forms on mobile */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-white rounded-lg shadow-xl p-8 sticky top-24">
                <h2 className="heading-1 mb-6 text-dark">Get in Touch</h2>

                <div className="space-y-6">
                  <div className="group flex items-start hover:transform hover:scale-105 transition-all duration-300">
                    <div className="flex-shrink-0 bg-primary/10 p-4 rounded-xl group-hover:bg-primary/20 transition-colors duration-300">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="body-1-semibold text-dark group-hover:text-primary transition-colors duration-300">
                        Email
                      </h3>
                      <a
                        href="mailto:hello@thinkred.tech"
                        className="text-primary hover:text-accent1 transition-colors duration-300 font-medium"
                      >
                        hello@thinkred.tech
                      </a>
                    </div>
                  </div>

                  <div className="group flex items-start hover:transform hover:scale-105 transition-all duration-300">
                    <div className="flex-shrink-0 bg-primary/10 p-4 rounded-xl group-hover:bg-primary/20 transition-colors duration-300">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="body-1-semibold text-dark group-hover:text-primary transition-colors duration-300">
                        Registered Address
                      </h3>
                      <p className="text-secondary leading-relaxed">
                        Sr No 22, Laxmi Nagar, Dhanori, Pune, Maharashtra, India - 411015
                      </p>
                    </div>
                  </div>

                  <div className="group flex items-start hover:transform hover:scale-105 transition-all duration-300">
                    <div className="flex-shrink-0 bg-primary/10 p-4 rounded-xl group-hover:bg-primary/20 transition-colors duration-300">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="body-1-semibold text-dark group-hover:text-primary transition-colors duration-300">
                        Working Hours
                      </h3>
                      <p className="text-secondary">Monday - Friday: 9AM - 6PM IST</p>
                    </div>
                  </div>

                  <div className="group flex items-start hover:transform hover:scale-105 transition-all duration-300">
                    <div className="flex-shrink-0 bg-primary/10 p-4 rounded-xl group-hover:bg-primary/20 transition-colors duration-300">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                        <rect x="11" y="7" width="2" height="2" fill="currentColor" stroke="none" />
                        <rect x="11" y="11" width="2" height="6" fill="currentColor" stroke="none" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="body-1-medium">MCA Information</h3>
                      <p className="text-secondary">LLP Identification Number: ACC-3993</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="body-1-medium mb-4">Connect With Us</h3>
                  <div className="flex space-x-4">
                    <a
                      href="https://github.com/thinkred-tech"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-dark hover:bg-primary text-white p-3 rounded-full transition-colors"
                      aria-label="Visit ThinkRED Technologies on GitHub"
                      title="Visit ThinkRED Technologies on GitHub"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                    </a>
                    <a
                      href="https://linkedin.com/company/thinkred-tech"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-dark hover:bg-primary text-white p-3 rounded-full transition-colors"
                      aria-label="Visit ThinkRED Technologies on LinkedIn"
                      title="Visit ThinkRED Technologies on LinkedIn"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                      </svg>
                    </a>
                    <a
                      href="https://twitter.com/thinkred_tech"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-dark hover:bg-primary text-white p-3 rounded-full transition-colors"
                      aria-label="Visit ThinkRED Technologies on Twitter"
                      title="Visit ThinkRED Technologies on Twitter"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Forms - Shown first on mobile */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              {activeTab === 'contact' && (
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="heading-1 mb-6">Talk to Us</h2>

                  {submitSuccess ? (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-8 rounded-lg mb-6">
                      <div className="flex items-center mb-4">
                        <svg
                          className="w-8 h-8 text-green-500 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <h3 className="heading-2">Message Sent Successfully!</h3>
                      </div>
                      <p className="mb-4">
                        Thank you for reaching out to ThinkRED Technologies. We've received your message and will get
                        back to you shortly.
                      </p>
                      <button onClick={() => setSubmitSuccess(false)} className="btn btn-primary">
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {submitError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                          {submitError}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                          <label htmlFor="name" className="block body-2 text-secondary mb-1">
                            Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label htmlFor="email" className="block body-2 text-secondary mb-1">
                            Email *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>

                        {/* Company */}
                        <div>
                          <label htmlFor="company" className="block body-2 text-secondary mb-1">
                            Company
                          </label>
                          <input
                            type="text"
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>

                        {/* Phone */}
                        <div>
                          <label htmlFor="phone" className="block body-2 text-secondary mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>

                        {/* Project Type */}
                        <div>
                          <label htmlFor="projectType" className="block body-2 text-secondary mb-1">
                            Project Type *
                          </label>
                          <select
                            id="projectType"
                            name="projectType"
                            value={formData.projectType}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="">Select Project Type</option>
                            {projectTypes.map((type, index) => (
                              <option key={index} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Budget */}
                        <div>
                          <label htmlFor="budget" className="block body-2 text-secondary mb-1">
                            Budget Range
                          </label>
                          <select
                            id="budget"
                            name="budget"
                            value={formData.budget}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="">Select Budget Range</option>
                            {budgetRanges.map((range, index) => (
                              <option key={index} value={range}>
                                {range}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Timeline */}
                        <div>
                          <label htmlFor="timeline" className="block body-2 text-secondary mb-1">
                            Timeline
                          </label>
                          <select
                            id="timeline"
                            name="timeline"
                            value={formData.timeline}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="">Select Timeline</option>
                            {timelineOptions.map((option, index) => (
                              <option key={index} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label htmlFor="message" className="block body-2 text-secondary mb-1">
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        ></textarea>
                      </div>

                      {/* Honeypot field for spam prevention - hidden from users */}
                      <div className="hidden">
                        <label htmlFor="honeypot">Leave this field empty</label>
                        <input
                          type="text"
                          id="honeypot"
                          name="honeypot"
                          value={formData.honeypot}
                          onChange={handleChange}
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`btn btn-primary ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                          {isSubmitting ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Sending...
                            </>
                          ) : (
                            'Send Message'
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {activeTab === 'discovery' && <DiscoveryCallScheduler />}

              {activeTab === 'quote' && <QuoteRequestForm />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
