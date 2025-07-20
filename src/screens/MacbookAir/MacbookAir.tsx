import React from "react";
import { CarSelectionSection } from "./sections/CarSelectionSection";
import { HeaderSection } from "./sections/HeaderSection";
import { VehicleDetailsSection } from "./sections/VehicleDetailsSection";

export const MacbookAir = (): JSX.Element => {
  return (
    <div className="bg-white flex flex-col items-center w-full">
      <div className="bg-white w-full max-w-[1440px] relative">
        <HeaderSection />
        <VehicleDetailsSection />
        <CarSelectionSection />
      </div>
    </div>
  );
};
