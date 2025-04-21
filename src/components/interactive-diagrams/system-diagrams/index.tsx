import ElectricalSystemDiagram from "./electrical-system-diagram";
import PlumbingSystemDiagram from "./plumbing-system-diagram";
import HVACSystemDiagram from "./hvac-system-diagram";
import PropaneSystemDiagram from "./propane-system-diagram";
import ChassisSystemDiagram from "./chassis-system-diagram";
import GenericSystemDiagram from "./generic-system-diagram";
import { RvSystem } from "@shared/schema";

// Import any existing diagrams here and add them to the mapping below

type SystemDiagramProps = {
  onPartClick: (partInfo: any) => void;
  highlightedPartId?: string;
  zoom?: number;
  rotation?: number;
  system?: RvSystem;
};

export const SystemDiagrams = {
  electrical: ElectricalSystemDiagram,
  plumbing: PlumbingSystemDiagram,
  hvac: HVACSystemDiagram,
  propane: PropaneSystemDiagram,
  chassis: ChassisSystemDiagram,
  other: (props: SystemDiagramProps) => (
    <GenericSystemDiagram {...props} system="other" />
  )
};

export default SystemDiagrams;