import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RV_SYSTEMS, RvSystem, insertDiagnosticSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import SystemCard from "./system-card";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getOnlineStatus } from "@/lib/local-storage";
import { VoiceRecorderButton } from "@/components/ui/voice-recorder-button";

const formSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().min(1900, "Year must be valid").max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  vin: z.string().optional(),
  system: z.enum(RV_SYSTEMS, { required_error: "Please select a system" }),
  symptoms: z.string().min(5, "Please describe the symptoms in more detail")
});

type FormValues = z.infer<typeof formSchema>;

interface DiagnosticFormProps {
  onSubmit: (data: FormValues, rvId?: number) => void;
  rvs?: any[];
  isSubmitting?: boolean;
}

export default function DiagnosticForm({ onSubmit, rvs = [], isSubmitting = false }: DiagnosticFormProps) {
  const { toast } = useToast();
  const isOnline = getOnlineStatus();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      vin: "",
      system: undefined as unknown as RvSystem,
      symptoms: ""
    }
  });
  
  const selectedSystem = form.watch("system");
  
  // Select a previously owned RV
  const selectRv = (rv: any) => {
    form.setValue("make", rv.make);
    form.setValue("model", rv.model);
    form.setValue("year", rv.year);
    form.setValue("vin", rv.vin || "");
    toast({
      title: "RV Selected",
      description: `${rv.year} ${rv.make} ${rv.model}`
    });
  };
  
  // Handle voice transcription completion
  const handleTranscriptionComplete = (text: string) => {
    form.setValue("symptoms", text);
    form.trigger("symptoms");
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* RV Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">RV Information</h3>
          
          {rvs.length > 0 && (
            <div className="mb-4">
              <FormLabel>Select an existing RV</FormLabel>
              <div className="flex flex-wrap gap-2 mt-1">
                {rvs.map((rv) => (
                  <Button
                    key={rv.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => selectRv(rv)}
                  >
                    {rv.year} {rv.make} {rv.model}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
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
              control={form.control}
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
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 2018" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
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
          </div>
        </div>
        
        {/* System Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Which system has an issue?</h3>
          <FormField
            control={form.control}
            name="system"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {RV_SYSTEMS.map((system) => (
                      <SystemCard
                        key={system}
                        system={system}
                        isSelected={field.value === system}
                        onClick={() => form.setValue("system", system)}
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Symptom Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Describe the symptoms</h3>
          <FormField
            control={form.control}
            name="symptoms"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder="Describe what's happening (e.g., 'Water heater not heating water' or 'AC blowing warm air')"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-center mt-4">
            <VoiceRecorderButton
              onTranscriptionComplete={handleTranscriptionComplete}
              size="icon"
              className="w-14 h-14"
              iconClassName="h-6 w-6"
              roundedFull={true}
              disabled={!isOnline}
              showLabel={true}
              listeningLabel="Listening..."
              label="Tap to use voice input"
            />
          </div>
        </div>
        
        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full flex items-center justify-center" 
          disabled={isSubmitting}
        >
          <Search className="mr-2 h-5 w-5" />
          {isSubmitting ? "Analyzing..." : "Diagnose Issue"}
        </Button>
      </form>
    </Form>
  );
}
