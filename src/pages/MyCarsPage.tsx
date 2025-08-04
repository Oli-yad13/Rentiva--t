import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { Button } from "../components/ui/button";

export const MyCarsPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("owner_id", session.user.id)
        .order("created_at", { ascending: false });
      if (error) setError(error.message);
      else setCars(data || []);
      setLoading(false);
    };
    fetchCars();
  }, [navigate]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    setLoading(true);
    const { error } = await supabase.from("cars").delete().eq("id", id);
    if (error) setError(error.message);
    else setCars((prev) => prev.filter((car) => car.id !== id));
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-[#000080] mb-6">My Cars</h1>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : cars.length === 0 ? (
          <div className="text-gray-500">You have not added any cars yet.</div>
        ) : (
          <div className="space-y-4">
            {cars.map((car) => (
              <div key={car.id} className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 shadow-sm">
                {car.image_url ? (
                  <img src={car.image_url} alt={car.make} className="w-24 h-16 object-cover rounded-md" />
                ) : (
                  <div className="w-24 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">No Image</div>
                )}
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{car.make} {car.model} ({car.year})</div>
                  <div className="text-sm text-gray-500">ETB {car.price_per_day} / day</div>
                  <div className="text-xs text-gray-400">Status: <span className={
                    car.status === 'approved' ? 'text-green-600' : car.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                  }>{car.status}</span></div>
                  <div className="text-xs text-gray-400">Added on {new Date(car.created_at).toLocaleDateString()}</div>
                </div>
                {car.status !== 'approved' && (
                  <>
                    <Button onClick={() => navigate(`/edit-car/${car.id}`)} className="mr-2" variant="outline">Edit</Button>
                    <Button onClick={() => handleDelete(car.id)} variant="destructive">Delete</Button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCarsPage; 