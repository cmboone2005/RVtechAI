import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Define part information
const electricalParts = [
  {
    id: "battery",
    name: "Battery Bank",
    description: "Stores electrical energy for use when not connected to shore power.",
    x: 200,
    y: 150,
    width: 120,
    height: 70,
    commonIssues: [
      "Low charge",
      "Sulfation",
      "Dead cells",
      "Corroded terminals",
      "Improper wiring"
    ],
    relatedPartsIds: [1, 2],
    relatedGuideIds: [1, 2]
  },
  {
    id: "converter",
    name: "Converter/Charger",
    description: "Converts 120V AC to 12V DC and charges the battery bank.",
    x: 380,
    y: 150,
    width: 140,
    height: 70,
    commonIssues: [
      "Output voltage too low",
      "Cooling fan failure",
      "Circuit board issues",
      "No charging output"
    ],
    relatedPartsIds: [3, 4],
    relatedGuideIds: [3, 4]
  },
  {
    id: "inverter",
    name: "Inverter",
    description: "Converts 12V DC battery power to 120V AC for running household appliances.",
    x: 580,
    y: 150,
    width: 120,
    height: 70,
    commonIssues: [
      "Overheating",
      "Output fluctuations",
      "Shutdown during high loads",
      "Faulty waveform"
    ],
    relatedPartsIds: [5, 6],
    relatedGuideIds: [5, 6]
  },
  {
    id: "shorepower",
    name: "Shore Power Connection",
    description: "Connection point for external 30A or 50A power source.",
    x: 480,
    y: 50,
    width: 140,
    height: 60,
    commonIssues: [
      "Loose connections",
      "Corroded contacts",
      "Damaged receptacle",
      "Improper grounding"
    ],
    relatedPartsIds: [7, 8],
    relatedGuideIds: [7, 8]
  },
  {
    id: "generator",
    name: "Generator",
    description: "Provides 120V AC power when shore power is unavailable.",
    x: 280,
    y: 50,
    width: 120,
    height: 60,
    commonIssues: [
      "Starting difficulties",
      "Fuel delivery issues",
      "Exhaust problems",
      "Output voltage fluctuations"
    ],
    relatedPartsIds: [9, 10],
    relatedGuideIds: [9, 10]
  },
  {
    id: "fusepanel",
    name: "Fuse/Breaker Panel",
    description: "Distributes and protects electrical circuits.",
    x: 380,
    y: 250,
    width: 140,
    height: 60,
    commonIssues: [
      "Tripped breakers",
      "Blown fuses",
      "Loose connections",
      "Overheating"
    ],
    relatedPartsIds: [11, 12],
    relatedGuideIds: [11, 12]
  },
  {
    id: "12vcircuits",
    name: "12V DC Circuits",
    description: "Low voltage circuits for lights, fans, and RV-specific components.",
    x: 200,
    y: 350,
    width: 120,
    height: 60,
    commonIssues: [
      "Voltage drop",
      "Short circuits",
      "Loose connections",
      "Corroded wiring"
    ],
    relatedPartsIds: [13, 14],
    relatedGuideIds: [13, 14]
  },
  {
    id: "120vcircuits",
    name: "120V AC Circuits",
    description: "Household voltage circuits for outlets and high-power appliances.",
    x: 580,
    y: 350,
    width: 120,
    height: 60,
    commonIssues: [
      "GFCI outlet failures",
      "Loose connections",
      "Improper grounding",
      "Inadequate wire gauge"
    ],
    relatedPartsIds: [15, 16],
    relatedGuideIds: [15, 16]
  },
  {
    id: "transferswitch",
    name: "Transfer Switch",
    description: "Automatically switches between different power sources.",
    x: 380,
    y: 350,
    width: 140,
    height: 60,
    commonIssues: [
      "Failure to switch",
      "Contact arcing",
      "Relay failure",
      "Control board issues"
    ],
    relatedPartsIds: [17, 18],
    relatedGuideIds: [17, 18]
  },
  {
    id: "solarpanel",
    name: "Solar Panel System",
    description: "Converts sunlight to DC electricity for battery charging.",
    x: 100,
    y: 50,
    width: 120,
    height: 60,
    commonIssues: [
      "Low output",
      "Charge controller failure",
      "Panel damage",
      "Wiring issues"
    ],
    relatedPartsIds: [19, 20],
    relatedGuideIds: [19, 20]
  }
];

