import { Link } from 'react-router-dom';

const Testimonials = () => {
  const testimonials = [
    {
      quote:
        'ThinkRED Technologies delivered an exceptional WordPress platform that perfectly integrates our technology training, certification, and AV staffing services. Their expertise in LearnPress integration and custom development exceeded our expectations.',
      author: 'Curtis Campbell',
      position: 'Marketing Consultant',
      company: 'OfficePro Inc.',
      image: '/assets/avatars/default-avatar.png',
    },
    {
      quote:
        'The Epic Learning Sync plugin developed by ThinkRED has revolutionized our course management process. The seamless API integration and robust data synchronization capabilities have significantly improved our workflow efficiency.',
      author: 'Curtis Campbell',
      position: 'Marketing Consultant',
      company: 'OfficePro Inc.',
      image: '/assets/avatars/default-avatar.png',
    },
    {
      quote:
        'ThinkRED transformed our healthcare services platform with a comprehensive WordPress solution. Their understanding of our business needs and technical execution for content management and course delivery was outstanding.',
      author: 'Salman Sidhiq Basha',
      position: 'Founder & CEO',
      company: 'Zeomed Services',
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
