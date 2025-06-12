const TeamExpertise = () => {
  // SVG Icons for expertise areas
  const LeadershipIcon = () => (
    <svg
      className="w-8 h-8 text-primary"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 7h-2.08c-.8 0-1.54.5-1.85 1.26l-1.92 5.77A2 2 0 0 0 14.61 16H16v6h4zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zm1.5 1h-2c-1.65 0-3 1.35-3 3v5h8v-5c0-1.65-1.35-3-3-3zM7.5 6.5C7.5 7.33 6.83 8 6 8s-1.5-.67-1.5-1.5S5.17 5 6 5s1.5.67 1.5 1.5zM9 9H3c-1.1 0-2 .9-2 2v7h8v-7c0-1.1-.9-2-2-2z" />
    </svg>
  );

  const ArchitectureIcon = () => (
    <svg
      className="w-8 h-8 text-primary"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z" />
    </svg>
  );

  const CloudIcon = () => (
    <svg
      className="w-8 h-8 text-primary"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
    </svg>
  );

  const DevOpsIcon = () => (
    <svg
      className="w-8 h-8 text-primary"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18a8 8 0 0 1-8-8 8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8m.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
    </svg>
  );

  const OpenSourceIcon = () => (
    <svg
      className="w-8 h-8 text-primary"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12.5 2C17.43 2 21.5 6.07 21.5 11c0 .55-.45 1-1 1s-1-.45-1-1c0-3.86-3.14-7-7-7S5.5 7.14 5.5 11c0 .55-.45 1-1 1s-1-.45-1-1c0-4.93 4.07-9 9-9zm0 18c-4.93 0-9-4.07-9-9 0-.55.45-1 1-1s1 .45 1 1c0 3.86 3.14 7 7 7s7-3.14 7-7c0-.55.45-1 1-1s1 .45 1 1c0 4.93-4.07 9-9 9zm0-16c-3.86 0-7 3.14-7 7s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
    </svg>
  );

  const AIIcon = () => (
    <svg
      className="w-8 h-8 text-primary"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.64-.8 3.09-2.15 4.1z" />
    </svg>
  );

  const expertiseAreas = [
    {
      icon: <LeadershipIcon />,
      title: 'Leadership Excellence',
      description:
        '15+ years of experience building and leading high-performing global teams, fostering inclusive cultures, and driving organizational transformation.',
      highlights: [
        'Global Team Leadership',
        'Talent Development',
        'Cross-functional Collaboration',
        'Agile Leadership',
      ],
    },
    {
      icon: <ArchitectureIcon />,
      title: 'Enterprise Architecture',
      description:
        'Deep expertise in designing and scaling enterprise SaaS platforms, microservices architectures, and full-stack solutions for millions of users.',
      highlights: [
        'SaaS Platform Design',
        'Microservices Architecture',
        'System Scalability',
        'Technical Strategy',
      ],
    },
    {
      icon: <CloudIcon />,
      title: 'Cloud & Infrastructure',
      description:
        'Proven track record in cloud-native architectures, serverless solutions, and infrastructure automation delivering multi-million dollar savings.',
      highlights: [
        'AWS & Kubernetes',
        'OpenShift Expertise',
        'Infrastructure as Code',
        'Serverless Architecture',
      ],
    },
    {
      icon: <DevOpsIcon />,
      title: 'DevOps & Automation',
      description:
        'Extensive experience in CI/CD pipeline optimization, workflow automation, and developer experience improvements saving thousands of engineering hours.',
      highlights: [
        'CI/CD Excellence',
        'Workflow Automation',
        'Developer Experience',
        'Quality Engineering',
      ],
    },
    {
      icon: <OpenSourceIcon />,
      title: 'Open Source Leadership',
      description:
        'Active contributors to major open-source initiatives with global impact, including platform development and community building across multiple organizations.',
      highlights: [
        'Platform Development',
        'Community Building',
        'Certification Programs',
        'Global Contributions',
      ],
    },
    {
      icon: <AIIcon />,
      title: 'AI & Innovation',
      description:
        'Hands-on experience integrating AI-powered solutions, modernizing legacy systems, and driving technological innovation in enterprise environments.',
      highlights: [
        'AI Integration',
        'Legacy Modernization',
        'Innovation Strategy',
        'Emerging Technologies',
      ],
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-backgroundAlt">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="heading-1 mb-4">Team Expertise & Value Proposition</h2>
          <p className="text-lg text-secondary max-w-4xl mx-auto">
            Our leadership team brings together decades of enterprise
            experience, open-source expertise, and proven track records in
            scaling technology solutions across global organizations. We combine
            technical excellence with strategic vision to deliver transformative
            results.
          </p>
        </div>

        {/* Expertise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {expertiseAreas.map((area, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-regular hover:shadow-lg transition-all duration-300 p-6 group"
            >
              {/* Icon and Title */}
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mr-4 group-hover:bg-primary/20 transition-colors duration-300">
                  {area.icon}
                </div>
                <h3 className="text-xl font-bold text-dark group-hover:text-primary transition-colors duration-300">
                  {area.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-secondary mb-6 leading-relaxed">
                {area.description}
              </p>

              {/* Highlights */}
              <div className="space-y-2">
                {area.highlights.map((highlight, highlightIndex) => (
                  <div key={highlightIndex} className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-sm text-dark font-medium">
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Value Proposition Summary */}
        <div className="bg-gradient-to-r from-primary/5 to-accent1/5 rounded-lg p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-dark mb-4">
                Why Organizations Choose ThinkRED
              </h3>
              <p className="text-secondary mb-6">
                Our team's combined expertise spans enterprise leadership,
                cutting-edge technology, and proven delivery at scale. We bring
                the knowledge and experience to accelerate your digital
                transformation journey.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    50+
                  </div>
                  <div className="text-sm text-secondary">
                    Years Combined Experience
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    $10M+
                  </div>
                  <div className="text-sm text-secondary">
                    In Client Cost Savings
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    1000+
                  </div>
                  <div className="text-sm text-secondary">
                    Projects Delivered
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    Global
                  </div>
                  <div className="text-sm text-secondary">
                    Enterprise Experience
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-lg p-6 shadow-regular">
                <h4 className="font-bold text-dark mb-4">
                  Core Differentiators
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-primary mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-dark">
                      Enterprise-grade solutions with startup agility
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-primary mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-dark">
                      Deep open-source expertise and community leadership
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-primary mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-dark">
                      Proven track record at Fortune 500 companies
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-primary mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-dark">
                      End-to-end ownership from strategy to delivery
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamExpertise;
