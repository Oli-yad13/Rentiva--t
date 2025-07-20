import { CheckIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

// Technical specification data
const technicalSpecifications = [
  {
    icon: "/group.png",
    title: "Gear Box",
    value: "Automat",
  },
  {
    icon: "/clip-path-group.png",
    title: "Fuel",
    value: "Petrol",
  },
  {
    icon: "/clip-path-group-1.png",
    title: "Doors",
    value: "2",
  },
  {
    icon: "/g1593-6.svg",
    title: "Air Conditioner",
    value: "Yes",
  },
  {
    icon: "/mask-group.svg",
    title: "Seats",
    value: "5",
  },
  {
    icon: "/group-1.png",
    title: "Distance",
    value: "500",
  },
];

// Car equipment data
const carEquipmentLeft = ["Abs", "Air Bags", "Cruise Control"];

const carEquipmentRight = ["Abs", "Air Bags", "Air Conditioner"];

export const VehicleDetailsSection = (): JSX.Element => {
  return (
    <section className="flex flex-col md:flex-row items-start justify-center gap-6 px-6 md:px-[72px] py-[60px] w-full">
      {/* Left Column - Vehicle Image and Title */}
      <div className="flex flex-col items-start gap-5">
        <div className="flex flex-col w-full md:w-[678px] items-start gap-5">
          <div className="flex flex-col items-start gap-5">
            <h1 className="font-bold text-defaultblack text-[40px] font-['Work_Sans',Helvetica]">
              Sedan
            </h1>

            <div className="flex items-center gap-1">
              <span className="font-semibold text-[#000080] text-[40px] font-['Work_Sans',Helvetica]">
                2500etb
              </span>
              <span className="font-normal text-[#00000099] text-base font-['Work_Sans',Helvetica]">
                / day
              </span>
            </div>
          </div>

          <img
            className="w-full md:w-[638px] h-auto md:h-[342px] object-contain"
            alt="Sedan car"
            src="/6b2c150d-aee6-42c3-92e3-47cfde40d500-removebg-preview-1.png"
          />
        </div>
      </div>

      {/* Right Column - Technical Specs and Equipment */}
      <div className="flex flex-col items-start gap-16 w-full md:w-auto">
        {/* Technical Specifications */}
        <div className="flex flex-col items-start gap-10 w-full">
          <h2 className="font-semibold text-defaultblack text-2xl font-['Work_Sans',Helvetica]">
            Technical Specification
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full md:w-[636px]">
            {technicalSpecifications.map((spec, index) => (
              <Card
                key={index}
                className="bg-neutral-50 rounded-xl overflow-hidden border-none"
              >
                <CardContent className="flex flex-col items-start justify-center gap-5 p-6 h-[148px]">
                  {spec.title === "Distance" ? (
                    <div className="relative w-6 h-6">
                      <div className="relative w-5 h-5 top-0.5 left-0.5">
                        <div className="relative w-[22px] h-[22px] -top-px -left-px">
                          <img
                            className="absolute w-[21px] h-[22px] top-0 left-0"
                            alt="Group"
                            src={spec.icon}
                          />
                          <img
                            className="absolute w-4 h-[19px] top-0.5 left-1.5"
                            alt="Vector"
                            src="/vector.svg"
                          />
                        </div>
                      </div>
                    </div>
                  ) : spec.title === "Gear Box" ? (
                    <div className="relative w-6 h-6">
                      <img
                        className="absolute w-[22px] h-[22px] top-px left-px"
                        alt="Group"
                        src={spec.icon}
                      />
                    </div>
                  ) : spec.title === "Fuel" || spec.title === "Doors" ? (
                    <div className="relative w-6 h-6 bg-[url(${spec.icon})] bg-[100%_100%]" />
                  ) : (
                    <img
                      className="relative w-6 h-6"
                      alt={spec.title}
                      src={spec.icon}
                    />
                  )}

                  <div className="flex flex-col items-start justify-center gap-2">
                    <h3 className="font-semibold text-defaultblack text-base font-['Work_Sans',Helvetica]">
                      {spec.title}
                    </h3>
                    <p className="font-normal text-[#00000099] text-base font-['Work_Sans',Helvetica]">
                      {spec.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Rent a Car Button */}
        <Button className="w-full md:w-[290px] h-[50px] bg-[#000080] rounded-xl text-defaultwhite font-semibold font-['Inter',Helvetica] text-base">
          Rent a car
        </Button>

        {/* Car Equipment */}
        <div className="flex flex-col items-start gap-10 w-full">
          <h2 className="font-semibold text-defaultblack text-2xl font-['Work_Sans',Helvetica]">
            Car Equipment
          </h2>

          <div className="flex flex-col md:flex-row items-start gap-[60px] w-full">
            {/* Left Equipment Column */}
            <div className="flex flex-col items-start gap-[17px]">
              {carEquipmentLeft.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-6 h-6 flex items-center justify-center bg-[#000080] rounded-full">
                    <CheckIcon className="w-4 h-4 text-white" />
                  </div>
                  {index === 0 && (
                    <>
                      <img
                        className="w-[12.64px] h-[9.31px]"
                        alt="Vector"
                        src="/vector-1.svg"
                      />
                      <img
                        className="w-[12.64px] h-[9.31px]"
                        alt="Vector"
                        src="/vector-1.svg"
                      />
                    </>
                  )}
                  <span className="font-normal text-[#00000099] text-base font-['Work_Sans',Helvetica]">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Right Equipment Column */}
            <div className="flex flex-col items-start gap-[17px]">
              {carEquipmentRight.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-6 h-6 flex items-center justify-center bg-[#000080] rounded-full">
                    <CheckIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-normal text-[#00000099] text-base font-['Work_Sans',Helvetica]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
