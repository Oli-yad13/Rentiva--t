import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Grid, List } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { VehicleCard } from "../../components/VehicleCard";
import { VehicleCategoryFilter } from "../../components/VehicleCategoryFilter";
import { supabase } from "../../lib/supabaseClient";

const categories = ["All vehicles", "Sedan", "SUV", "Cabriolet", "Pickup", "Minivan", "Electric", "Hatchback"];

export const VehiclesPage = (): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All vehicles");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("cars")
          .select(`
            *,
            reviews(rating)
          `)
          .eq("status", "approved");
        
        if (error) {
          console.error("Error fetching vehicles:", error);
          setVehicles([]);
        } else if (data) {
          // Calculate average rating and review count for each vehicle
          const vehiclesWithRatings = data.map(vehicle => {
            const reviews = vehicle.reviews || [];
            const averageRating = reviews.length > 0 
              ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length 
              : 0;
            
            return {
              ...vehicle,
              average_rating: averageRating,
              review_count: reviews.length
            };
          });
          
          setVehicles(vehiclesWithRatings);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setVehicles([]);
      }
      setLoading(false);
    };
    
    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Handle case-insensitive category matching and common variations
    let matchesCategory = selectedCategory === "All vehicles";
    if (!matchesCategory && vehicle.type) {
      const vehicleType = vehicle.type.toLowerCase();
      const selectedType = selectedCategory.toLowerCase();
      
      // Direct match
      matchesCategory = vehicleType === selectedType;
      
      // Handle common variations
      if (!matchesCategory) {
        if (selectedType === 'suv' && (vehicleType === 'suv' || vehicleType === 'sport utility vehicle')) {
          matchesCategory = true;
        } else if (selectedType === 'cabriolet' && (vehicleType === 'convertible' || vehicleType === 'cabriolet')) {
          matchesCategory = true;
        } else if (selectedType === 'pickup' && (vehicleType === 'pickup truck' || vehicleType === 'truck')) {
          matchesCategory = true;
        }
      }
    }
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white py-6 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-work-sans text-defaultblack mb-4 sm:mb-6">
            Select a vehicle group
          </h1>
        </div>
        
        {/* Category Filter */}
        <VehicleCategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-[#000080] hover:bg-[#000060]" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
            {/* View Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-[#000080] hover:bg-[#000060]" : ""}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-[#000080] hover:bg-[#000060]" : ""}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredVehicles.length} of {vehicles.length} vehicles
          </p>
        </div>
        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {loading ? (
            <div className="col-span-full text-center text-gray-500 py-12">Loading vehicles...</div>
          ) : filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
        {filteredVehicles.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 mb-4">No vehicles found matching your criteria.</p>
            <Button onClick={() => { setSearchTerm(""); setSelectedCategory("All vehicles"); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};