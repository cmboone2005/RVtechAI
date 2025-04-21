import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface VoiceRecorderButtonProps {
  onTranscriptionComplete: (text: string) => void;
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  iconClassName?: string;
  disabled?: boolean;
  showLabel?: boolean;
  label?: string;
  processingLabel?: string;
  listeningLabel?: string;
  roundedFull?: boolean;
  maxDuration?: number;
}

export function VoiceRecorderButton({
  onTranscriptionComplete,
  variant = "default",
  size = "default",
  className = "",
  iconClassName = "h-4 w-4",
  disabled = false,
  showLabel = false,
  label = "Voice Input",
  processingLabel = "Processing...",
  listeningLabel = "Listening...",
  roundedFull = false,
  maxDuration = 30000,
}: VoiceRecorderButtonProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleRecordingComplete = async (audioBlob: Blob, audioBase64: string) => {
    try {
      setIsProcessing(true);
      
      // Call the API endpoint to transcribe the audio
      const response = await fetch('/api/voice-transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audioBase64 }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to transcribe audio');
      }
      
      const data = await response.json();
      
      if (data.text) {
        onTranscriptionComplete(data.text);
        toast({
          title: "Voice input received",
          description: "Transcription complete.",
        });
      } else {
        throw new Error('No transcription returned');
      }
    } catch (error) {
      console.error('Transcription error:', error);
      toast({
        title: "Transcription failed",
        description: "Could not transcribe your voice input. Please try text input instead.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const {
    isRecording,
    startRecording,
    stopRecording,
    hasPermission,
    isSupported,
  } = useVoiceRecorder({
    onComplete: handleRecordingComplete,
    maxDuration,
  });
  
  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  // Determine if the button should be disabled
  const isButtonDisabled = disabled || !isSupported || isProcessing;
  
  // Determine button appearance
  const buttonClasses = cn(
    className,
    roundedFull ? 'rounded-full' : '',
    isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : ''
  );
  
  // Determine the status label to show
  let statusLabel = label;
  if (isRecording) {
    statusLabel = listeningLabel;
  } else if (isProcessing) {
    statusLabel = processingLabel;
  }
  
  return (
    <div className="flex flex-col items-center">
      <Button
        type="button"
        variant={variant}
        size={size}
        className={buttonClasses}
        onClick={handleClick}
        disabled={isButtonDisabled}
      >
        {isProcessing ? (
          <Loader2 className={cn(iconClassName, "animate-spin")} />
        ) : isRecording ? (
          <Mic className={iconClassName} />
        ) : !isSupported || hasPermission === false ? (
          <MicOff className={iconClassName} />
        ) : (
          <Mic className={iconClassName} />
        )}
        {showLabel && size !== "icon" && <span className="ml-2">{statusLabel}</span>}
      </Button>
      
      {showLabel && size === "icon" && (
        <p className="text-xs text-gray-500 mt-1">{statusLabel}</p>
      )}
      
      {!isSupported && (
        <p className="text-xs text-red-500 mt-1">Voice input not supported</p>
      )}
    </div>
  );
}