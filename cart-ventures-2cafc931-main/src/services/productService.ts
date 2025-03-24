
import { ApiResponse, Product } from "@/types";

export const fetchProducts = async (
  limit: number = 10,
  skip: number = 0
): Promise<ApiResponse<Product>> => {
  try {
    const response = await fetch(
      `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchProductsByCategory = async (
  category: string,
  limit: number = 10,
  skip: number = 0
): Promise<ApiResponse<Product>> => {
  try {
    const response = await fetch(
      `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching products in category ${category}:`, error);
    throw error;
  }
};

export const fetchCategories = async (): Promise<string[]> => {
  try {
    const response = await fetch("https://dummyjson.com/products/categories");
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const searchProducts = async (
  query: string,
  limit: number = 10
): Promise<ApiResponse<Product>> => {
  try {
    const response = await fetch(
      `https://dummyjson.com/products/search?q=${query}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};
