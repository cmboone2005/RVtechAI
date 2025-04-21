import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Package } from "lucide-react";

interface PartCardProps {
  part: {
    id: number;
    name: string;
    partNumber: string;
    manufacturer: string;
    system: string;
    price: number;
    stockQuantity: number;
    description?: string;
  };
  onAddToOrder: () => void;
}

export default function PartCard({ part, onAddToOrder }: PartCardProps) {
  // Format price from cents to dollars
  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };
  
  // Determine stock status
  const getStockStatus = () => {
    if (part.stockQuantity <= 0) {
      return { label: "Out of Stock", color: "bg-red-100 text-red-800" };
    } else if (part.stockQuantity < 5) {
      return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800" };
    } else {
      return { label: "In Stock", color: "bg-green-100 text-green-800" };
    }
  };
  
  const stockStatus = getStockStatus();
  
  // Handle add to order button click
  const handleAddToOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToOrder();
  };
  
  return (
    <Link href={`/parts/${part.id}`}>
      <a className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition duration-150 block">
        <div className="flex">
          <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded mr-3 flex items-center justify-center">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium">{part.name}</h4>
            <p className="text-xs text-gray-500 mb-1">{part.manufacturer} • {part.partNumber}</p>
            <div className="flex items-center">
              <Badge variant="outline" className={`${stockStatus.color} border-0 text-xs font-medium mr-2`}>
                {stockStatus.label}
              </Badge>
              {part.stockQuantity > 0 && (
                <span className="text-xs text-gray-500">
                  {part.stockQuantity < 5 ? `${part.stockQuantity} remaining` : "Ships today"}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="font-medium text-primary">{formatPrice(part.price)}</span>
              <Button 
                size="sm" 
                onClick={handleAddToOrder}
                disabled={part.stockQuantity <= 0}
              >
                {part.stockQuantity <= 0 ? "Out of Stock" : "Add to Order"}
              </Button>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}
