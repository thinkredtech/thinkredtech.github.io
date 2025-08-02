import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { useState, useEffect } from "react";
import PageHero from "../components/ui/PageHero";
import { Position } from "../types"; // Import Position from types
import { getAllJobPositions } from "../utils/jobUtils";
import {
  useSEO,
  useStructuredData,
  SEOConfigs,
  StructuredDataSchemas,
} from "../hooks/useSEO";

// Export hardcoded positions (kept for backward compatibility)
export const hardcodedPositions: Position[] = [
  {
    id: 1,
    slug: "ui-ux-designer",
    title: "UI/UX Designer",
    type: "Full-time",
    location: "Remote",
    experience: "2-4 years",
    description:
      "We are looking for a creative and detail-oriented UI/UX Designer to join our team. You will be responsible for creating intuitive and engaging user experiences for web and mobile applications.",
    requirements: [
      "Bachelor's degree in Design, HCI, or related field",
      "2-4 years of experience in UI/UX design",
      "Proficiency in Figma, Adobe XD, or Sketch",
      "Strong understanding of user-centered design principles",
      "Experience with responsive design and mobile-first approach",
      "Knowledge of HTML/CSS is a plus",
      "Strong portfolio demonstrating design thinking and problem-solving skills",
    ],
    responsibilities: [
      "Design user interfaces and experiences for web and mobile applications",
      "Conduct user research and usability testing to inform design decisions",
      "Create wireframes, prototypes, and high-fidelity mockups",
      "Collaborate with developers to ensure design implementation accuracy",
      "Develop and maintain design systems and component libraries",
      "Present design concepts and rationale to stakeholders and clients",
      "Stay current with design trends, tools, and best practices",
      "Participate in design reviews and provide constructive feedback",
    ],
    skills: [
      "Figma",
      "Adobe XD",
      "Sketch",
      "Prototyping",
      "User Research",
      "Wireframing",
      "Design Systems",
      "Responsive Design",
    ],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    slug: "senior-web-developer",
    title: "Senior Web Developer",
    type: "Full-time",
    location: "Remote",
    experience: "4+ years",
    description:
      "Join our development team to build high-performance web applications using modern technologies. You will work on challenging projects and mentor junior developers.",
    requirements: [
      "Bachelor's degree in Computer Science or equivalent experience",
      "4+ years of professional web development experience",
      "Strong expertise in React, TypeScript, and Node.js",
      "Experience with cloud platforms (AWS, Azure, or GCP)",
      "Knowledge of DevOps practices and CI/CD pipelines",
      "Experience with database design and optimization",
      "Excellent problem-solving and mentoring skills",
    ],
    responsibilities: [
      "Develop and maintain high-performance web applications using React and TypeScript",
      "Build and optimize backend services using Node.js and modern frameworks",
      "Design and implement RESTful APIs and GraphQL endpoints",
      "Collaborate with UI/UX designers to implement responsive user interfaces",
      "Write clean, maintainable, and well-documented code following best practices",
      "Mentor junior developers and conduct code reviews",
      "Optimize application performance and ensure scalability",
      "Participate in architectural decisions and technical planning",
      "Implement automated testing strategies and maintain CI/CD pipelines",
      "Stay updated with emerging technologies and industry trends",
    ],
    skills: [
      "React",
      "TypeScript",
      "Node.js",
      "Next.js",
      "AWS",
      "Docker",
      "PostgreSQL",
      "MongoDB",
      "Tailwind CSS",
      "GraphQL",
    ],
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
];

// Export function to get all current job openings
export const getOpenPositions = (): Position[] => {
  return getAllJobPositions(hardcodedPositions);
};

// Export hardcoded positions for compatibility
export const openPositions = hardcodedPositions;

const CareerPage = () => {
  // Apply SEO configuration for careers page
  useSEO({
    ...SEOConfigs.careers,
    url: `${window.location.origin}/careers`,
  });

  // Add breadcrumb structured data
  useStructuredData(
    StructuredDataSchemas.breadcrumb([
      { name: "Home", url: window.location.origin },
      { name: "Careers", url: `${window.location.origin}/careers` },
    ]),
  );

  const navigate = useNavigate();
  const [allPositions, setAllPositions] = useState<Position[]>([]);

  useEffect(() => {
    // Load all positions (hardcoded + stored)
    const positions = getAllJobPositions(hardcodedPositions);
    setAllPositions(positions);
  }, []);

  const handleLearnMore = (position: Position) => {
    navigate(`/careers/${position.slug}`);
  };

  // Export combined positions for other components to use
  const openPositions = allPositions;

  const benefits = [
    {
      icon: (
        <svg
          className="w-8 h-8 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
      title: "Competitive Compensation",
      description:
        "Market-competitive salaries with performance-based bonuses and equity options.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9"
          />
        </svg>
      ),
      title: "Remote-First Culture",
      description:
        "Work from anywhere with flexible hours and a focus on work-life balance.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
      title: "Growth Opportunities",
      description:
        "Continuous learning resources, conference attendance, and career development programs.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "Collaborative Team",
      description:
        "Work with passionate professionals in an inclusive, supportive environment.",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <PageHero
        title="Join Our Team"
        subtitle="Build the future of technology with us. We're looking for passionate individuals who want to make a meaningful impact."
      >
        {openPositions.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12">
            {[
              { number: `${openPositions.length}`, label: "Open Positions" },
              { number: "100%", label: "Remote Friendly" },
              { number: "Flexible", label: "Work Schedule" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="heading-1 text-primary">{stat.number}</div>
                <div className="text-secondary">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </PageHero>

      {/* Open Positions Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="display-2 mb-4 text-dark">Open Positions</h2>
            <p className="text-secondary max-w-3xl mx-auto">
              Explore our current openings and find the perfect role to advance
              your career with ThinkRED Technologies.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
            {openPositions.map(position => (
              <div
                key={position.id}
                className="bg-white rounded-xl shadow-regular hover:shadow-lg transition-all duration-300 p-8 border border-gray-100"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h3 className="heading-1 text-dark">{position.title}</h3>
                      <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                        {position.type}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-secondary mb-4">
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
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
                        {position.location}
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {position.experience}
                      </div>
                    </div>

                    <p className="text-secondary mb-6">
                      {position.description}
                    </p>

                    <div className="mb-6">
                      <h4 className="body-1-semibold text-dark mb-3">
                        Requirements:
                      </h4>
                      <ul className="space-y-2">
                        {position.requirements.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <svg
                              className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-secondary">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {position.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-accent1/10 text-accent1 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to={`/apply/${position.slug}`}
                    className="btn btn-primary flex-1 text-center"
                  >
                    Apply Now
                  </Link>
                  <button
                    onClick={() => handleLearnMore(position)}
                    className="btn btn-secondary flex-1"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No positions available fallback */}
          {openPositions.length === 0 && (
            <div className="text-center py-16">
              <h3 className="heading-1 text-dark mb-4">
                No Open Positions Right Now
              </h3>
              <p className="body-1-medium text-secondary mb-8">
                We're not actively hiring at the moment, but we're always
                interested in connecting with talented individuals.
              </p>
              <Link to="/contact" className="btn btn-primary">
                Send Us Your Resume
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section - Removed $5K learning budget claim, rephrased to general "Continuous learning budget" */}
      <section className="py-16 md:py-24 bg-backgroundAlt">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="display-2 mb-4 text-dark">Why Join ThinkRED?</h2>
            <p className="body-1-medium text-secondary max-w-3xl mx-auto">
              We believe in creating an environment where our team can thrive,
              grow, and make meaningful contributions to cutting-edge technology
              projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
              // Specifically find and modify the "Growth Opportunities" benefit
              if (benefit.title === "Growth Opportunities") {
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-8 shadow-regular hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-6">
                        {benefit.icon}
                      </div>
                      <div>
                        <h3 className="heading-2 text-dark mb-3">
                          {benefit.title}
                        </h3>
                        <p className="text-secondary leading-relaxed">
                          Continuous learning resources, conference attendance,
                          and career development programs.
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-regular hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-6">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="heading-2 text-dark mb-3">
                        {benefit.title}
                      </h3>
                      <p className="text-secondary leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="display-2 mb-6 text-dark">Our Culture & Values</h2>
              <p className="body-1-medium text-secondary mb-6 leading-relaxed">
                At ThinkRED, we foster a culture of innovation, collaboration,
                and continuous learning. We believe in the power of diverse
                perspectives and inclusive teamwork to drive exceptional
                results.
              </p>

              <div className="space-y-4">
                {[
                  {
                    title: "Innovation First",
                    description:
                      "We encourage creative thinking and embrace new technologies",
                  },
                  {
                    title: "Work-Life Balance",
                    description: "Flexible schedules and remote-first approach",
                  },
                  {
                    title: "Professional Growth",
                    description:
                      "Training and development opportunities to advance your career",
                  },
                  {
                    title: "Open Communication",
                    description:
                      "Transparent, honest feedback and open-door policy",
                  },
                  {
                    title: "Open Source Heritage",
                    description:
                      "Deep roots in open source communities and collaborative development",
                  },
                  {
                    title: "Engineering Excellence",
                    description:
                      "Commitment to high-quality code and best practices",
                  },
                  {
                    title: "Global Perspective",
                    description:
                      "Experience working with international clients and diverse teams",
                  },
                  {
                    title: "Continuous Learning",
                    description:
                      "Stay current with latest technologies and industry trends",
                  },
                ].map((value, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mr-4 mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-dark mb-1">
                        {value.title}
                      </h4>
                      <p className="text-secondary text-sm">
                        {value.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-primary/10 rounded-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 18.657A8 8 0 0 1 6.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0 1 20 13a7.975 7.975 0 0 1-2.343 5.657z"
                        />
                      </svg>
                    </div>
                    <div className="heading-2 text-primary mb-2">
                      Open Source
                    </div>
                    <div className="text-sm text-secondary">
                      Community-driven development and collaborative innovation
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent1 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                    <div className="heading-2 text-accent1 mb-2">
                      Innovation
                    </div>
                    <div className="text-sm text-secondary">
                      Cutting-edge technologies and creative problem solving
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent2 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <div className="heading-2 text-accent2 mb-2">
                      Collaboration
                    </div>
                    <div className="text-sm text-secondary">
                      Cross-functional teamwork and knowledge sharing
                    </div>
                  </div>
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
            <h2 className="font-comfortaa display-2 mb-6">
              Shape the Future with Us
            </h2>
            <p className="body-1-medium mb-8 opacity-90">
              Don't see a perfect match? We're always looking for exceptional
              talent who are passionate about innovation and technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="btn bg-white text-primary hover:bg-white/90 px-8 py-4 body-1-semibold"
              >
                Get In Touch
              </Link>
              <Link
                to="/about"
                className="btn border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 body-1-semibold"
              >
                Learn About Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareerPage;
