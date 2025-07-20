import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, User, Phone, Mail, CreditCard } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { supabase } from "../../lib/supabaseClient";
import { useNotifications } from "../../hooks/useNotifications";

export const BookingPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!id) {
        setError("Invalid vehicle ID.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from("cars")
          .select("*")
          .eq("id", id)
          .eq("status", "approved")
          .single();
          
        if (error || !data) {
          setError("Vehicle not found or not available for booking.");
          setVehicle(null);
        } else {
          setVehicle(data);
        }
      } catch (err) {
        console.error("Error fetching vehicle:", err);
        setError("Failed to load vehicle details.");
        setVehicle(null);
      }
      
      setLoading(false);
    };
    fetchVehicle();
  }, [id]);

  const [bookingData, setBookingData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    
    // Rental Details
    pickupDate: "",
    returnDate: "",
    pickupLocation: "",
    returnLocation: "",
    
    // Special Requests
    specialRequests: ""
  });

  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus(null);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setSubmitStatus("You must be logged in to book a car.");
      return;
    }
    if (!vehicle) {
      setSubmitStatus("Vehicle not found.");
      return;
    }
    const { data: booking, error } = await supabase.from("bookings").insert([
      {
        user_id: session.user.id,
        car_id: vehicle.id,
        pickup_date: bookingData.pickupDate,
        return_date: bookingData.returnDate,
        pickup_location: bookingData.pickupLocation,
        return_location: bookingData.returnLocation,
        status: 'confirmed'
      }
    ]).select().single();
    
    if (error) {
      setSubmitStatus("Error: " + error.message);
    } else {
      setSubmitStatus("Booking confirmed successfully!");
      addNotification({
        type: 'success',
        title: 'Booking Confirmed!',
        message: 'Your car rental has been successfully booked. Redirecting to your profile...',
        duration: 5000
      });
      // Redirect to profile page
      setTimeout(() => {
        navigate("/profile");
      }, 3000);
    }
  };


  const calculateDays = () => {
    if (bookingData.pickupDate && bookingData.returnDate) {
      const pickup = new Date(bookingData.pickupDate);
      const returnDate = new Date(bookingData.returnDate);
      const diffTime = Math.abs(returnDate.getTime() - pickup.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays || 1;
    }
    return 1;
  };

  if (loading) return <div className="p-8 text-center">Loading vehicle...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!vehicle) return null;

  const basePrice = parseInt(vehicle.price_per_day || vehicle.price?.replace(/[^\d]/g, '') || '0');
  const days = calculateDays();
  const subtotal = basePrice * days;
  const total = subtotal;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-8">
          <Link to={`/vehicle/${id}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Vehicle Details
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Complete Your Booking
              </h1>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-[#000080]" />
                    Personal Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <Input
                        type="text"
                        name="firstName"
                        value={bookingData.firstName}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <Input
                        type="text"
                        name="lastName"
                        value={bookingData.lastName}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                        placeholder="Enter your last name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={bookingData.email}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={bookingData.phone}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                        placeholder="+251 911 123 456"
                      />
                    </div>
                  </div>
                </div>

                {/* Rental Details */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-[#000080]" />
                    Rental Details
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pickup Date *
                      </label>
                      <Input
                        type="date"
                        name="pickupDate"
                        value={bookingData.pickupDate}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Return Date *
                      </label>
                      <Input
                        type="date"
                        name="returnDate"
                        value={bookingData.returnDate}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                        min={bookingData.pickupDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pickup Location *
                      </label>
                      <select
                        name="pickupLocation"
                        value={bookingData.pickupLocation}
                        onChange={handleInputChange}
                        required
                        className="w-full h-12 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#000080] focus:border-transparent"
                      >
                        <option value="">Select pickup location</option>
                        <option value="airport">Bole International Airport</option>
                        <option value="downtown">Downtown Office</option>
                        <option value="hotel-delivery">Hotel Delivery</option>
                        <option value="home-delivery">Home Delivery</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Return Location *
                      </label>
                      <select
                        name="returnLocation"
                        value={bookingData.returnLocation}
                        onChange={handleInputChange}
                        required
                        className="w-full h-12 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#000080] focus:border-transparent"
                      >
                        <option value="">Select return location</option>
                        <option value="airport">Bole International Airport</option>
                        <option value="downtown">Downtown Office</option>
                        <option value="hotel-pickup">Hotel Pickup</option>
                        <option value="home-pickup">Home Pickup</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    name="specialRequests"
                    value={bookingData.specialRequests}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#000080] focus:border-transparent resize-none"
                    placeholder="Any special requests or requirements..."
                  />
                </div>

                <Button type="submit" size="lg" className="w-full bg-[#000080] hover:bg-[#000060]">
                  <Calendar className="w-5 h-5 mr-2" />
                  Confirm Booking
                </Button>
              </form>
              
              {submitStatus && (
                <div className={submitStatus.startsWith("Error") || submitStatus.includes("failed") ? "text-red-500 mt-4" : "text-green-600 mt-4"}>
                  {submitStatus}
                </div>
              )}
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Booking Summary
              </h2>

              {/* Vehicle Info */}
              <div className="flex gap-4 mb-6 pb-6 border-b">
                <img
                  src={vehicle.image_url}
                  alt={vehicle.make || vehicle.name}
                  className="w-20 h-16 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{vehicle.make} {vehicle.model}</h3>
                  <p className="text-sm text-gray-600">{vehicle.type}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {/* Optionally show features if available */}
                  </div>
                </div>
              </div>

              {/* Rental Period */}
              <div className="mb-6 pb-6 border-b">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Rental Period</span>
                  <span className="font-medium">{days} day{days > 1 ? 's' : ''}</span>
                </div>
                {bookingData.pickupDate && (
                  <div className="text-xs text-gray-500">
                    {new Date(bookingData.pickupDate).toLocaleDateString()} - {' '}
                    {bookingData.returnDate ? new Date(bookingData.returnDate).toLocaleDateString() : 'Select return date'}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Price ({days} day{days > 1 ? 's' : ''})</span>
                  <span>{subtotal.toLocaleString()} ETB</span>
                </div>
              </div>

              {/* Total */}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-[#000080]">{total.toLocaleString()} ETB</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#000080]" />
                    <span>+251 911 123 456</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#000080]" />
                    <span>bookings@rentiva.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};