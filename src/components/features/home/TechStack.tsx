import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaReact,
  FaVuejs,
  FaNodeJs,
  FaPython,
  FaDocker,
  FaAws,
  FaGithub,
} from 'react-icons/fa';
import {
  SiNextdotjs,
  SiTailwindcss,
  SiTypescript,
  SiExpress,
  SiNestjs,
  SiFastapi,
  SiSpringboot,
  SiKubernetes,
  SiFirebase,
  SiWordpress,
  SiDrupal,
  SiPhp,
  SiMysql,
  SiPostgresql,
  SiGraphql,
  SiTensorflow,
  SiPytorch,
} from 'react-icons/si';

const TechStack = () => {
  const [activeCategory, setActiveCategory] = useState(0);

  const technologies = [
    {
      category: 'Frontend',
      techs: [
        {
          name: 'React',
          icon: <FaReact className="w-10 h-10 text-[#61DAFB]" />,
        },
        { name: 'Vue', icon: <FaVuejs className="w-10 h-10 text-[#4FC08D]" /> },
        {
          name: 'Next.js',
          icon: <SiNextdotjs className="w-10 h-10 text-[#000000]" />,
        },
        {
          name: 'TailwindCSS',
          icon: <SiTailwindcss className="w-10 h-10 text-[#06B6D4]" />,
        },
        {
          name: 'TypeScript',
          icon: <SiTypescript className="w-10 h-10 text-[#3178C6]" />,
        },
      ],
    },
    {
      category: 'Backend',
      techs: [
        {
          name: 'Node.js',
          icon: <FaNodeJs className="w-10 h-10 text-[#339933]" />,
        },
        {
          name: 'Express',
          icon: <SiExpress className="w-10 h-10 text-[#000000]" />,
        },
        {
          name: 'NestJS',
          icon: <SiNestjs className="w-10 h-10 text-[#E0234E]" />,
        },
        {
          name: 'Python',
          icon: <FaPython className="w-10 h-10 text-[#3776AB]" />,
        },
        {
          name: 'FastAPI',
          icon: <SiFastapi className="w-10 h-10 text-[#009688]" />,
        },
        {
          name: 'Spring Boot',
          icon: <SiSpringboot className="w-10 h-10 text-[#6DB33F]" />,
        },
        {
          name: 'PHP',
          icon: <SiPhp className="w-10 h-10 text-[#777BB4]" />,
        },
      ],
    },
    {
      category: 'Databases & APIs',
      techs: [
        {
          name: 'MySQL',
          icon: <SiMysql className="w-10 h-10 text-[#4479A1]" />,
        },
        {
          name: 'PostgreSQL',
          icon: <SiPostgresql className="w-10 h-10 text-[#336791]" />,
        },
        {
          name: 'GraphQL',
          icon: <SiGraphql className="w-10 h-10 text-[#E10098]" />,
        },
        {
          name: 'Firebase',
          icon: <SiFirebase className="w-10 h-10 text-[#FFCA28]" />,
        },
      ],
    },
    {
      category: 'CMS & Platforms',
      techs: [
        {
          name: 'WordPress',
          icon: <SiWordpress className="w-10 h-10 text-[#21759B]" />,
        },
        {
          name: 'Drupal',
          icon: <SiDrupal className="w-10 h-10 text-[#0073BA]" />,
        },
      ],
    },
    {
      category: 'AI & Machine Learning',
      techs: [
        {
          name: 'TensorFlow',
          icon: <SiTensorflow className="w-10 h-10 text-[#FF6F00]" />,
        },
        {
          name: 'PyTorch',
          icon: <SiPytorch className="w-10 h-10 text-[#EE4C2C]" />,
        },
        {
          name: 'LLM Integration',
          icon: (
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              AI
            </div>
          ),
        },
        {
          name: 'MCP Servers',
          icon: (
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
              MCP
            </div>
          ),
        },
      ],
    },
    {
      category: 'DevOps & Cloud',
      techs: [
        {
          name: 'Docker',
          icon: <FaDocker className="w-10 h-10 text-[#2496ED]" />,
        },
        {
          name: 'Kubernetes',
          icon: <SiKubernetes className="w-10 h-10 text-[#326CE5]" />,
        },
        { name: 'AWS', icon: <FaAws className="w-10 h-10 text-[#FF9900]" /> },
        {
          name: 'GitHub Actions',
          icon: <FaGithub className="w-10 h-10 text-[#2088FF]" />,
        },
      ],
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-backgroundAlt">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="heading-1 mb-4">Our Technology Stack</h2>
          <p className="text-lg text-secondary max-w-3xl mx-auto">
            We leverage modern technologies and frameworks to build robust,
            scalable, and high-performance solutions.
          </p>
        </div>

        {/* Interactive Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {technologies.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(index)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === index
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:scale-102'
              }`}
            >
              {category.category}
            </button>
          ))}
        </div>

        {/* Active Category Technologies */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
            <h3 className="text-xl font-bold text-center mb-6 text-primary">
              {technologies[activeCategory].category}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {technologies[activeCategory].techs.map((tech, techIndex) => (
                <div
                  key={techIndex}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className="w-14 h-14 mb-3 flex items-center justify-center bg-gray-50 rounded-xl shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:scale-110 group-hover:bg-white">
                    {tech.icon}
                  </div>
                  <span className="text-sm font-medium text-center text-gray-700 group-hover:text-primary transition-colors">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Overview Grid - Show all categories at once in compact form */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-center mb-6 text-dark">
            Complete Technology Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {technologies.map((category, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl p-4 shadow-sm transition-all duration-300 cursor-pointer hover:shadow-md ${
                  activeCategory === index ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setActiveCategory(index)}
              >
                <h4 className="font-semibold text-sm text-gray-800 mb-3 text-center">
                  {category.category}
                </h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {category.techs.slice(0, 6).map((tech, techIndex) => (
                    <div
                      key={techIndex}
                      className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-lg transition-transform hover:scale-110"
                      title={tech.name}
                    >
                      <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5 [&>div]:w-5 [&>div]:h-5 [&>div]:text-xs">
                        {tech.icon}
                      </div>
                    </div>
                  ))}
                  {category.techs.length > 6 && (
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg text-xs font-medium text-gray-600">
                      +{category.techs.length - 6}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Link
            to="/services"
            className="inline-flex items-center px-8 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-300"
          >
            Learn About Our Technical Expertise
            <svg
              className="ml-2 w-5 h-5"
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
  );
};

export default TechStack;
