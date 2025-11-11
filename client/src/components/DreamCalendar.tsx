import React, { useState, useMemo } from "react";
import { Dream } from "@shared/schema";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  getDay
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getMoonPhase } from "@/lib/moon";
import { getDreamsForDate } from "@/lib/dateFilters";

interface DreamCalendarProps {
  dreams: Dream[];
  onDateClick?: (date: Date, dreams: Dream[]) => void;
}

const EMOTION_COLORS: Record<string, string> = {
  curious: "#6D5A9E",
  afraid: "#9E3B3B",
  confused: "#D67F00",
  peaceful: "#F3C623",
  anxious: "#E05A9E",
  excited: "#5AAE9E",
  sad: "#5A9EE0",
  other: "#B0B0B0",
};

export default function DreamCalendar({ dreams, onDateClick }: DreamCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  
  // Build calendar days
  const calendarDays = useMemo(() => {
    const days: Date[] = [];
    let day = calendarStart;
    
    // Get 6 weeks to always show full calendar grid
    for (let i = 0; i < 42; i++) {
      days.push(day);
      day = new Date(day);
      day.setDate(day.getDate() + 1);
    }
    
    return days;
  }, [calendarStart]);

  // Map dreams by date
  const dreamsByDate = useMemo(() => {
    const map = new Map<string, Dream[]>();
    
    for (const dream of dreams) {
      const dateKey = format(new Date(dream.createdAt), "yyyy-MM-dd");
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(dream);
    }
    
    return map;
  }, [dreams]);

  const getDominantEmotion = (dreams: Dream[]): string => {
    if (dreams.length === 0) return "other";
    
    const emotionCounts: Record<string, number> = {};
    for (const dream of dreams) {
      const emotion = dream.primaryEmotion || "other";
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    }
    
    let maxEmotion = "other";
    let maxCount = 0;
    for (const [emotion, count] of Object.entries(emotionCounts)) {
      if (count > maxCount) {
        maxCount = count;
        maxEmotion = emotion;
      }
    }
    
    return maxEmotion;
  };

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleToday = () => setCurrentMonth(new Date());

  return (
    <Card className="bg-[var(--card-bg)] p-6 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading text-xl font-semibold text-[var(--text-primary)]">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="text-xs"
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-[var(--text-body)] py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const dayDreams = dreamsByDate.get(dateKey) || [];
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());
          const moonData = getMoonPhase(day);
          const dominantEmotion = getDominantEmotion(dayDreams);

          return (
            <div
              key={index}
              className={`
                relative min-h-[70px] p-2 rounded-lg border transition-all cursor-pointer
                ${isCurrentMonth ? "bg-[var(--card-bg)]" : "bg-[var(--bg-hover)] opacity-40"}
                ${isToday ? "ring-2 ring-[var(--text-accent)]" : "border-[var(--border-subtle)]"}
                hover:shadow-md hover:scale-105
              `}
              onClick={() => {
                if (dayDreams.length > 0 && onDateClick) {
                  onDateClick(day, dayDreams);
                }
              }}
              title={
                dayDreams.length > 0
                  ? `${dayDreams.length} dream${dayDreams.length > 1 ? "s" : ""} - ${moonData.name}`
                  : `${moonData.name}`
              }
            >
              {/* Date number */}
              <div className={`text-sm font-medium ${isToday ? "text-[var(--text-accent)]" : "text-[var(--text-primary)]"}`}>
                {format(day, "d")}
              </div>

              {/* Moon phase icon (small) */}
              <div className="absolute top-1 right-1 text-xs opacity-60">
                {moonData.emoji}
              </div>

              {/* Dream indicator */}
              {dayDreams.length > 0 && (
                <div className="mt-1 space-y-1">
                  <div
                    className="h-2 w-2 rounded-full mx-auto"
                    style={{ backgroundColor: EMOTION_COLORS[dominantEmotion] }}
                  />
                  {dayDreams.length > 1 && (
                    <div className="text-xs text-center text-[var(--text-body)]">
                      +{dayDreams.length - 1}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
        <div className="text-xs text-[var(--text-body)] mb-2">Emotion Colors:</div>
        <div className="flex flex-wrap gap-3">
          {Object.entries(EMOTION_COLORS).map(([emotion, color]) => (
            <div key={emotion} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs capitalize text-[var(--text-body)]">{emotion}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
