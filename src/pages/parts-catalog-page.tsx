import { useState } from "react";
import AppShell from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Search, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PartCard from "@/components/parts/part-card";
import CategoryCard from "@/components/parts/category-card";
import { RV_SYSTEMS, RvSystem } from "@shared/schema";
import { useLocation } from "wouter";

type SortOption = "popularity" | "price-low" | "price-high" | "name";

export default function PartsCatalogPage() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<RvSystem | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("popularity");
  const { toast } = useToast();
  
  // Fetch all parts
  const { data: parts = [], isLoading } = useQuery({
    queryKey: [`/api/parts${searchQuery ? `?search=${searchQuery}` : ''}`],
    queryFn: async ({ queryKey }) => {
      try {
        return await fetch(queryKey[0].toString()).then(res => res.json());
      } catch (error) {
        console.error("Failed to fetch parts:", error);
        return [];
      }
    }
  });
  
  // Filter parts based on search and system
  const filteredParts = parts.filter(part => {
    const matchesSystem = selectedSystem === "all" || part.system === selectedSystem;
    return matchesSystem;
  });
  
  // Sort parts
  const sortedParts = [...filteredParts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      case "popularity":
      default:
        // For popularity, we'll use stock as a proxy (lower stock = higher popularity)
        return b.stockQuantity - a.stockQuantity;
    }
  });
  
  // Add to cart/order
  const handleAddToOrder = (part) => {
    toast({
      title: "Part added to order",
      description: `${part.name} has been added to your order`
    });
  };
  
  return (
    <AppShell currentRoute="/parts">
      <div className="mb-4 flex items-center">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => setLocation("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-bold">Parts Catalog</h2>
      </div>
      
      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                className="pl-9"
                placeholder="Search parts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-primary/10 text-primary" : ""}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          {showFilters && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              <Button
                variant={selectedSystem === "all" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedSystem("all")}
                className="text-sm"
              >
                All
              </Button>
              
              {RV_SYSTEMS.map(system => (
                <Button
                  key={system}
                  variant={selectedSystem === system ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSystem(system)}
                  className="text-sm"
                >
                  {system.charAt(0).toUpperCase() + system.slice(1)}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Part Categories */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Categories</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {RV_SYSTEMS.map(system => (
            <CategoryCard
              key={system}
              system={system}
              onClick={() => setSelectedSystem(system)}
            />
          ))}
        </div>
      </div>
      
      {/* Parts List */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">
            {selectedSystem === "all" ? "All Parts" : `${selectedSystem.charAt(0).toUpperCase() + selectedSystem.slice(1)} Parts`}
          </h3>
          <div className="text-sm text-gray-500">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="border-none bg-transparent focus:ring-0 w-44 h-8">
                <SelectValue placeholder="Sort by: Popularity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Sort by: Popularity</SelectItem>
                <SelectItem value="price-low">Sort by: Price (Low to High)</SelectItem>
                <SelectItem value="price-high">Sort by: Price (High to Low)</SelectItem>
                <SelectItem value="name">Sort by: Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Loading parts catalog...</p>
          </div>
        ) : sortedParts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedParts.map(part => (
              <PartCard
                key={part.id}
                part={part}
                onAddToOrder={() => handleAddToOrder(part)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-8">
            <p className="text-gray-500">No parts found matching your search criteria</p>
            {(searchQuery || selectedSystem !== "all") && (
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSystem("all");
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
