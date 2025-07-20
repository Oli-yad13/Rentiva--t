import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Upload, Car, DollarSign, Calendar, FileText, AlertCircle, CheckCircle2 } from "lucide-react";

export const AddCarPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    make: "",
    model: "",
    year: "",
    price_per_day: "",
    description: "",
    type: "SUV",
    transmission: "Manual",
    fuel_type: "Petrol",
    seats: "5",
    doors: "4",
    air_conditioning: true,
    location: "",
    color: "",
    mileage: "",
    engine_size: "",
    features: [] as string[],
    image: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files, type, checked } = e.target as any;
    
    if (name === "image" && files && files[0]) {
      const file = files[0];
      setForm((prev) => ({ ...prev, image: file }));
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else if (type === "checkbox" && name === "features") {
      // Handle features as checkboxes
      const currentFeatures = Array.isArray(form.features) ? form.features : [];
      if (checked) {
        setForm((prev) => ({ ...prev, features: [...currentFeatures, value] }));
      } else {
        setForm((prev) => ({ ...prev, features: currentFeatures.filter(f => f !== value) }));
      }
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
      
      // Clear validation error when user starts typing
      if (validationErrors[name]) {
        setValidationErrors(prev => ({ ...prev, [name]: "" }));
      }
    }
  };
  
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!form.make.trim()) errors.make = "Make is required";
    if (!form.model.trim()) errors.model = "Model is required";
    if (!form.year || parseInt(form.year) < 1900 || parseInt(form.year) > new Date().getFullYear() + 1) {
      errors.year = "Please enter a valid year";
    }
    if (!form.price_per_day || parseFloat(form.price_per_day) <= 0) {
      errors.price_per_day = "Please enter a valid price";
    }
    if (!form.description.trim() || form.description.length < 10) {
      errors.description = "Description must be at least 10 characters";
    }
    if (!form.location.trim()) errors.location = "Location is required";
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setError("You must be logged in to add a car.");
      setLoading(false);
      return;
    }
    console.log('Adding car for user:', session.user.id);
    let image_url = null;
    if (form.image) {
      const fileExt = form.image.name.split('.').pop();
      const filePath = `${session.user.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('car-images').upload(filePath, form.image);
      if (uploadError) {
        setError(uploadError.message);
        setLoading(false);
        return;
      }
      const { data } = supabase.storage.from('car-images').getPublicUrl(filePath);
      image_url = data.publicUrl;
    }
    const { error: insertError } = await supabase.from("cars").insert([
      {
        owner_id: session.user.id,
        make: form.make.trim(),
        model: form.model.trim(),
        year: parseInt(form.year),
        price_per_day: parseFloat(form.price_per_day),
        description: form.description.trim(),
        image_url,
        status: "pending",
        type: form.type,
        transmission: form.transmission,
        fuel_type: form.fuel_type,
        seats: parseInt(form.seats),
        doors: parseInt(form.doors),
        air_conditioning: form.air_conditioning,
        location: form.location.trim(),
        color: form.color.trim() || null,
        mileage: form.mileage ? parseInt(form.mileage) : 0,
        engine_size: form.engine_size.trim() || null,
        features: form.features.length > 0 ? form.features : null,
      },
    ]);
    if (insertError) {
      setError(insertError.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/my-cars"), 1500);
    }
    setLoading(false);
  };

  const availableFeatures = [
    "GPS Navigation", "Bluetooth", "USB Ports", "Backup Camera", 
    "Parking Sensors", "Sunroof", "Leather Seats", "Heated Seats",
    "Cruise Control", "Keyless Entry", "Push Start", "Premium Sound"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-[#000080]">
              <Car className="h-6 w-6" />
              Add Your Vehicle to Rentiva
            </CardTitle>
            <p className="text-gray-600">List your car and start earning money by renting it out to verified users.</p>
          </CardHeader>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Make *</label>
                  <Input 
                    name="make" 
                    placeholder="e.g., Toyota, Honda, BMW" 
                    value={form.make} 
                    onChange={handleChange} 
                    className={validationErrors.make ? "border-red-500" : ""}
                  />
                  {validationErrors.make && <p className="text-red-500 text-sm mt-1">{validationErrors.make}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
                  <Input 
                    name="model" 
                    placeholder="e.g., Camry, Civic, X3" 
                    value={form.model} 
                    onChange={handleChange}
                    className={validationErrors.model ? "border-red-500" : ""}
                  />
                  {validationErrors.model && <p className="text-red-500 text-sm mt-1">{validationErrors.model}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                  <Input 
                    name="year" 
                    placeholder="2020" 
                    value={form.year} 
                    onChange={handleChange} 
                    type="number" 
                    min="1900" 
                    max={new Date().getFullYear() + 1}
                    className={validationErrors.year ? "border-red-500" : ""}
                  />
                  {validationErrors.year && <p className="text-red-500 text-sm mt-1">{validationErrors.year}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type *</label>
                  <select 
                    name="type" 
                    value={form.type} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-lg p-2 h-10 focus:ring-2 focus:ring-[#000080] focus:border-transparent"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Pickup">Pickup Truck</option>
                    <option value="Van">Van/Minivan</option>
                    <option value="Cabriolet">Convertible</option>
                    <option value="Electric">Electric Vehicle</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <Input 
                    name="color" 
                    placeholder="e.g., White, Black, Silver" 
                    value={form.color} 
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Specifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Vehicle Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                  <select 
                    name="transmission" 
                    value={form.transmission} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-lg p-2 h-10 focus:ring-2 focus:ring-[#000080] focus:border-transparent"
                  >
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                    <option value="CVT">CVT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                  <select 
                    name="fuel_type" 
                    value={form.fuel_type} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-lg p-2 h-10 focus:ring-2 focus:ring-[#000080] focus:border-transparent"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                  <select 
                    name="seats" 
                    value={form.seats} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-lg p-2 h-10 focus:ring-2 focus:ring-[#000080] focus:border-transparent"
                  >
                    <option value="2">2 Seats</option>
                    <option value="4">4 Seats</option>
                    <option value="5">5 Seats</option>
                    <option value="7">7 Seats</option>
                    <option value="8">8 Seats</option>
                    <option value="9">9+ Seats</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doors</label>
                  <select 
                    name="doors" 
                    value={form.doors} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-lg p-2 h-10 focus:ring-2 focus:ring-[#000080] focus:border-transparent"
                  >
                    <option value="2">2 Doors</option>
                    <option value="3">3 Doors</option>
                    <option value="4">4 Doors</option>
                    <option value="5">5 Doors</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mileage (km)</label>
                  <Input 
                    name="mileage" 
                    placeholder="e.g., 45000" 
                    value={form.mileage} 
                    onChange={handleChange} 
                    type="number" 
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Engine Size</label>
                  <Input 
                    name="engine_size" 
                    placeholder="e.g., 2.0L, 1500cc" 
                    value={form.engine_size} 
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    name="air_conditioning" 
                    checked={form.air_conditioning} 
                    onChange={handleChange}
                    className="rounded border-gray-300 text-[#000080] focus:ring-[#000080]"
                  />
                  <span className="text-sm font-medium text-gray-700">Air Conditioning Available</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Features</CardTitle>
              <p className="text-sm text-gray-600">Select all features that apply to your vehicle</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableFeatures.map((feature) => (
                  <label key={feature} className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="features" 
                      value={feature}
                      checked={Array.isArray(form.features) && form.features.includes(feature)}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-[#000080] focus:ring-[#000080]"
                    />
                    <span className="text-sm">{feature}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pricing and Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing & Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price per Day (ETB) *</label>
                  <Input 
                    name="price_per_day" 
                    placeholder="e.g., 1500" 
                    value={form.price_per_day} 
                    onChange={handleChange} 
                    type="number" 
                    min="0"
                    className={validationErrors.price_per_day ? "border-red-500" : ""}
                  />
                  {validationErrors.price_per_day && <p className="text-red-500 text-sm mt-1">{validationErrors.price_per_day}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <Input 
                    name="location" 
                    placeholder="e.g., Addis Ababa, Bole" 
                    value={form.location} 
                    onChange={handleChange}
                    className={validationErrors.location ? "border-red-500" : ""}
                  />
                  {validationErrors.location && <p className="text-red-500 text-sm mt-1">{validationErrors.location}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
              <p className="text-sm text-gray-600">Provide a detailed description of your vehicle</p>
            </CardHeader>
            <CardContent>
              <textarea 
                name="description" 
                placeholder="Describe your vehicle's condition, any special features, pickup instructions, etc. (minimum 10 characters)" 
                value={form.description} 
                onChange={handleChange} 
                className={`w-full border rounded-lg p-3 min-h-[120px] focus:ring-2 focus:ring-[#000080] focus:border-transparent ${validationErrors.description ? "border-red-500" : "border-gray-300"}`}
              />
              {validationErrors.description && <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>}
              <p className="text-sm text-gray-500 mt-1">{form.description.length} characters</p>
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Vehicle Photos
              </CardTitle>
              <p className="text-sm text-gray-600">Upload a clear photo of your vehicle</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#000080] transition-colors">
                  <input 
                    name="image" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {imagePreview ? (
                      <div className="space-y-2">
                        <img src={imagePreview} alt="Preview" className="mx-auto h-48 w-auto object-cover rounded-lg" />
                        <p className="text-sm text-gray-600">Click to change image</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div>
                          <span className="text-[#000080] font-medium">Click to upload</span>
                          <span className="text-gray-600"> or drag and drop</span>
                        </div>
                        <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(-1)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-[#000080] hover:bg-[#000060] text-white" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding Vehicle...
                    </>
                  ) : (
                    <>
                      <Car className="h-4 w-4 mr-2" />
                      Add Vehicle
                    </>
                  )}
                </Button>
              </div>
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              {success && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  <span>Vehicle added successfully! Redirecting to your cars...</span>
                </div>
              )}
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default AddCarPage; 