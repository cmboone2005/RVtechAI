import { ReactNode, useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import Header from "./header";
import BottomNavigation from "./bottom-navigation";
import { updateOnlineStatus, getOnlineStatus } from "@/lib/local-storage";

interface AppShellProps {
  children: ReactNode;
  currentRoute: string;
}

export default function AppShell({ children, currentRoute }: AppShellProps) {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(getOnlineStatus());
  
  // Handle online status changes
  useEffect(() => {
    const handleOnlineStatusChange = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      updateOnlineStatus(online);
      
      // Create a custom event for child components to react to
      const event = new CustomEvent("onlineStatusChanged", { detail: { online } });
      window.dispatchEvent(event);
    };
    
    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);
    handleOnlineStatusChange();
    
    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background">
      <Header isOnline={isOnline} />
      
      <main className="flex-1 px-4 py-4 pb-20 overflow-auto">
        {children}
      </main>
      
      <div className="fixed bottom-0 left-0 right-0 z-10 max-w-md mx-auto">
        <BottomNavigation currentRoute={currentRoute} />
      </div>
    </div>
  );
}