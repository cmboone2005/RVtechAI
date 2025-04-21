import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { getOnlineStatus } from "@/lib/local-storage";
import { VoiceRecorderButton } from "@/components/ui/voice-recorder-button";

interface ChatMessage {
  id?: number;
  sender: "user" | "ai";
  message: string;
  timestamp?: string;
}

interface ChatInterfaceProps {
  diagnosticId: number;
  rvMake: string;
  rvModel: string;
  rvYear: number;
  system: string;
  symptoms: string;
}

export default function ChatInterface({
  diagnosticId,
  rvMake,
  rvModel,
  rvYear,
  system,
  symptoms
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isOnline = getOnlineStatus();
  
  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Fetch existing chat messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/diagnostics/${diagnosticId}/chat`, {
          credentials: "include"
        });
        
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (error) {
        console.error("Failed to fetch chat messages:", error);
      }
    };
    
    if (diagnosticId && isOnline) {
      fetchMessages();
    } else {
      // Add initial AI greeting if offline or no messages
      setMessages([
        {
          sender: "ai",
          message: `I'm your AI diagnostic assistant. I'll help troubleshoot the ${system} system issue based on the symptoms you've described. What would you like to know?`
        }
      ]);
    }
  }, [diagnosticId, isOnline, system]);
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await apiRequest("POST", `/api/diagnostics/${diagnosticId}/chat`, {
        message,
        make: rvMake,
        model: rvModel,
        year: rvYear
      });
      return await res.json();
    },
    onSuccess: (data) => {
      // Add both user message and AI response to the chat
      setMessages(prev => [...prev, data.userMessage, data.aiMessage]);
      setInputValue("");
    },
    onError: (error) => {
      // If there's an error, still show the user message but with an error for AI
      setMessages(prev => [
        ...prev, 
        { 
          sender: "user", 
          message: inputValue 
        },
        { 
          sender: "ai", 
          message: "Sorry, I'm having trouble responding right now. Please try again later." 
        }
      ]);
      setInputValue("");
      
      toast({
        title: "Message failed",
        description: isOnline 
          ? error.message 
          : "Cannot send messages while offline",
        variant: "destructive"
      });
    }
  });
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    if (!isOnline) {
      toast({
        title: "Offline mode",
        description: "Chat is not available while offline",
        variant: "destructive"
      });
      return;
    }
    
    // Optimistically add user message
    setMessages(prev => [...prev, { sender: "user", message: inputValue }]);
    
    // Send message to API
    sendMessageMutation.mutate(inputValue);
  };
  
  // Handle voice transcription completion
  const handleTranscriptionComplete = (text: string) => {
    setInputValue(text);
  };
  
  return (
    <div>
      <div className="bg-gray-50 rounded-lg p-3 mb-3">
        <div className="space-y-3 mb-3 max-h-[300px] overflow-y-auto">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex items-start ${message.sender === 'user' ? 'justify-end' : ''}`}
            >
              {message.sender === 'ai' && (
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-2">
                  <i className="text-white text-sm">AI</i>
                </div>
              )}
              
              <div 
                className={`${
                  message.sender === 'user' 
                    ? 'bg-primary/10 rounded-lg p-3 max-w-[85%]' 
                    : 'bg-white rounded-lg p-3 shadow-sm max-w-[85%]'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.message}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        
        <form onSubmit={handleSubmit} className="flex items-center">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1"
            placeholder="Ask a follow-up question..."
            disabled={sendMessageMutation.isPending || !isOnline}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="ml-2"
            disabled={!inputValue.trim() || sendMessageMutation.isPending || !isOnline}
          >
            <Send className="h-4 w-4" />
          </Button>
          <VoiceRecorderButton
            onTranscriptionComplete={handleTranscriptionComplete}
            size="icon"
            className="ml-2"
            iconClassName="h-4 w-4"
            disabled={!isOnline || sendMessageMutation.isPending}
          />
        </form>
        
        {!isOnline && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Chat is not available in offline mode
          </p>
        )}
      </div>
    </div>
  );
}
