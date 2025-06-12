import Hero from '../components/features/home/Hero';
import Services from '../components/features/home/Services';
import TechStack from '../components/features/home/TechStack';
import Vision from '../components/features/home/Vision';
import ProjectHighlights from '../components/features/home/ProjectHighlights';
import CallToAction from '../components/features/home/CallToAction';

const HomePage = () => {
  return (
    <div>
      <Hero />
      <Services />
      <TechStack />
      <Vision />
      <ProjectHighlights />
      <CallToAction />
    </div>
  );
};

export default HomePage;
