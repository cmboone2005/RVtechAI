import { useState } from "react";
import AppShell from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertRvSchema } from "@shared/schema";
import RvCard from "@/components/service-history/rv-card";
import ServiceRecordCard from "@/components/service-history/service-record-card";
import { useLocation } from "wouter";

export default function ServiceHistoryPage() {
  const [location, setLocation] = useLocation();
  const [selectedRvId, setSelectedRvId] = useState<number | null>(null);
  const [addRvDialogOpen, setAddRvDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Fetch all RVs
  const { data: rvs = [], isLoading: isLoadingRvs } = useQuery({
    queryKey: ["/api/rvs"],
    queryFn: async ({ queryKey }) => {
      try {
        return await fetch(queryKey[0].toString(), { credentials: "include" }).then(res => res.json());
      } catch (error) {
        console.error("Failed to fetch RVs:", error);
        return [];
      }
    }
  });
  
  // Fetch service records for selected RV
  const { data: serviceRecords = [], isLoading: isLoadingRecords } = useQuery({
    queryKey: [`/api/service-history/by-rv/${selectedRvId}`],
    queryFn: async ({ queryKey }) => {
      if (!selectedRvId) return [];
      try {
        return await fetch(queryKey[0].toString(), { credentials: "include" }).then(res => res.json());
      } catch (error) {
        console.error("Failed to fetch service records:", error);
        return [];
      }
    },
    enabled: !!selectedRvId
  });
  
  // Selected RV details
  const selectedRv = rvs.find(rv => rv.id === selectedRvId);
  
  // Form schema for adding new RV
  const addRvSchema = insertRvSchema.pick({
    make: true,
    model: true,
    year: true,
    vin: true
  });
  
  // New RV form
  const addRvForm = useForm<z.infer<typeof addRvSchema>>({
    resolver: zodResolver(addRvSchema),
    defaultValues: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      vin: ""
    }
  });
  
  // Create RV mutation
  const createRvMutation = useMutation({
    mutationFn: async (data: z.infer<typeof addRvSchema>) => {
      const res = await apiRequest("POST", "/api/rvs", data);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "RV added",
        description: `${data.year} ${data.make} ${data.model} has been added`
      });
      setAddRvDialogOpen(false);
      addRvForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/rvs"] });
      setSelectedRvId(data.id);
    },
    onError: (error) => {
      toast({
        title: "Failed to add RV",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Handle add RV form submission
  const onAddRvSubmit = (data: z.infer<typeof addRvSchema>) => {
    createRvMutation.mutate(data);
  };
  
  return (
    <AppShell currentRoute="/service-history">
      <div className="mb-4 flex items-center">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => setLocation("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-bold">Service History</h2>
      </div>
      
      {/* RV List */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Your RVs</h3>
          </div>
          
          <div className="divide-y">
            {isLoadingRvs ? (
              <div className="p-4 text-center">
                <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-gray-500">Loading RVs...</p>
              </div>
            ) : rvs.length > 0 ? (
              rvs.map(rv => (
                <RvCard
                  key={rv.id}
                  rv={rv}
                  isSelected={selectedRvId === rv.id}
                  onClick={() => setSelectedRvId(rv.id)}
                />
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No RVs added yet
              </div>
            )}
            
            <div className="p-4">
              <Dialog open={addRvDialogOpen} onOpenChange={setAddRvDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="text-primary font-medium flex items-center p-0">
                    <Plus className="h-4 w-4 mr-1" />
                    Add New RV
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New RV</DialogTitle>
                  </DialogHeader>
                  
                  <Form {...addRvForm}>
                    <form onSubmit={addRvForm.handleSubmit(onAddRvSubmit)} className="space-y-4">
                      <FormField
                        control={addRvForm.control}
                        name="make"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Make</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Winnebago" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={addRvForm.control}
                        name="model"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Model</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Vista" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={addRvForm.control}
                        name="year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={addRvForm.control}
                        name="vin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>VIN/Serial (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 1F6WF36A56W220000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={createRvMutation.isPending}
                      >
                        {createRvMutation.isPending ? "Adding..." : "Add RV"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Service Records (For selected RV) */}
      {selectedRvId && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">
              {selectedRv ? `${selectedRv.year} ${selectedRv.make} ${selectedRv.model}` : "Service Records"}
            </h3>
            <Button size="sm" className="flex items-center" onClick={() => {
              toast({
                title: "Feature coming soon",
                description: "Adding new service records will be available soon"
              });
            }}>
              <Plus className="h-4 w-4 mr-1" />
              New Record
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0 divide-y">
              {isLoadingRecords ? (
                <div className="p-4 text-center">
                  <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-gray-500">Loading service records...</p>
                </div>
              ) : serviceRecords.length > 0 ? (
                serviceRecords.map(record => (
                  <ServiceRecordCard key={record.id} record={record} />
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No service records for this RV
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </AppShell>
  );
}
