import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { User, Mail, Calendar, MapPin, Car, Phone, Edit3, Camera, LogOut, Settings, History } from "lucide-react";

export const ProfilePage = (): JSX.Element => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [success, setSuccess] = useState(false);
  const [editing, setEditing] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [phone, setPhone] = useState("");
  const [editingPhone, setEditingPhone] = useState(false);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalCars: 0,
    memberSince: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, profile_photo_url, phone, created_at")
        .eq("id", session.user.id)
        .single();
      if (error) {
        setError(error.message);
      } else {
        setProfile(data);
        setFullName(data.full_name || "");
        setPhone(data.phone || "");
        setStats(prev => ({
          ...prev,
          memberSince: data.created_at ? new Date(data.created_at).toLocaleDateString() : ''
        }));
      }
      setLoading(false);
    };
    const fetchBookings = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data, error } = await supabase
        .from("bookings")
        .select("*, cars(make, model, year, image_url)")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
      if (!error && data) {
        setBookings(data);
        setStats(prev => ({ ...prev, totalBookings: data.length }));
      }
      
      // Fetch user's cars count
      const { data: carsData } = await supabase
        .from("cars")
        .select("id")
        .eq("owner_id", session.user.id);
      if (carsData) {
        setStats(prev => ({ ...prev, totalCars: carsData.length }));
      }
    };
    fetchProfile();
    fetchBookings();
  }, [navigate]);

  const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleEdit = () => setEditing(true);
  
  const handleFieldChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
    await updateProfile({ full_name: e.target.value });
  };

  const handlePhoneChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    await updateProfile({ phone: e.target.value });
  };

  const updateProfile = async (updates: any) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
      return;
    }
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", session.user.id);
    if (error) {
      setError(error.message);
    } else {
      setProfile((prev: any) => ({ ...prev, ...updates }));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleAvatarClick = () => {
    document.getElementById("profile-photo-input")?.click();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setError("You must be logged in.");
      setUploading(false);
      return;
    }
    const fileExt = file.name.split('.').pop();
    const filePath = `profile-photos/${session.user.id}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const photoUrl = data.publicUrl;
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ profile_photo_url: photoUrl })
      .eq("id", session.user.id);
    if (updateError) {
      setError(updateError.message);
    } else {
      setProfile((prev: any) => ({ ...prev, profile_photo_url: photoUrl }));
    }
    setUploading(false);
  };

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Photo */}
            <div className="relative">
              <div 
                className="w-32 h-32 rounded-full bg-[#000080] flex items-center justify-center shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
                onClick={handleAvatarClick} 
                title="Click to upload profile photo"
              >
                <input
                  id="profile-photo-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                  disabled={uploading}
                />
                {uploading ? (
                  <span className="text-white text-sm">Uploading...</span>
                ) : profile.profile_photo_url ? (
                  <img src={profile.profile_photo_url} alt="Profile" className="w-32 h-32 object-cover rounded-full" />
                ) : profile.full_name ? (
                  <span className="text-4xl font-bold text-white">{getInitials(profile.full_name)}</span>
                ) : (
                  <User className="w-16 h-16 text-white" />
                )}
              </div>
              <div className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg">
                <Camera className="w-4 h-4 text-[#000080]" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profile.full_name || "Welcome!"}
              </h1>
              <p className="text-gray-600 mb-4">Member since {stats.memberSince}</p>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#000080]">{stats.totalBookings}</div>
                  <div className="text-sm text-gray-600">Bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#000080]">{stats.totalCars}</div>
                  <div className="text-sm text-gray-600">Cars Listed</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate("/my-cars")}>
                <Car className="w-4 h-4 mr-2" />
                My Cars
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Details */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-[#000080]" />
                Profile Details
              </h2>
              
              <div className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </label>
                  <Input value={profile.email} disabled className="bg-gray-50" />
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Full Name
                    <Edit3 
                      className="w-3 h-3 ml-2 cursor-pointer text-[#000080]" 
                      onClick={() => setEditing(!editing)}
                    />
                  </label>
                  <Input
                    value={fullName}
                    onChange={editing ? handleFieldChange : undefined}
                    placeholder="Enter your full name"
                    disabled={!editing}
                    className={editing ? "" : "bg-gray-50"}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Phone Number
                    <Edit3 
                      className="w-3 h-3 ml-2 cursor-pointer text-[#000080]" 
                      onClick={() => setEditingPhone(!editingPhone)}
                    />
                  </label>
                  <Input
                    value={phone}
                    onChange={editingPhone ? handlePhoneChange : undefined}
                    placeholder="Enter your phone number"
                    disabled={!editingPhone}
                    className={editingPhone ? "" : "bg-gray-50"}
                  />
                </div>
              </div>

              {success && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-green-800 text-sm font-medium">Profile updated successfully!</div>
                </div>
              )}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-red-800 text-sm font-medium">{error}</div>
                </div>
              )}
            </div>
          </div>

          {/* Rental History */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <History className="w-5 h-5 mr-2 text-[#000080]" />
                Rental History ({stats.totalBookings})
              </h2>
              
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No rental history</h3>
                  <p className="text-gray-600 mb-6">You haven't made any bookings yet.</p>
                  <Button onClick={() => navigate("/vehicles")} className="bg-[#000080] hover:bg-[#000060]">
                    Browse Vehicles
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Car Image */}
                        <div className="flex-shrink-0">
                          {booking.cars?.image_url ? (
                            <img 
                              src={booking.cars.image_url} 
                              alt={`${booking.cars.make} ${booking.cars.model}`} 
                              className="w-24 h-18 object-cover rounded-lg border"
                            />
                          ) : (
                            <div className="w-24 h-18 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Car className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Booking Details */}
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {booking.cars ? `${booking.cars.make} ${booking.cars.model} (${booking.cars.year})` : "Vehicle"}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {booking.pickup_date} to {booking.return_date}
                                </span>
                              </div>
                              <div className="flex flex-col md:flex-row gap-2 mt-2 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  Pickup: {booking.pickup_location}
                                </span>
                                <span className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  Return: {booking.return_location}
                                </span>
                              </div>
                            </div>
                            <div className="text-right mt-4 md:mt-0">
                              <div className="text-sm text-gray-500">Booked on</div>
                              <div className="font-medium">{new Date(booking.created_at).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 