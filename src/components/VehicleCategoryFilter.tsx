import React from "react";
import { Button } from "./ui/button";

interface VehicleCategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categoryIcons: Record<string, string> = {
  "All vehicles": "🚗",
  "Sedan": "🚘", 
  "SUV": "🚙",
  "Cabriolet": "🏎️",
  "Pickup": "🚚",
  "Minivan": "🚐",
  "Electric": "⚡",
  "Hatchback": "🚗"
};

export const VehicleCategoryFilter: React.FC<VehicleCategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 justify-center sm:justify-start">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-full transition-colors text-sm sm:text-base ${
            selectedCategory === category
              ? "bg-[#000080] text-white hover:bg-[#000060]"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
          onClick={() => onCategoryChange(category)}
        >
          <span className="text-base sm:text-lg">{categoryIcons[category] || "🚗"}</span>
          <span className="font-work-sans font-medium hidden sm:inline">{category}</span>
          <span className="font-work-sans font-medium sm:hidden text-xs">{category.split(' ')[0]}</span>
        </Button>
      ))}
    </div>
  );
};