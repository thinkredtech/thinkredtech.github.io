/**
 * Type definitions for the ThinkRED Technologies website
 *
 * This module contains comprehensive TypeScript type definitions used throughout
 * the application to ensure type safety, improve developer experience, and
 * maintain consistency across components.
 *
 * @fileoverview Central type definitions for ThinkRED website
 * @version 1.0.0
 */

/**
 * Represents a navigation item in the website's navigation system
 *
 * @interface NavItem
 * @example
 * ```typescript
 * const homeNavItem: NavItem = {
 *   name: 'Home',
 *   path: '/'
 * };
 * ```
 */
export interface NavItem {
  /** Display name of the navigation item */
  name: string;
  /** URL path or route for the navigation item */
  path: string;
}

/**
 * Defines a service offering provided by ThinkRED Technologies
 *
 * @interface Service
 * @example
 * ```typescript
 * const webDevService: Service = {
 *   title: 'Web Development',
 *   description: 'Custom web applications built with modern frameworks',
 *   features: ['React', 'TypeScript', 'Responsive Design'],
 *   icon: <WebIcon />
 * };
 * ```
 */
export interface Service {
  /** Name of the service */
  title: string;
  /** Detailed description of the service */
  description: string;
  /** Array of key features or technologies included in the service */
  features: string[];
  /** React component or element representing the service icon */
  icon: React.ReactNode;
}

/**
 * Represents different tiers or packages of a service offering
 *
 * @interface ServiceTier
 * @example
 * ```typescript
 * const premiumTier: ServiceTier = {
 *   name: 'Premium',
 *   description: 'Full-featured development with premium support',
 *   features: ['24/7 Support', 'Custom Features', 'Priority Updates'],
 *   highlighted: true
 * };
 * ```
 */
export interface ServiceTier {
  /** Name of the service tier (e.g., 'Basic', 'Standard', 'Premium') */
  name: string;
  /** Description of what this tier includes */
  description: string;
  /** Array of features included in this tier */
  features: string[];
  /** Whether this tier should be visually highlighted as recommended */
  highlighted?: boolean;
}

/**
 * Represents a project or portfolio item showcasing ThinkRED's work
 *
 * @interface Project
 * @example
 * ```typescript
 * const portfolioProject: Project = {
 *   title: 'E-commerce Platform',
 *   client: 'TechCorp Inc.',
 *   description: 'Modern e-commerce solution with advanced features',
 *   image: '/images/projects/ecommerce-platform.jpg',
 *   technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
 *   featured: true
 * };
 * ```
 */
export interface Project {
  /** Project title or name */
  title: string;
  /** Client or company name for whom the project was built */
  client: string;
  /** Detailed description of the project and its outcomes */
  description: string;
  /** URL or path to the project's main image */
  image: string;
  /** Array of technologies used in the project */
  technologies: string[];
  /** Whether this project should be featured prominently */
  featured?: boolean;
}

/**
 * Represents a client testimonial or review
 *
 * @interface Testimonial
 * @example
 * ```typescript
 * const clientTestimonial: Testimonial = {
 *   quote: 'ThinkRED delivered exceptional results beyond our expectations',
 *   author: 'John Doe',
 *   position: 'CTO',
 *   company: 'TechCorp Inc.',
 *   image: '/images/testimonials/john-doe.jpg'
 * };
 * ```
 */
export interface Testimonial {
  /** The testimonial text or quote */
  quote: string;
  /** Name of the person providing the testimonial */
  author: string;
  /** Job title or position of the testimonial author */
  position: string;
  /** Company or organization the author represents */
  company: string;
  /** URL or path to the author's profile image */
  image: string;
}

/**
 * Represents a blog article or news item
 *
 * @interface Article
 * @example
 * ```typescript
 * const blogArticle: Article = {
 *   title: 'The Future of Web Development',
 *   excerpt: 'Exploring emerging trends in modern web development...',
 *   date: '2024-06-15',
 *   author: 'ThinkRED Team',
 *   slug: 'future-of-web-development',
 *   tags: ['Web Development', 'Technology', 'Trends'],
 *   readTime: 5,
 *   featured: false
 * };
 * ```
 */
