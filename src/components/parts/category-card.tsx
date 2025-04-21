import { RvSystem } from "@shared/schema";
import { Power, Droplet, Snowflake, Gauge, Car, HelpCircle } from "lucide-react";

interface CategoryCardProps {
  system: RvSystem;
  onClick: () => void;
}

export default function CategoryCard({ system, onClick }: CategoryCardProps) {
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
      className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition duration-150 text-center cursor-pointer"
      onClick={onClick}
    >
      <Icon className="text-primary text-2xl block mx-auto mb-1 h-6 w-6" />
      <h4 className="font-medium text-sm">{label}</h4>
    </div>
  );
}
