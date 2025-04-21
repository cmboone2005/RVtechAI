import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Save, Share2 } from "lucide-react";
import ChatInterface from "./chat-interface";
import { Link } from "wouter";

interface DiagnosticResultsProps {
  diagnostic: any;
  rvMake: string;
  rvModel: string;
  rvYear: number;
  onSaveToHistory: () => void;
}

export default function DiagnosticResults({ 
  diagnostic, 
  rvMake,
  rvModel,
  rvYear,
  onSaveToHistory 
}: DiagnosticResultsProps) {
  const [shareSupported, setShareSupported] = useState(false);
  
  // Check if Web Share API is supported
  useEffect(() => {
    setShareSupported(!!navigator.share);
  }, []);
  
  // Fetch repair guides
  const { data: guides = [] } = useQuery({
    queryKey: ["/api/repair-guides"],
    queryFn: async ({ queryKey }) => {
      try {
        return await fetch(queryKey[0].toString()).then(res => res.json());
      } catch (error) {
        console.error("Failed to fetch guides:", error);
        return [];
      }
    }
  });
  
  // Fetch parts
  const { data: parts = [] } = useQuery({
    queryKey: ["/api/parts"],
    queryFn: async ({ queryKey }) => {
      try {
        return await fetch(queryKey[0].toString()).then(res => res.json());
      } catch (error) {
        console.error("Failed to fetch parts:", error);
        return [];
      }
    }
  });
  
  // Get related guides and parts based on AI analysis
  const getRelatedGuides = () => {
    if (!diagnostic.aiAnalysis || !diagnostic.aiAnalysis.relatedGuides) return [];
    return diagnostic.aiAnalysis.relatedGuides
      .map((guideId: number) => guides.find((g: any) => g.id === guideId))
      .filter(Boolean);
  };
  
  const getSuggestedParts = () => {
    if (!diagnostic.aiAnalysis || !diagnostic.aiAnalysis.suggestedParts) return [];
    return diagnostic.aiAnalysis.suggestedParts
      .map((partId: number) => parts.find((p: any) => p.id === partId))
      .filter(Boolean);
  };
  
  // Format price from cents to dollars
  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };
  
  // Share diagnostic
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `RV Diagnostic: ${diagnostic.system} System Issue`,
          text: `Issue with ${rvYear} ${rvMake} ${rvModel} ${diagnostic.system} system: ${diagnostic.symptoms}`,
          url: window.location.href
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
  };
  
  const relatedGuides = getRelatedGuides();
  const suggestedParts = getSuggestedParts();
  
  if (!diagnostic.aiAnalysis) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin mb-4 mx-auto">
          <svg className="h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Analyzing your diagnostic</h3>
        <p className="text-gray-600">This may take a moment...</p>
      </div>
    );
  }
  
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">AI Analysis Results</h3>
      
      {/* Likely Issues */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Potential Issues</h4>
        <div className="space-y-3">
          {diagnostic.aiAnalysis.potentialIssues.map((issue: any, index: number) => (
            <div key={index} className="border border-gray-100 rounded-lg p-3">
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full">
                    <i className="text-sm">{index + 1}</i>
                  </span>
                </div>
                <div>
                  <h5 className="font-medium">{issue.issue}</h5>
                  <p className="text-sm text-gray-600">{issue.description}</p>
                </div>
                <div className="ml-auto">
                  <span className="text-sm font-medium text-primary">
                    {Math.round(issue.probability * 100)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recommended Tests */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Recommended Tests</h4>
        <div className="space-y-2">
          {diagnostic.aiAnalysis.recommendedTests.map((test: string, index: number) => (
            <div key={index} className="flex items-start">
              <CheckCircle className="text-primary mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{test}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Related Repair Guides */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Related Repair Guides</h4>
        <div className="space-y-2">
          {relatedGuides.length > 0 ? (
            relatedGuides.map((guide: any) => (
              <Link key={guide.id} href={`/repair-guides/${guide.id}`}>
                <a className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition duration-150 block">
                  <div className="flex items-center">
                    <span className="text-primary mr-3">
                      <i className="fas fa-file-alt"></i>
                    </span>
                    <div>
                      <h5 className="font-medium text-sm">{guide.title}</h5>
                      <p className="text-xs text-gray-500">{guide.readTime} min read</p>
                    </div>
                  </div>
                </a>
              </Link>
            ))
          ) : (
            <div className="text-sm text-gray-500 p-3 border border-gray-100 rounded-lg">
              No related guides found
            </div>
          )}
        </div>
      </div>
      
      {/* Parts Suggestion */}
      {suggestedParts.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h4 className="font-medium mb-2">Suggested Parts</h4>
          <div className="space-y-3">
            {suggestedParts.map((part: any) => (
              <div key={part.id} className="border border-gray-100 rounded-lg p-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded mr-3 flex items-center justify-center text-gray-400">
                    <i className="fas fa-tools text-2xl"></i>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium">{part.name}</h5>
                    <p className="text-xs text-gray-500">Part #: {part.partNumber}</p>
                    <p className="text-sm font-medium text-primary mt-1">{formatPrice(part.price)}</p>
                  </div>
                  <Link href={`/parts/${part.id}`}>
                    <Button size="sm" className="ml-2">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Ask AI Assistant */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h4 className="font-medium mb-3">Ask AI Assistant</h4>
        <ChatInterface 
          diagnosticId={diagnostic.id} 
          rvMake={rvMake}
          rvModel={rvModel}
          rvYear={rvYear}
          system={diagnostic.system}
          symptoms={diagnostic.symptoms}
        />
      </div>
      
      {/* Save to History */}
      <div className="flex justify-between mt-6">
        <Button variant="outline" className="text-primary" onClick={onSaveToHistory}>
          <Save className="h-4 w-4 mr-2" />
          Save to History
        </Button>
        
        {shareSupported && (
          <Button variant="outline" className="text-primary" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        )}
      </div>
    </div>
  );
}
