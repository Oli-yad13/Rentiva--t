import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CTASection: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse animation-delay-2000"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className={`transform transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Hit the Road?
          </h2>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied customers who have discovered the freedom of 
            premium car rental. Your perfect journey starts here.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link
              to="/vehicles"
              className="group bg-gradient-to-r from-white to-blue-50 text-blue-600 px-10 py-5 rounded-full font-bold text-lg transform hover:-translate-y-1 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-3"
            >
              <span>Explore Vehicles</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            
            <Link
              to="/auth/register"
              className="group border-3 border-white text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
            >
              <span>Start Free Trial</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Enhanced stats with animations */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 transform transition-all duration-300 hover:bg-opacity-20 hover:-translate-y-1">
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-200 text-sm">Premium Vehicles</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 transform transition-all duration-300 hover:bg-opacity-20 hover:-translate-y-1">
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-blue-200 text-sm">Locations</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 transform transition-all duration-300 hover:bg-opacity-20 hover:-translate-y-1">
              <div className="text-3xl font-bold text-white mb-2">10k+</div>
              <div className="text-blue-200 text-sm">Happy Customers</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 transform transition-all duration-300 hover:bg-opacity-20 hover:-translate-y-1">
              <div className="text-3xl font-bold text-white mb-2">4.9★</div>
              <div className="text-blue-200 text-sm">Average Rating</div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center text-blue-100">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Money Back Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
