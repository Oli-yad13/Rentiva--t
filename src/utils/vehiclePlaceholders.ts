// Vehicle placeholder images and data
export const vehiclePlaceholders = {
  images: {
    sedan: "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=400&h=300&fit=crop&crop=center",
    suv: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop&crop=center", 
    pickup: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=300&fit=crop&crop=center",
    hatchback: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=400&h=300&fit=crop&crop=center",
    minivan: "https://images.unsplash.com/photo-1570312257860-9df25c034b19?w=400&h=300&fit=crop&crop=center",
    electric: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop&crop=center"
  },
  
  getImageForVehicle: (make: string, model: string, type: string) => {
    const vehicleType = type?.toLowerCase() || 'sedan';
    const placeholders = vehiclePlaceholders.images;
    
    // Try to match vehicle type to available placeholders
    if (vehicleType.includes('suv')) return placeholders.suv;
    if (vehicleType.includes('pickup') || vehicleType.includes('truck')) return placeholders.pickup;
    if (vehicleType.includes('hatch')) return placeholders.hatchback;
    if (vehicleType.includes('van') || vehicleType.includes('mini')) return placeholders.minivan;
    if (vehicleType.includes('electric') || vehicleType.includes('ev')) return placeholders.electric;
    
    // Default to sedan
    return placeholders.sedan;
  }
};