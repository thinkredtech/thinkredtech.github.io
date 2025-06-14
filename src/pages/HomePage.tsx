import Hero from '../components/features/home/Hero';
import Services from '../components/features/home/Services';
import TechStack from '../components/features/home/TechStack';
import TeamExpertise from '../components/features/home/TeamExpertise';
import ProcessMethodology from '../components/features/home/ProcessMethodology';
import ProjectHighlights from '../components/features/home/ProjectHighlights';
import CallToAction from '../components/features/home/CallToAction';
import ScrollToTop from '../components/ui/ScrollToTop';

const HomePage = () => {
  return (
    <div>
      <Hero />
      <Services />
      <TechStack />
      <TeamExpertise />
      <ProcessMethodology />
      <ProjectHighlights />
      <CallToAction />
      <ScrollToTop />
    </div>
  );
};

export default HomePage;
