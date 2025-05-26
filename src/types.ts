// This file contains type declarations for the ThinkRED website
// These types are used throughout the application to ensure type safety

// Navigation item type
export interface NavItem {
  name: string;
  path: string;
}

// Service type
export interface Service {
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
}

// Service tier type
export interface ServiceTier {
  name: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

// Project/portfolio item type
export interface Project {
  title: string;
  client: string;
  description: string;
  image: string;
  technologies: string[];
  featured?: boolean;
}

// Testimonial type
export interface Testimonial {
  quote: string;
  author: string;
  position: string;
  company: string;
  image: string;
}

// Blog article type
export interface Article {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  image: string;
}

// Contact form data type
export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  projectType: string;
  requirements: string;
  budget: string;
  timeline: string;
  source: string;
}

// Technology item type
export interface Technology {
  name: string;
  icon: string;
}

// Technology category type
export interface TechnologyCategory {
  category: string;
  techs: Technology[];
}
