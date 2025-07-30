import React from 'react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: '/icons/ac-icon.svg',
      title: 'Premium Comfort',
      description: 'All vehicles equipped with air conditioning, comfortable seating, and modern amenities for your journey.'
    },
    {
      icon: '/icons/gear-shift-1--1.svg',
      title: 'Easy Booking',
      description: 'Simple online booking process with instant confirmation and flexible pickup options.'
    },
    {
      icon: '/icons/fuel-icon.svg',
      title: 'Fuel Efficient',
      description: 'Choose from our eco-friendly fleet with excellent fuel economy to save on your travels.'
    },
    {
      icon: '/icons/g1593-3.svg',
      title: '24/7 Support',
      description: 'Round-the-clock customer support to assist you whenever you need help during your rental.'
    }
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Rentiva?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the difference with our premium car rental service. 
            We're committed to making your journey comfortable and hassle-free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <img 
                  src={feature.icon} 
                  alt={feature.title}
                  className="w-8 h-8"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=';
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
