import React, { useMemo } from "react";
import { Dream } from "@shared/schema";
import { calculateStreak, getStreakBadge, getStreakMessage } from "@/lib/streak";
import { Flame, Trophy, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StreakTrackerProps {
  dreams: Dream[];
}

export default function StreakTracker({ dreams }: StreakTrackerProps) {
  const streakData = useMemo(() => calculateStreak(dreams), [dreams]);
  const badge = useMemo(() => getStreakBadge(streakData.currentStreak), [streakData.currentStreak]);
  const message = useMemo(() => getStreakMessage(streakData), [streakData]);

  return (
    <Card className="bg-gradient-to-br from-[var(--card-bg)] to-[var(--bg-hover)] p-6 rounded-xl shadow-lg border border-[var(--border-subtle)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Dream Streak
        </h3>
        {badge && (
          <div className="flex items-center gap-2 bg-[var(--card-bg)] px-3 py-1.5 rounded-full">
            <span className="text-2xl">{badge.emoji}</span>
            <span className="text-xs font-medium text-[var(--text-secondary)]">{badge.label}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-[var(--text-primary)]">
            {streakData.currentStreak}
          </div>
          <div className="text-xs text-[var(--text-body)] mt-1">Current Streak</div>
        </div>
        
        <div className="text-center border-l border-r border-[var(--border-subtle)]">
          <div className="text-3xl font-bold text-[var(--text-accent)] flex items-center justify-center gap-1">
            <Trophy className="h-6 w-6" />
            {streakData.longestStreak}
          </div>
          <div className="text-xs text-[var(--text-body)] mt-1">Best Streak</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-[var(--text-secondary)] flex items-center justify-center gap-1">
            <TrendingUp className="h-6 w-6" />
            {streakData.totalDreams}
          </div>
          <div className="text-xs text-[var(--text-body)] mt-1">Total Dreams</div>
        </div>
      </div>

      <div className="text-center py-3 px-4 bg-[var(--bg-hover)] rounded-lg">
        <p className="text-sm font-medium text-[var(--text-primary)]">{message}</p>
      </div>

      {streakData.currentStreak > 0 && (
        <div className="mt-4">
          <div className="flex items-center gap-1 flex-wrap">
            {streakData.streakDates.slice(-14).map((date, i) => (
              <div
                key={i}
                className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-sm flex items-center justify-center"
                title={date}
              >
                <Flame className="h-3 w-3 text-white" />
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--text-body)] mt-2">
            {streakData.streakDates.length > 14 
              ? `Last 14 days of your ${streakData.currentStreak}-day streak`
              : `Your ${streakData.currentStreak}-day streak`}
          </p>
        </div>
      )}
    </Card>
  );
}
