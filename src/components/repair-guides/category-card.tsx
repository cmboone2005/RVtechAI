import { RvSystem } from "@shared/schema";
import { Power, Droplet, Snowflake, Gauge, Car, HelpCircle } from "lucide-react";

interface CategoryCardProps {
  system: RvSystem;
  count: number;
  onClick: () => void;
}

export default function CategoryCard({ system, count, onClick }: CategoryCardProps) {
  // Define system icons and labels
  const systemInfo = {
    electrical: { icon: Power, label: "Electrical Systems", color: "bg-blue-100 text-blue-700" },
    plumbing: { icon: Droplet, label: "Plumbing Systems", color: "bg-cyan-100 text-cyan-700" },
    hvac: { icon: Snowflake, label: "HVAC Systems", color: "bg-indigo-100 text-indigo-700" },
    propane: { icon: Gauge, label: "Propane Systems", color: "bg-yellow-100 text-yellow-700" },
    chassis: { icon: Car, label: "Chassis Systems", color: "bg-orange-100 text-orange-700" },
    other: { icon: HelpCircle, label: "Other Systems", color: "bg-gray-100 text-gray-700" },
  };
  
  const { icon: Icon, label, color } = systemInfo[system];
  
  return (
    <div
      className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition duration-150 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`rounded-full p-3 mr-3 ${color.split(' ')[0]} ${color.split(' ')[1]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-medium">{label}</h4>
          <p className="text-sm text-gray-500">{count} guides</p>
        </div>
      </div>
    </div>
  );
}
