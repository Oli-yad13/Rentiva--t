import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Settings, Fuel, Snowflake } from "lucide-react";
import { vehiclePlaceholders } from "../utils/vehiclePlaceholders";
import { LazyImage } from "./ui/LazyImage";
import { StarRating } from "./StarRating";

interface VehicleCardProps {
  vehicle: {
    id: string;
    make: string;
    model: string;
    type: string;
    price_per_day: number;
    image_url?: string;
    year?: number;
    average_rating?: number;
    review_count?: number;
  };
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const imageUrl = vehicle.image_url || vehiclePlaceholders.getImageForVehicle(vehicle.make, vehicle.model, vehicle.type);
  
  return (
    <Card className="bg-neutral-50 rounded-[20px] overflow-hidden border-0">
      <CardContent className="p-6 flex flex-col gap-10">
        <div className="flex flex-col gap-5">
          {/* Vehicle Image */}
          <LazyImage
            src={imageUrl}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-60 rounded-lg"
            fallback={vehiclePlaceholders.images.sedan}
          />
          
          <div className="flex flex-col gap-10">
            {/* Vehicle Info */}
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1 flex-1 pr-2">
                <h3 className="font-work-sans font-semibold text-defaultblack text-lg sm:text-xl lg:text-2xl truncate">
                  {vehicle.make} {vehicle.model}
                </h3>
                <p className="font-work-sans font-normal text-[#00000099] text-sm sm:text-base truncate">
                  {vehicle.type}
                </p>
                {/* Rating */}
                {vehicle.average_rating && vehicle.review_count ? (
                  <div className="flex items-center gap-1 mt-1">
                    <StarRating rating={vehicle.average_rating} size="sm" />
                    <span className="text-xs text-gray-500">
                      ({vehicle.review_count})
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="font-work-sans font-semibold text-[#000080] text-lg sm:text-xl lg:text-2xl">
                  {vehicle.price_per_day} ETB
                </span>
                <span className="font-work-sans font-normal text-[#00000099] text-xs sm:text-sm">
                  per day
                </span>
              </div>
            </div>
            
            {/* Specifications Row */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
              <div className="flex items-center gap-1 sm:gap-2">
                <img 
                  className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" 
                  alt="Gear shift" 
                  src="/gear-shift-1--1.svg" 
                />
                <span className="font-work-sans font-normal text-[#00000099] text-sm sm:text-base truncate">
                  Manual
                </span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Fuel className="w-5 h-5 sm:w-6 sm:h-6 text-[#00000099] flex-shrink-0" />
                <span className="font-work-sans font-normal text-[#00000099] text-sm sm:text-base truncate">
                  PB 95
                </span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <img 
                  className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" 
                  alt="Air conditioner" 
                  src="/g1593-3.svg" 
                />
                <span className="font-work-sans font-normal text-[#00000099] text-sm sm:text-base truncate">
                  AC
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <Button asChild className="w-full h-[50px] bg-[#000080] rounded-xl text-defaultwhite font-inter font-semibold">
          <Link to={`/vehicle/${vehicle.id}`}>
            View Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};