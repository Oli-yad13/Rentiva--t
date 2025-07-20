import { ArrowRightIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

// Car data for mapping
const carData = [
  {
    id: 1,
    name: "Toyota Prado",
    type: "Suv",
    price: "5000 Etb",
    transmission: "Manual",
    fuel: "Pb 95",
    hasAirConditioner: true,
    image: "/img.png",
  },
  {
    id: 2,
    name: "Toyota Yaris",
    type: "Sedan",
    price: "4500 Etb",
    transmission: "Automat",
    fuel: "Pb 95",
    hasAirConditioner: true,
    image: "/img-1.png",
  },
  {
    id: 3,
    name: "Toyota Rav-4",
    type: "Suv",
    price: "3450etb",
    transmission: "Manual",
    fuel: "Pb 95",
    hasAirConditioner: true,
    image: "/img-2.png",
    imageRotate: true,
  },
  {
    id: 4,
    name: "Toyota Rush",
    type: "Suv",
    price: "4500etb",
    transmission: "Automat",
    fuel: "Ev",
    hasAirConditioner: true,
    image: "/img-3.png",
  },
  {
    id: 5,
    name: "Seagull-byd",
    type: "Suv",
    price: "2500etb",
    transmission: "Automat",
    fuel: "Pb 95",
    hasAirConditioner: true,
    image: "/img-4.png",
    imageRotate: true,
  },
  {
    id: 6,
    name: "Suzuki Swift",
    type: "Suv",
    price: "4500etb",
    transmission: "Manual",
    fuel: "Pb 95",
    hasAirConditioner: true,
    image: "/img-5.png",
  },
];

export const CarSelectionSection = (): JSX.Element => {
  return (
    <section className="flex flex-col w-full items-center gap-10 py-16 px-[72px]">
      <div className="flex w-full max-w-[1296px] items-end justify-between">
        <h2 className="font-['Work_Sans',Helvetica] font-bold text-defaultblack text-[50px]">
          Other cars
        </h2>

        <div className="flex items-center gap-2 cursor-pointer">
          <span className="font-['Work_Sans',Helvetica] font-bold text-defaultblack text-xl whitespace-nowrap">
            View All
          </span>
          <ArrowRightIcon className="w-6 h-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-[1296px] gap-6">
        {carData.map((car) => (
          <Card
            key={car.id}
            className="bg-neutral-50 rounded-[20px] overflow-hidden"
          >
            <CardContent className="p-6 flex flex-col gap-10">
              <div className="flex flex-col gap-5">
                <div
                  className={`w-full h-60 bg-cover bg-center ${car.imageRotate ? "rotate-180" : ""}`}
                  style={{ backgroundImage: `url(${car.image})` }}
                />

                <div className="flex flex-col gap-10">
                  <div className="flex justify-between">
                    <div className="flex flex-col gap-1">
                      <h3 className="font-['Work_Sans',Helvetica] font-semibold text-defaultblack text-2xl whitespace-nowrap">
                        {car.name}
                      </h3>
                      <p className="font-['Work_Sans',Helvetica] font-normal text-[#00000099] text-base whitespace-nowrap">
                        {car.type}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="font-['Work_Sans',Helvetica] font-semibold text-[#000080] text-2xl whitespace-nowrap">
                        {car.price}
                      </span>
                      <span className="font-['Work_Sans',Helvetica] font-normal text-[#00000099] text-sm whitespace-nowrap">
                        per day
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        className="w-6 h-6"
                        alt="Gear shift"
                        src="/gear-shift-1--1.svg"
                      />
                      <span className="font-['Work_Sans',Helvetica] font-normal text-[#00000099] text-base whitespace-nowrap">
                        {car.transmission}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <img
                        className="w-6 h-6"
                        alt="Fuel type"
                        src={
                          car.fuel === "Ev"
                            ? "/g17.svg"
                            : `/g17-${car.id === 1 ? "1" : car.id}.svg`
                        }
                      />
                      <span className="font-['Work_Sans',Helvetica] font-normal text-[#00000099] text-base whitespace-nowrap">
                        {car.fuel}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <img
                        className="w-6 h-6"
                        alt="Air conditioner"
                        src={`/g1593${car.id === 6 ? "" : `-${car.id === 5 ? "1" : car.id}`}.svg`}
                      />
                      <span className="font-['Work_Sans',Helvetica] font-normal text-[#00000099] text-base whitespace-nowrap">
                        Air Conditioner
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full h-[50px] bg-[#000080] rounded-xl text-defaultwhite font-['Inter',Helvetica] font-semibold">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
