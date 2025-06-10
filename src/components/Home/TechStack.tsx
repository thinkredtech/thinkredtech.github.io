import React from 'react';
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
} from 'react-icons/si';

const TechStack: React.FC = () => {
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
        {
          name: 'Firebase',
          icon: <SiFirebase className="w-10 h-10 text-[#FFCA28]" />,
        },
      ],
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-backgroundAlt">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="heading-1 mb-4">Our Technology Stack</h2>
          <p className="text-lg text-secondary max-w-3xl mx-auto">
            We leverage modern technologies and frameworks to build robust,
            scalable, and high-performance solutions.
          </p>
        </div>

        <div className="space-y-16">
          {technologies.map((category, index) => (
            <div key={index}>
              <h3 className="heading-2 mb-8 text-center">
                {category.category}
              </h3>
              <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                {category.techs.map((tech, techIndex) => (
                  <div key={techIndex} className="flex flex-col items-center">
                    <div className="w-16 h-16 mb-3 flex items-center justify-center bg-white rounded-full shadow-regular p-2 transition-transform hover:scale-110">
                      {tech.icon}
                    </div>
                    <span className="text-dark font-medium">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a href="/services" className="btn btn-secondary">
            Learn About Our Technical Expertise
          </a>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
