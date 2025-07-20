import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import * as Tabs from "@radix-ui/react-tabs";
import { Car, Users, Calendar, DollarSign, CheckCircle, XCircle, Clock, TrendingUp, Eye, Star, Activity, Trash2, ExternalLink } from "lucide-react";

export const AdminDashboardPage = (): JSX.Element => {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalCars: 0,
    pendingCars: 0,
    approvedCars: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/login";
        return;
      }
      // Fetch user role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();
      if (profileError || !profile || profile.role !== "admin") {
        setError("Access denied. Admins only.");
        setLoading(false);
        return;
      }
      setUserRole(profile.role);
      // Fetch all cars with owner details
      const { data: carsData, error: carsError } = await supabase
        .from("cars")
        .select("*, profiles:owner_id(id, full_name, email, profile_photo_url, role, created_at)")
        .order("created_at", { ascending: false });
      if (carsError) setError(carsError.message);
      else setCars(carsData || []);
      // Fetch all bookings with car and renter details
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select("*, cars(id, make, model, year, image_url), profiles:user_id(id, full_name, email, profile_photo_url, role)")
        .order("created_at", { ascending: false });
      if (bookingsError) setError(bookingsError.message);
      else setBookings(bookingsData || []);
      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from("profiles")
        .select("id, full_name, email, profile_photo_url, role, created_at")
        .order("created_at", { ascending: false });
      if (usersError) setError(usersError.message);
      else setUsers(usersData || []);
      
      // Calculate statistics
      const totalCars = carsData?.length || 0;
      const pendingCars = carsData?.filter(car => car.status === 'pending').length || 0;
      const approvedCars = carsData?.filter(car => car.status === 'approved').length || 0;
      const totalBookings = bookingsData?.length || 0;
      const totalUsers = usersData?.length || 0;
      const totalRevenue = bookingsData?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;
      
      setStats({
        totalCars,
        pendingCars,
        approvedCars,
        totalBookings,
        totalUsers,
        totalRevenue
      });
      
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleStatus = async (id: string, status: string) => {
    setLoading(true);
    const { error } = await supabase.from("cars").update({ status }).eq("id", id);
    if (error) setError(error.message);
    else setCars((prev) => prev.map((car) => car.id === id ? { ...car, status } : car));
    setLoading(false);
  };

  const handleDeleteCar = async (id: string, carName: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${carName}"? This action cannot be undone.`)) {
      return;
    }
    
    setLoading(true);
    
    try {
      // First, delete any associated bookings
      const { error: bookingsError } = await supabase
        .from("bookings")
        .delete()
        .eq("car_id", id);
      
      if (bookingsError) {
        setError(`Error deleting bookings: ${bookingsError.message}`);
        setLoading(false);
        return;
      }
      
      // Then delete the car
      const { error: carError } = await supabase
        .from("cars")
        .delete()
        .eq("id", id);
      
      if (carError) {
        setError(`Error deleting car: ${carError.message}`);
      } else {
        setCars((prev) => prev.filter((car) => car.id !== id));
        // Update stats
        setStats(prevStats => ({
          ...prevStats,
          totalCars: prevStats.totalCars - 1,
          approvedCars: prevStats.approvedCars - (cars.find(car => car.id === id)?.status === 'approved' ? 1 : 0),
          pendingCars: prevStats.pendingCars - (cars.find(car => car.id === id)?.status === 'pending' ? 1 : 0)
        }));
      }
    } catch (err: any) {
      setError(`Unexpected error: ${err.message}`);
    }
    
    setLoading(false);
  };

  const handleViewCar = (carId: string) => {
    window.open(`/vehicle/${carId}`, '_blank');
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-[#000080] mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your car rental platform</p>
        </div>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
              <Car className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCars}</div>
              <p className="text-xs text-blue-100">Cars in the system</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Clock className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingCars}</div>
              <p className="text-xs text-orange-100">Cars awaiting approval</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-green-100">Bookings made</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-purple-100">Registered users</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <Tabs.Root defaultValue="cars">
            <Tabs.List className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-6">
              <Tabs.Trigger 
                value="cars" 
                className="flex-1 px-4 py-2 font-semibold rounded-md transition-all data-[state=active]:bg-white data-[state=active]:text-[#000080] data-[state=active]:shadow-sm text-gray-600 hover:text-gray-900"
              >
                Cars ({stats.totalCars})
              </Tabs.Trigger>
              <Tabs.Trigger 
                value="bookings" 
                className="flex-1 px-4 py-2 font-semibold rounded-md transition-all data-[state=active]:bg-white data-[state=active]:text-[#000080] data-[state=active]:shadow-sm text-gray-600 hover:text-gray-900"
              >
                Bookings ({stats.totalBookings})
              </Tabs.Trigger>
              <Tabs.Trigger 
                value="users" 
                className="flex-1 px-4 py-2 font-semibold rounded-md transition-all data-[state=active]:bg-white data-[state=active]:text-[#000080] data-[state=active]:shadow-sm text-gray-600 hover:text-gray-900"
              >
                Users ({stats.totalUsers})
              </Tabs.Trigger>
              <Tabs.Trigger 
                value="analytics" 
                className="flex-1 px-4 py-2 font-semibold rounded-md transition-all data-[state=active]:bg-white data-[state=active]:text-[#000080] data-[state=active]:shadow-sm text-gray-600 hover:text-gray-900"
              >
                Analytics
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="cars">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Car Management</h3>
                  <div className="flex gap-2">
                    <div className="text-sm text-gray-500">
                      {stats.pendingCars} pending • {stats.approvedCars} approved
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-lg border">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="p-4 text-left font-medium text-gray-900">Car Details</th>
                        <th className="p-4 text-left font-medium text-gray-900">Owner Information</th>
                        <th className="p-4 text-left font-medium text-gray-900">Status</th>
                        <th className="p-4 text-left font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {cars.map((car) => (
                        <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {car.image_url && (
                                <img src={car.image_url} alt="Car" className="w-16 h-12 object-cover rounded-lg border" />
                              )}
                              <div>
                                <div className="font-semibold text-gray-900">{car.make} {car.model} ({car.year})</div>
                                <div className="text-sm text-gray-500">ETB {car.price_per_day} / day • {car.type}</div>
                                <div className="text-xs text-gray-400">Added {new Date(car.created_at).toLocaleDateString()}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {car.profiles?.profile_photo_url ? (
                                <img src={car.profiles.profile_photo_url} alt="Profile" className="w-10 h-10 rounded-full object-cover border" />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <Users className="w-5 h-5 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <div className="font-medium text-gray-900">{car.profiles?.full_name || "Unknown"}</div>
                                <div className="text-sm text-gray-500">{car.profiles?.email || "-"}</div>
                                <div className="text-xs text-gray-400 capitalize">{car.profiles?.role || "user"}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                              car.status === 'approved' 
                                ? 'bg-green-100 text-green-800' 
                                : car.status === 'pending' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {car.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                              {car.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                              {car.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                              {car.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              {car.status === 'pending' && (
                                <>
                                  <Button 
                                    onClick={() => handleStatus(car.id, 'approved')} 
                                    size="sm" 
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button 
                                    onClick={() => handleStatus(car.id, 'rejected')} 
                                    size="sm" 
                                    variant="destructive"
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleViewCar(car.id)}
                              >
                                <ExternalLink className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDeleteCar(car.id, `${car.make} ${car.model}`)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Tabs.Content>
            <Tabs.Content value="bookings">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Booking Management</h3>
                  <div className="text-sm text-gray-500">
                    {stats.totalBookings} total bookings
                  </div>
                </div>
                <div className="overflow-x-auto rounded-lg border">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="p-4 text-left font-medium text-gray-900">Vehicle</th>
                        <th className="p-4 text-left font-medium text-gray-900">Customer</th>
                        <th className="p-4 text-left font-medium text-gray-900">Pickup Details</th>
                        <th className="p-4 text-left font-medium text-gray-900">Return Details</th>
                        <th className="p-4 text-left font-medium text-gray-900">Booking Date</th>
                        <th className="p-4 text-left font-medium text-gray-900">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bookings.length === 0 ? (
                        <tr><td colSpan={6} className="text-center text-gray-400 py-12">No bookings found.</td></tr>
                      ) : bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {booking.cars?.image_url && (
                                <img src={booking.cars.image_url} alt="Car" className="w-16 h-12 object-cover rounded-lg border" />
                              )}
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {booking.cars ? `${booking.cars.make} ${booking.cars.model}` : "Unknown Vehicle"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {booking.cars?.year || "-"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {booking.profiles?.profile_photo_url ? (
                                <img src={booking.profiles.profile_photo_url} alt="Profile" className="w-10 h-10 rounded-full object-cover border" />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <Users className="w-5 h-5 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <div className="font-medium text-gray-900">{booking.profiles?.full_name || "Unknown"}</div>
                                <div className="text-sm text-gray-500">{booking.profiles?.email || "-"}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="font-medium text-gray-900">{booking.pickup_date || "-"}</div>
                              <div className="text-sm text-gray-500">{booking.pickup_location || "-"}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="font-medium text-gray-900">{booking.return_date || "-"}</div>
                              <div className="text-sm text-gray-500">{booking.return_location || "-"}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-gray-900">{new Date(booking.created_at).toLocaleDateString()}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-gray-900">
                              ETB {booking.total_amount || 0}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Tabs.Content>
          <Tabs.Content value="users">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Profile</th>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Role</th>
                    <th className="p-2 text-left">User ID</th>
                    <th className="p-2 text-left">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan={6} className="text-center text-gray-400 py-8">No users found.</td></tr>
                  ) : users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="p-2">
                        {user.profile_photo_url ? (
                          <img src={user.profile_photo_url} alt="Profile" className="w-10 h-10 rounded-full object-cover border" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">N/A</div>
                        )}
                      </td>
                      <td className="p-2 font-semibold">{user.full_name || "-"}</td>
                      <td className="p-2">{user.email || "-"}</td>
                      <td className="p-2">{user.role}</td>
                      <td className="p-2 text-xs text-gray-500">{user.id}</td>
                      <td className="p-2 text-xs text-gray-500">{user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Tabs.Content>
            <Tabs.Content value="analytics">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Platform Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {stats.totalCars > 0 ? Math.round((stats.approvedCars / stats.totalCars) * 100) : 0}%
                      </div>
                      <p className="text-xs text-gray-500">Cars approved vs total</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ETB {stats.totalBookings > 0 ? Math.round(stats.totalRevenue / stats.totalBookings) : 0}
                      </div>
                      <p className="text-xs text-gray-500">Per booking</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Platform Activity</CardTitle>
                      <Activity className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalBookings + stats.totalCars}</div>
                      <p className="text-xs text-gray-500">Total transactions</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage; 