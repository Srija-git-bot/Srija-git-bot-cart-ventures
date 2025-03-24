
import React from "react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="product-card overflow-hidden bg-white rounded-lg shadow-sm border border-gray-100 h-full flex flex-col"
    >
      <div className="relative overflow-hidden aspect-square">
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="secondary" className="px-2 py-1 font-medium bg-primary text-primary-foreground">
            {product.discountPercentage.toFixed(0)}% OFF
          </Badge>
        </div>
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          src={product.thumbnail}
          alt={product.title}
          className="product-image w-full h-full object-cover"
          loading="lazy" 
          onError={(e) => {
            e.currentTarget.src = "https://placehold.co/400x400/e2e8f0/a0aec0?text=Image+Not+Found";
          }}
        />
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-1 mb-1">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground ml-1">({Math.floor(product.rating * 10)} reviews)</span>
        </div>
        
        <h3 className="font-medium text-base line-clamp-1 mb-1">
          {product.title}
        </h3>
        
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2 flex-grow">
          {product.description}
        </p>
        
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-semibold">${discountedPrice.toFixed(2)}</span>
          <span className="text-xs text-muted-foreground line-through">
            ${product.price.toFixed(2)}
          </span>
        </div>
        
        <Button 
          onClick={() => addToCart(product)}
          className="w-full btn-hover-effect group"
          size="sm"
        >
          <ShoppingCart size={16} className="mr-2 group-hover:animate-cart-bounce" />
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
