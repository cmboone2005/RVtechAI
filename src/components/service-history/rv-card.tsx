import { ChevronRight } from "lucide-react";

interface RvCardProps {
  rv: {
    id: number;
    make: string;
    model: string;
    year: number;
    vin?: string;
  };
  isSelected: boolean;
  onClick: () => void;
}

export default function RvCard({ rv, isSelected, onClick }: RvCardProps) {
  return (
    <div 
      className={`p-4 transition duration-150 cursor-pointer ${
        isSelected ? 'bg-primary/5' : 'hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-medium">{rv.year} {rv.make} {rv.model}</h4>
          {rv.vin && <p className="text-sm text-gray-500">VIN: {rv.vin}</p>}
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
}
