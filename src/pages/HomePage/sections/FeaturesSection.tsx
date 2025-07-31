import React, { useState, useEffect } from 'react';

const FeaturesSection: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const features = [
    {
      icon: '🚗',
      title: 'Premium Fleet',
      description: 'Choose from 500+ meticulously maintained vehicles, from economy to luxury, all equipped with modern amenities.'
    },
    {
      icon: '⚡',
      title: 'Instant Booking',
      description: 'Book your perfect car in under 2 minutes with our streamlined booking process and instant confirmation.'
    },
    {
      icon: '💰',
      title: 'Transparent Pricing',
      description: 'No hidden fees! Get upfront pricing with flexible options and special discounts for extended rentals.'
    },
    {
      icon: '🛡️',
      title: '24/7 Roadside',
      description: 'Complete peace of mind with round-the-clock roadside assistance and dedicated customer support.'
    },
    {
      icon: '📱',
      title: 'Mobile App',
      description: 'Manage your bookings on-the-go with our user-friendly mobile app for iOS and Android devices.'
    },
    {
      icon: '🌍',
      title: 'Nationwide Coverage',
      description: 'Pick up and drop off at 50+ locations across major cities with flexible scheduling options.'
    }
  ];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-white via-blue-50 to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose Rentiva?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the difference with our premium car rental service. 
            We're committed to making your journey comfortable, convenient, and memorable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-8 shadow-lg transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-3xl transform transition-transform duration-300 hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="bg-white rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600">Premium Vehicles</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-gray-600">Locations</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="text-3xl font-bold text-blue-600 mb-2">10k+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="text-3xl font-bold text-blue-600 mb-2">4.9★</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
