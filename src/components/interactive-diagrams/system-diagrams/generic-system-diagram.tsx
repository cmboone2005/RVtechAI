import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RvSystem } from "@shared/schema";

// Define interface for component props
interface GenericSystemDiagramProps {
  onPartClick: (partInfo: any) => void;
  highlightedPartId?: string;
  zoom?: number;
  rotation?: number;
  system: RvSystem;
}

export default function GenericSystemDiagram({
  onPartClick,
  highlightedPartId,
  zoom = 1,
  rotation = 0,
  system
}: GenericSystemDiagramProps) {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  
  // Generic parts to show when a specific diagram is not available
  const genericParts = [
    {
      id: "mainComponent",
      name: "Main Component",
      description: `Primary component of the ${system} system.`,
      x: 350,
      y: 150,
      width: 120,
      height: 70,
      commonIssues: [
        "Component failure",
        "Wear and tear",
        "Improper operation"
      ],
      relatedPartsIds: [101, 102],
      relatedGuideIds: [101, 102]
    },
    {
      id: "secondaryComponent1",
      name: "Secondary Component 1",
      description: `Supporting component for the ${system} system.`,
      x: 200,
      y: 280,
      width: 140,
      height: 60,
      commonIssues: [
        "Connection issues",
        "Performance degradation",
        "Physical damage"
      ],
      relatedPartsIds: [103, 104],
      relatedGuideIds: [103, 104]
    },
    {
      id: "secondaryComponent2",
      name: "Secondary Component 2",
      description: `Additional supporting component for the ${system} system.`,
      x: 480,
      y: 280,
      width: 140,
      height: 60,
      commonIssues: [
        "Calibration issues",
        "Sensor failure",
        "Operational inconsistency"
      ],
      relatedPartsIds: [105, 106],
      relatedGuideIds: [105, 106]
    },
    {
      id: "tertiaryComponent1",
      name: "Tertiary Component 1",
      description: `Additional component that supports the ${system} system functionality.`,
      x: 200,
      y: 400,
      width: 140,
      height: 60,
      commonIssues: [
        "Corrosion",
        "Loose connections",
        "Environmental damage"
      ],
      relatedPartsIds: [107, 108],
      relatedGuideIds: [107, 108]
    },
    {
      id: "tertiaryComponent2",
      name: "Tertiary Component 2",
      description: `Supplementary component for the ${system} system.`,
      x: 480,
      y: 400,
      width: 140,
      height: 60,
      commonIssues: [
        "Mechanical failure",
        "Adjustment issues",
        "Compatibility problems"
      ],
      relatedPartsIds: [109, 110],
      relatedGuideIds: [109, 110]
    }
  ];
  
  // Handle click on a generic part
  const handlePartClick = (part: any) => {
    onPartClick(part);
  };
  
  // Render connecting lines between components
  const renderConnectionLines = () => {
    return (
      <g className="connection-lines">
        {/* Main to secondary 1 */}
        <line x1="350" y1="185" x2="270" y2="280" stroke="#64748b" strokeWidth="2" />
        
        {/* Main to secondary 2 */}
        <line x1="470" y1="185" x2="550" y2="280" stroke="#64748b" strokeWidth="2" />
        
        {/* Secondary 1 to tertiary 1 */}
        <line x1="270" y1="340" x2="270" y2="400" stroke="#64748b" strokeWidth="2" strokeDasharray="4,2" />
        
        {/* Secondary 2 to tertiary 2 */}
        <line x1="550" y1="340" x2="550" y2="400" stroke="#64748b" strokeWidth="2" strokeDasharray="4,2" />
        
        {/* Connecting tertiaries */}
        <path d="M340,430 H480" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="1,3" />
      </g>
    );
  };
  
  // Render generic parts as rectangles
  const renderParts = () => {
    return genericParts.map(part => {
      const isHighlighted = highlightedPartId === part.id;
      const isHovered = hoveredPart === part.id;
      
      // Set different colors based on part type
      let fillColor = '#f8fafc'; // Default light color
      if (part.id === 'mainComponent') {
        fillColor = '#e0f2fe'; // Light blue for main component
      } else if (part.id.includes('secondary')) {
        fillColor = '#f1f5f9'; // Light slate for secondary components
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
        {system.charAt(0).toUpperCase() + system.slice(1)} System - Generic Diagram
      </text>
      
      {/* Information text */}
      <text
        x="400"
        y="80"
        textAnchor="middle"
        fontSize={14}
        fill="#6b7280"
      >
        This is a generic representation. Specific diagram not available.
      </text>
      
      {/* Render connecting components */}
      {renderConnectionLines()}
      
      {/* Render each generic part */}
      {renderParts()}
      
      {/* Legend */}
      <g transform="translate(20, 530)">
        <rect x="0" y="0" width="15" height="15" fill="#e0f2fe" stroke="#9ca3af" />
        <text x="25" y="12" fontSize={12}>Main Component</text>
        
        <rect x="150" y="0" width="15" height="15" fill="#f1f5f9" stroke="#9ca3af" />
        <text x="175" y="12" fontSize={12}>Secondary Component</text>
        
        <rect x="350" y="0" width="15" height="15" fill="#f8fafc" stroke="#9ca3af" />
        <text x="375" y="12" fontSize={12}>Tertiary Component</text>
        
        <line x1="480" y1="7" x2="510" y2="7" stroke="#64748b" strokeWidth="2" />
        <text x="520" y="12" fontSize={12}>Primary Connection</text>
        
        <line x1="620" y1="7" x2="650" y2="7" stroke="#64748b" strokeWidth="2" strokeDasharray="4,2" />
        <text x="660" y="12" fontSize={12}>Secondary Connection</text>
      </g>
    </svg>
  );
}