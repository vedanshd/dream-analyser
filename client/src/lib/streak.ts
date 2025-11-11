import { Dream } from "@shared/schema";
import { format, differenceInDays, parseISO } from "date-fns";

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalDreams: number;
  lastDreamDate: string | null;
  streakDates: string[]; // array of dates in current streak
}

/**
 * Calculate dream journaling streak from dreams array
 * A streak is consecutive days with at least one dream
 */
export function calculateStreak(dreams: Dream[]): StreakData {
  if (!dreams || dreams.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalDreams: 0,
      lastDreamDate: null,
      streakDates: [],
    };
  }

  // Get unique dates (YYYY-MM-DD format)
  const dateSet = new Set<string>();
  for (const dream of dreams) {
    if (dream.createdAt) {
      const dateKey = format(new Date(dream.createdAt as any), "yyyy-MM-dd");
      dateSet.add(dateKey);
    }
  }

  const uniqueDates = Array.from(dateSet).sort(); // ascending order
  
  if (uniqueDates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalDreams: dreams.length,
      lastDreamDate: null,
      streakDates: [],
    };
  }

  // Calculate current streak (from today backwards)
  const today = format(new Date(), "yyyy-MM-dd");
  let currentStreak = 0;
  let currentStreakDates: string[] = [];
  
  // Check if today or yesterday has a dream (streak is still active)
  const lastDate = uniqueDates[uniqueDates.length - 1];
  const daysSinceLastDream = differenceInDays(new Date(today), new Date(lastDate));
  
  if (daysSinceLastDream <= 1) {
    // Streak is active, count backwards
    currentStreakDates.push(lastDate);
    currentStreak = 1;
    
    for (let i = uniqueDates.length - 2; i >= 0; i--) {
      const prevDate = uniqueDates[i];
      const nextDate = uniqueDates[i + 1];
      const gap = differenceInDays(new Date(nextDate), new Date(prevDate));
      
      if (gap === 1) {
        currentStreak++;
        currentStreakDates.unshift(prevDate);
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  let longestStreak = 1;
  let tempStreak = 1;
  
  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = uniqueDates[i - 1];
    const currDate = uniqueDates[i];
    const gap = differenceInDays(new Date(currDate), new Date(prevDate));
    
    if (gap === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    totalDreams: dreams.length,
    lastDreamDate: lastDate,
    streakDates: currentStreakDates,
  };
}

/**
 * Get milestone badge for current streak
 */
export function getStreakBadge(streak: number): { emoji: string; label: string } | null {
  if (streak >= 365) return { emoji: "🏆", label: "Dream Master" };
  if (streak >= 180) return { emoji: "💎", label: "Dream Adept" };
  if (streak >= 100) return { emoji: "🌟", label: "Century Club" };
  if (streak >= 50) return { emoji: "⭐", label: "Dream Devotee" };
  if (streak >= 30) return { emoji: "🔥", label: "On Fire" };
  if (streak >= 14) return { emoji: "💪", label: "Two Weeks Strong" };
  if (streak >= 7) return { emoji: "✨", label: "Week Warrior" };
  if (streak >= 3) return { emoji: "🌱", label: "Starting Strong" };
  return null;
}

/**
 * Get encouraging message based on streak
 */
export function getStreakMessage(streakData: StreakData): string {
  const { currentStreak, longestStreak } = streakData;
  
  if (currentStreak === 0) {
    return "Record a dream to start your streak!";
  }
  
  if (currentStreak === 1) {
    return "Great start! Come back tomorrow to build your streak.";
  }
  
  if (currentStreak >= longestStreak && currentStreak >= 7) {
    return `New personal record! ${currentStreak} days and counting! 🎉`;
  }
  
  if (currentStreak >= 30) {
    return "Incredible dedication to your dream practice! 💫";
  }
  
  if (currentStreak >= 7) {
    return `Amazing! ${currentStreak} days in a row! Keep it going! 🔥`;
  }
  
  return `${currentStreak} day streak! You're building a powerful habit! ⭐`;
}
