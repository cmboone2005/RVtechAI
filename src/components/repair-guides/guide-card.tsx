import { ArrowRight, Bookmark, BookmarkCheck, Download, FileCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

interface GuideCardProps {
  guide: {
    id: number;
    title: string;
    system: string;
    readTime: number;
    isOfflineAvailable?: boolean;
  };
  isOffline: boolean;
  onToggleSave: () => void;
}

export default function GuideCard({ guide, isOffline, onToggleSave }: GuideCardProps) {
  // Format system name for display
  const formatSystem = (system: string) => {
    return system.charAt(0).toUpperCase() + system.slice(1);
  };
  
  // Handle click on save button
  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleSave();
  };
  
  return (
    <Link href={`/repair-guides/${guide.id}`}>
      <a className="p-4 hover:bg-gray-50 transition duration-150 block">
        <div className="flex items-center">
          <div className="flex-1">
            <h4 className="font-medium">{guide.title}</h4>
            <div className="flex items-center mt-1">
              <Badge variant="secondary" className="bg-primary-light/20 text-primary mr-2">
                {formatSystem(guide.system)}
              </Badge>
              <span className="text-xs text-gray-500 flex items-center">
                <span className="material-icons text-xs mr-1">schedule</span>
                {guide.readTime} min read
              </span>
            </div>
          </div>
          
          <div className="ml-4 flex items-center space-x-2">
            <button
              className={isOffline ? "text-primary" : "text-gray-400"}
              onClick={handleSaveClick}
              aria-label={isOffline ? "Remove from offline guides" : "Save for offline use"}
            >
              {isOffline ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
            </button>
            
            {isOffline && (
              <span className="text-green-600">
                <FileCheck className="h-5 w-5" />
              </span>
            )}
            
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </a>
    </Link>
  );
}
