import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Define part information
const chassisParts = [
  {
    id: "frame",
    name: "Frame/Chassis",
    description: "The main structural support for the entire RV.",
    x: 100,
    y: 200,
    width: 600,
    height: 40,
    commonIssues: [
      "Rust and corrosion",
      "Structural cracks",
      "Bent frame rails",
      "Loose crossmembers"
    ],
    relatedPartsIds: [81, 82],
    relatedGuideIds: [81, 82]
  },
  {
    id: "suspension",
    name: "Suspension System",
    description: "Springs, shocks, and other components that support the RV and provide a smoother ride.",
    x: 180,
    y: 280,
    width: 140,
    height: 60,
    commonIssues: [
      "Worn leaf springs",
      "Shock absorber leaks",
      "Broken shackles",
      "Axle misalignment"
    ],
    relatedPartsIds: [83, 84],
    relatedGuideIds: [83, 84]
  },
  {
    id: "brakes",
    name: "Brake System",
    description: "Braking components for safe stopping, including brake controller integration.",
    x: 480,
    y: 280,
    width: 120,
    height: 60,
    commonIssues: [
      "Worn brake pads/shoes",
      "Warped rotors/drums",
      "Air in brake lines",
      "Controller issues"
    ],
    relatedPartsIds: [85, 86],
    relatedGuideIds: [85, 86]
  },
  {
    id: "wheels",
    name: "Wheels & Tires",
    description: "Wheels and tires that provide contact with the road and support the RV weight.",
    x: 180,
    y: 380,
    width: 120,
    height: 60,
    commonIssues: [
      "Tire wear or damage",
      "Improper inflation",
      "Wheel bearing failure",
      "Lug nut torque issues"
    ],
    relatedPartsIds: [87, 88],
    relatedGuideIds: [87, 88]
  },
  {
    id: "axles",
    name: "Axles",
    description: "Support the RV weight and connect to the wheels.",
    x: 350,
    y: 380,
    width: 100,
    height: 60,
    commonIssues: [
      "Bent axles",
      "Spindle damage",
      "Bearing failure",
      "Axle separation"
    ],
    relatedPartsIds: [89, 90],
    relatedGuideIds: [89, 90]
  },
  {
    id: "hitch",
    name: "Hitch System",
    description: "For towable RVs, connects the RV to the tow vehicle.",
    x: 480,
    y: 380,
    width: 120,
    height: 60,
    commonIssues: [
      "Hitch ball wear",
      "Weight distribution issues",
      "Sway control problems",
      "Coupler damage"
    ],
    relatedPartsIds: [91, 92],
    relatedGuideIds: [91, 92]
  },
  {
    id: "leveling",
    name: "Leveling System",
    description: "Hydraulic or electric jacks for leveling the RV when parked.",
    x: 180,
    y: 480,
    width: 120,
    height: 60,
    commonIssues: [
      "Hydraulic leaks",
      "Jack failure",
      "Control panel issues",
      "Uneven operation"
    ],
    relatedPartsIds: [93, 94],
    relatedGuideIds: [93, 94]
  },
  {
    id: "slideouts",
    name: "Slide-Out System",
    description: "Mechanism for extending and retracting slide-out rooms.",
    x: 350,
    y: 120,
    width: 120,
    height: 60,
    commonIssues: [
      "Motor failure",
      "Hydraulic leaks",
      "Misalignment",
      "Slide seal damage"
    ],
    relatedPartsIds: [95, 96],
    relatedGuideIds: [95, 96]
  },
  {
    id: "steering",
    name: "Steering Components",
    description: "For motorized RVs, the components that control direction.",
    x: 350,
    y: 480,
    width: 140,
    height: 60,
    commonIssues: [
      "Loose steering",
      "Power steering issues",
      "Worn tie rods",
      "Alignment problems"
    ],
    relatedPartsIds: [97, 98],
    relatedGuideIds: [97, 98]
  },
  {
    id: "engine",
    name: "Engine & Drivetrain",
    description: "For motorized RVs, the engine and related components.",
    x: 530,
    y: 480,
    width: 140,
    height: 60,
    commonIssues: [
      "Starting issues",
      "Fluid leaks",
      "Belt failures",
      "Transmission problems"
    ],
    relatedPartsIds: [99, 100],
    relatedGuideIds: [99, 100]
  }
];

