import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

export const CTASection = (): JSX.Element => {
  const [city, setCity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("City submitted:", city);
    alert(`Thank you! We'll notify you when we expand to ${city}.`);
    setCity("");
  };

  return (
    <section className="py-20 bg-gradient-to-r from-[#1a1a8a] to-[#000080] text-white">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Where should Rentiva expand next?
          </h2>
          <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto">
            Let us know which city you'd like to see Rentiva in! Enter your city below and we'll notify you if we launch there.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter your city"
              className="h-12 bg-white text-gray-900 border-0 flex-1"
              required
            />
            <Button 
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 h-12 font-semibold whitespace-nowrap"
            >
              Notify Me
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};