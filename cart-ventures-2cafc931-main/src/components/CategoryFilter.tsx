
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  isLoading: boolean;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  isLoading,
}) => {
  // Format category name for display
  const formatCategory = (category: string) => {
    // Add type checking to ensure category is a string
    if (typeof category !== 'string') {
      return String(category); // Convert to string if it's not already
    }
    
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">Categories</h2>
      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex space-x-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className={`px-3 py-1 cursor-pointer text-sm ${
                selectedCategory === null
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary hover:text-secondary-foreground"
              }`}
              onClick={() => onSelectCategory(null)}
            >
              All Products
            </Badge>
          </motion.div>

          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <Badge
                  key={`skeleton-category-${index}`}
                  variant="outline"
                  className="px-3 py-1 opacity-40"
                >
                  Loading...
                </Badge>
              ))
            : categories.map((category) => (
                <motion.div
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={`px-3 py-1 cursor-pointer text-sm ${
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary hover:text-secondary-foreground"
                    }`}
                    onClick={() => onSelectCategory(category)}
                  >
                    {formatCategory(category)}
                  </Badge>
                </motion.div>
              ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CategoryFilter;
