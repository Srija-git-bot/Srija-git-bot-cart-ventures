
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { CartItem, Product } from "@/types";
import { toast } from "sonner";

// Define the cart state
interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
}

// Define the cart actions
type CartAction =
  | { type: "ADD_TO_CART"; payload: Product }
  | { type: "REMOVE_FROM_CART"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { productId: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" };

// Initial cart state
const initialState: CartState = {
  items: [],
  isCartOpen: false,
};

// Load cart state from localStorage if available
const loadCartState = (): CartState => {
  try {
    const storedState = localStorage.getItem("cartState");
    return storedState ? JSON.parse(storedState) : initialState;
  } catch (error) {
    console.error("Error loading cart state from localStorage:", error);
    return initialState;
  }
};

// Cart reducer function
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItemIndex = state.items.findIndex(
        (item) => item.product.id === action.payload.id
      );

      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        return { ...state, items: updatedItems };
      } else {
        // Item doesn't exist, add new item
        return {
          ...state,
          items: [...state.items, { product: action.payload, quantity: 1 }],
        };
      }
    }

    case "REMOVE_FROM_CART": {
      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== action.payload),
      };
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // If quantity is 0 or negative, remove the item
        return {
          ...state,
          items: state.items.filter((item) => item.product.id !== productId),
        };
      }
      
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        ),
      };
    }

    case "CLEAR_CART": {
      return {
        ...state,
        items: [],
      };
    }

    case "TOGGLE_CART": {
      return {
        ...state,
        isCartOpen: !state.isCartOpen,
      };
    }

    default:
      return state;
  }
};

// Create the context
interface CartContextProps {
  state: CartState;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

// Create the provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, loadCartState());

  // Calculate the total number of items
  const totalItems = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Calculate the total price
  const totalPrice = state.items.reduce(
    (total, item) => {
      const discountedPrice = 
        item.product.price * (1 - item.product.discountPercentage / 100);
      return total + discountedPrice * item.quantity;
    },
    0
  );

  // Save cart state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("cartState", JSON.stringify(state));
  }, [state]);

  // Add a product to the cart
  const addToCart = (product: Product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
    toast.success(`${product.title} added to cart`, {
      description: "Your item has been added to the cart!",
      position: "top-right",
    });
  };

  // Remove a product from the cart
  const removeFromCart = (productId: number) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: productId });
    toast.info("Item removed from cart", {
      description: "The item has been removed from your cart",
      position: "top-right",
    });
  };

  // Update the quantity of a product
  const updateQuantity = (productId: number, quantity: number) => {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { productId, quantity },
    });
  };

  // Clear the cart
  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    toast.info("Cart cleared", {
      description: "All items have been removed from your cart",
      position: "top-right",
    });
  };

  // Toggle the cart
  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" });
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
