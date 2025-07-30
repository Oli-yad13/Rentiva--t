import React from 'react';
import { Link } from 'react-router-dom';

interface Vehicle {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  features: {
    seats: number;
    transmission: string;
    fuel: string;
    doors: number;
    ac: boolean;
  };
}

const VehicleGridSection: React.FC = () => {
  // Sample vehicle data
  const featuredVehicles: Vehicle[] = [
    {
      id: '1',
      name: 'Toyota Camry',
      category: 'Sedan',
      price: 45,
      image: '/vehicles/toyota-camry.jpg',
      features: {
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Gasoline',
        doors: 4,
        ac: true
      }
    },
    {
      id: '2',
      name: 'Honda CR-V',
      category: 'SUV',
      price: 65,
      image: '/vehicles/honda-crv.jpg',
      features: {
        seats: 7,
        transmission: 'Automatic',
        fuel: 'Gasoline',
        doors: 5,
        ac: true
      }
    },
    {
      id: '3',
      name: 'BMW 3 Series',
      category: 'Luxury',
      price: 85,
      image: '/vehicles/bmw-3series.jpg',
      features: {
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Gasoline',
        doors: 4,
        ac: true
      }
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Vehicles
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our handpicked selection of premium vehicles, 
            each offering comfort, reliability, and style for your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredVehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gray-200 relative">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5WZWhpY2xlIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {vehicle.category}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{vehicle.name}</h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-blue-600">${vehicle.price}</span>
                  <span className="text-gray-500">per day</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <img src="/icons/seats-icon.svg" alt="Seats" className="w-4 h-4" />
                    <span>{vehicle.features.seats} Seats</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src="/icons/gear-shift-1--1.svg" alt="Transmission" className="w-4 h-4" />
                    <span>{vehicle.features.transmission}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src="/icons/fuel-icon.svg" alt="Fuel" className="w-4 h-4" />
                    <span>{vehicle.features.fuel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src="/icons/door-icon.svg" alt="Doors" className="w-4 h-4" />
                    <span>{vehicle.features.doors} Doors</span>
                  </div>
                </div>
                
                <Link
                  to={`/vehicles/${vehicle.id}`}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/vehicles"
            className="inline-flex items-center px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
          >
            View All Vehicles
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VehicleGridSection;
