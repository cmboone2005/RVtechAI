import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { RvSystem } from "@shared/schema";

interface ServiceRecordCardProps {
  record: {
    id: number;
    title: string;
    description: string;
    system: RvSystem;
    technicianId: number;
    serviceDate: string;
  };
}

export default function ServiceRecordCard({ record }: ServiceRecordCardProps) {
  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Format system name for display
  const formatSystem = (system: string) => {
    return system.charAt(0).toUpperCase() + system.slice(1);
  };
  
  return (
    <div className="p-4 hover:bg-gray-50 transition duration-150 cursor-pointer">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{record.title}</h4>
          <p className="text-sm text-gray-500">{formatDate(record.serviceDate)}</p>
          <div className="flex items-center mt-1">
            <Badge variant="secondary" className="bg-primary-light/20 text-primary mr-2">
              {formatSystem(record.system)}
            </Badge>
            <span className="text-xs text-gray-500">Tech ID: {record.technicianId}</span>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
}
