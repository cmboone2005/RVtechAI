import { useState } from "react";
import { RvSystem, RV_SYSTEMS } from "@shared/schema";
import AppShell from "@/components/layout/app-shell";
import InteractiveDiagram from "@/components/interactive-diagrams/interactive-diagram";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

export default function SystemDiagramsPage() {
  const [activeSystem, setActiveSystem] = useState<RvSystem>("electrical");
  const [selectedPartInfo, setSelectedPartInfo] = useState<any | null>(null);
  
  // Handle system tab change
  const handleSystemChange = (value: string) => {
    setActiveSystem(value as RvSystem);
    setSelectedPartInfo(null); // Reset selected part when changing systems
  };
  
  // Handle part selection in the diagram
  const handlePartSelect = (partInfo: any) => {
    setSelectedPartInfo(partInfo);
  };
  
  return (
    <AppShell currentRoute="/system-diagrams">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">RV System Diagrams</CardTitle>
            <CardDescription>
              Interactive diagrams of RV systems to help you understand, diagnose, and repair issues.
              Select different systems using the tabs below and click on components for details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue="electrical" 
              value={activeSystem}
              onValueChange={handleSystemChange}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
                {RV_SYSTEMS.map((system) => (
                  <TabsTrigger 
                    key={system} 
                    value={system}
                    className="capitalize"
                  >
                    {system}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {RV_SYSTEMS.map((system) => (
                <TabsContent key={system} value={system} className="mt-0">
                  <InteractiveDiagram 
                    system={system}
                    onPartSelect={handlePartSelect}
                    highlightedPartId={selectedPartInfo?.id}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Related information card - shows when a part is selected */}
        {selectedPartInfo && (
          <Card>
            <CardHeader>
              <CardTitle>{selectedPartInfo.name}</CardTitle>
              <CardDescription>Component Details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                <p>{selectedPartInfo.description}</p>
              </div>
              
              {selectedPartInfo.commonIssues && selectedPartInfo.commonIssues.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Common Issues</h3>
                  <ul className="list-disc list-inside pl-2 space-y-1">
                    {selectedPartInfo.commonIssues.map((issue: string, index: number) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {selectedPartInfo.relatedGuideIds && selectedPartInfo.relatedGuideIds.length > 0 && (
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Related Repair Guides</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">
                        There are {selectedPartInfo.relatedGuideIds.length} repair guides related to this component. 
                        View the repair guides section for detailed instructions.
                      </p>
                    </CardContent>
                  </Card>
                )}
                
                {selectedPartInfo.relatedPartsIds && selectedPartInfo.relatedPartsIds.length > 0 && (
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Related Parts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">
                        There are {selectedPartInfo.relatedPartsIds.length} parts associated with this component.
                        Check the parts catalog for availability and specifications.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* General information about system diagrams */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use System Diagrams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-3">
              <p>
                These interactive diagrams help you understand how different RV systems work and relate to each other.
                Use them as a reference when troubleshooting issues or planning maintenance.
              </p>
              <p className="font-medium">Tips:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Click on any component to view detailed information about it</li>
                <li>Use the zoom and rotate controls to better view complex diagrams</li>
                <li>The connecting lines show how components relate to each other</li>
                <li>Refer to the color legend at the bottom of each diagram</li>
                <li>Switch between different system tabs to explore all RV systems</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}