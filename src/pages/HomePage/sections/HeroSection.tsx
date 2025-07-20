import React from "react";
import { Button } from "../../../components/ui/button";
import { Link } from "react-router-dom";

export const HeroSection = (): JSX.Element => {
  return (
    <section className="relative bg-gradient-to-br from-[#f7f7fa] via-[#eef1ff] to-[#e6edff] py-8 sm:py-12 md:py-20 min-h-[500px] sm:min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background pattern for additional depth */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 via-transparent to-blue-200/20"></div>
      </div>
      {/* Blue rounded frosted glass container */}
      <div className="relative w-[95vw] max-w-7xl mx-auto min-h-[400px] sm:min-h-[440px] md:min-h-[520px] flex items-center justify-center rounded-[24px] sm:rounded-[32px] md:rounded-[48px] backdrop-blur-2xl bg-gradient-to-r from-[#1a1a8a]/85 via-[#000080]/80 to-[#1a1a8a]/85 shadow-2xl border border-white/30" style={{boxShadow: '0 8px 64px 0 #00008055, inset 0 1px 0 0 rgba(255, 255, 255, 0.2), inset 0 0 20px 0 rgba(255, 255, 255, 0.05)'}}>
        
        {/* Stunning car background image with enhanced positioning */}
        <div className="absolute inset-0 overflow-hidden rounded-[24px] sm:rounded-[32px] md:rounded-[48px]">
          {/* High-quality luxury car image */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4/5 sm:w-3/5 h-full z-0 pointer-events-none">
            <div 
              className="w-full h-full bg-cover bg-no-repeat opacity-25 sm:opacity-30"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&crop=center&auto=format&q=90')`,
                backgroundPosition: 'center right',
                filter: 'blur(1px) brightness(1.1) contrast(1.1)'
              }}
            ></div>
          </div>
          
          {/* Additional luxury car accent */}
          <div className="absolute right-8 bottom-8 w-1/3 h-1/3 z-0 pointer-events-none opacity-20">
            <div 
              className="w-full h-full bg-contain bg-no-repeat bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop&crop=center&auto=format&q=85')`,
                filter: 'blur(0.5px) brightness(1.3)'
              }}
            ></div>
          </div>
          
          {/* Enhanced frosted glass overlay with shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/15 rounded-[24px] sm:rounded-[32px] md:rounded-[48px]"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-400/10 to-transparent rounded-[24px] sm:rounded-[32px] md:rounded-[48px]"></div>
        </div>
        {/* Hero content - Centered layout */}
        <div className="relative z-10 w-full px-4 sm:px-6 py-8 sm:py-12 text-center">
          <div className="text-white space-y-4 sm:space-y-6 max-w-4xl mx-auto">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight font-work-sans">
                Experience the road
                <br />
                <span className="text-white">like never before</span>
              </h1>
              <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
                Book the selected car effortlessly, pay for driving only,
                <span className="hidden sm:inline"><br /></span>
                <span className="sm:hidden"> </span>
                join our service instantly by just a click
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                asChild
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-base sm:text-lg rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Link to="/vehicles">View All Cars</Link>
              </Button>
              <Button 
                asChild
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 px-8 py-4 text-base sm:text-lg rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};