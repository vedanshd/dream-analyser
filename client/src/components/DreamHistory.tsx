import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  formatDistanceToNow, 
  format 
} from "date-fns";
import { Eye, History, EyeOff } from "lucide-react";
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { getEmotionIcon } from "@/lib/emotions";
import { Dream } from "@shared/schema";

interface DreamHistoryProps {
  showHistory: boolean;
  toggleHistory: () => void;
}

export default function DreamHistory({ showHistory, toggleHistory }: DreamHistoryProps) {
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: dreams = [] as Dream[], isLoading } = useQuery<Dream[]>({
    queryKey: ['/api/dreams'],
    enabled: showHistory
  });

  const handleViewDream = (dream: Dream) => {
    setSelectedDream(dream);
    setDrawerOpen(true);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const dreamDate = new Date(date);
    
    // If dream is less than 7 days old, show relative time
    if (now.getTime() - dreamDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return formatDistanceToNow(dreamDate, { addSuffix: true });
    }
    
    // Otherwise show actual date
    return `on ${format(dreamDate, 'MMM d, yyyy')}`;
  };

  const getEmotionColor = (emotion: string) => {
    const emotionMap: Record<string, string> = {
      curious: "bg-[var(--emotion-curious-bg)] text-[var(--emotion-curious-text)]",
      afraid: "bg-[var(--emotion-afraid-bg)] text-[var(--emotion-afraid-text)]",
      confused: "bg-[var(--emotion-confused-bg)] text-[var(--emotion-confused-text)]",
      peaceful: "bg-[var(--emotion-peaceful-bg)] text-[var(--emotion-peaceful-text)]",
      anxious: "bg-[var(--emotion-anxious-bg)] text-[var(--emotion-anxious-text)]",
      excited: "bg-[var(--emotion-excited-bg)] text-[var(--emotion-excited-text)]",
      sad: "bg-[var(--emotion-sad-bg)] text-[var(--emotion-sad-text)]",
      other: "bg-[var(--emotion-other-bg)] text-[var(--emotion-other-text)]",
    };
    
    return emotionMap[emotion] || "bg-[var(--emotion-other-bg)] text-[var(--emotion-other-text)]";
  };

  if (!showHistory) return null;

  return (
    <>
      <div className="mt-12 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl font-semibold text-[var(--text-primary)] flex items-center">
            <History className="mr-2 h-5 w-5 text-[var(--icon-primary)]" />
            Your Dream History
          </h2>
          
          <Button 
            variant="ghost"
            size="sm"
            onClick={toggleHistory}
            className="text-sm font-body text-[var(--text-secondary)] hover:text-[var(--text-accent)] flex items-center"
          >
            <EyeOff className="mr-1 h-4 w-4 text-[var(--icon-primary)]" />
            Hide
          </Button>
        </div>
        
        <Card className="bg-[var(--card-bg)] backdrop-blur-md rounded-xl shadow-[var(--card-shadow)] overflow-hidden">
          {isLoading && (
            <CardContent className="p-8 text-center">
              <p className="font-body text-[var(--text-body)]">Loading your dream history...</p>
            </CardContent>
          )}
          
          {!isLoading && dreams.length === 0 && (
            <CardContent className="p-8 text-center">
              <p className="font-body text-[var(--text-body)]">You haven't saved any dreams yet.</p>
            </CardContent>
          )}
          
          {!isLoading && dreams.length > 0 && dreams.map((dream: Dream) => (
            <div 
              key={dream.id} 
              className="p-5 border-b border-[var(--border-subtle)] hover:bg-[var(--bg-hover)] transition-colors duration-200 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex-grow">
                <h3 className="font-heading font-medium text-lg text-[var(--text-primary)]">
                  {dream.title || "Untitled Dream"}
                </h3>
                <p className="font-body text-sm text-[var(--text-body)] mt-1">
                  Analyzed {formatDate(new Date(dream.createdAt))}
                </p>
              </div>
              <div className="flex gap-2 sm:flex-shrink-0">
                <Badge 
                  variant="secondary"
                  className={getEmotionColor(dream.primaryEmotion)}
                >
                  {dream.primaryEmotion.charAt(0).toUpperCase() + dream.primaryEmotion.slice(1)}
                </Badge>
                <Button 
                  variant="ghost"
                  size="icon"
                  onClick={() => handleViewDream(dream)}
                  aria-label="View dream"
                  className="p-2 text-[var(--text-body)] hover:text-[var(--text-accent)] rounded-full transition-colors duration-200"
                >
                  <Eye className="h-5 w-5 text-[var(--icon-primary)]" />
                </Button>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Dream View Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="max-h-[90vh] bg-[var(--card-bg)]">
          <DrawerHeader>
            <DrawerTitle className="font-heading text-2xl text-[var(--text-primary)]">
              {selectedDream?.title || "Untitled Dream"}
            </DrawerTitle>
            <DrawerDescription className="text-[var(--text-body)]">
              Analyzed {selectedDream && formatDate(new Date(selectedDream.createdAt))}
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="px-4 py-2 overflow-y-auto max-h-[calc(90vh-10rem)]">
            {selectedDream && (
              <>
                <h3 className="font-heading text-lg font-medium text-[var(--text-secondary)] mb-2">Dream Narrative</h3>
                <div className="prose prose-sm font-body text-[var(--text-body)] max-w-none mb-6">
                  {selectedDream.dreamNarrative?.split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
                
                {selectedDream.psychologicalReport && (
                  <>
                    <h3 className="font-heading text-lg font-medium text-[var(--text-secondary)] mt-4 mb-2">Psychological Analysis</h3>
                    <div className="prose prose-sm font-body text-[var(--text-body)] max-w-none">
                      {(selectedDream.psychologicalReport as any).analysisSummary?.split('\n\n').map((paragraph: string, i: number) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" className="text-[var(--text-primary)] border-[var(--border-primary)] hover:bg-[var(--bg-hover)]">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
