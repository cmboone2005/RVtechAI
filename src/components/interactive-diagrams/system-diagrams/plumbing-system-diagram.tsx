import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Define part information
const plumbingParts = [
  {
    id: "freshWaterTank",
    name: "Fresh Water Tank",
    description: "Stores clean potable water for drinking, washing, and other uses.",
    x: 100,
    y: 150,
    width: 120,
    height: 70,
    commonIssues: [
      "Leaks",
      "Contamination",
      "Poor water quality",
      "Cracking"
    ],
    relatedPartsIds: [21, 22],
    relatedGuideIds: [21, 22]
  },
  {
    id: "waterPump",
    name: "Water Pump",
    description: "Pressurizes the water system for use when not connected to city water.",
    x: 300,
    y: 150,
    width: 100,
    height: 60,
    commonIssues: [
      "Fails to prime",
      "Runs continuously",
      "Noisy operation",
      "Pulsating flow"
    ],
    relatedPartsIds: [23, 24],
    relatedGuideIds: [23, 24]
  },
  {
    id: "waterHeater",
    name: "Water Heater",
    description: "Heats water for showers, washing, and other uses. Can run on propane or electricity.",
    x: 500,
    y: 150,
    width: 120,
    height: 70,
    commonIssues: [
      "No hot water",
      "Pilot light won't stay lit",
      "Heating element failure",
      "Temperature fluctuations"
    ],
    relatedPartsIds: [25, 26],
    relatedGuideIds: [25, 26]
  },
  {
    id: "cityWaterConnection",
    name: "City Water Connection",
    description: "Connection for pressurized water at campgrounds or RV parks.",
    x: 100,
    y: 300,
    width: 120,
    height: 60,
    commonIssues: [
      "Leaks at connection",
      "Damaged seal",
      "Check valve failure",
      "Backflow issues"
    ],
    relatedPartsIds: [27, 28],
    relatedGuideIds: [27, 28]
  },
  {
    id: "waterFilter",
    name: "Water Filter",
    description: "Filters sediment and contaminants from incoming water.",
    x: 300,
    y: 300,
    width: 100,
    height: 60,
    commonIssues: [
      "Clogged filter",
      "Reduced flow",
      "Housing cracks",
      "Seal failure"
    ],
    relatedPartsIds: [29, 30],
    relatedGuideIds: [29, 30]
  },
  {
    id: "plumbingFixtures",
    name: "Plumbing Fixtures",
    description: "Faucets, shower heads, and other fixtures that deliver water.",
    x: 500,
    y: 300,
    width: 120,
    height: 60,
    commonIssues: [
      "Leaking faucets",
      "Low water pressure",
      "Clogged aerators",
      "Handle issues"
    ],
    relatedPartsIds: [31, 32],
    relatedGuideIds: [31, 32]
  },
  {
    id: "greyWaterTank",
    name: "Grey Water Tank",
    description: "Collects waste water from sinks and showers.",
    x: 100,
    y: 450,
    width: 120,
    height: 70,
    commonIssues: [
      "Sensor failure",
      "Odors",
      "Leaks",
      "Slow draining"
    ],
    relatedPartsIds: [33, 34],
    relatedGuideIds: [33, 34]
  },
  {
    id: "blackWaterTank",
    name: "Black Water Tank",
    description: "Collects waste from the toilet.",
    x: 300,
    y: 450,
    width: 120,
    height: 70,
    commonIssues: [
      "Sensor failure",
      "Blockages",
      "Odors",
      "Valve problems"
    ],
    relatedPartsIds: [35, 36],
    relatedGuideIds: [35, 36]
  },
  {
    id: "dumpValves",
    name: "Dump Valves",
    description: "Valves for emptying the grey and black water tanks.",
    x: 500,
    y: 450,
    width: 120,
    height: 60,
    commonIssues: [
      "Valve leaks",
      "Broken handle",
      "Stuck valve",
      "Seal failure"
    ],
    relatedPartsIds: [37, 38],
    relatedGuideIds: [37, 38]
  }
];

// Define interface for component props
interface PlumbingSystemDiagramProps {
  onPartClick: (partInfo: any) => void;
  highlightedPartId?: string;
  zoom?: number;
  rotation?: number;
}

