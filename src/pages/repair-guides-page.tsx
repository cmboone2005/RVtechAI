import { useState } from "react";
import AppShell from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Search, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getOfflineGuides, isGuideSavedOffline, saveGuideForOffline, removeOfflineGuide } from "@/lib/local-storage";
import { RvSystem, RV_SYSTEMS } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GuideCard from "@/components/repair-guides/guide-card";
import CategoryCard from "@/components/repair-guides/category-card";
import { useLocation } from "wouter";

export default function RepairGuidesPage() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<RvSystem | "all">("all");
  const { toast } = useToast();
  
  // Get tab from query params
  const params = new URLSearchParams(location.split("?")[1]);
  const defaultTab = params.get("tab") || "all";
  
  // Fetch all repair guides
  const { data: guides = [], isLoading } = useQuery({
    queryKey: ["/api/repair-guides"],
    queryFn: async ({ queryKey }) => {
      try {
        return await fetch(queryKey[0].toString()).then(res => res.json());
      } catch (error) {
        console.error("Failed to fetch repair guides:", error);
        return [];
      }
    }
  });
  
  // Get offline guides from local storage
  const offlineGuides = getOfflineGuides();
  
  // Filter guides based on search and system
  const filteredGuides = guides.filter(guide => {
    const matchesSearch = searchQuery === "" || 
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSystem = selectedSystem === "all" || guide.system === selectedSystem;
    
    return matchesSearch && matchesSystem;
  });
  
  // Group guides by system for categories view
  const guidesBySystem = RV_SYSTEMS.map(system => {
    const systemGuides = guides.filter(guide => guide.system === system);
    return {
      system,
      count: systemGuides.length
    };
  });
  
  // Toggle saved for offline use
  const toggleSaveOffline = (guide) => {
    if (isGuideSavedOffline(guide.id)) {
      removeOfflineGuide(guide.id);
      toast({
        title: "Guide removed",
        description: `"${guide.title}" is no longer available offline`
      });
    } else {
      saveGuideForOffline(guide);
      toast({
        title: "Guide saved",
        description: `"${guide.title}" is now available offline`
      });
    }
  };
  
  return (
    <AppShell currentRoute="/repair-guides">
      <div className="mb-4 flex items-center">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => setLocation("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-bold">Repair Guides</h2>
      </div>
      
      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex space-x-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                className="pl-9"
                placeholder="Search guides..."
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
            <div className="grid grid-cols-4 gap-2">
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
      
      <Tabs defaultValue={defaultTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Guides</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="offline">
            Offline ({offlineGuides.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading repair guides...</p>
            </div>
          ) : filteredGuides.length > 0 ? (
            <Card>
              <CardContent className="p-0 divide-y">
                {filteredGuides.map(guide => (
                  <GuideCard
                    key={guide.id}
                    guide={guide}
                    isOffline={isGuideSavedOffline(guide.id)}
                    onToggleSave={() => toggleSaveOffline(guide)}
                  />
                ))}
              </CardContent>
            </Card>
          ) : (
            <div className="text-center p-8">
              <p className="text-gray-500">No guides found matching your search criteria</p>
              {searchQuery && (
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
        </TabsContent>
        
        <TabsContent value="categories">
          <div className="grid grid-cols-2 gap-3">
            {guidesBySystem.map(({ system, count }) => (
              <CategoryCard 
                key={system} 
                system={system}
                count={count}
                onClick={() => {
                  setSelectedSystem(system);
                  const tabsList = document.querySelector('[role="tablist"]');
                  const allTab = tabsList?.querySelector('[value="all"]');
                  if (allTab) {
                    (allTab as HTMLElement).click();
                  }
                }}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="offline">
          {offlineGuides.length > 0 ? (
            <Card>
              <CardContent className="p-0 divide-y">
                {offlineGuides.map(guide => (
                  <GuideCard
                    key={guide.id}
                    guide={guide}
                    isOffline={true}
                    onToggleSave={() => toggleSaveOffline(guide)}
                  />
                ))}
              </CardContent>
            </Card>
          ) : (
            <div className="text-center p-8">
              <p className="text-gray-500 mb-4">No guides saved for offline use</p>
              <p className="text-sm text-gray-400 mb-4">
                Save guides for access when you don't have an internet connection
              </p>
              <Button 
                onClick={() => {
                  const tabsList = document.querySelector('[role="tablist"]');
                  const allTab = tabsList?.querySelector('[value="all"]');
                  if (allTab) {
                    (allTab as HTMLElement).click();
                  }
                }}
              >
                Browse Guides
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
