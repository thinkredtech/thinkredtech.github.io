import React from 'react';
import Hero from '../components/Home/Hero';
import Services from '../components/Home/Services';
import TechStack from '../components/Home/TechStack';
import Vision from '../components/Home/Vision';
import Testimonials from '../components/Home/Testimonials';
import CallToAction from '../components/Home/CallToAction';

const HomePage: React.FC = () => {
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
