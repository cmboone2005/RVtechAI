import { RvSystem } from "@shared/schema";
import { Power, Droplet, Snowflake, Gauge, Car, HelpCircle } from "lucide-react";

interface SystemCardProps {
  system: RvSystem;
  isSelected: boolean;
  onClick: () => void;
}

export default function SystemCard({ system, isSelected, onClick }: SystemCardProps) {
  // Define system icons and labels
  const systemInfo = {
    electrical: { icon: Power, label: "Electrical" },
    plumbing: { icon: Droplet, label: "Plumbing" },
    hvac: { icon: Snowflake, label: "HVAC" },
    propane: { icon: Gauge, label: "Propane" },
    chassis: { icon: Car, label: "Chassis" },
    other: { icon: HelpCircle, label: "Other" },
  };
  
  const { icon: Icon, label } = systemInfo[system];
  
  return (
    <div
      className={`
        p-4 rounded-lg text-center cursor-pointer transition duration-150
        ${isSelected 
          ? 'bg-primary text-white shadow-md' 
          : 'bg-white border hover:bg-gray-50'}
      `}
      onClick={onClick}
    >
      <Icon className={`h-8 w-8 mx-auto mb-2 ${isSelected ? 'text-white' : 'text-primary'}`} />
      <p className="font-medium text-sm">{label}</p>
    </div>
  );
}