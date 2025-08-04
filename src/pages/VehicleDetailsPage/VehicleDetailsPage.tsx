import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { ReviewsList } from "../../components/ReviewsList";
import { supabase } from "../../lib/supabaseClient";


export const VehicleDetailsPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<any>(null);
  const [otherVehicles, setOtherVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!id) return;

      try {
        // Fetch the specific vehicle first
        const { data: vehicleData, error: vehicleError } = await supabase
          .from("cars")
          .select("*")
          .eq("id", id)
          .eq("status", "approved")
          .single();

        if (vehicleError) {
          if (vehicleError.code === 'PGRST116') {
            // No rows returned
            throw new Error('Vehicle not found or not available');
          }
          throw vehicleError;
        }
        
        // Fetch owner profile separately if needed
        let ownerProfile = null;
        if (vehicleData.owner_id) {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("full_name, email")
            .eq("id", vehicleData.owner_id)
            .single();
          
          if (!profileError && profileData) {
            ownerProfile = profileData;
          }
        }
        
        setVehicle({
          ...vehicleData,
          profiles: ownerProfile
        });

        // Fetch other approved vehicles (excluding current one)
        const { data: otherData, error: otherError } = await supabase
          .from("cars")
          .select("*")
          .eq("status", "approved")
          .neq("id", id)
          .limit(6);

        if (otherError) throw otherError;
        setOtherVehicles(otherData || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-lg text-gray-600">Loading vehicle details...</div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load vehicle</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button asChild>
          <Link to="/vehicles">Back to Vehicles</Link>
        </Button>
      </div>
    </div>
  );
  
  if (!vehicle) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Vehicle not found</h2>
        <p className="text-gray-600 mb-4">The vehicle you're looking for might have been removed or is no longer available.</p>
        <Button asChild>
          <Link to="/vehicles">Browse Other Vehicles</Link>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-8">
          <Link to="/vehicles">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Vehicles
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Left Column - Vehicle Info and Image */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {vehicle.make} {vehicle.model} ({vehicle.year})
              </h1>
              <div className="flex items-center gap-2 mb-8">
                <span className="text-4xl font-bold text-[#000080]">{vehicle.price_per_day} ETB</span>
                <span className="text-gray-500">/ day</span>
              </div>
              {vehicle.description && (
                <p className="text-gray-600 mb-6">{vehicle.description}</p>
              )}
            </div>
            
            <div className="relative">
              <img
                src={vehicle.image_url || "/placeholder-car.jpg"}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-auto max-w-2xl mx-auto rounded-lg"
              />
            </div>
          </div>

          {/* Right Column - Technical Specs and Equipment */}
          <div className="space-y-12">
            {/* Technical Specifications */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">
                Vehicle Information
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <Card className="bg-gray-50 border-0">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-gray-900 text-sm mb-2">Make</h3>
                    <p className="text-gray-600 text-sm">{vehicle.make}</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-50 border-0">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-gray-900 text-sm mb-2">Model</h3>
                    <p className="text-gray-600 text-sm">{vehicle.model}</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-50 border-0">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-gray-900 text-sm mb-2">Year</h3>
                    <p className="text-gray-600 text-sm">{vehicle.year}</p>
                  </CardContent>
                </Card>
                {vehicle.type && (
                  <Card className="bg-gray-50 border-0">
                    <CardContent className="p-6 text-center">
                      <h3 className="font-semibold text-gray-900 text-sm mb-2">Type</h3>
                      <p className="text-gray-600 text-sm">{vehicle.type}</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Rent a Car Button */}
              <Button asChild className="w-full max-w-xs bg-[#000080] hover:bg-[#000060] h-12 text-white font-semibold rounded-xl mb-12">
                <Link to={`/booking/${vehicle.id}`}>
                  Rent a car
                </Link>
              </Button>
            </div>

            {/* Owner Information */}
            {vehicle.profiles && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-8">
                  Owner Information
                </h2>
                <Card className="bg-gray-50 border-0">
                  <CardContent className="p-6">
                    <p className="text-gray-600">
                      <strong>Owner:</strong> {vehicle.profiles.full_name || "Not provided"}
                    </p>
                    <p className="text-gray-600">
                      <strong>Contact:</strong> {vehicle.profiles.email}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-20">
          <ReviewsList carId={id!} />
        </div>

        {/* Other Cars Section */}
        <div>
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">
              Other cars
            </h2>
            <Link to="/vehicles" className="flex items-center gap-2 text-gray-900 hover:text-[#000080] transition-colors">
              <span className="font-bold text-xl">View All</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherVehicles.map((car) => (
              <Card key={car.id} className="bg-gray-50 border-0 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="h-48 mb-6 flex items-center justify-center">
                    <img
                      src={car.image_url || "/placeholder-car.jpg"}
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {car.make} {car.model}
                        </h3>
                        <p className="text-gray-500">{car.type || "Car"}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-semibold text-[#000080]">{car.price_per_day} ETB</div>
                        <div className="text-sm text-gray-500">per day</div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      <p><strong>Year:</strong> {car.year}</p>
                      {car.description && (
                        <p className="mt-2 line-clamp-2">{car.description}</p>
                      )}
                    </div>

                    <Button asChild className="w-full bg-[#000080] hover:bg-[#000060] h-12 rounded-xl">
                      <Link to={`/vehicle/${car.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};