import { Dream } from "@shared/schema";
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth,
  subDays,
  isWithinInterval,
  isSameDay,
  startOfYear,
  endOfYear
} from "date-fns";

export type DateFilterType = 
  | "all"
  | "today"
  | "this-week"
  | "this-month"
  | "last-7-days"
  | "last-30-days"
  | "last-90-days"
  | "this-year"
  | "custom";

export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Get date range for a given filter type
 */
export function getDateRangeForFilter(filterType: DateFilterType, customRange?: DateRange): DateRange | null {
  const now = new Date();
  
  switch (filterType) {
    case "all":
      return null;
      
    case "today":
      return {
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59),
      };
      
    case "this-week":
      return {
        start: startOfWeek(now, { weekStartsOn: 0 }),
        end: endOfWeek(now, { weekStartsOn: 0 }),
      };
      
    case "this-month":
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      };
      
    case "last-7-days":
      return {
        start: subDays(now, 7),
        end: now,
      };
      
    case "last-30-days":
      return {
        start: subDays(now, 30),
        end: now,
      };
      
    case "last-90-days":
      return {
        start: subDays(now, 90),
        end: now,
      };
      
    case "this-year":
      return {
        start: startOfYear(now),
        end: endOfYear(now),
      };
      
    case "custom":
      return customRange || null;
      
    default:
      return null;
  }
}

/**
 * Filter dreams by date range
 */
export function filterDreamsByDate(dreams: Dream[], filterType: DateFilterType, customRange?: DateRange): Dream[] {
  const range = getDateRangeForFilter(filterType, customRange);
  
  if (!range) {
    return dreams; // Return all dreams
  }
  
  return dreams.filter((dream) => {
    const dreamDate = new Date(dream.createdAt);
    return isWithinInterval(dreamDate, { start: range.start, end: range.end });
  });
}

/**
 * Get dreams for a specific date
 */
export function getDreamsForDate(dreams: Dream[], date: Date): Dream[] {
  return dreams.filter((dream) => {
    const dreamDate = new Date(dream.createdAt);
    return isSameDay(dreamDate, date);
  });
}

/**
 * Get season name for a date
 */
export function getSeason(date: Date): string {
  const month = date.getMonth();
  
  // Northern Hemisphere seasons
  if (month >= 2 && month <= 4) return "Spring";
  if (month >= 5 && month <= 7) return "Summer";
  if (month >= 8 && month <= 10) return "Fall";
  return "Winter";
}

/**
 * Filter dreams by season
 */
export function filterDreamsBySeason(dreams: Dream[], season: string): Dream[] {
  return dreams.filter((dream) => {
    const dreamDate = new Date(dream.createdAt);
    return getSeason(dreamDate) === season;
  });
}

/**
 * Get dreams from one year ago (anniversary feature)
 */
export function getAnniversaryDreams(dreams: Dream[]): Dream[] {
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  
  return dreams.filter((dream) => {
    const dreamDate = new Date(dream.createdAt);
    return isSameDay(dreamDate, oneYearAgo);
  });
}
