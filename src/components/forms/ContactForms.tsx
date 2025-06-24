import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  sanitizeInput,
  validateEmail,
  validatePhone,
  validateTextLength,
} from '../../utils/security';
import {
  submitContactForm,
  checkRateLimit,
  validateHoneypot,
} from '../../utils/api';

// Discovery Call component
const DiscoveryCallScheduler = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    projectType: '',
    preferredDate: '',
    preferredTime: '',
    timezone: '',
    additionalInfo: '',
    honeypot: '', // Spam prevention field
  });

  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
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
        setSubmitError('Please wait before submitting another request.');
        setIsSubmitting(false);
        return;
      }

      // Input validation
      if (!validateEmail(formData.email)) {
        setSubmitError('Please enter a valid email address.');
        setIsSubmitting(false);
        return;
      }

      if (!validatePhone(formData.phone)) {
        setSubmitError('Please enter a valid phone number.');
        setIsSubmitting(false);
        return;
      }

      if (!validateTextLength(formData.name, 100, 1)) {
        setSubmitError('Name must be between 1 and 100 characters.');
        setIsSubmitting(false);
        return;
      }

      if (!validateTextLength(formData.company, 100, 1)) {
        setSubmitError('Company name must be between 1 and 100 characters.');
        setIsSubmitting(false);
        return;
      }

      if (!validateTextLength(formData.additionalInfo, 500, 0)) {
        setSubmitError(
          'Additional information must be less than 500 characters.'
        );
        setIsSubmitting(false);
        return;
      }

      // Sanitize inputs
      const sanitizedData = {
        formType: 'Discovery Call',
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email),
        company: sanitizeInput(formData.company),
        phone: sanitizeInput(formData.phone),
        message: `Discovery Call Request - Project Type: ${sanitizeInput(formData.projectType)}, Preferred Date: ${sanitizeInput(formData.preferredDate)}, Preferred Time: ${sanitizeInput(formData.preferredTime)}, Timezone: ${sanitizeInput(formData.timezone)}, Additional Info: ${sanitizeInput(formData.additionalInfo)}`,
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
        preferredDate: '',
        preferredTime: '',
        timezone: '',
        additionalInfo: '',
        honeypot: '',
      });
    } catch {
      // Error scheduling discovery call - handled gracefully
      setSubmitError(
        'There was an error scheduling your call. Please try again later.'
      );
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

  const timezones = [
    'UTC-12:00',
    'UTC-11:00',
    'UTC-10:00',
    'UTC-09:00',
    'UTC-08:00 (PST)',
    'UTC-07:00 (MST)',
    'UTC-06:00 (CST)',
    'UTC-05:00 (EST)',
    'UTC-04:00',
    'UTC-03:00',
    'UTC-02:00',
    'UTC-01:00',
    'UTC+00:00 (GMT)',
    'UTC+01:00 (CET)',
    'UTC+02:00',
    'UTC+03:00',
    'UTC+04:00',
    'UTC+05:00',
    'UTC+05:30 (IST)',
    'UTC+06:00',
    'UTC+07:00',
    'UTC+08:00',
    'UTC+09:00 (JST)',
    'UTC+10:00',
    'UTC+11:00',
    'UTC+12:00',
  ];

  const timeSlots = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '12:00 PM',
    '12:30 PM',
    '01:00 PM',
    '01:30 PM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
    '04:30 PM',
    '05:00 PM',
    '05:30 PM',
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="heading-1 mb-6">Schedule a Discovery Call</h2>

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
            <h3 className="heading-2">Discovery Call Scheduled!</h3>
          </div>
          <p className="mb-4">
            Thank you for scheduling a discovery call with ThinkRED
            Technologies. We'll confirm your appointment shortly via email.
          </p>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="btn btn-primary"
          >
            Schedule Another Call
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
              <label
                htmlFor="dc-name"
                className="block body-2 text-secondary mb-1"
              >
                Name *
              </label>
              <input
                type="text"
                id="dc-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="dc-email"
                className="block body-2 text-secondary mb-1"
              >
                Email *
              </label>
              <input
                type="email"
                id="dc-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Company */}
            <div>
              <label
                htmlFor="dc-company"
                className="block body-2 text-secondary mb-1"
              >
                Company
              </label>
              <input
                type="text"
                id="dc-company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="dc-phone"
                className="block body-2 text-secondary mb-1"
              >
                Phone
              </label>
              <input
                type="tel"
                id="dc-phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Project Type */}
            <div>
              <label
                htmlFor="dc-projectType"
                className="block body-2 text-secondary mb-1"
              >
                Project Type *
              </label>
              <select
                id="dc-projectType"
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

            {/* Timezone */}
            <div>
              <label
                htmlFor="dc-timezone"
                className="block body-2 text-secondary mb-1"
              >
                Your Timezone *
              </label>
              <select
                id="dc-timezone"
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select Your Timezone</option>
                {timezones.map((timezone, index) => (
                  <option key={index} value={timezone}>
                    {timezone}
                  </option>
                ))}
              </select>
            </div>

            {/* Preferred Date */}
            <div>
              <label
                htmlFor="dc-preferredDate"
                className="block body-2 text-secondary mb-1"
              >
                Preferred Date *
              </label>
              <input
                type="date"
                id="dc-preferredDate"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Preferred Time */}
            <div>
              <label
                htmlFor="dc-preferredTime"
                className="block body-2 text-secondary mb-1"
              >
                Preferred Time *
              </label>
              <select
                id="dc-preferredTime"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select Preferred Time</option>
                {timeSlots.map((slot, index) => (
                  <option key={index} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            {/* Additional Information */}
            <div className="md:col-span-2">
              <label
                htmlFor="dc-additionalInfo"
                className="block body-2 text-secondary mb-1"
              >
                Additional Information
              </label>
              <textarea
                id="dc-additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Please share any specific topics you'd like to discuss during the call."
              ></textarea>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="dc-privacy"
              required
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label
              htmlFor="dc-privacy"
              className="ml-2 block text-sm text-secondary"
            >
              I agree to the{' '}
              <Link
                to="/privacy-policy"
                className="text-primary hover:underline"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Honeypot field - hidden from users to prevent spam */}
          <div className="hidden">
            <label htmlFor="dc-website">
              Website (leave blank if you're human)
            </label>
            <input
              type="text"
              id="dc-website"
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
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Scheduling...
                </>
              ) : (
                'Schedule Call'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

// Quote Request component
const QuoteRequestForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    projectType: '',
    projectDescription: '',
    budget: '',
    timeline: '',
    requirements: '',
    hearAboutUs: '',
    honeypot: '', // Spam prevention field
  });

  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
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
        setSubmitError('Please wait before submitting another request.');
        setIsSubmitting(false);
        return;
      }

      // Input validation
      if (!validateEmail(formData.email)) {
        setSubmitError('Please enter a valid email address.');
        setIsSubmitting(false);
        return;
      }

      if (!validatePhone(formData.phone)) {
        setSubmitError('Please enter a valid phone number.');
        setIsSubmitting(false);
        return;
      }

      if (!validateTextLength(formData.name, 100, 1)) {
        setSubmitError('Name must be between 1 and 100 characters.');
        setIsSubmitting(false);
        return;
      }

      if (!validateTextLength(formData.company, 100, 1)) {
        setSubmitError('Company name must be between 1 and 100 characters.');
        setIsSubmitting(false);
        return;
      }

      if (!validateTextLength(formData.projectDescription, 500, 10)) {
        setSubmitError(
          'Project description must be between 10 and 500 characters.'
        );
        setIsSubmitting(false);
        return;
      }

      if (!validateTextLength(formData.requirements, 500, 0)) {
        setSubmitError('Requirements must be less than 500 characters.');
        setIsSubmitting(false);
        return;
      }

      // Sanitize inputs
      const sanitizedData = {
        formType: 'Quote Request',
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email),
        company: sanitizeInput(formData.company),
        phone: sanitizeInput(formData.phone),
        message: `Quote Request - Project Type: ${sanitizeInput(formData.projectType)}, Project Description: ${sanitizeInput(formData.projectDescription)}, Budget: ${sanitizeInput(formData.budget)}, Timeline: ${sanitizeInput(formData.timeline)}, Requirements: ${sanitizeInput(formData.requirements)}, How they heard about us: ${sanitizeInput(formData.hearAboutUs)}`,
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
        projectDescription: '',
        budget: '',
        timeline: '',
        requirements: '',
        hearAboutUs: '',
        honeypot: '',
      });
    } catch {
      // Error requesting quote - handled gracefully
      setSubmitError(
        'There was an error submitting your quote request. Please try again later.'
      );
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

  const timelineOptions = [
    'Less than 1 month',
    '1-3 months',
    '3-6 months',
    '6+ months',
    'Ongoing support',
  ];

  const referralSources = [
    'Google Search',
    'Social Media',
    'Referral',
    'Blog/Article',
    'Conference/Event',
    'Other',
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="heading-1 mb-6">Request a Quote</h2>

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
            <h3 className="heading-2">Quote Request Received!</h3>
          </div>
          <p className="mb-4">
            Thank you for your interest in ThinkRED Technologies. We'll review
            your project details and get back to you with a customized quote
            within 2 business days.
          </p>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="btn btn-primary"
          >
            Submit Another Request
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
              <label
                htmlFor="qr-name"
                className="block body-2 text-secondary mb-1"
              >
                Name *
              </label>
              <input
                type="text"
                id="qr-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="qr-email"
                className="block body-2 text-secondary mb-1"
              >
                Email *
              </label>
              <input
                type="email"
                id="qr-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Company */}
            <div>
              <label
                htmlFor="qr-company"
                className="block body-2 text-secondary mb-1"
              >
                Company
              </label>
              <input
                type="text"
                id="qr-company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="qr-phone"
                className="block body-2 text-secondary mb-1"
              >
                Phone
              </label>
              <input
                type="tel"
                id="qr-phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Project Type */}
            <div>
              <label
                htmlFor="qr-projectType"
                className="block body-2 text-secondary mb-1"
              >
                Project Type *
              </label>
              <select
                id="qr-projectType"
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
              <label
                htmlFor="qr-budget"
                className="block body-2 text-secondary mb-1"
              >
                Budget *
              </label>
              <select
                id="qr-budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
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
              <label
                htmlFor="qr-timeline"
                className="block body-2 text-secondary mb-1"
              >
                Timeline *
              </label>
              <select
                id="qr-timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                required
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

            {/* How did you hear about us */}
            <div>
              <label
                htmlFor="qr-hearAboutUs"
                className="block body-2 text-secondary mb-1"
              >
                How did you hear about us?
              </label>
              <select
                id="qr-hearAboutUs"
                name="hearAboutUs"
                value={formData.hearAboutUs}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select an option</option>
                {referralSources.map((source, index) => (
                  <option key={index} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>

            {/* Project Description */}
            <div className="md:col-span-2">
              <label
                htmlFor="qr-projectDescription"
                className="block body-2 text-secondary mb-1"
              >
                Project Description *
              </label>
              <textarea
                id="qr-projectDescription"
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Please provide a brief overview of your project, including its goals and target audience."
              ></textarea>
            </div>

            {/* Specific Requirements */}
            <div className="md:col-span-2">
              <label
                htmlFor="qr-requirements"
                className="block body-2 text-secondary mb-1"
              >
                Specific Requirements
              </label>
              <textarea
                id="qr-requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Please list any specific features, technologies, or requirements for your project."
              ></textarea>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="qr-privacy"
              required
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label
              htmlFor="qr-privacy"
              className="ml-2 block text-sm text-secondary"
            >
              I agree to the{' '}
              <Link
                to="/privacy-policy"
                className="text-primary hover:underline"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Honeypot field - hidden from users to prevent spam */}
          <div className="hidden">
            <label htmlFor="qr-website">
              Website (leave blank if you're human)
            </label>
            <input
              type="text"
              id="qr-website"
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
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Submitting...
                </>
              ) : (
                'Request Quote'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export { DiscoveryCallScheduler, QuoteRequestForm };
