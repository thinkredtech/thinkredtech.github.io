import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="py-16 md:py-24 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-comfortaa text-3xl md:text-4xl font-bold mb-6">
            Ready to build something amazing together?
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Let's transform your ideas into reality with our engineering
            expertise and innovative solutions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="btn bg-white text-primary hover:bg-opacity-90"
            >
              Talk to Us
            </Link>
            <Link
              to="/services"
              className="btn border-2 border-white text-white hover:bg-white hover:bg-opacity-10"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-white"></div>
      </div>
    </section>
  );
};

export default CallToAction;
