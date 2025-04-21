import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Define part information
const hvacParts = [
  {
    id: "roofAC",
    name: "Roof Air Conditioner",
    description: "Cools the RV by removing heat from the interior air. Usually mounted on the roof.",
    x: 350,
    y: 80,
    width: 140,
    height: 70,
    commonIssues: [
      "Insufficient cooling",
      "Fan not operating",
      "Freezing up",
      "Circuit breaker tripping",
      "Water leaks into RV"
    ],
    relatedPartsIds: [41, 42],
    relatedGuideIds: [41, 42]
  },
  {
    id: "furnace",
    name: "Propane Furnace",
    description: "Heats the RV using propane fuel. Includes a blower motor to distribute warm air.",
    x: 180,
    y: 200,
    width: 120,
    height: 70,
    commonIssues: [
      "Blower running but no heat",
      "Won't ignite",
      "Cycling on and off",
      "Loud operation",
      "No blower operation"
    ],
    relatedPartsIds: [43, 44],
    relatedGuideIds: [43, 44]
  },
  {
    id: "thermostat",
    name: "Thermostat",
    description: "Controls the operation of the air conditioning and heating systems.",
    x: 350,
    y: 200,
    width: 100,
    height: 60,
    commonIssues: [
      "Display not working",
      "Incorrect temperature reading",
      "No response to adjustments",
      "Battery failure",
      "Wiring issues"
    ],
    relatedPartsIds: [45, 46],
    relatedGuideIds: [45, 46]
  },
  {
    id: "heatPump",
    name: "Heat Pump",
    description: "Some AC units can also function as heat pumps for more efficient heating in mild weather.",
    x: 500,
    y: 200,
    width: 120,
    height: 70,
    commonIssues: [
      "Limited heating in cold weather",
      "Fan operation but no heat",
      "Noisy operation",
      "Defrost issues"
    ],
    relatedPartsIds: [47, 48],
    relatedGuideIds: [47, 48]
  },
  {
    id: "ductwork",
    name: "Ductwork & Vents",
    description: "Distributes heated or cooled air throughout the RV.",
    x: 350,
    y: 320,
    width: 130,
    height: 60,
    commonIssues: [
      "Airflow restrictions",
      "Disconnected ducts",
      "Damaged vents",
      "Air leaks",
      "Uneven heating/cooling"
    ],
    relatedPartsIds: [49, 50],
    relatedGuideIds: [49, 50]
  },
  {
    id: "returnAir",
    name: "Return Air Grille",
    description: "Intake vent that draws air from the RV into the HVAC system for conditioning.",
    x: 180,
    y: 320,
    width: 120,
    height: 60,
    commonIssues: [
      "Clogged filter",
      "Restricted airflow",
      "Loose grille",
      "Damaged filter frame"
    ],
    relatedPartsIds: [51, 52],
    relatedGuideIds: [51, 52]
  },
  {
    id: "fanVents",
    name: "Roof Fan Vents",
    description: "Ventilation fans that help circulate air and remove humidity.",
    x: 500,
    y: 320,
    width: 120,
    height: 60,
    commonIssues: [
      "Fan not operating",
      "Vent lid won't open",
      "Water leaks",
      "Motor failure"
    ],
    relatedPartsIds: [53, 54],
    relatedGuideIds: [53, 54]
  },
  {
    id: "propaneTank",
    name: "Propane Tank",
    description: "Supplies fuel to the furnace and other propane appliances.",
    x: 180,
    y: 440,
    width: 120,
    height: 60,
    commonIssues: [
      "Empty tank",
      "Regulator failure",
      "Leaking connections",
      "Tank valve issues"
    ],
    relatedPartsIds: [55, 56],
    relatedGuideIds: [55, 56]
  },
  {
    id: "acThermalCover",
    name: "AC Thermal Cover",
    description: "Insulates the AC unit when not in use during cold weather.",
    x: 350,
    y: 440,
    width: 130,
    height: 60,
    commonIssues: [
      "Torn material",
      "Poor fit",
      "Missing straps",
      "Water pooling"
    ],
    relatedPartsIds: [57, 58],
    relatedGuideIds: [57, 58]
  },
  {
    id: "electricHeaters",
    name: "Electric Heaters",
    description: "Supplemental heating using 120V AC power.",
    x: 500,
    y: 440,
    width: 120,
    height: 60,
    commonIssues: [
      "Overheating protection tripping",
      "No heat output",
      "Tripping circuit breakers",
      "Thermostat failure"
    ],
    relatedPartsIds: [59, 60],
    relatedGuideIds: [59, 60]
  }
];

