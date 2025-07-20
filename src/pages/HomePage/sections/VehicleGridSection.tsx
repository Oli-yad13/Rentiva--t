import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Settings, Fuel, Snowflake } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { supabase } from "../../../lib/supabaseClient";
import { vehiclePlaceholders } from "../../../utils/vehiclePlaceholders";

export const VehicleGridSection = (): JSX.Element => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { data, error } = await supabase
          .from("cars")
          .select("*")
          .eq("status", "approved")
          .limit(6);
        
        if (error) {
          console.error("Error fetching vehicles:", error);
          setVehicles([]);
        } else {
          setVehicles(data || []);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setVehicles([]);
      }
      setLoading(false);
    };
    
    fetchVehicles();
  }, []);

  return (
    <section className="flex flex-col w-full items-center gap-10 py-16 px-[72px]">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="flex w-full max-w-[1296px] mx-auto items-end justify-between mb-10">
          <h2 className="font-work-sans font-bold text-defaultblack text-[50px]">
            Other cars
          </h2>
          <Link to="/vehicles" className="flex items-center gap-2 cursor-pointer hover:text-[#000080] transition-colors">
            <span className="font-work-sans font-bold text-defaultblack text-xl whitespace-nowrap">
              View All
            </span>
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-[1296px] mx-auto gap-6">
          {loading ? (
            <div className="col-span-full text-center text-gray-500 py-12">
              Loading vehicles...
            </div>
          ) : vehicles.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12">
              No vehicles available at the moment.
            </div>
          ) : (
            vehicles.map((vehicle) => {
              const imageUrl = vehicle.image_url || vehiclePlaceholders.getImageForVehicle(vehicle.make, vehicle.model, vehicle.type);
              
              return (
                <Card key={vehicle.id} className="bg-neutral-50 rounded-[20px] overflow-hidden">
                  <CardContent className="p-6 flex flex-col gap-10">
                    <div className="flex flex-col gap-5">
                      <div 
                        className="w-full h-60 bg-cover bg-center rounded-lg" 
                        style={{ backgroundImage: `url(${imageUrl})` }}
                      />
                      
                      <div className="flex flex-col gap-10">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-1">
                            <h3 className="font-work-sans font-semibold text-defaultblack text-2xl whitespace-nowrap">
                              {vehicle.make} {vehicle.model}
                            </h3>
                            <p className="font-work-sans font-normal text-[#00000099] text-base whitespace-nowrap">
                              {vehicle.type}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="font-work-sans font-semibold text-[#000080] text-2xl whitespace-nowrap">
                              {vehicle.price_per_day} ETB
                            </span>
                            <span className="font-work-sans font-normal text-[#00000099] text-sm whitespace-nowrap">
                              per day
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <Settings className="w-6 h-6" />
                            <span className="font-work-sans font-normal text-[#00000099] text-base whitespace-nowrap">
                              {vehicle.transmission || 'Manual'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Fuel className="w-6 h-6" />
                            <span className="font-work-sans font-normal text-[#00000099] text-base whitespace-nowrap">
                              {vehicle.fuel_type || 'Petrol'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Snowflake className="w-6 h-6" />
                            <span className="font-work-sans font-normal text-[#00000099] text-base whitespace-nowrap">
                              {vehicle.air_conditioning ? 'AC' : 'No AC'}
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
            })
          )}
        </div>
      </div>
    </section>
  );
};