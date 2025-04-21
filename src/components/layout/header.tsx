import { useAuth } from "@/hooks/use-auth";
import { Wifi, WifiOff } from "lucide-react";

interface HeaderProps {
  isOnline: boolean;
}

export default function Header({ isOnline }: HeaderProps) {
  const { user } = useAuth();
  
  return (
    <header className="border-b p-4 bg-white shadow-sm flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center">
        <div className="font-bold text-primary">RV Assistant</div>
      </div>
      
      <div className="flex items-center gap-3">
        {isOnline ? (
          <Wifi className="h-4 w-4 text-green-500" />
        ) : (
          <WifiOff className="h-4 w-4 text-red-500" />
        )}
        
        <div className="text-sm font-medium">
          {user?.username}
        </div>
      </div>
    </header>
  );
}