export interface Article {
  /** Article title */
  title: string;
  /** Brief excerpt or summary of the article */
  excerpt: string;
  /** Publication date in YYYY-MM-DD format */
  date: string;
  /** Author name or byline */
  author: string;
  /** URL slug for the article (used in routing) */
  slug: string;
  /** Array of tags or categories associated with the article */
  tags: string[];
  /** Estimated reading time in minutes */
  readTime: number;
  /** Whether this article should be featured */
  featured?: boolean;
}

/**
 * Represents form data structure for contact forms
 *
 * @interface ContactFormData
 * @example
 * ```typescript
 * const formData: ContactFormData = {
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   company: 'TechCorp Inc.',
 *   phone: '+1-555-0123',
 *   projectType: 'Web Development',
 *   budget: '$10,000 - $25,000',
 *   timeline: '3-6 months',
 *   message: 'We need a custom e-commerce solution...'
 * };
 * ```
 */
export interface ContactFormData {
  /** Full name of the contact person */
  name: string;
  /** Email address for communication */
  email: string;
  /** Company or organization name */
  company: string;
  /** Phone number (optional) */
  phone?: string;
  /** Type of project or service needed */
  projectType: string;
  /** Budget range for the project */
  budget: string;
  /** Expected timeline for completion */
  timeline: string;
  /** Detailed message or project description */
  message: string;
}

/**
 * Technology or skill item used in technology stack displays
 *
 * @interface TechStackItem
 * @example
 * ```typescript
 * const reactTech: TechStackItem = {
 *   name: 'React',
 *   category: 'Frontend',
 *   icon: '/icons/react.svg',
 *   description: 'Modern JavaScript library for building user interfaces',
 *   proficiency: 'Expert',
 *   featured: true
 * };
 * ```
 */
export interface TechStackItem {
  /** Name of the technology */
  name: string;
  /** Category or type of technology (Frontend, Backend, DevOps, etc.) */
  category: string;
  /** URL or path to the technology's icon/logo */
  icon: string;
  /** Brief description of the technology's purpose */
  description: string;
  /** Team's proficiency level with this technology */
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  /** Whether this technology should be featured prominently */
  featured?: boolean;
}

/**
 * Team member information for about page and team sections
 *
 * @interface TeamMember
 * @example
 * ```typescript
 * const teamMember: TeamMember = {
 *   name: 'Jane Smith',
 *   position: 'Senior Frontend Developer',
 *   bio: 'Passionate about creating beautiful and functional user interfaces',
 *   image: '/images/team/jane-smith.jpg',
 *   skills: ['React', 'TypeScript', 'UI/UX Design'],
 *   social: {
 *     linkedin: 'https://linkedin.com/in/janesmith',
 *     github: 'https://github.com/janesmith',
 *     twitter: 'https://twitter.com/janesmith'
 *   }
 * };
 * ```
 */
export interface TeamMember {
  /** Full name of the team member */
  name: string;
  /** Job title or position */
  position: string;
  /** Brief biography or description */
  bio: string;
  /** URL or path to profile image */
  image: string;
  /** Array of key skills or technologies */
  skills: string[];
  /** Social media profiles and links */
  social?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
}

/**
 * FAQ item structure for frequently asked questions
 *
 * @interface FAQItem
 * @example
 * ```typescript
 * const faqItem: FAQItem = {
 *   question: 'What is your typical project timeline?',
 *   answer: 'Project timelines vary based on scope and complexity...',
 *   category: 'General',
 *   featured: true
 * };
 * ```
 */
export interface FAQItem {
  /** The question being asked */
  question: string;
  /** The detailed answer to the question */
  answer: string;
  /** Category for grouping related questions */
  category: string;
  /** Whether this FAQ should be prominently displayed */
  featured?: boolean;
}

/**
 * Generic API response structure for consistency across the application
 *
 * @interface ApiResponse<T>
 * @template T The type of data being returned
 * @example
 * ```typescript
 * const response: ApiResponse<Project[]> = {
 *   success: true,
 *   data: [project1, project2],
 *   message: 'Projects retrieved successfully',
 *   timestamp: '2024-06-15T10:30:00Z'
 * };
 * ```
 */
export interface ApiResponse<T> {
  /** Whether the request was successful */
  success: boolean;
  /** The actual data payload */
  data?: T;
  /** Human-readable message about the response */
  message: string;
  /** Optional error details if the request failed */
  error?: string;
  /** ISO timestamp of when the response was generated */
  timestamp: string;
}

/**
 * Common props interface for page components
 *
 * @interface PageProps
 * @example
 * ```typescript
 * const HomePage: React.FC<PageProps> = ({ className, children }) => {
 *   return (
 *     <div className={className}>
 *       {children}
 *     </div>
 *   );
 * };
 * ```
 */
