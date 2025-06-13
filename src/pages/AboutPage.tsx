import { Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';

const AboutPage = () => {
  return (
    <div>
      {/* Enhanced Hero Section */}
      <PageHero
        title="About ThinkRED Technologies"
        subtitle="We are an engineering-focused, innovation-led technology company with roots in open source communities and enterprise solutions."
      />

      {/* Enhanced Journey Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-dark">
                Our Journey
              </h2>
              <p className="text-lg text-secondary mb-6 leading-relaxed">
                ThinkRED Technologies was founded by engineers with a passion
                for simplifying technology and creating exceptional user
                experiences. Our journey began in open source communities like
                Mozilla and Fedora, where we learned the value of collaboration
                and innovation.
              </p>
              <p className="text-lg text-secondary mb-6 leading-relaxed">
                After years of experience at Red Hat and working with global
                clients through platforms like Upwork, we established ThinkRED
                Technologies to bring enterprise-grade solutions to businesses
                of all sizes.
              </p>
              <p className="text-lg text-secondary leading-relaxed">
                Today, we help organizations transform their digital presence
                and operations through custom web development, platform
                engineering, and infrastructure automation.
              </p>

              {/* Interactive stats */}
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="group">
                  <div className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                    500+
                  </div>
                  <div className="text-sm text-secondary">
                    Open Source Contributions
                  </div>
                </div>
                <div className="group">
                  <div className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                    95%
                  </div>
                  <div className="text-sm text-secondary">
                    Client Satisfaction
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Enhanced timeline visualization */}
              <div className="relative bg-backgroundAlt p-8 rounded-2xl shadow-xl">
                <div className="space-y-8">
                  {[
                    {
                      step: '1',
                      title: 'Open Source Roots',
                      description: 'Mozilla and Fedora community contributions',
                      year: '2009',
                      active: false,
                    },
                    {
                      step: '2',
                      title: 'Enterprise Experience',
                      description: 'Red Hat and global enterprise clients',
                      year: '2012',
                      active: false,
                    },
                    {
                      step: '3',
                      title: 'Freelance Excellence',
                      description: 'Top-rated Upwork professionals',
                      year: '2018',
                      active: false,
                    },
                    {
                      step: '4',
                      title: 'ThinkRED Founded',
                      description: 'Established to deliver innovation at scale',
                      year: '2021',
                      active: true,
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`group flex items-start transition-all duration-300 hover:scale-105 ${
                        item.active ? 'transform scale-105' : ''
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center mr-6 transition-all duration-300 ${
                          item.active
                            ? 'bg-primary shadow-lg'
                            : 'bg-primary/10 group-hover:bg-primary/20'
                        }`}
                      >
                        <span
                          className={`font-bold text-lg ${
                            item.active ? 'text-white' : 'text-primary'
                          }`}
                        >
                          {item.step}
                        </span>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <h3
                            className={`font-bold text-lg transition-colors duration-300 ${
                              item.active
                                ? 'text-primary'
                                : 'text-dark group-hover:text-primary'
                            }`}
                          >
                            {item.title}
                          </h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {item.year}
                          </span>
                        </div>
                        <p className="text-secondary text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Connecting line */}
                <div className="absolute left-8 top-12 bottom-12 w-0.5 bg-primary/40"></div>

                {/* Floating decoration */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent1/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-accent2/20 rounded-full blur-xl animate-pulse animate-delay-1000"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Enhanced Philosophy Section */}
      <section className="py-16 md:py-24 bg-backgroundAlt">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-dark">
              Our Philosophy
            </h2>
            <p className="text-lg text-secondary max-w-3xl mx-auto leading-relaxed">
              At ThinkRED, we believe in simplifying technology to create
              exceptional experiences that drive meaningful business outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white p-8 rounded-2xl shadow-regular hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
              </div>
              <h3 className="text-xl font-bold mb-4 text-dark group-hover:text-primary transition-colors duration-300">
                Innovation-Led
              </h3>
              <p className="text-secondary leading-relaxed">
                We constantly explore new technologies and approaches to solve
                complex problems in elegant ways, staying ahead of industry
                trends.
              </p>
              <div className="mt-6 flex items-center text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Learn More</span>
                <svg
                  className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-regular hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-accent1/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative w-16 h-16 rounded-xl bg-accent1/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
              </div>
              <h3 className="text-xl font-bold mb-4 text-dark group-hover:text-primary transition-colors duration-300">
                Engineering Excellence
              </h3>
              <p className="text-secondary leading-relaxed">
                We prioritize code quality, performance, and maintainability in
                everything we build, ensuring long-term success.
              </p>
              <div className="mt-6 flex items-center text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Learn More</span>
                <svg
                  className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-regular hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-accent2/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative w-16 h-16 rounded-xl bg-accent2/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
              </div>
              <h3 className="text-xl font-bold mb-4 text-dark group-hover:text-primary transition-colors duration-300">
                Client Partnership
              </h3>
              <p className="text-secondary leading-relaxed">
                We work closely with our clients to understand their needs and
                deliver solutions that exceed expectations and drive growth.
              </p>
              <div className="mt-6 flex items-center text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Learn More</span>
                <svg
                  className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
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

      {/* Enhanced CTA Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-primary"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float animate-delay-1000"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="font-comfortaa text-3xl md:text-4xl font-bold mb-6">
              Join Our Team
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              We're always looking for talented individuals who are passionate
              about technology and innovation. Be part of our journey to
              transform the digital landscape.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/careers"
                className="btn bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                View Open Positions
              </Link>
              <Link
                to="/contact"
                className="btn border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold transition-all duration-300"
              >
                Get In Touch
              </Link>
            </div>

            {/* Values showcase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white/90">
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="font-semibold mb-1">Innovation First</div>
                <div className="text-sm">Cutting-edge technology solutions</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <svg
                    className="w-12 h-12 text-white"
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
                <div className="font-semibold mb-1">Collaborative Culture</div>
                <div className="text-sm">
                  Remote-first, inclusive environment
                </div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <svg
                    className="w-12 h-12 text-white"
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
                </div>
                <div className="font-semibold mb-1">Growth Opportunities</div>
                <div className="text-sm">
                  Continuous learning and development
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