// Define interface for component props
interface ChassisSystemDiagramProps {
  onPartClick: (partInfo: any) => void;
  highlightedPartId?: string;
  zoom?: number;
  rotation?: number;
}

export default function ChassisSystemDiagram({
  onPartClick,
  highlightedPartId,
  zoom = 1,
  rotation = 0
}: ChassisSystemDiagramProps) {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  
  // Handle click on a chassis part
  const handlePartClick = (part: any) => {
    onPartClick(part);
  };
  
  // Render connecting lines between components
  const renderConnectionLines = () => {
    return (
      <g className="connection-lines">
        {/* Frame to slideouts */}
        <line x1="400" y1="180" x2="400" y2="200" stroke="#64748b" strokeWidth="3" />
        
        {/* Frame to suspension */}
        <line x1="250" y1="240" x2="250" y2="280" stroke="#64748b" strokeWidth="3" />
        
        {/* Frame to brakes */}
        <line x1="540" y1="240" x2="540" y2="280" stroke="#64748b" strokeWidth="3" />
        
        {/* Suspension to wheels */}
        <line x1="250" y1="340" x2="250" y2="380" stroke="#64748b" strokeWidth="2" />
        
        {/* Brakes to wheels (via axles) */}
        <path d="M540,340 Q400,360 400,380" fill="none" stroke="#64748b" strokeWidth="2" />
        
        {/* Leveling system to frame */}
        <path d="M240,480 V450 H250 V240" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,3" />
        
        {/* Steering to frame */}
        <path d="M400,480 V450 H400 V240" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,3" />
        
        {/* Engine to frame */}
        <path d="M600,480 V450 H600 V240" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,3" />
        
        {/* Hitch to frame */}
        <path d="M540,380 V350 H540 V240" fill="none" stroke="#64748b" strokeWidth="2" />
      </g>
    );
  };
  
  // Render chassis parts as rectangles
  const renderParts = () => {
    return chassisParts.map(part => {
      const isHighlighted = highlightedPartId === part.id;
      const isHovered = hoveredPart === part.id;
      
      // Set different colors based on part type
      let fillColor = '#f3f4f6'; // Default light gray
      if (part.id === 'frame') {
        fillColor = '#e2e8f0'; // Darker gray for frame
      } else if (part.id === 'engine') {
        fillColor = '#fee2e2'; // Light red for engine
      } else if (part.id === 'suspension' || part.id === 'brakes' || part.id === 'wheels' || part.id === 'axles') {
        fillColor = '#cbd5e1'; // Medium gray for major mechanical components
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
  
  // Simple RV silhouette for context
  const renderRVSilhouette = () => {
    return (
      <g>
        {/* RV body outline */}
        <rect x="120" y="100" width="560" height="90" rx="5" ry="5" fill="none" stroke="#d1d5db" strokeWidth="1" strokeDasharray="3,3" />
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
        RV Chassis System
      </text>
      
      {/* RV silhouette */}
      {renderRVSilhouette()}
      
      {/* Render connecting components */}
      {renderConnectionLines()}
      
      {/* Render each chassis part */}
      {renderParts()}
      
      {/* Legend */}
      <g transform="translate(20, 530)">
        <rect x="0" y="0" width="15" height="15" fill="#e2e8f0" stroke="#9ca3af" />
        <text x="25" y="12" fontSize={12}>Frame/Structure</text>
        
        <rect x="160" y="0" width="15" height="15" fill="#cbd5e1" stroke="#9ca3af" />
        <text x="185" y="12" fontSize={12}>Mechanical Components</text>
        
        <rect x="350" y="0" width="15" height="15" fill="#fee2e2" stroke="#9ca3af" />
        <text x="375" y="12" fontSize={12}>Engine Components</text>
        
        <line x1="480" y1="7" x2="510" y2="7" stroke="#64748b" strokeWidth="3" />
        <text x="520" y="12" fontSize={12}>Primary Connection</text>
        
        <line x1="650" y1="7" x2="680" y2="7" stroke="#64748b" strokeWidth="2" strokeDasharray="5,3" />
        <text x="690" y="12" fontSize={12}>Secondary Connection</text>
      </g>
    </svg>
  );
}