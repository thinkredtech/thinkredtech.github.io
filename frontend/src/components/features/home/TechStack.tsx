import { useState } from 'react';
import { Link } from 'react-router-dom';
import React from 'react';
import {
  useScrollAnimation,
  useStaggeredAnimation,
} from '../../../hooks/useScrollAnimation';
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

  const { elementRef: headerRef, isInView: headerVisible } =
    useScrollAnimation();
  const { elementRef: tabsRef, visibleItems: visibleTabs } =
    useStaggeredAnimation(6, 100);
  const { elementRef: activeRef, isInView: activeVisible } =
    useScrollAnimation();
  const { elementRef: overviewRef, visibleItems: visibleOverview } =
    useStaggeredAnimation(6, 150);
  const { elementRef: ctaRef, isInView: ctaVisible } = useScrollAnimation();

  const technologies = [
    {
      category: 'Frontend',
      techs: [
        {
          name: 'React',
          icon: (
            <FaReact className="w-10 h-10 text-[#61DAFB]" />
          ) as React.ReactElement,
        },
        {
          name: 'Vue',
          icon: (
            <FaVuejs className="w-10 h-10 text-[#4FC08D]" />
          ) as React.ReactElement,
        },
        {
          name: 'Next.js',
          icon: (
            <SiNextdotjs className="w-10 h-10 text-[#000000]" />
          ) as React.ReactElement,
        },
        {
          name: 'TailwindCSS',
          icon: (
            <SiTailwindcss className="w-10 h-10 text-[#06B6D4]" />
          ) as React.ReactElement,
        },
        {
          name: 'TypeScript',
          icon: (
            <SiTypescript className="w-10 h-10 text-[#3178C6]" />
          ) as React.ReactElement,
        },
      ],
    },
    {
      category: 'Backend',
      techs: [
        {
          name: 'Node.js',
          icon: (
            <FaNodeJs className="w-10 h-10 text-[#339933]" />
          ) as React.ReactElement,
        },
        {
          name: 'Express',
          icon: (
            <SiExpress className="w-10 h-10 text-[#000000]" />
          ) as React.ReactElement,
        },
        {
          name: 'NestJS',
          icon: (
            <SiNestjs className="w-10 h-10 text-[#E0234E]" />
          ) as React.ReactElement,
        },
        {
          name: 'Python',
          icon: (
            <FaPython className="w-10 h-10 text-[#3776AB]" />
          ) as React.ReactElement,
        },
        {
          name: 'FastAPI',
          icon: (
            <SiFastapi className="w-10 h-10 text-[#009688]" />
          ) as React.ReactElement,
        },
        {
          name: 'Spring Boot',
          icon: (
            <SiSpringboot className="w-10 h-10 text-[#6DB33F]" />
          ) as React.ReactElement,
        },
        {
          name: 'PHP',
          icon: (
            <SiPhp className="w-10 h-10 text-[#777BB4]" />
          ) as React.ReactElement,
        },
      ],
    },
    {
      category: 'Databases & APIs',
      techs: [
        {
          name: 'MySQL',
          icon: (
            <SiMysql className="w-10 h-10 text-[#4479A1]" />
          ) as React.ReactElement,
        },
        {
          name: 'PostgreSQL',
          icon: (
            <SiPostgresql className="w-10 h-10 text-[#336791]" />
          ) as React.ReactElement,
        },
        {
          name: 'GraphQL',
          icon: (
            <SiGraphql className="w-10 h-10 text-[#E10098]" />
          ) as React.ReactElement,
        },
        {
          name: 'Firebase',
          icon: (
            <SiFirebase className="w-10 h-10 text-[#FFCA28]" />
          ) as React.ReactElement,
        },
      ],
    },
    {
      category: 'CMS & Platforms',
      techs: [
        {
          name: 'WordPress',
          icon: (
            <SiWordpress className="w-10 h-10 text-[#21759B]" />
          ) as React.ReactElement,
        },
        {
          name: 'Drupal',
          icon: (
            <SiDrupal className="w-10 h-10 text-[#0073BA]" />
          ) as React.ReactElement,
        },
      ],
    },
    {
      category: 'AI & Machine Learning',
      techs: [
        {
          name: 'TensorFlow',
          icon: (
            <SiTensorflow className="w-10 h-10 text-[#FF6F00]" />
          ) as React.ReactElement,
        },
        {
          name: 'PyTorch',
          icon: (
            <SiPytorch className="w-10 h-10 text-[#EE4C2C]" />
          ) as React.ReactElement,
        },
        {
          name: 'LLM Integration',
          icon: (
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              AI
            </div>
          ),
        },
        {
          name: 'MCP Servers',
          icon: (
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
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
          icon: (
            <FaDocker className="w-10 h-10 text-[#2496ED]" />
          ) as React.ReactElement,
        },
        {
          name: 'Kubernetes',
          icon: (
            <SiKubernetes className="w-10 h-10 text-[#326CE5]" />
          ) as React.ReactElement,
        },
        {
          name: 'AWS',
          icon: (
            <FaAws className="w-10 h-10 text-[#FF9900]" />
          ) as React.ReactElement,
        },
        {
          name: 'GitHub Actions',
          icon: (
            <FaGithub className="w-10 h-10 text-[#2088FF]" />
          ) as React.ReactElement,
        },
      ],
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-backgroundAlt">
      <div className="container mx-auto px-4">
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-12 transition-all duration-1000 ease-out ${
            headerVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="heading-1 mb-4 text-secondary">
            Our Technology Stack
          </h2>
          <p className="max-w-3xl mx-auto text-secondary">
            We leverage modern technologies and frameworks to build robust,
            scalable, and high-performance solutions.
          </p>
        </div>

        {/* Interactive Category Tabs */}
        <div
          ref={tabsRef as React.RefObject<HTMLDivElement>}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {technologies.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(index)}
              className={`px-4 py-2 rounded-lg transition-all duration-500 ${
                activeCategory === index
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : 'bg-white text-secondary hover:bg-gray-50 hover:scale-102'
              } ${
                visibleTabs.includes(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              {category.category}
            </button>
          ))}
        </div>

        {/* Active Category Technologies */}
        <div
          ref={activeRef as React.RefObject<HTMLDivElement>}
          className={`mb-8 transition-all duration-1000 ease-out ${
            activeVisible
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-8 scale-95'
          }`}
        >
          <div className="bg-white rounded-lg p-6 md:p-8 shadow-lg">
            <h3 className="heading-2 text-center mb-6 text-primary">
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
                  <span className="text-center text-secondary group-hover:text-primary transition-colors">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Overview Grid - Show all categories at once in compact form */}
        <div
          ref={overviewRef as React.RefObject<HTMLDivElement>}
          className="mb-8"
        >
          <h3 className="body-1-semibold text-center mb-6 text-secondary">
            Complete Technology Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {technologies.map((category, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl p-4 shadow-sm transition-all duration-700 cursor-pointer hover:shadow-md ${
                  activeCategory === index ? 'ring-2 ring-primary' : ''
                } ${
                  visibleOverview.includes(index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: `${index * 150}ms`,
                }}
                onClick={() => setActiveCategory(index)}
              >
                <h4 className="font-semibold text-sm text-secondary mb-3 text-center">
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
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg body-3 text-secondary">
                      +{category.techs.length - 6}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div
          ref={ctaRef as React.RefObject<HTMLDivElement>}
          className={`text-center transition-all duration-1000 ease-out ${
            ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Link
            to="/services"
            className="inline-flex items-center px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-300"
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
