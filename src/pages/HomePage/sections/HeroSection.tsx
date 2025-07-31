import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('HeroSection error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700">
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
            <p className="text-lg">Please refresh the page to continue</p>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}

// Loading skeleton component
const LoadingSkeleton: React.FC = () => (
  <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <div className="animate-pulse">
        <div className="h-16 bg-white bg-opacity-20 rounded-lg mb-6 w-3/4 mx-auto"></div>
        <div className="h-6 bg-white bg-opacity-20 rounded-lg mb-8 w-1/2 mx-auto"></div>
        <div className="h-12 bg-white bg-opacity-20 rounded-full mb-12 w-64 mx-auto"></div>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-white bg-opacity-20 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const HeroSection: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Optimized loading sequence
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
      setIsLoading(false);
    }, 300);

    // Intersection observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      clearTimeout(loadTimer);
      window.removeEventListener('resize', checkMobile);
      observer.disconnect();
    };
  }, []);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <ErrorBoundary>
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
        {/* Optimized animated background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                              radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)`,
              animation: 'float 20s ease-in-out infinite'
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`text-center transform transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight ${isMobile ? 'text-4xl' : ''}`}>
              Drive Your Dreams
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 animate-pulse">
                Premium Cars
              </span>
            </h1>
            
            <p className={`text-lg md:text-xl lg:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed ${isMobile ? 'text-lg' : ''}`}>
              Experience luxury car rental like never before. Choose from 500+ premium vehicles 
              and start your journey today.
            </p>
            
            <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4 justify-center items-center mb-12`}>
              <Link
                to="/vehicles"
                className="group bg-gradient-to-r from-white to-blue-50 text-blue-600 px-8 py-4 rounded-full font-bold text-base md:text-lg transform hover:-translate-y-1 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-2 touch-manipulation"
              >
                <span>Explore Vehicles</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              
              <Link
                to="/auth/register"
                className="group border-2 border-white text-white px-8 py-4 rounded-full font-bold text-base md:text-lg hover:bg-white hover:text-blue-600 transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 touch-manipulation"
              >
                <span>Start Free Trial</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            {/* Optimized stats section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { value: '500+', label: 'Premium Vehicles' },
                { value: '50+', label: 'Locations' },
                { value: '10k+', label: 'Happy Customers' },
                { value: '4.9★', label: 'Average Rating' }
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 transform transition-all duration-300 hover:bg-opacity-20 hover:-translate-y-1 animate-on-scroll"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="text-xl md:text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs md:text-sm text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Touch-friendly scroll indicator for mobile */}
        {isMobile && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        )}
      </section>
    </ErrorBoundary>
  );
};

export default HeroSection;
