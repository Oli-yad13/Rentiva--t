import React from "react";
import { HeroSection } from "./sections/HeroSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { VehicleGridSection } from "./sections/VehicleGridSection";
import { CTASection } from "./sections/CTASection";

export const HomePage = (): JSX.Element => {
  return (
    <div className="w-full bg-white">
      <HeroSection />
      <FeaturesSection />
      <VehicleGridSection />
      <CTASection />
    </div>
  );
};