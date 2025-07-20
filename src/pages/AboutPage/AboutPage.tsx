import React from "react";
import { Users, Award, Clock, Shield, Car, MapPin, Calendar, Star, Smartphone, CreditCard } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Trust & Safety",
    description: "Secure booking system with verified car owners and comprehensive safety measures."
  },
  {
    icon: Award,
    title: "Quality Service",
    description: "Premium vehicles with detailed descriptions, photos, and transparent pricing."
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock customer support to assist you throughout your rental journey."
  },
  {
    icon: Users,
    title: "Community",
    description: "Building a trusted community of car owners and renters across Ethiopia."
  }
];

const features = [
  {
    icon: Car,
    title: "Wide Vehicle Selection",
    description: "From economy cars to luxury vehicles, find the perfect ride for any occasion."
  },
  {
    icon: MapPin,
    title: "Convenient Locations",
    description: "Pick up and drop off at multiple locations across Addis Ababa and beyond."
  },
  {
    icon: Calendar,
    title: "Flexible Booking",
    description: "Book for hours, days, or weeks with our flexible rental periods."
  },
  {
    icon: Star,
    title: "Verified Reviews",
    description: "Read genuine reviews from other renters to make informed decisions."
  },
  {
    icon: Smartphone,
    title: "Easy Mobile Access",
    description: "Manage your bookings on the go with our mobile-friendly platform."
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Safe and secure payment processing with multiple payment options."
  }
];

// Removed fake statistics as we are just starting out

export const AboutPage = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              About Rentiva
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Ethiopia's emerging car rental platform, connecting travelers with trusted vehicle owners for seamless, affordable, and convenient transportation solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  We're building a reliable, accessible, and user-friendly car rental platform that connects vehicle owners with renters, creating economic opportunities while solving mobility challenges in Ethiopia.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Starting with Addis Ababa, we aim to make transportation accessible to everyone, whether for business trips, family vacations, or daily commutes. Our platform is designed to make finding, booking, and enjoying quality vehicles simple and affordable.
                </p>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop"
                  alt="Car rental service"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose Rentiva?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've designed our platform with your needs in mind, offering features that make car rental simple, safe, and affordable.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-[#000080] rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
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

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These values guide our work and learning as students.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-[#000080] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};