
import React from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, X, Plus, Minus, Trash, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

const Cart: React.FC = () => {
  const {
    state: { items, isCartOpen },
    totalItems,
    totalPrice,
    toggleCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  return (
    <>
      {/* Cart Toggle Button */}
      <Button
        onClick={toggleCart}
        variant="outline"
        size="icon"
        className="relative rounded-full h-10 w-10 flex items-center justify-center"
        aria-label="Shopping cart"
      >
        <ShoppingCart size={18} />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </Button>

      {/* Cart Overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={toggleCart}
          >
            {/* Cart Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Cart Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center">
                  <ShoppingBag size={20} className="mr-2" />
                  <h2 className="text-lg font-semibold">Your Cart</h2>
                  <span className="ml-2 bg-secondary text-secondary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={toggleCart}
                >
                  <X size={18} />
                </Button>
              </div>

              {/* Cart Items */}
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                    <ShoppingBag size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    Looks like you haven't added anything to your cart yet.
                  </p>
                  <Button onClick={toggleCart} className="btn-hover-effect">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <>
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      <AnimatePresence>
                        {items.map((item) => {
                          const discountedPrice = 
                            item.product.price * (1 - item.product.discountPercentage / 100);
                          
                          return (
                            <motion.div
                              key={item.product.id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex gap-3"
                            >
                              <div className="h-20 w-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                <img
                                  src={item.product.thumbnail}
                                  alt={item.product.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm line-clamp-1">{item.product.title}</h4>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                  <span>${discountedPrice.toFixed(2)}</span>
                                  <span className="text-xs line-through ml-1">
                                    ${item.product.price.toFixed(2)}
                                  </span>
                                </div>
                                
                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex items-center border rounded-md">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 rounded-none"
                                      onClick={() => 
                                        updateQuantity(
                                          item.product.id, 
                                          Math.max(0, item.quantity - 1)
                                        )
                                      }
                                    >
                                      <Minus size={14} />
                                    </Button>
                                    
                                    <span className="w-8 text-center text-sm">
                                      {item.quantity}
                                    </span>
                                    
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 rounded-none"
                                      onClick={() => 
                                        updateQuantity(
                                          item.product.id, 
                                          item.quantity + 1
                                        )
                                      }
                                    >
                                      <Plus size={14} />
                                    </Button>
                                  </div>
                                  
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    onClick={() => removeFromCart(item.product.id)}
                                  >
                                    <Trash size={14} />
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </ScrollArea>
                  
                  {/* Cart Summary */}
                  <div className="p-4 border-t">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">${totalPrice.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="text-green-600 font-medium">Free</span>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={clearCart}
                        >
                          Clear Cart
                        </Button>
                        
                        <Button 
                          variant="default" 
                          className="w-full btn-hover-effect"
                        >
                          Checkout
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Cart;
