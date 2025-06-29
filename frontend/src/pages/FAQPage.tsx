import React from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import { renderIcon } from '../utils/iconUtils';
import { useSEO, useStructuredData } from '../hooks/useSEO';

const FAQPage = () => {
  // Apply SEO for FAQ page
  useSEO({
    title: 'Frequently Asked Questions | ThinkRED Technologies - Web Development & Technology Solutions',
    description:
      'Find answers to common questions about ThinkRED Technologies web development, mobile app development, DevOps, platform engineering, and technology consultation services.',
    keywords:
      'FAQ, frequently asked questions, web development questions, mobile app development FAQ, DevOps consulting questions, platform engineering FAQ, technology consultation questions, project process, timelines, support, pricing, technologies',
    type: 'website' as const,
    url: `${window.location.origin}/faq`,
  });

  // Add FAQ structured data
  useStructuredData({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is your typical project process?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our process typically includes discovery and planning, design and development, testing and refinement, and deployment and support phases. We work closely with clients throughout the process to ensure their needs are met.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long does a typical project take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Project timelines vary based on complexity and scope. Simple websites might take 4-6 weeks, while complex applications can take 3-6 months or more. We provide a detailed timeline during the discovery phase.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you provide ongoing support after launch?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we offer various support and maintenance packages to ensure your solution continues to perform optimally after launch. These can include regular updates, performance monitoring, and technical support.',
        },
      },
      {
        '@type': 'Question',
        name: 'What technologies do you specialize in?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We specialize in modern web technologies including React, Node.js, TypeScript, Python, and cloud platforms like AWS. We also have expertise in mobile development, DevOps, and enterprise automation.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do you handle project communication?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We maintain regular communication through scheduled meetings, progress reports, and collaborative tools. You will have direct access to your project team and regular updates on project status.',
        },
      },
      {
        '@type': 'Question',
        name: 'What makes ThinkRED Technologies different?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our team combines open source heritage with enterprise expertise, focusing on engineering excellence and innovation. We deliver scalable, maintainable solutions using modern technologies and best practices.',
        },
      },
    ],
  });
  return (
    <div>
      <section className="py-8 md:py-16">
        <div className="container mx-auto text-center mt-16">
          <div className="flex flex-col items-center mb-8">
            {renderIcon(FaQuestionCircle, {
              className: 'w-12 h-12 text-primary mb-4',
            })}
            <h1 className="display-2 mb-2">Frequently Asked Questions</h1>
          </div>
          <p className="body-1-medium text-secondary max-w-3xl mx-auto">
            Find answers to common questions about working with ThinkRED Technologies.
          </p>
        </div>
      </section>
      <section className="py-16 md:py-24 bg-backgroundAlt">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-regular">
              <h3 className="body-1-medium text-dark mb-2">What is your typical project process?</h3>
              <p className="text-secondary">
                Our process typically includes discovery and planning, design and development, testing and refinement,
                and deployment and support phases. We work closely with clients throughout the process to ensure their
                needs are met.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-regular">
              <h3 className="body-1-medium text-dark mb-2">How long does a typical project take?</h3>
              <p className="text-secondary">
                Project timelines vary based on complexity and scope. Simple websites might take 4-6 weeks, while
                complex applications can take 3-6 months or more. We'll provide a detailed timeline during the discovery
                phase.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-regular">
              <h3 className="body-1-medium text-dark mb-2">Do you provide ongoing support after launch?</h3>
              <p className="text-secondary">
                Yes, we offer various support and maintenance packages to ensure your solution continues to perform
                optimally after launch. These can include regular updates, performance monitoring, and technical
                support.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-regular">
              <h3 className="body-1-medium text-dark mb-2">What technologies do you specialize in?</h3>
              <p className="text-secondary">
                We specialize in modern web and mobile technologies including React, Vue, Node.js, Python, Spring Boot,
                as well as cloud platforms like AWS, Azure, and Google Cloud. We also have expertise in DevOps,
                containerization, and infrastructure automation.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-regular">
              <h3 className="body-1-medium text-dark mb-2">
                How do you handle project changes or additional requirements?
              </h3>
              <p className="text-secondary">
                We follow an agile approach that allows for flexibility. If requirements change during a project, we'll
                assess the impact on timeline and budget, discuss options with you, and implement changes in a
                controlled manner to minimize disruption.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
