import React from 'react';
import HeroSection from './sections/HeroSection';
import VehicleGridSection from './sections/VehicleGridSection';
import FeaturesSection from './sections/FeaturesSection';
import CTASection from './sections/CTASection';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <VehicleGridSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
};

export default HomePage;
