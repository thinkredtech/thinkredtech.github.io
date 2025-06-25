import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import { hardcodedPositions } from './CareerPage';
import { getAllJobPositions } from '../utils/jobUtils';
import { Position, JobApplication } from '../types';
import {
  sanitizeInput,
  validateEmail,
  validatePhone,
  validateURL,
  validateTextLength,
  validateFile,
} from '../utils/security';
import {
  submitJobApplication,
  checkRateLimit,
  validateHoneypot,
} from '../utils/api';

const JobApplicationPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Position | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedIn: '',
    portfolio: '',
    coverLetter: '',
    experience: '',
    availability: '',
    salaryExpectation: '',
    relocate: '',
    references: '',
    honeypot: '', // Spam prevention field
  });

  // File state
  const [files, setFiles] = useState<{
    resume: File | null;
    coverLetterFile: File | null;
  }>({
    resume: null,
    coverLetterFile: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const allJobs = getAllJobPositions(hardcodedPositions);
    const foundJob = allJobs.find(
      (p: Position) => p.id.toString() === jobId || p.slug === jobId
    );
    if (foundJob) {
      setJob(foundJob);
    }
  }, [jobId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: 'resume' | 'coverLetterFile'
  ) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Use centralized file validation
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];

      const validationResult = validateFile(
        file,
        allowedTypes,
        5 * 1024 * 1024
      ); // 5MB limit

      if (!validationResult.isValid) {
        setErrors(prev => ({
          ...prev,
          [fileType]: validationResult.error || 'File validation failed',
        }));
        return;
      }
    }

    setFiles(prev => ({
      ...prev,
      [fileType]: file,
    }));

    // Clear error
    if (errors[fileType]) {
      setErrors(prev => ({
        ...prev,
        [fileType]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Enhanced validation with sanitization
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (!validateTextLength(formData.firstName, 50)) {
      newErrors.firstName = 'First name must be less than 50 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (!validateTextLength(formData.lastName, 50)) {
      newErrors.lastName = 'Last name must be less than 50 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // URL validation for optional fields
    if (formData.linkedIn && !validateURL(formData.linkedIn)) {
      newErrors.linkedIn = 'Please enter a valid LinkedIn URL';
    }

    if (formData.portfolio && !validateURL(formData.portfolio)) {
      newErrors.portfolio = 'Please enter a valid portfolio URL';
    }

    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = 'Cover letter is required';
    } else if (formData.coverLetter.trim().length < 100) {
      newErrors.coverLetter = 'Cover letter must be at least 100 characters';
    } else if (!validateTextLength(formData.coverLetter, 2000)) {
      newErrors.coverLetter = 'Cover letter must be less than 2000 characters';
    }
    if (!formData.experience.trim()) {
      newErrors.experience = 'Please describe your relevant experience';
    }
    if (!formData.availability.trim()) {
      newErrors.availability = 'Please specify your availability';
    }

    // File validation
    if (!files.resume) {
      newErrors.resume = 'Resume is required';
    }

    // File validation
    if (!files.resume) {
      newErrors.resume = 'Resume is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Spam prevention: Check honeypot field
      if (!validateHoneypot(formData.honeypot)) {
        alert('Spam detected. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Rate limiting: Check for rapid successive submissions
      if (!checkRateLimit(formData.email, 10000)) {
        alert('Please wait before submitting another application.');
        setIsSubmitting(false);
        return;
      }

      // Generate application ID (in real app, this would come from backend)
      const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Prepare data for submission
      const fullName = `${formData.firstName} ${formData.lastName}`;

      // Submit to backend API
      await submitJobApplication({
        jobId: job?.slug || job?.id.toString() || '',
        applicationId,
        name: fullName,
        email: formData.email,
        phone: formData.phone,
        resumeFile: files.resume!,
        coverLetterFile: files.coverLetterFile || undefined,
      });

      // Sanitize all form inputs for local storage (existing logic)
      const sanitizedFormData = {
        firstName: sanitizeInput(formData.firstName),
        lastName: sanitizeInput(formData.lastName),
        email: sanitizeInput(formData.email),
        phone: sanitizeInput(formData.phone),
        linkedIn: sanitizeInput(formData.linkedIn),
        portfolio: sanitizeInput(formData.portfolio),
        coverLetter: sanitizeInput(formData.coverLetter),
        experience: sanitizeInput(formData.experience),
        availability: sanitizeInput(formData.availability),
        salaryExpectation: sanitizeInput(formData.salaryExpectation),
        relocate: sanitizeInput(formData.relocate),
        references: sanitizeInput(formData.references),
      };

      // Store application data (for local tracking)
      const applicationData: JobApplication = {
        applicationId,
        jobId: job?.id || 0,
        jobSlug: job?.slug || '',
        jobTitle: job?.title || '',
        applicant: {
          ...sanitizedFormData,
          resume: files.resume ? files.resume.name : undefined,
          coverLetterFile: files.coverLetterFile
            ? files.coverLetterFile.name
            : undefined,
        },
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Store in localStorage for demo purposes
      localStorage.setItem(
        `application_${applicationId}`,
        JSON.stringify(applicationData)
      );

      setIsSubmitted(true);
    } catch (error) {
      // Handle error appropriately with better error message
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error submitting application: ${errorMessage}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!job) {
    return (
      <div>
        <PageHero
          title="Job Not Found"
          subtitle="The job opening you are looking for does not exist or is no longer available."
        />
        <div className="container mx-auto px-4 py-16 text-center">
          <Link to="/careers" className="btn btn-primary">
            View Open Positions
          </Link>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div>
        <PageHero
          title="Application Submitted!"
          subtitle={`Thank you for applying for the ${job.title} position`}
        />
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="bg-green-50 border border-green-200 rounded-xl p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="heading-1 text-secondary mb-4">
                Application Received
              </h2>
              <p className="body-1 text-secondary mb-6">
                We have received your application for the{' '}
                <strong>{job.title}</strong> position. Our team will review your
                application and get back to you within 5-7 business days.
              </p>
              <p className="body-2 text-secondary mb-8">
                If you have any questions, please don't hesitate to contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/careers" className="btn btn-primary">
                  View Other Positions
                </Link>
                <Link to="/contact" className="btn btn-secondary">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHero
        title={`Apply for ${job.title}`}
        subtitle={`${job.type} | ${job.location} | ${job.experience} Experience`}
      />

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Job Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                <h3 className="heading-2 text-secondary mb-4">
                  Position Summary
                </h3>
                <div className="space-y-4">
                  <div>
                    <span className="body-3 text-secondary/70">Position:</span>
                    <p className="body-1-medium text-secondary">{job.title}</p>
                  </div>
                  <div>
                    <span className="body-3 text-secondary/70">Type:</span>
                    <p className="body-1-medium text-secondary">{job.type}</p>
                  </div>
                  <div>
                    <span className="body-3 text-secondary/70">Location:</span>
                    <p className="body-1-medium text-secondary">
                      {job.location}
                    </p>
                  </div>
                  <div>
                    <span className="body-3 text-secondary/70">
                      Experience:
                    </span>
                    <p className="body-1-medium text-secondary">
                      {job.experience}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link
                    to={`/careers/${job.id}`}
                    className="text-primary hover:text-primary/80 body-2 transition-colors"
                  >
                    ← View Job Details
                  </Link>
                </div>
              </div>
            </div>

            {/* Application Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="heading-1 text-secondary mb-6">
                  Application Form
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="heading-3 text-secondary mb-4">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block body-2 text-secondary mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 ${
                            errors.firstName
                              ? 'border-red-500'
                              : 'border-gray-200'
                          }`}
                          placeholder="John"
                        />
                        {errors.firstName && (
                          <p className="text-red-500 body-3 mt-1">
                            {errors.firstName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block body-2 text-secondary mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 ${
                            errors.lastName
                              ? 'border-red-500'
                              : 'border-gray-200'
                          }`}
                          placeholder="Doe"
                        />
                        {errors.lastName && (
                          <p className="text-red-500 body-3 mt-1">
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="heading-3 text-secondary mb-4">
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block body-2 text-secondary mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 ${
                            errors.email ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="john.doe@example.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 body-3 mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block body-2 text-secondary mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 ${
                            errors.phone ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="+1 (555) 123-4567"
                        />
                        {errors.phone && (
                          <p className="text-red-500 body-3 mt-1">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block body-2 text-secondary mb-2">
                          LinkedIn Profile
                        </label>
                        <input
                          type="url"
                          name="linkedIn"
                          value={formData.linkedIn}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                          placeholder="https://linkedin.com/in/johndoe"
                        />
                      </div>
                      <div>
                        <label className="block body-2 text-secondary mb-2">
                          Portfolio/Website
                        </label>
                        <input
                          type="url"
                          name="portfolio"
                          value={formData.portfolio}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                          placeholder="https://johndoe.dev"
                        />
                      </div>
                    </div>
                  </div>

                  {/* File Uploads */}
                  <div>
                    <h3 className="heading-3 text-secondary mb-4">Documents</h3>
                    <div className="space-y-6">
                      <div>
                        <label
                          htmlFor="resume-upload"
                          className="block body-2 text-secondary mb-2"
                        >
                          Resume/CV *
                        </label>
                        <div className="relative">
                          <input
                            id="resume-upload"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={e => handleFileChange(e, 'resume')}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90"
                          />
                          {files.resume && (
                            <p className="text-sm text-green-600 mt-2">
                              ✓ {files.resume.name} (
                              {Math.round(files.resume.size / 1024)}KB)
                            </p>
                          )}
                          {errors.resume && (
                            <p className="text-red-500 body-3 mt-1">
                              {errors.resume}
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          PDF, DOC, or DOCX format. Max 5MB.
                        </p>
                      </div>
                      <div>
                        <label
                          htmlFor="cover-letter-upload"
                          className="block body-2 text-secondary mb-2"
                        >
                          Cover Letter File (Optional)
                        </label>
                        <div className="relative">
                          <input
                            id="cover-letter-upload"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={e =>
                              handleFileChange(e, 'coverLetterFile')
                            }
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90"
                          />
                          {files.coverLetterFile && (
                            <p className="text-sm text-green-600 mt-2">
                              ✓ {files.coverLetterFile.name} (
                              {Math.round(files.coverLetterFile.size / 1024)}KB)
                            </p>
                          )}
                          {errors.coverLetterFile && (
                            <p className="text-red-500 body-3 mt-1">
                              {errors.coverLetterFile}
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          PDF, DOC, or DOCX format. Max 5MB.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Application Details */}
                  <div>
                    <h3 className="heading-3 text-secondary mb-4">
                      Application Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block body-2 text-secondary mb-2">
                          Cover Letter *
                        </label>
                        <textarea
                          name="coverLetter"
                          value={formData.coverLetter}
                          onChange={handleInputChange}
                          rows={6}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 resize-vertical ${
                            errors.coverLetter
                              ? 'border-red-500'
                              : 'border-gray-200'
                          }`}
                          placeholder="Tell us why you're interested in this position and how your skills and experience make you a great fit..."
                        />
                        {errors.coverLetter && (
                          <p className="text-red-500 body-3 mt-1">
                            {errors.coverLetter}
                          </p>
                        )}
                        <p className="body-3 text-secondary/70 mt-1">
                          Minimum 100 characters ({formData.coverLetter.length}
                          /100)
                        </p>
                      </div>
                      <div>
                        <label className="block body-2 text-secondary mb-2">
                          Relevant Experience *
                        </label>
                        <textarea
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          rows={4}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 resize-vertical ${
                            errors.experience
                              ? 'border-red-500'
                              : 'border-gray-200'
                          }`}
                          placeholder="Describe your relevant work experience, projects, and achievements..."
                        />
                        {errors.experience && (
                          <p className="text-red-500 body-3 mt-1">
                            {errors.experience}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block body-2 text-secondary mb-2">
                          Availability *
                        </label>
                        <select
                          name="availability"
                          value={formData.availability}
                          onChange={handleInputChange}
                          aria-label="Availability"
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 ${
                            errors.availability
                              ? 'border-red-500'
                              : 'border-gray-200'
                          }`}
                        >
                          <option value="">Select your availability</option>
                          <option value="immediately">Immediately</option>
                          <option value="2weeks">2 weeks notice</option>
                          <option value="1month">1 month notice</option>
                          <option value="2months">2 months notice</option>
                          <option value="3months">3+ months</option>
                        </select>
                        {errors.availability && (
                          <p className="text-red-500 body-3 mt-1">
                            {errors.availability}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div>
                    <h3 className="heading-3 text-secondary mb-4">
                      Additional Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block body-2 text-secondary mb-2">
                          Salary Expectation
                        </label>
                        <input
                          type="text"
                          name="salaryExpectation"
                          value={formData.salaryExpectation}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                          placeholder="Expected range or specific amount in preferred currency"
                        />
                      </div>
                      <div>
                        <label className="block body-2 text-secondary mb-2">
                          Willing to Relocate (if the position requires it)?
                        </label>
                        <select
                          name="relocate"
                          value={formData.relocate}
                          onChange={handleInputChange}
                          aria-label="Willing to Relocate (if the position requires it)?"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                        >
                          <option value="">Select an option</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                          <option value="maybe">Open to discussion</option>
                        </select>
                      </div>
                      <div>
                        <label className="block body-2 text-secondary mb-2">
                          References
                        </label>
                        <textarea
                          name="references"
                          value={formData.references}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 resize-vertical"
                          placeholder="Please provide contact information for 2-3 professional references (optional)"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Honeypot field - hidden from users to prevent spam */}
                  <div className="hidden">
                    <label htmlFor="website">
                      Website (leave blank if you're human)
                    </label>
                    <input
                      type="text"
                      id="website"
                      name="website"
                      value={formData.honeypot}
                      onChange={e =>
                        setFormData({ ...formData, honeypot: e.target.value })
                      }
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn btn-primary py-4 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Submitting Application...
                        </div>
                      ) : (
                        'Submit Application'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JobApplicationPage;
