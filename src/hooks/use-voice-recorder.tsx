import { useState, useRef, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseVoiceRecorderOptions {
  onComplete?: (audioBlob: Blob, audioBase64: string) => void;
  onError?: (error: Error) => void;
  maxDuration?: number; // in ms
}

export function useVoiceRecorder({
  onComplete,
  onError,
  maxDuration = 30000, // Default max duration: 30 seconds
}: UseVoiceRecorderOptions = {}) {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioBase64, setAudioBase64] = useState<string>("");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  
  // Check for browser support
  const isSupported = typeof window !== 'undefined' && 
    !!navigator.mediaDevices && 
    !!navigator.mediaDevices.getUserMedia;
  
  // Clean up function to stop recording and release resources
  const cleanUp = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    chunksRef.current = [];
  }, []);
  
  // Start recording
  const startRecording = useCallback(async () => {
    if (!isSupported) {
      const error = new Error("Voice recording is not supported in this browser");
      if (onError) onError(error);
      toast({
        title: "Voice input unavailable",
        description: "Your browser doesn't support voice recording.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Reset previous recording
      setAudioBlob(null);
      setAudioBase64("");
      chunksRef.current = [];
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      // Permission granted
      setHasPermission(true);
      
      // Create a new media recorder with the stream
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Add data handler
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      // Handle recording stop
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        
        // Convert blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          // Remove data URL prefix (data:audio/webm;base64,)
          const base64Audio = base64data.split(',')[1];
          setAudioBase64(base64Audio);
          
          if (onComplete) {
            onComplete(audioBlob, base64Audio);
          }
        };
        
        setIsRecording(false);
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Set a timeout for max duration
      timerRef.current = window.setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          stopRecording();
          toast({
            title: "Recording complete",
            description: "Maximum recording duration reached."
          });
        }
      }, maxDuration);
      
    } catch (error) {
      // Handle permission denied or other errors
      setHasPermission(false);
      setIsRecording(false);
      
      if (error instanceof Error) {
        if (onError) onError(error);
        
        const errorMessage = error.name === 'NotAllowedError' 
          ? "Microphone access was denied. Please allow microphone access to use voice input."
          : "Failed to start recording. Please try again.";
          
        toast({
          title: "Voice input failed",
          description: errorMessage,
          variant: "destructive"
        });
      }
    }
  }, [isSupported, maxDuration, onComplete, onError, toast]);
  
  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    // Don't set isRecording to false here - wait for onstop event
  }, []);
  
  // Check browser support on mount
  useEffect(() => {
    if (!isSupported) {
      setHasPermission(false);
    }
  }, [isSupported]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanUp();
    };
  }, [cleanUp]);
  
  return {
    isRecording,
    startRecording,
    stopRecording,
    audioBlob,
    audioBase64,
    hasPermission,
    isSupported
  };
}