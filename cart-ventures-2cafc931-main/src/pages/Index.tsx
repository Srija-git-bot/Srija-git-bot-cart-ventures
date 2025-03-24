
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";
import CategoryFilter from "@/components/CategoryFilter";
import { fetchProducts, fetchCategories, fetchProductsByCategory, searchProducts } from "@/services/productService";
import { Product } from "@/types";
import { motion } from "framer-motion";

const ITEMS_PER_PAGE = 8;

const Index = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch categories
  const { 
    data: categories = [],
    isLoading: categoriesLoading
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Fetch products based on current filters
  const {
    data: productsData,
    isLoading: productsLoading,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["products", currentPage, selectedCategory, searchQuery],
    queryFn: async () => {
      if (searchQuery) {
        return await searchProducts(searchQuery);
      }
      
      if (selectedCategory) {
        return await fetchProductsByCategory(
          selectedCategory,
          ITEMS_PER_PAGE,
          (currentPage - 1) * ITEMS_PER_PAGE
        );
      }
      
      return await fetchProducts(
        ITEMS_PER_PAGE,
        (currentPage - 1) * ITEMS_PER_PAGE
      );
    },
  });

  // Update displayed products and total pages when data changes
  useEffect(() => {
    if (productsData) {
      setDisplayedProducts(productsData.products);
      setTotalPages(Math.ceil(productsData.total / ITEMS_PER_PAGE));
    }
  }, [productsData]);

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle category selection
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar onSearch={handleSearch} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-center mb-2">
            {searchQuery
              ? `Search results for "${searchQuery}"`
              : selectedCategory
              ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace("-", " ")}`
              : "Trending Products"}
          </h1>
          
          <p className="text-muted-foreground text-center mb-8">
            {searchQuery
              ? "Discover what you're looking for"
              : selectedCategory
              ? "Explore our curated collection"
              : "Discover our popular products with amazing discounts"}
          </p>
        </motion.div>
        
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          isLoading={categoriesLoading}
        />
        
        <ProductGrid
          products={displayedProducts}
          isLoading={productsLoading}
        />
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>
      
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="mb-2">© 2023 EleganCart. All rights reserved.</p>
          <p className="text-sm">
            A premium shopping experience with unmatched elegance and simplicity.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
