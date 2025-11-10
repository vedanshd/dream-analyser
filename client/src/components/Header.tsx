import { Moon } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Dream } from "@shared/schema";

interface HeaderProps {
  showHistory?: boolean;
  toggleHistory?: () => void;
}

export default function Header({ showHistory, toggleHistory }: HeaderProps) {
  const { data: dreams = [] as Dream[] } = useQuery<Dream[]>({
    queryKey: ['/api/dreams'],
    // keep it lightweight in the header - we only need the latest
    staleTime: 1000 * 60, // 1 minute
  });

  const latest = dreams && dreams.length > 0 ? dreams[0] : null;

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

  return (
    <header className="relative z-10 py-6 px-4 flex items-center">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex-1">
          {/* Empty div for flex balance */}
        </div>

        <div className="flex-1 text-center">
          <Link href="/">
            <div className="flex items-center justify-center cursor-pointer">
              <Moon className="h-6 w-6 text-[var(--icon-primary)] mr-2" />
              <h1 className="font-heading font-bold text-3xl sm:text-4xl tracking-wide text-[var(--text-primary)]">
                V<span className="text-[var(--text-secondary)]">Dream</span>Scape
              </h1>
            </div>
          </Link>
          <p className="font-body text-[var(--text-body)] mt-1">Unlock Your Dream's Hidden Meanings</p>
        </div>

        <div className="flex-1 flex justify-end items-center gap-3">
          {/* Recent analysis mini-card */}
          <div
            role="button"
            onClick={() => toggleHistory && toggleHistory()}
            className="hidden md:flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors duration-150"
            title={latest ? `Open recent analysis: ${latest.title || 'Untitled'}` : 'No recent analyses'}
          >
            {latest ? (
              <>
                <Badge className={`${getEmotionColor(latest.primaryEmotion)} rounded-md px-2 py-1 text-xs`}>{
                  latest.primaryEmotion.charAt(0).toUpperCase() + latest.primaryEmotion.slice(1)
                }</Badge>
                <div className="text-left">
                  <div className="font-heading text-sm font-medium text-[var(--text-primary)]">
                    {latest.title ? (latest.title.length > 28 ? latest.title.slice(0, 25) + '...' : latest.title) : 'Untitled Dream'}
                  </div>
                  <div className="text-[var(--text-body)] text-xs">Most recent analysis</div>
                </div>
              </>
            ) : (
              <div className="text-[var(--text-body)] text-sm">No recent analyses</div>
            )}
          </div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
