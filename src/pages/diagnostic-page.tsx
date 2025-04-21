import { useState } from "react";
import AppShell from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import DiagnosticForm from "@/components/diagnostic/diagnostic-form";
import DiagnosticResults from "@/components/diagnostic/diagnostic-results";
import { apiRequest } from "@/lib/queryClient";
import { getOnlineStatus, saveDiagnosticOffline } from "@/lib/local-storage";
import { useLocation } from "wouter";

export default function DiagnosticPage() {
  const [selectedRvId, setSelectedRvId] = useState<number | null>(null);
  const [diagnostic, setDiagnostic] = useState<any | null>(null);
  const { toast } = useToast();
  const isOnline = getOnlineStatus();
  const [, setLocation] = useLocation();
  
  // Fetch RVs for selection
  const { data: rvs = [] } = useQuery({
    queryKey: ["/api/rvs"],
    queryFn: async ({ queryKey }) => {
      try {
        const res = await fetch(queryKey[0].toString(), { credentials: "include" });
        if (!res.ok) return [];
        return await res.json();
      } catch (error) {
        console.error("Failed to fetch RVs:", error);
        return [];
      }
    }
  });
  
  // Create diagnostic mutation
  const createDiagnosticMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/diagnostics", {
        rvId: selectedRvId,
        system: data.system,
        symptoms: data.symptoms
      });
      return await res.json();
    },
    onSuccess: (data) => {
      // After creating diagnostic, run analysis
      analyzeDiagnosticMutation.mutate({
        diagnosticId: data.id,
        make: currentFormData!.make,
        model: currentFormData!.model,
        year: currentFormData!.year,
        vin: currentFormData!.vin
      });
      
      // Store the form data for analysis
      setDiagnostic(data);
      
      toast({
        title: "Diagnostic created",
        description: "Analyzing symptoms..."
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create diagnostic",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Analyze diagnostic mutation
  const analyzeDiagnosticMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest(
        "POST", 
        `/api/diagnostics/${data.diagnosticId}/analyze`,
        {
          make: data.make,
          model: data.model,
          year: data.year,
          vin: data.vin
        }
      );
      return await res.json();
    },
    onSuccess: (data) => {
      setDiagnostic(data);
      
      // If offline, save to local storage
      if (!isOnline) {
        saveDiagnosticOffline(data);
      }
      
      toast({
        title: "Analysis complete",
        description: "Review the diagnostic results"
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/diagnostics/by-technician"] });
    },
    onError: (error) => {
      toast({
        title: "Analysis failed",
        description: isOnline 
          ? error.message 
          : "You are offline. The diagnostic has been saved and will be analyzed when you're back online.",
        variant: isOnline ? "destructive" : "default"
      });
      
      // If offline, still show the created diagnostic
      if (!isOnline && diagnostic) {
        saveDiagnosticOffline(diagnostic);
      }
    }
  });
  
  // Store form data for later use in analysis
  const [currentFormData, setCurrentFormData] = useState<any | null>(null);
  
  // Handle form submission
  const handleSubmit = (data: any) => {
    if (!isOnline) {
      toast({
        title: "Offline mode",
        description: "Diagnostics require an internet connection for AI analysis. Please connect to the internet and try again.",
        variant: "destructive"
      });
      return;
    }
    
    // Store form data for later
    setCurrentFormData(data);
    
    // Check if RV exists or needs to be created
    const matchingRv = rvs.find(
      rv => rv.make.toLowerCase() === data.make.toLowerCase() && 
           rv.model.toLowerCase() === data.model.toLowerCase() &&
           rv.year === data.year
    );
    
    if (matchingRv) {
      setSelectedRvId(matchingRv.id);
      createDiagnosticMutation.mutate(data);
    } else {
      // Create new RV first
      createRvMutation.mutate({
        make: data.make,
        model: data.model,
        year: data.year,
        vin: data.vin || undefined
      });
    }
  };
  
  // Create RV mutation (if needed)
  const createRvMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/rvs", data);
      return await res.json();
    },
    onSuccess: (data) => {
      setSelectedRvId(data.id);
      
      // Now create the diagnostic
      if (currentFormData) {
        createDiagnosticMutation.mutate(currentFormData);
      }
      
      // Invalidate RVs query
      queryClient.invalidateQueries({ queryKey: ["/api/rvs"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to create RV",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Save diagnostic to history
  const handleSaveToHistory = () => {
    toast({
      title: "Saved to history",
      description: "This diagnostic has been saved to your history"
    });
  };
  
  return (
    <AppShell currentRoute="/diagnose">
      <div className="mb-4 flex items-center">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => setLocation("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-bold">Diagnose an Issue</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
        {!diagnostic ? (
          <DiagnosticForm 
            onSubmit={handleSubmit} 
            rvs={rvs} 
            isSubmitting={
              createDiagnosticMutation.isPending || 
              analyzeDiagnosticMutation.isPending || 
              createRvMutation.isPending
            }
          />
        ) : (
          <DiagnosticResults 
            diagnostic={diagnostic} 
            rvMake={currentFormData?.make}
            rvModel={currentFormData?.model}
            rvYear={currentFormData?.year}
            onSaveToHistory={handleSaveToHistory}
          />
        )}
      </div>
    </AppShell>
  );
}
