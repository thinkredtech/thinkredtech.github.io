import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div>
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-backgroundAlt">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-1 mb-6">About ThinkRED Technologies</h1>
            <p className="text-lg text-secondary">
              We are an engineering-focused, innovation-led technology company
              with roots in open source communities and enterprise solutions.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-2 mb-6">Our Journey</h2>
              <p className="text-lg text-secondary mb-6">
                ThinkRED Technologies was founded by engineers with a passion
                for simplifying technology and creating exceptional user
                experiences. Our journey began in open source communities like
                Mozilla and Fedora, where we learned the value of collaboration
                and innovation.
              </p>
              <p className="text-lg text-secondary mb-6">
                After years of experience at Red Hat and working with global
                clients through platforms like Upwork, we established ThinkRED
                Technologies to bring enterprise-grade solutions to businesses
                of all sizes.
              </p>
              <p className="text-lg text-secondary">
                Today, we help organizations transform their digital presence
                and operations through custom web development, platform
                engineering, and infrastructure automation.
              </p>
            </div>
            <div className="relative">
              {/* Timeline visualization placeholder */}
              <div className="bg-backgroundAlt p-8 rounded-lg shadow-regular">
                <div className="space-y-8">
                  <div className="flex">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-dark">
                        Open Source Roots
                      </h3>
                      <p className="text-secondary">
                        Mozilla and Fedora community contributions
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-dark">
                        Enterprise Experience
                      </h3>
                      <p className="text-secondary">
                        Red Hat and global enterprise clients
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <span className="text-primary font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-dark">
                        Freelance Excellence
                      </h3>
                      <p className="text-secondary">
                        Top-rated Upwork professionals
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center mr-4">
                      <span className="text-white font-bold">4</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-dark">
                        ThinkRED Founded
                      </h3>
                      <p className="text-secondary">
                        Established to deliver innovation at scale
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-backgroundAlt">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="heading-1 mb-4">Our Philosophy</h2>
            <p className="text-lg text-secondary max-w-3xl mx-auto">
              At ThinkRED, we believe in simplifying technology to create
              exceptional experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-regular">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
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
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="heading-3 mb-4">Innovation-Led</h3>
              <p className="text-secondary">
                We constantly explore new technologies and approaches to solve
                complex problems in elegant ways.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-regular">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
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
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <h3 className="heading-3 mb-4">Engineering Excellence</h3>
              <p className="text-secondary">
                We prioritize code quality, performance, and maintainability in
                everything we build.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-regular">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
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
              </div>
              <h3 className="heading-3 mb-4">Client Partnership</h3>
              <p className="text-secondary">
                We work closely with our clients to understand their needs and
                deliver solutions that exceed expectations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="heading-1 mb-4">Leadership Team</h2>
            <p className="text-lg text-secondary max-w-3xl mx-auto">
              Meet the experienced professionals leading ThinkRED Technologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team member cards would go here - using placeholders */}
      {/* <div className="bg-backgroundAlt p-6 rounded-lg shadow-regular text-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-6">
                <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary text-2xl font-bold">JS</span>
                </div>
              </div>
              <h3 className="heading-3 mb-2">John Smith</h3>
              <p className="text-primary font-medium mb-4">Founder & CEO</p>
              <p className="text-secondary mb-4">
                Former Red Hat engineer with 15+ years of experience in enterprise software development.
              </p>
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-secondary hover:text-primary">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                  </svg>
                </a>
                <a href="#" className="text-secondary hover:text-primary">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="bg-backgroundAlt p-6 rounded-lg shadow-regular text-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-6">
                <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary text-2xl font-bold">AP</span>
                </div>
              </div>
              <h3 className="heading-3 mb-2">Anita Patel</h3>
              <p className="text-primary font-medium mb-4">CTO</p>
              <p className="text-secondary mb-4">
                Full-stack developer with expertise in cloud infrastructure and DevOps practices.
              </p>
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-secondary hover:text-primary">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                  </svg>
                </a>
                <a href="#" className="text-secondary hover:text-primary">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="bg-backgroundAlt p-6 rounded-lg shadow-regular text-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-6">
                <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary text-2xl font-bold">MR</span>
                </div>
              </div>
              <h3 className="heading-3 mb-2">Marcus Rodriguez</h3>
              <p className="text-primary font-medium mb-4">Design Director</p>
              <p className="text-secondary mb-4">
                UX/UI specialist with a background in creating intuitive and engaging digital experiences.
              </p>
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-secondary hover:text-primary">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                  </svg>
                </a>
                <a href="#" className="text-secondary hover:text-primary">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-comfortaa text-3xl md:text-4xl font-bold mb-6">
              Join Our Team
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              We're always looking for talented individuals who are passionate
              about technology and innovation.
            </p>
            <a
              href="/careers"
              className="btn bg-white text-primary hover:bg-opacity-90"
            >
              View Open Positions
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
