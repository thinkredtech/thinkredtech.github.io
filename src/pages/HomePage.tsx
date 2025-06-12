import Hero from '../components/features/home/Hero';
import Services from '../components/features/home/Services';
import TechStack from '../components/features/home/TechStack';
import Vision from '../components/features/home/Vision';
import Testimonials from '../components/features/home/Testimonials';
import CallToAction from '../components/features/home/CallToAction';

const HomePage = () => {
  return (
    <div>
      <Hero />
      <Services />
      <TechStack />
      <Vision />
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default HomePage;