// Define interface for component props
interface HVACSystemDiagramProps {
  onPartClick: (partInfo: any) => void;
  highlightedPartId?: string;
  zoom?: number;
  rotation?: number;
}

export default function HVACSystemDiagram({
  onPartClick,
  highlightedPartId,
  zoom = 1,
  rotation = 0
}: HVACSystemDiagramProps) {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  
  // Handle click on an HVAC part
  const handlePartClick = (part: any) => {
    onPartClick(part);
  };
  
  // Render connecting lines between components (airflow and ducting)
  const renderConnectionLines = () => {
    return (
      <g className="connection-lines">
        {/* Roof AC to Thermostat */}
        <line x1="400" y1="150" x2="400" y2="200" stroke="#0ea5e9" strokeWidth="3" />
        
        {/* Furnace to Thermostat */}
        <line x1="300" y1="230" x2="350" y2="230" stroke="#f59e0b" strokeWidth="3" />
        
        {/* Heat Pump to Thermostat */}
        <line x1="500" y1="230" x2="450" y2="230" stroke="#0ea5e9" strokeWidth="3" />
        
        {/* Thermostat to Ductwork */}
        <line x1="400" y1="260" x2="400" y2="320" stroke="#64748b" strokeWidth="3" />
        
        {/* Ductwork to various locations - cooled air distribution */}
        <path d="M350,350 H180 V320" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="5,3" />
        <path d="M480,350 H550 V320" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="5,3" />
        
        {/* Return air to Roof AC (air return) */}
        <path d="M240,320 V170 H350" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,3" />
        
        {/* Propane tank to furnace */}
        <line x1="240" y1="440" x2="240" y2="270" stroke="#f59e0b" strokeWidth="3" />
        
        {/* Thermal cover to roof AC (seasonal connection) */}
        <path d="M415,440 V380 H415 V150" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="3,3" />
        
        {/* Electric heaters to ductwork (alternative heat) */}
        <path d="M560,440 V380 H480 V350" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,3" />
      </g>
    );
  };
  
  // Render HVAC parts as rectangles
  const renderParts = () => {
    return hvacParts.map(part => {
      const isHighlighted = highlightedPartId === part.id;
      const isHovered = hoveredPart === part.id;
      
      // Set different colors based on part type
      let fillColor = '#f3f4f6';
      if (part.id === 'roofAC' || part.id === 'heatPump') {
        fillColor = '#e0f2fe'; // Light blue for cooling components
      } else if (part.id === 'furnace' || part.id === 'propaneTank') {
        fillColor = '#fef3c7'; // Light yellow/orange for heating components
      } else if (part.id === 'ductwork' || part.id === 'returnAir') {
        fillColor = '#f1f5f9'; // Light grey for air distribution
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
        RV HVAC System
      </text>
      
      {/* RV outline silhouette for context */}
      <rect x="120" y="120" width="560" height="280" rx="5" ry="5" fill="none" stroke="#d1d5db" strokeWidth="1" strokeDasharray="5,5" />
      <path d="M340,120 L460,80 L580,120" fill="none" stroke="#d1d5db" strokeWidth="1" strokeDasharray="5,5" />
      
      {/* Render connecting components */}
      {renderConnectionLines()}
      
      {/* Render each HVAC part */}
      {renderParts()}
      
      {/* Legend */}
      <g transform="translate(20, 530)">
        <rect x="0" y="0" width="15" height="15" fill="#e0f2fe" stroke="#9ca3af" />
        <text x="25" y="12" fontSize={12}>Cooling Components</text>
        
        <rect x="170" y="0" width="15" height="15" fill="#fef3c7" stroke="#9ca3af" />
        <text x="195" y="12" fontSize={12}>Heating Components</text>
        
        <rect x="350" y="0" width="15" height="15" fill="#f1f5f9" stroke="#9ca3af" />
        <text x="375" y="12" fontSize={12}>Air Distribution</text>
        
        <line x1="490" y1="7" x2="510" y2="7" stroke="#0ea5e9" strokeWidth="3" />
        <text x="520" y="12" fontSize={12}>Cool Air</text>
        
        <line x1="580" y1="7" x2="600" y2="7" stroke="#f59e0b" strokeWidth="3" />
        <text x="610" y="12" fontSize={12}>Heating/Propane</text>
        
        <line x1="690" y1="7" x2="710" y2="7" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,3" />
        <text x="720" y="12" fontSize={12}>Air Return</text>
      </g>
    </svg>
  );
}