export interface PageProps {
  /** Additional CSS classes to apply */
  className?: string;
  /** Child components to render */
  children?: React.ReactNode;
}

/**
 * Animation and transition configuration
 *
 * @interface AnimationConfig
 * @example
 * ```typescript
 * const fadeInConfig: AnimationConfig = {
 *   duration: 500,
 *   delay: 100,
 *   easing: 'ease-out',
 *   direction: 'up'
 * };
 * ```
 */
export interface AnimationConfig {
  /** Animation duration in milliseconds */
  duration: number;
  /** Delay before animation starts in milliseconds */
  delay?: number;
  /** CSS easing function */
  easing?: string;
  /** Direction of animation (for slide/fade effects) */
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
}

/**
 * Job position/opening structure for career page
 *
 * @interface Position
 * @example
 * ```typescript
 * const position: Position = {
 *   id: 1,
 *   slug: 'senior-frontend-developer',
 *   title: 'Senior Frontend Developer',
 *   type: 'Full-time',
 *   location: 'Remote',
 *   experience: '3+ years',
 *   description: 'Join our team to build amazing user experiences...',
 *   requirements: ['React expertise', 'TypeScript knowledge'],
 *   responsibilities: ['Build frontend applications', 'Mentor junior devs'],
 *   skills: ['React', 'TypeScript', 'CSS'],
 *   createdAt: '2024-01-15T10:00:00Z',
 *   updatedAt: '2024-01-15T10:00:00Z'
 * };
 * ```
 */
export interface Position {
  /** Unique identifier for the position */
  id: number;
  /** URL-friendly unique identifier for the position */
  slug: string;
  /** Job title or position name */
  title: string;
  /** Employment type (e.g., Full-time, Part-time, Contract) */
  type: string;
  /** Work location (e.g., Remote, On-site, Hybrid) */
  location: string;
  /** Required experience level */
  experience: string;
  /** Detailed description of the role */
  description: string;
  /** Array of job requirements */
  requirements: string[];
  /** Array of key responsibilities */
  responsibilities: string[];
  /** Array of required/preferred skills */
  skills: string[];
  /** ISO timestamp when the position was created */
  createdAt: string;
  /** ISO timestamp when the position was last updated */
  updatedAt: string;
}

/**
 * Job application data structure
 *
 * @interface JobApplication
 * @example
 * ```typescript
 * const application: JobApplication = {
 *   applicationId: 'APP-1234567890-abc123def',
 *   jobId: 1,
 *   jobSlug: 'senior-frontend-developer',
 *   jobTitle: 'Senior Frontend Developer',
 *   applicant: {
 *     firstName: 'John',
 *     lastName: 'Doe',
 *     email: 'john.doe@example.com',
 *     phone: '+1234567890',
 *     linkedIn: 'https://linkedin.com/in/johndoe',
 *     portfolio: 'https://johndoe.dev',
 *     coverLetter: 'I am interested in this position...',
 *     experience: '5 years of React development...',
 *     availability: 'immediately',
 *     salaryExpectation: '$80,000 - $90,000',
 *     relocate: 'no',
 *     references: 'Available upon request'
 *   },
 *   status: 'submitted',
 *   submittedAt: '2024-01-16T10:00:00Z',
 *   updatedAt: '2024-01-16T10:00:00Z'
 * };
 * ```
 */
export interface JobApplication {
  /** Unique application identifier */
  applicationId: string;
  /** ID of the job position */
  jobId: number;
  /** Slug of the job position */
  jobSlug: string;
  /** Title of the job position */
  jobTitle: string;
  /** Applicant's personal and professional information */
  applicant: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    linkedIn?: string;
    portfolio?: string;
    coverLetter?: string;
    experience?: string;
    availability?: string;
    salaryExpectation?: string;
    relocate?: string;
    references?: string;
    resume?: File | string; // File object or file path/URL
    coverLetterFile?: File | string; // File object or file path/URL
  };
  /** Current status of the application */
  status:
    | 'submitted'
    | 'under_review'
    | 'interviewing'
    | 'offer_extended'
    | 'accepted'
    | 'rejected';
  /** ISO timestamp when the application was submitted */
  submittedAt: string;
  /** ISO timestamp when the application was last updated */
  updatedAt: string;
}
