import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Define part information
const propaneParts = [
  {
    id: "propaneTank",
    name: "Propane Tank",
    description: "Stores liquid propane under pressure for use in various RV appliances.",
    x: 350,
    y: 80,
    width: 120,
    height: 70,
    commonIssues: [
      "Empty tank",
      "Expired certification",
      "Tank valve issues",
      "Physical damage",
      "Rust/corrosion"
    ],
    relatedPartsIds: [61, 62],
    relatedGuideIds: [61, 62]
  },
  {
    id: "regulator",
    name: "Propane Regulator",
    description: "Reduces tank pressure to a safe, usable level for RV appliances.",
    x: 350,
    y: 200,
    width: 120,
    height: 60,
    commonIssues: [
      "Improper pressure output",
      "Regulator freezing",
      "Internal diaphragm failure",
      "Vent blockage",
      "Contamination"
    ],
    relatedPartsIds: [63, 64],
    relatedGuideIds: [63, 64]
  },
  {
    id: "shutoffValve",
    name: "Shut-off Valve",
    description: "Allows manual control of propane flow to appliances.",
    x: 180,
    y: 320,
    width: 100,
    height: 60,
    commonIssues: [
      "Valve stuck",
      "Leaking valve",
      "Handle breakage",
      "Internal corrosion"
    ],
    relatedPartsIds: [65, 66],
    relatedGuideIds: [65, 66]
  },
  {
    id: "propaneLines",
    name: "Propane Lines",
    description: "Tubing that delivers propane from the tank to appliances.",
    x: 350,
    y: 320,
    width: 100,
    height: 60,
    commonIssues: [
      "Leaks at fittings",
      "Damaged lines",
      "Improper routing",
      "Line corrosion"
    ],
    relatedPartsIds: [67, 68],
    relatedGuideIds: [67, 68]
  },
  {
    id: "autoSwitchover",
    name: "Auto Switchover",
    description: "For dual tank systems, automatically switches to backup tank when primary is empty.",
    x: 520,
    y: 320,
    width: 130,
    height: 60,
    commonIssues: [
      "Failed switchover",
      "Indicator malfunction",
      "Internal leak",
      "Regulator issues"
    ],
    relatedPartsIds: [69, 70],
    relatedGuideIds: [69, 70]
  },
  {
    id: "furnace",
    name: "Furnace",
    description: "Heats the RV using propane fuel.",
    x: 120,
    y: 440,
    width: 100,
    height: 60,
    commonIssues: [
      "Ignition failure",
      "Gas valve issues",
      "Limit switch failure",
      "Burner problems"
    ],
    relatedPartsIds: [71, 72],
    relatedGuideIds: [71, 72]
  },
  {
    id: "waterHeater",
    name: "Water Heater",
    description: "Heats water using propane (and sometimes electricity).",
    x: 260,
    y: 440,
    width: 100,
    height: 60,
    commonIssues: [
      "Pilot light issues",
      "Thermocouple failure",
      "Gas valve problems",
      "Control board failure"
    ],
    relatedPartsIds: [73, 74],
    relatedGuideIds: [73, 74]
  },
  {
    id: "refrigerator",
    name: "Refrigerator",
    description: "RV refrigerator that can operate on propane or electricity.",
    x: 400,
    y: 440,
    width: 100,
    height: 60,
    commonIssues: [
      "No cooling on propane",
      "Ignition failure",
      "Gas valve issues",
      "Improper ventilation"
    ],
    relatedPartsIds: [75, 76],
    relatedGuideIds: [75, 76]
  },
  {
    id: "stove",
    name: "Stove/Oven",
    description: "Cooktop and oven that run on propane.",
    x: 540,
    y: 440,
    width: 100,
    height: 60,
    commonIssues: [
      "Burner ignition problems",
      "Uneven heating",
      "Gas odor",
      "Low flame"
    ],
    relatedPartsIds: [77, 78],
    relatedGuideIds: [77, 78]
  },
  {
    id: "leakDetector",
    name: "Leak Detector",
    description: "Safety device that detects propane leaks.",
    x: 620,
    y: 200,
    width: 100,
    height: 60,
    commonIssues: [
      "False alarms",
      "Failure to detect",
      "Power issues",
      "Sensor failure"
    ],
    relatedPartsIds: [79, 80],
    relatedGuideIds: [79, 80]
  }
];

// Define interface for component props
interface PropaneSystemDiagramProps {
  onPartClick: (partInfo: any) => void;
  highlightedPartId?: string;
  zoom?: number;
  rotation?: number;
}

