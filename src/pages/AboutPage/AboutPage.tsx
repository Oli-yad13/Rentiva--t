import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  Car, 
  Users, 
  Shield, 
  Award, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  Star,
  CheckCircle,
  Heart,
  Globe
} from 'lucide-react';

const AboutPage: React.FC = () => {
  const stats = [
    { icon: Car, label: 'Vehicles Available', value: '500+' },
    { icon: Users, label: 'Happy Customers', value: '10,000+' },
    { icon: MapPin, label: 'Locations', value: '25+' },
    { icon: Award, label: 'Years of Service', value: '15+' },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Safety First',
      description: 'All our vehicles undergo rigorous safety inspections and maintenance to ensure your peace of mind.',
    },
    {
      icon: Heart,
      title: 'Customer Care',
      description: 'We prioritize exceptional customer service and support throughout your rental experience.',
    },
    {
      icon: CheckCircle,
      title: 'Reliability',
      description: 'Count on us for dependable vehicles and transparent, honest business practices.',
    },
    {
      icon: Globe,
      title: 'Accessibility',
      description: 'Convenient locations and flexible rental options to meet your travel needs.',
    },
  ];

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: '/api/placeholder/150/150',
      bio: 'With 20+ years in the automotive industry, Sarah founded Rentiva to revolutionize car rentals.',
    },
    {
      name: 'Michael Chen',
      role: 'Operations Director',
      image: '/api/placeholder/150/150',
      bio: 'Michael ensures our fleet is maintained to the highest standards and operations run smoothly.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Customer Experience Manager',
      image: '/api/placeholder/150/150',
      bio: 'Emily leads our customer service team to deliver exceptional experiences for every customer.',
    },
    {
      name: 'David Thompson',
      role: 'Technology Lead',
      image: '/api/placeholder/150/150',
      bio: 'David oversees our digital platform and ensures seamless booking and rental processes.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">About Rentiva</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Your trusted partner in car rentals since 2009. We're committed to providing 
            exceptional vehicles and outstanding service for all your transportation needs.
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
            <Phone className="w-5 h-5 mr-2" />
            Contact Us Today
          </Button>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Founded in 2009, Rentiva began as a small family business with just five vehicles 
                and a simple mission: to provide reliable, affordable car rentals with exceptional 
                customer service.
              </p>
              <p className="text-gray-700 mb-4">
                Over the years, we've grown into one of the region's most trusted car rental companies, 
                expanding our fleet to over 500 vehicles and serving more than 10,000 satisfied customers 
                across 25 locations.
              </p>
              <p className="text-gray-700">
                Despite our growth, we've never forgotten our roots. We still operate with the same 
                family values and personal touch that made us who we are today.
              </p>
            </div>
            <div className="relative">
              <img
                src="/api/placeholder/600/400"
                alt="Rentiva fleet"
                className="rounded-lg shadow-lg w-full"
              />
              <div className="absolute inset-0 bg-blue-600 opacity-10 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Rentiva by the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardContent className="pt-6">
                  <stat.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center h-full">
                <CardHeader>
                  <value.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Our Mission</h2>
          <p className="text-xl max-w-4xl mx-auto mb-8">
            To provide exceptional car rental experiences that exceed expectations, 
            offering reliable vehicles, transparent pricing, and outstanding customer 
            service that makes every journey memorable.
          </p>
          <div className="flex justify-center items-center gap-2">
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            <span className="ml-2 text-lg">Rated 4.9/5 by our customers</span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What do I need to rent a car?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  You'll need a valid driver's license, credit card, and to meet our minimum age 
                  requirement (21 years old). International visitors need a valid passport and 
                  international driving permit.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I modify or cancel my reservation?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Yes! You can modify or cancel your reservation up to 24 hours before your 
                  pickup time without any fees. Changes within 24 hours may incur charges.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer insurance coverage?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We offer comprehensive insurance options including collision damage waiver, 
                  liability protection, and personal accident insurance. Coverage details vary 
                  by location and vehicle type.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's your fuel policy?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We operate on a full-to-full fuel policy. You'll receive the vehicle with a 
                  full tank and should return it with a full tank to avoid refueling charges.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of satisfied customers who trust Rentiva for their car rental needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Car className="w-5 h-5 mr-2" />
              Browse Vehicles
            </Button>
            <Button size="lg" variant="outline">
              <Mail className="w-5 h-5 mr-2" />
              Contact Support
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
