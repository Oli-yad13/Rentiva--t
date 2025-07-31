import React, { useState, useEffect, useCallback } from 'react';

// Error boundary for vehicle grid
class VehicleGridErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, errorInfo: React.ErrorInfo) {
    console.error('VehicleGrid error:', _error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">We're having trouble loading the vehicles right now.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  pricePerDay: number;
  imageUrl: string;
  transmission: string;
  fuelType: string;
  seats: number;
  doors: number;
  ac: boolean;
  rating: number;
  reviews: number;
}

const VehicleGridSection: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Enhanced sample data with more variety
  const sampleVehicles: Vehicle[] = [
    {
      id: 1,
      make: 'Toyota',
      model: 'Camry Hybrid',
      year: 2024,
      pricePerDay: 55,
      imageUrl: '/vehicles/toyota-camry.jpg',
      transmission: 'Automatic',
      fuelType: 'Hybrid',
      seats: 5,
      doors: 4,
      ac: true,
      rating: 4.8,
      reviews: 124
    },
    {
      id: 2,
      make: 'Honda',
      model: 'Civic Sport',
      year: 2024,
      pricePerDay: 48,
      imageUrl: '/vehicles/honda-civic.jpg',
      transmission: 'CVT',
      fuelType: 'Petrol',
      seats: 5,
      doors: 4,
      ac: true,
      rating: 4.7,
      reviews: 98
    },
    {
      id: 3,
      make: 'BMW',
      model: '330i M Sport',
      year: 2024,
      pricePerDay: 95,
      imageUrl: '/vehicles/bmw-3series.jpg',
      transmission: '8-Speed Auto',
      fuelType: 'Petrol',
      seats: 5,
      doors: 4,
      ac: true,
      rating: 4.9,
      reviews: 156
    },
    {
      id: 4,
      make: 'Mercedes',
      model: 'C300 AMG Line',
      year: 2024,
      pricePerDay: 105,
      imageUrl: '/vehicles/mercedes-cclass.jpg',
      transmission: '9G-Tronic',
      fuelType: 'Petrol',
      seats: 5,
      doors: 4,
      ac: true,
      rating: 4.9,
      reviews: 203
    },
    {
      id: 5,
      make: 'Audi',
      model: 'A4 Technik',
      year: 2024,
      pricePerDay: 88,
      imageUrl: '/vehicles/audi-a4.jpg',
      transmission: 'S-Tronic',
      fuelType: 'Petrol',
      seats: 5,
      doors: 4,
      ac: true,
      rating: 4.8,
      reviews: 89
    },
    {
      id: 6,
      make: 'Lexus',
      model: 'ES 300h',
      year: 2024,
      pricePerDay: 78,
      imageUrl: '/vehicles/lexus-es.jpg',
      transmission: 'e-CVT',
      fuelType: 'Hybrid',
      seats: 5,
      doors: 4,
      ac: true,
      rating: 4.9,
      reviews: 67
    }
  ];

  // Check mobile device and handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Simulate API call with realistic timing
    const loadVehicles = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setVehicles(sampleVehicles);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load vehicles:', error);
        setIsLoading(false);
      }
    };

    loadVehicles();

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Touch gesture handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    // Handle swipe gestures for mobile navigation
    if (isLeftSwipe || isRightSwipe) {
      // Could implement swipe navigation here
    }
  }, [touchStart, touchEnd]);

  const VehicleCard: React.FC<{ vehicle: Vehicle }> = ({ vehicle }) => {
    const [imageError, setImageError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div 
        className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 touch-manipulation ${
          isMobile ? 'active:scale-95' : ''
        }`}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {imageError ? (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <div className="text-6xl font-bold text-gray-400">
                {vehicle.make.charAt(0)}
              </div>
            </div>
          ) : (
            <img 
              src={vehicle.imageUrl} 
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          )}
          <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            ${vehicle.pricePerDay}/day
          </div>
          {isHovered && (
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center transition-opacity duration-300">
              <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-transform">
                Quick View
              </button>
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(vehicle.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-sm text-gray-600 font-medium">{vehicle.rating}</span>
              <span className="ml-1 text-sm text-gray-500">({vehicle.reviews})</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {vehicle.seats} Seats
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              {vehicle.transmission}
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {vehicle.fuelType}
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {vehicle.doors} Doors
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95">
            Book Now - ${vehicle.pricePerDay}/day
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 mb-4">Loading...</p>
      </div>
    );
  }

  if (!vehicles.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 mb-4">No vehicles found.</p>
      </div>
    );
  }

  // Loading skeleton component
  const VehicleGridSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-300"></div>
          <div className="p-6">
            <div className="h-6 bg-gray-300 rounded mb-3"></div>
            <div className="h-4 bg-gray-300 rounded mb-3 w-3/4"></div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-300 rounded"></div>
              ))}
            </div>
            <div className="h-10 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <VehicleGridErrorBoundary>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Perfect Ride
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our wide selection of premium vehicles, all maintained to the highest standards
            </p>
          </div>

          {isLoading ? (
            <VehicleGridSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {vehicles.map(vehicle => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      </section>
    </VehicleGridErrorBoundary>
  );
};

export default VehicleGridSection;