export default function PlumbingSystemDiagram({
  onPartClick,
  highlightedPartId,
  zoom = 1,
  rotation = 0
}: PlumbingSystemDiagramProps) {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  
  // Handle click on a plumbing part
  const handlePartClick = (part: any) => {
    onPartClick(part);
  };
  
  // Render connecting lines between components (pipes)
  const renderConnectionLines = () => {
    return (
      <g className="connection-lines">
        {/* Fresh water tank to Water pump */}
        <line x1="220" y1="180" x2="300" y2="180" stroke="#3b82f6" strokeWidth="3" />
        
        {/* Water pump to water heater */}
        <line x1="400" y1="180" x2="500" y2="180" stroke="#3b82f6" strokeWidth="3" />
        
        {/* City water connection to water filter */}
        <line x1="220" y1="330" x2="300" y2="330" stroke="#3b82f6" strokeWidth="3" />
        
        {/* Water filter to plumbing fixtures */}
        <line x1="400" y1="330" x2="500" y2="330" stroke="#3b82f6" strokeWidth="3" />
        
        {/* Water heater to plumbing fixtures */}
        <line x1="560" y1="220" x2="560" y2="300" stroke="#3b82f6" strokeWidth="3" />
        
        {/* Plumbing fixtures to grey water tank (drain) */}
        <path d="M500,330 Q350,380 220,450" fill="none" stroke="#94a3b8" strokeWidth="3" />
        
        {/* Plumbing fixtures to black water tank (toilet) */}
        <path d="M560,360 Q480,400 420,450" fill="none" stroke="#1e293b" strokeWidth="3" />
        
        {/* Grey water tank to dump valves */}
        <line x1="220" y1="480" x2="500" y2="480" stroke="#94a3b8" strokeWidth="3" />
        
        {/* Black water tank to dump valves */}
        <line x1="420" y1="485" x2="500" y2="485" stroke="#1e293b" strokeWidth="3" />
      </g>
    );
  };
  
  // Render plumbing parts as rectangles
  const renderParts = () => {
    return plumbingParts.map(part => {
      const isHighlighted = highlightedPartId === part.id;
      const isHovered = hoveredPart === part.id;
      
      // Set different colors based on part type
      let fillColor = '#f3f4f6';
      if (part.id.includes('fresh') || part.id.includes('city') || part.id === 'waterPump' || part.id === 'waterFilter') {
        fillColor = '#dbeafe'; // Light blue for fresh water
      } else if (part.id.includes('grey')) {
        fillColor = '#f1f5f9'; // Light grey for grey water
      } else if (part.id.includes('black')) {
        fillColor = '#e2e8f0'; // Darker grey for black water
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
        RV Plumbing System
      </text>
      
      {/* Render pipes connecting components */}
      {renderConnectionLines()}
      
      {/* Render each plumbing part */}
      {renderParts()}
      
      {/* Legend */}
      <g transform="translate(20, 530)">
        <rect x="0" y="0" width="15" height="15" fill="#dbeafe" stroke="#9ca3af" />
        <text x="25" y="12" fontSize={12}>Fresh Water</text>
        
        <rect x="120" y="0" width="15" height="15" fill="#f1f5f9" stroke="#9ca3af" />
        <text x="145" y="12" fontSize={12}>Grey Water</text>
        
        <rect x="240" y="0" width="15" height="15" fill="#e2e8f0" stroke="#9ca3af" />
        <text x="265" y="12" fontSize={12}>Black Water</text>
        
        <line x1="350" y1="7" x2="380" y2="7" stroke="#3b82f6" strokeWidth="3" />
        <text x="390" y="12" fontSize={12}>Fresh Water Pipe</text>
        
        <line x1="500" y1="7" x2="530" y2="7" stroke="#94a3b8" strokeWidth="3" />
        <text x="540" y="12" fontSize={12}>Grey Water Pipe</text>
        
        <line x1="650" y1="7" x2="680" y2="7" stroke="#1e293b" strokeWidth="3" />
        <text x="690" y="12" fontSize={12}>Black Water Pipe</text>
      </g>
    </svg>
  );
}