// Define interface for component props
interface ElectricalSystemDiagramProps {
  onPartClick: (partInfo: any) => void;
  highlightedPartId?: string;
  zoom?: number;
  rotation?: number;
}

export default function ElectricalSystemDiagram({
  onPartClick,
  highlightedPartId,
  zoom = 1,
  rotation = 0
}: ElectricalSystemDiagramProps) {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  
  // Handle click on an electrical component
  const handlePartClick = (part: any) => {
    onPartClick(part);
  };
  
  // Render connecting lines between components (wiring)
  const renderConnectionLines = () => {
    return (
      <g className="connection-lines">
        {/* Shore Power to Transfer Switch */}
        <path d="M550,110 L550,250 L450,350" fill="none" stroke="#ef4444" strokeWidth="3" />
        
        {/* Generator to Transfer Switch */}
        <path d="M330,110 L330,250 L350,350" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="5,3" />
        
        {/* Solar Panel to Battery */}
        <line x1="160" y1="110" x2="200" y2="150" stroke="#f59e0b" strokeWidth="2" />
        
        {/* Battery to Converter */}
        <line x1="320" y1="180" x2="380" y2="180" stroke="#f59e0b" strokeWidth="3" />
        
        {/* Converter to Inverter */}
        <line x1="520" y1="180" x2="580" y2="180" stroke="#f59e0b" strokeWidth="3" />
        
        {/* Battery to Fuse Panel */}
        <line x1="260" y1="220" x2="380" y2="250" stroke="#f59e0b" strokeWidth="3" />
        
        {/* Inverter to Fuse Panel */}
        <line x1="600" y1="220" x2="450" y2="250" stroke="#ef4444" strokeWidth="2" />
        
        {/* Fuse Panel to 12V Circuits */}
        <line x1="380" y1="310" x2="320" y2="350" stroke="#f59e0b" strokeWidth="3" />
        
        {/* Fuse Panel to 120V Circuits (via transfer switch) */}
        <path d="M450,310 L450,350" fill="none" stroke="#ef4444" strokeWidth="2" />
        
        {/* Transfer Switch to 120V Circuits */}
        <line x1="520" y1="380" x2="580" y2="380" stroke="#ef4444" strokeWidth="3" />
      </g>
    );
  };
  
  // Render electrical parts as rectangles
  const renderParts = () => {
    return electricalParts.map(part => {
      const isHighlighted = highlightedPartId === part.id;
      const isHovered = hoveredPart === part.id;
      
      // Set different colors based on part type
      let fillColor = '#f3f4f6';
      if (part.id === 'battery' || part.id === '12vcircuits' || part.id === 'solarpanel') {
        fillColor = '#fff7ed'; // Light orange for DC components
      } else if (part.id === 'shorepower' || part.id === 'generator' || part.id === '120vcircuits') {
        fillColor = '#fee2e2'; // Light red for AC power
      } else if (part.id === 'converter' || part.id === 'inverter' || part.id === 'transferswitch') {
        fillColor = '#f0fdf4'; // Light green for power conversion
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
      viewBox="0 0 800 500"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect width="800" height="500" fill="#ffffff" />
      
      {/* Diagram title */}
      <text
        x="400"
        y="30"
        textAnchor="middle"
        className="font-bold"
        fontSize={20}
        fill="#111827"
      >
        RV Electrical System
      </text>
      
      {/* Render wiring connections */}
      {renderConnectionLines()}
      
      {/* Render each electrical part */}
      {renderParts()}
      
      {/* Legend */}
      <g transform="translate(20, 450)">
        <rect x="0" y="0" width="15" height="15" fill="#fff7ed" stroke="#9ca3af" />
        <text x="25" y="12" fontSize={12}>12V DC Components</text>
        
        <rect x="170" y="0" width="15" height="15" fill="#fee2e2" stroke="#9ca3af" />
        <text x="195" y="12" fontSize={12}>120V AC Components</text>
        
        <rect x="350" y="0" width="15" height="15" fill="#f0fdf4" stroke="#9ca3af" />
        <text x="375" y="12" fontSize={12}>Power Conversion</text>
        
        <line x1="480" y1="7" x2="510" y2="7" stroke="#f59e0b" strokeWidth="3" />
        <text x="520" y="12" fontSize={12}>12V DC Wiring</text>
        
        <line x1="620" y1="7" x2="650" y2="7" stroke="#ef4444" strokeWidth="3" />
        <text x="660" y="12" fontSize={12}>120V AC Wiring</text>
      </g>
    </svg>
  );
}