export default function PropaneSystemDiagram({
  onPartClick,
  highlightedPartId,
  zoom = 1,
  rotation = 0
}: PropaneSystemDiagramProps) {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  
  // Handle click on a propane part
  const handlePartClick = (part: any) => {
    onPartClick(part);
  };
  
  // Render connecting lines between components (propane lines)
  const renderConnectionLines = () => {
    return (
      <g className="connection-lines">
        {/* Tank to regulator */}
        <line x1="410" y1="150" x2="410" y2="200" stroke="#f59e0b" strokeWidth="3" />
        
        {/* Regulator to distribution lines */}
        <line x1="410" y1="260" x2="410" y2="320" stroke="#f59e0b" strokeWidth="3" />
        
        {/* Lines to shut-off valve */}
        <line x1="350" y1="350" x2="230" y2="350" stroke="#f59e0b" strokeWidth="3" />
        
        {/* Lines to auto switchover */}
        <line x1="450" y1="350" x2="520" y2="350" stroke="#f59e0b" strokeWidth="3" />
        
        {/* Distribution to appliances */}
        <line x1="170" y1="380" x2="170" y2="440" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,3" />
        <line x1="310" y1="380" x2="310" y2="440" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,3" />
        <line x1="450" y1="380" x2="450" y2="440" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,3" />
        <line x1="590" y1="380" x2="590" y2="440" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,3" />
        
        {/* Leak detector connections */}
        <path d="M450,230 Q550,230 620,230" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,3" />
      </g>
    );
  };
  
  // Render propane parts as rectangles
  const renderParts = () => {
    return propaneParts.map(part => {
      const isHighlighted = highlightedPartId === part.id;
      const isHovered = hoveredPart === part.id;
      
      // Set different colors based on part type
      let fillColor = '#fef3c7'; // Light yellow/orange for propane components
      if (part.id === 'leakDetector') {
        fillColor = '#fee2e2'; // Light red for safety components
      }
      
      return (
        <TooltipProvider key={part.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <g 
                className={`part ${isHighlighted ? 'highlighted' : ''} ${isHovered ? 'hovered' : ''}`}
                onClick={() => handlePartClick(part)}
                onMouseEnter={() => setHoveredPart(part.id)}
                onMouseLeave={() => setHoveredPart(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={part.x}
                  y={part.y}
                  width={part.width}
                  height={part.height}
                  rx={10}
                  ry={10}
                  fill={isHighlighted ? '#3b82f6' : fillColor}
                  stroke={isHovered ? '#2563eb' : '#9ca3af'}
                  strokeWidth={isHighlighted || isHovered ? 3 : 1.5}
                  className="transition-all duration-200"
                />
                <text
                  x={part.x + part.width / 2}
                  y={part.y + part.height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isHighlighted ? 'white' : 'black'}
                  fontSize={14}
                  fontWeight={isHighlighted ? 'bold' : 'normal'}
                >
                  {part.name}
                </text>
              </g>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="font-medium">{part.name}</p>
              <p className="text-xs max-w-[200px]">{part.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    });
  };
  
  // Render warning icon and message about propane safety
  const renderSafetyWarning = () => {
    return (
      <g transform="translate(20, 80)">
        <polygon 
          points="15,0 30,30 0,30" 
          fill="#fef3c7" 
          stroke="#f59e0b" 
          strokeWidth="2" 
        />
        <text 
          x="15" 
          y="22" 
          textAnchor="middle" 
          fontSize="20" 
          fontWeight="bold" 
          fill="#f59e0b"
        >
          !
        </text>
        <text 
          x="40" 
          y="20" 
          fontSize="12" 
          fontWeight="medium" 
          fill="#111827"
        >
          SAFETY: Always check for propane leaks and ensure proper ventilation
        </text>
      </g>
    );
  };
  
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 800 600"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect width="800" height="600" fill="#ffffff" />
      
      {/* Diagram title */}
      <text
        x="400"
        y="40"
        textAnchor="middle"
        className="font-bold"
        fontSize={20}
        fill="#111827"
      >
        RV Propane System
      </text>
      
      {/* Safety warning */}
      {renderSafetyWarning()}
      
      {/* RV outline silhouette for context */}
      <rect x="100" y="170" width="600" height="300" rx="5" ry="5" fill="none" stroke="#d1d5db" strokeWidth="1" strokeDasharray="5,5" />
      
      {/* Render connecting components */}
      {renderConnectionLines()}
      
      {/* Render each propane part */}
      {renderParts()}
      
      {/* Legend */}
      <g transform="translate(20, 530)">
        <rect x="0" y="0" width="15" height="15" fill="#fef3c7" stroke="#9ca3af" />
        <text x="25" y="12" fontSize={12}>Propane Components</text>
        
        <rect x="170" y="0" width="15" height="15" fill="#fee2e2" stroke="#9ca3af" />
        <text x="195" y="12" fontSize={12}>Safety Components</text>
        
        <line x1="320" y1="7" x2="350" y2="7" stroke="#f59e0b" strokeWidth="3" />
        <text x="360" y="12" fontSize={12}>Main Propane Line</text>
        
        <line x1="490" y1="7" x2="520" y2="7" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,3" />
        <text x="530" y="12" fontSize={12}>Branch Propane Line</text>
        
        <line x1="650" y1="7" x2="680" y2="7" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,3" />
        <text x="690" y="12" fontSize={12}>Detection/Safety</text>
      </g>
    </svg>
  );
}