import { useState } from "react";
import { RvSystem } from "@shared/schema";
import SystemDiagrams from "./system-diagrams";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

// Part information interface
export interface PartInfo {
  id: string;
  name: string;
  description: string;
  commonIssues?: string[];
  relatedPartsIds?: number[];
  relatedGuideIds?: number[];
}

// Component props interface
interface InteractiveDiagramProps {
  system: RvSystem;
  onPartSelect?: (partInfo: PartInfo) => void;
  highlightedPartId?: string;
  width?: number;
  height?: number;
}

export default function InteractiveDiagram({
  system,
  onPartSelect = () => {},
  highlightedPartId,
  width = 800,
  height = 600
}: InteractiveDiagramProps) {
  // State for zoom
  const [zoom, setZoom] = useState(1);
  
  // Handle part click
  const handlePartClick = (partInfo: PartInfo) => {
    onPartSelect(partInfo);
  };
  
  // Select the appropriate diagram component based on the system
  const DiagramComponent = SystemDiagrams[system] || SystemDiagrams.other;
  
  return (
    <div className="flex flex-col h-full">
      {/* Controls for diagram interaction */}
      <div className="flex flex-row gap-4 mb-4 p-2 bg-gray-50 rounded-md">
        <div className="flex items-center gap-2 flex-1">
          <ZoomOut className="h-4 w-4 text-gray-500" />
          <Slider
            value={[zoom * 100]}
            min={50}
            max={150}
            step={10}
            onValueChange={(value) => setZoom(value[0] / 100)}
            className="flex-1"
          />
          <ZoomIn className="h-4 w-4 text-gray-500" />
          <span className="text-xs text-gray-500 ml-2 w-12">{Math.round(zoom * 100)}%</span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setZoom(1);
          }}
          className="text-xs"
        >
          Reset Zoom
        </Button>
      </div>
      
      {/* Diagram container */}
      <div 
        className="flex-1 border rounded-md overflow-hidden bg-white" 
        style={{ 
          width: "100%", 
          height: "100%",
          minHeight: "400px"
        }}
      >
        <div style={{ 
          transform: `scale(${zoom})`,
          transformOrigin: "center center",
          transition: "transform 0.3s ease",
          height: "100%",
          width: "100%",
        }}>
          <DiagramComponent
            onPartClick={handlePartClick}
            highlightedPartId={highlightedPartId}
            zoom={zoom}
            rotation={0}
            system={system}
          />
        </div>
      </div>
    </div>
  );
}