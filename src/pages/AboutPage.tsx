import { Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import { FaReact, FaNodeJs, FaPython, FaDocker, FaAws } from 'react-icons/fa';
import { SiTypescript, SiPostgresql, SiMongodb } from 'react-icons/si';

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
              <h2 className="heading-1 mb-6 text-secondary">Our Journey</h2>
              <p className="body-1 mb-6 text-secondary">
                ThinkRED Technologies was founded by engineers with a passion
                for simplifying technology and creating exceptional user
                experiences. Our journey began in open source communities like
                Mozilla and Fedora, where we learned the value of collaboration
                and innovation.
              </p>
              <p className="body-1 mb-6 text-secondary">
                After years of experience at Red Hat and working with global
                clients through platforms like Upwork, we established ThinkRED
                Technologies to bring enterprise-grade solutions to businesses
                of all sizes.
              </p>
              <p className="body-1 text-secondary">
                Today, we help organizations transform their digital presence
                and operations through custom web development, platform
                engineering, and infrastructure automation.
              </p>

              {/* Interactive stats */}
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="group">
                  <div className="heading-1 text-primary group-hover:scale-110 transition-transform duration-300">
                    500+
                  </div>
                  <div className="text-sm text-secondary">
                    Open Source Contributions
                  </div>
                </div>
                <div className="group">
                  <div className="heading-1 text-primary group-hover:scale-110 transition-transform duration-300">
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
              <div className="relative bg-backgroundAlt p-8 rounded-lg shadow-xl">
                {/* Floating decoration - moved to background */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent1/20 rounded-full blur-xl animate-pulse -z-10"></div>
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-accent2/20 rounded-full blur-xl animate-pulse animate-delay-1000 -z-10"></div>

                <div className="space-y-8 relative z-10">
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
                          className={`font-bold body-1-medium ${
                            item.active ? 'text-white' : 'text-primary'
                          }`}
                        >
                          {item.step}
                        </span>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <h3
                            className={`font-bold body-1-medium transition-colors duration-300 ${
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
                <div className="absolute left-8 top-12 bottom-12 w-0.5 bg-primary/40 z-20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Enhanced Philosophy Section */}
      <section className="py-16 md:py-24 bg-backgroundAlt">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="heading-1 mb-4 text-secondary">Our Philosophy</h2>
            <p className="max-w-3xl mx-auto text-secondary">
              At ThinkRED, we believe in simplifying technology to create
              exceptional experiences that drive meaningful business outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white p-8 rounded-lg shadow-regular hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
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
              <h3 className="heading-3 mb-4 group-hover:text-primary transition-colors duration-300 text-secondary">
                Innovation-Led
              </h3>
              <p className="text-secondary">
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

            <div className="group bg-white p-8 rounded-lg shadow-regular hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
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
              <h3 className="heading-3 mb-4 group-hover:text-primary transition-colors duration-300 text-secondary">
                Engineering Excellence
              </h3>
              <p className="text-secondary">
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

            <div className="group bg-white p-8 rounded-lg shadow-regular hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
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
              <h3 className="heading-3 mb-4 group-hover:text-primary transition-colors duration-300 text-secondary">
                Client Partnership
              </h3>
              <p className="text-secondary">
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

      {/* Technology Expertise Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="heading-1 mb-4 text-secondary">
              Technology Expertise
            </h2>
            <p className="max-w-3xl mx-auto text-secondary">
              We leverage cutting-edge technologies and frameworks to deliver
              scalable, high-performance solutions that drive business growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Frontend Stack */}
            <div className="group bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-center mb-4">
                <div className="flex space-x-2">
                  <FaReact className="text-blue-600 text-2xl" />
                  <SiTypescript className="text-blue-600 text-2xl" />
                </div>
              </div>
              <h3 className="heading-3 text-center mb-3 text-secondary">
                Frontend
              </h3>
              <div className="text-center space-y-1">
                <p className="body-3 text-secondary">React • TypeScript</p>
                <p className="body-3 text-secondary">Next.js • Vite</p>
                <p className="body-3 text-secondary">Tailwind CSS</p>
              </div>
            </div>

            {/* Backend Stack */}
            <div className="group bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-center mb-4">
                <div className="flex space-x-2">
                  <FaNodeJs className="text-green-600 text-2xl" />
                  <FaPython className="text-green-600 text-2xl" />
                </div>
              </div>
              <h3 className="heading-3 text-center mb-3 text-secondary">
                Backend
              </h3>
              <div className="text-center space-y-1">
                <p className="body-3 text-secondary">Node.js • Python</p>
                <p className="body-3 text-secondary">Express • FastAPI</p>
                <p className="body-3 text-secondary">GraphQL • REST</p>
              </div>
            </div>

            {/* Database Stack */}
            <div className="group bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-center mb-4">
                <div className="flex space-x-2">
                  <SiPostgresql className="text-purple-600 text-2xl" />
                  <SiMongodb className="text-purple-600 text-2xl" />
                </div>
              </div>
              <h3 className="heading-3 text-center mb-3 text-secondary">
                Database
              </h3>
              <div className="text-center space-y-1">
                <p className="body-3 text-secondary">PostgreSQL • MongoDB</p>
                <p className="body-3 text-secondary">Redis • Elasticsearch</p>
                <p className="body-3 text-secondary">Prisma • Mongoose</p>
              </div>
            </div>

            {/* DevOps Stack */}
            <div className="group bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-center mb-4">
                <div className="flex space-x-2">
                  <FaDocker className="text-orange-600 text-2xl" />
                  <FaAws className="text-orange-600 text-2xl" />
                </div>
              </div>
              <h3 className="heading-3 text-center mb-3 text-secondary">
                DevOps
              </h3>
              <div className="text-center space-y-1">
                <p className="body-3 text-secondary">Docker • AWS</p>
                <p className="body-3 text-secondary">Kubernetes • Terraform</p>
                <p className="body-3 text-secondary">CI/CD • Monitoring</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-secondary mb-6">
              And many more technologies tailored to your project needs
            </p>
            <Link
              to="/services"
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <span>Explore Our Services</span>
              <svg
                className="w-4 h-4"
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
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-primary"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float animate-delay-1000"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="display-2-white mb-6">Join Our Team</h2>
            <p className="body-2-white mb-8 opacity-90">
              We're always looking for talented individuals who are passionate
              about technology and innovation. Be part of our journey to
              transform the digital landscape.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/careers"
                className="btn bg-white text-primary hover:bg-white/90 px-8 py-4 body-1-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                View Open Positions
              </Link>
              <Link
                to="/contact"
                className="btn border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 body-1-semibold transition-all duration-300"
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
