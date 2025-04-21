import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AppShell from "@/components/layout/app-shell";
import { 
  Wrench, 
  Book, 
  Package, 
  History, 
  Settings, 
  AlertTriangle, 
  Mic,
  HelpCircle,
  Map
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function HomePage() {
  const [location, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isOnline, setIsOnline] = useState(true);
  
  // Check online status
  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };
    
    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);
    handleOnlineStatusChange();
    
    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
  }, []);
  
  // Main feature cards
  const featureCards = [
    {
      title: "Diagnostic Tool",
      description: "Analyze issues using AI to identify problems with your RV systems",
      icon: Settings,
      path: "/diagnose",
      color: "bg-green-100 text-green-700"
    },
    {
      title: "Repair Guides",
      description: "Step-by-step guides for fixing common RV problems",
      icon: Book,
      path: "/repair-guides",
      color: "bg-blue-100 text-blue-700"
    },
    {
      title: "System Diagrams",
      description: "Interactive diagrams of RV systems for troubleshooting and education",
      icon: Map,
      path: "/system-diagrams",
      color: "bg-indigo-100 text-indigo-700"
    },
    {
      title: "Parts Catalog",
      description: "Browse and search for replacement parts for your RV",
      icon: Package,
      path: "/parts",
      color: "bg-purple-100 text-purple-700"
    },
    {
      title: "Service History",
      description: "Track maintenance and repairs for your RV fleet",
      icon: History,
      path: "/service-history",
      color: "bg-amber-100 text-amber-700"
    }
  ];
  
  return (
    <AppShell currentRoute="/">
      <div className="flex flex-col gap-6">
        {/* Welcome Section */}
        <div className="bg-primary rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome, {user?.username || "Technician"}!</h1>
          <p className="text-primary-foreground/80">
            Your AI-powered assistant for RV diagnostics and repairs
          </p>
        </div>
        
        {/* Offline Warning */}
        {!isOnline && (
          <Card className="bg-yellow-50 border-yellow-200 p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-yellow-800">Offline Mode</h3>
                <p className="text-sm text-yellow-700">
                  You're currently offline. Some features may be limited.
                </p>
              </div>
            </div>
          </Card>
        )}
        
        {/* Voice Assistant Guide */}
        {isOnline && (
          <Card className="bg-blue-50 border-blue-200 p-4">
            <div className="flex items-start">
              <Mic className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-800">Voice Assistant Available</h3>
                <p className="text-sm text-blue-700 mb-2">
                  Hands-free operation is now available! Look for the microphone icon throughout the app.
                </p>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="voice-tips" className="border-blue-200">
                    <AccordionTrigger className="text-sm text-blue-700 py-2">
                      <div className="flex items-center">
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Voice Command Tips
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-blue-700">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>In <strong>Diagnostics</strong>, use voice to describe symptoms in detail.</li>
                        <li>During <strong>Chat</strong>, ask specific questions about troubleshooting steps.</li>
                        <li>Speak clearly and at a normal pace for best results.</li>
                        <li>Background noise may affect transcription quality.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </Card>
        )}
        
        {/* Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featureCards.map((card, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-md transition duration-200"
              onClick={() => setLocation(card.path)}
            >
              <div className="p-5">
                <div className="flex items-center mb-4">
                  <div className={`rounded-full p-3 mr-3 ${card.color}`}>
                    <card.icon className="h-5 w-5" />
                  </div>
                  <h2 className="font-bold text-lg">{card.title}</h2>
                </div>
                <p className="text-gray-600 text-sm mb-4">{card.description}</p>
                <Button variant="outline" className="w-full">
                  Open {card.title}
                </Button>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Quick Actions */}
        <div className="mt-4">
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              className="flex items-center"
              onClick={() => setLocation("/diagnose")}
            >
              <Wrench className="h-4 w-4 mr-2" />
              New Diagnostic
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center"
              onClick={() => logoutMutation.mutate()}
            >
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}