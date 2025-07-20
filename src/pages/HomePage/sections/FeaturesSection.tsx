import React from "react";
import { MapPin, Car, CreditCard } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Availability",
    description: "Addis Ababa,Jimma city, Hawet Bishoftu..."
  },
  {
    icon: Car,
    title: "Comfort",
    description: "The best quality comfortable cars for the best customers"
  },
  {
    icon: CreditCard,
    title: "Savings",
    description: "Premium complete of clean and comfortable without hidden costs"
  }
];

export const FeaturesSection = (): JSX.Element => {
  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <feature.icon className="w-8 h-8 text-[#000080]" />
              </div>
              <h3 className="text-xl font-semibold font-work-sans text-defaultblack mb-3">
                {feature.title}
              </h3>
              <p className="font-work-sans text-[#00000099] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};