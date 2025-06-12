import { Link } from 'react-router-dom';

const Testimonials = () => {
  const testimonials = [
    {
      quote:
        'ThinkRED Technologies transformed our digital infrastructure, delivering a solution that exceeded our expectations in both functionality and user experience.',
      author: 'Sarah Johnson',
      position: 'CTO, ZeoMed Services',
      company: 'ZeoMed Services',
      image: '/assets/avatars/default-avatar.png',
    },
    {
      quote:
        'Working with ThinkRED has been a game-changer for our development workflow. Their expertise in DevOps and infrastructure automation has significantly improved our deployment process.',
      author: 'Michael Chen',
      position: 'Lead Developer',
      company: 'TechNova Solutions',
      image: '/assets/avatars/default-avatar.png',
    },
    {
      quote:
        'The team at ThinkRED brought both technical excellence and creative thinking to our project. They truly understand how to simplify complex technology challenges.',
      author: 'Priya Sharma',
      position: 'Product Manager',
      company: 'Innovate Digital',
      image: '/assets/avatars/default-avatar.png',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-backgroundAlt">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="heading-1 mb-4">What Our Clients Say</h2>
          <p className="text-lg text-secondary max-w-3xl mx-auto">
            We take pride in delivering exceptional results that exceed our
            clients' expectations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-regular hover:shadow-lg transition-all duration-300"
            >
              <svg
                className="w-10 h-10 text-primary/20 mb-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-dark mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                  {/* Placeholder for client image */}
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-dark">
                    {testimonial.author}
                  </h4>
                  <p className="text-sm text-secondary">
                    {testimonial.position}, {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/portfolio" className="btn btn-secondary">
            View Our Case Studies
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
