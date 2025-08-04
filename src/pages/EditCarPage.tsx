import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export const EditCarPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("id", id)
        .single();
      if (error || !data) {
        setError("Car not found or you do not have permission to edit.");
        setLoading(false);
        return;
      }
      setForm(data);
      setLoading(false);
    };
    fetchCar();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any;
    if (name === "image" && files) {
      setForm((prev: any) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    let image_url = form.image_url;
    if (form.image) {
      const { data: { session } } = await supabase.auth.getSession();
      const fileExt = form.image.name.split('.').pop();
      const filePath = `car-images/${session.user.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('car-images').upload(filePath, form.image, { upsert: true });
      if (uploadError) {
        setError(uploadError.message);
        setLoading(false);
        return;
      }
      const { data } = supabase.storage.from('car-images').getPublicUrl(filePath);
      image_url = data.publicUrl;
    }
    const { error: updateError } = await supabase.from("cars").update({
      make: form.make,
      model: form.model,
      year: form.year ? parseInt(form.year) : null,
      price_per_day: form.price_per_day ? parseFloat(form.price_per_day) : null,
      description: form.description,
      image_url,
      type: form.type,
    }).eq("id", id);
    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/my-cars"), 1500);
    }
    setLoading(false);
  };

  if (loading) return <div className="p-8 text-center">Loading car...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!form) return null;
  if (form.status === "approved") return <div className="p-8 text-center text-yellow-600">Approved cars cannot be edited.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-[#000080] mb-2">Edit Car</h1>
        <Input name="make" placeholder="Make" value={form.make} onChange={handleChange} required />
        <Input name="model" placeholder="Model" value={form.model} onChange={handleChange} required />
        <Input name="year" placeholder="Year" value={form.year} onChange={handleChange} type="number" min="1900" max={new Date().getFullYear()} required />
        <Input name="price_per_day" placeholder="Price per day (ETB)" value={form.price_per_day} onChange={handleChange} type="number" min="0" required />
        <select name="type" value={form.type} onChange={handleChange} className="border rounded-lg p-2 h-12" required>
          <option value="SUV">SUV</option>
          <option value="Sedan">Sedan</option>
          <option value="Hatchback">Hatchback</option>
          <option value="Electric">Electric</option>
          <option value="Pickup">Pickup</option>
          <option value="Van">Van</option>
          <option value="Other">Other</option>
        </select>
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border rounded-lg p-2 min-h-[80px]" required />
        <input name="image" type="file" accept="image/*" onChange={handleChange} />
        <Button type="submit" className="bg-[#000080] text-white h-12 text-lg font-semibold rounded-lg" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
        {error && <div className="text-red-500 text-center">{error}</div>}
        {success && <div className="text-green-600 text-center">Car updated! Redirecting...</div>}
      </form>
    </div>
  );
};

export default EditCarPage; 