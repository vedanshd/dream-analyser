import React, { useMemo } from "react";
import { Dream } from "@shared/schema";
import { format, addDays, subDays, startOfWeek, differenceInCalendarWeeks } from "date-fns";

interface TimelineProps {
  dreams: Dream[];
  months?: number;
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

function buildDateMap(dreams: Dream[]) {
  const map: Record<string, { count: number; emotionCounts: Record<string, number> }> = {};
  for (const d of dreams) {
    const dateKey = d.createdAt ? format(new Date(d.createdAt as any), "yyyy-MM-dd") : null;
    if (!dateKey) continue;
    if (!map[dateKey]) map[dateKey] = { count: 0, emotionCounts: {} };
    map[dateKey].count += 1;
    const emo = (d.primaryEmotion || "other").toLowerCase();
    map[dateKey].emotionCounts[emo] = (map[dateKey].emotionCounts[emo] || 0) + 1;
  }
  // compute dominant emotion for each date
  const result: Record<string, { count: number; dominant?: string }> = {};
  for (const key of Object.keys(map)) {
    const eCounts = map[key].emotionCounts;
    let dominant: string | undefined = undefined;
    let max = 0;
    for (const emo of Object.keys(eCounts)) {
      if (eCounts[emo] > max) {
        max = eCounts[emo];
        dominant = emo;
      }
    }
    result[key] = { count: map[key].count, dominant };
  }
  return result;
}

export default function Timeline({ dreams, months = 6 }: TimelineProps) {
  const dateMap = useMemo(() => buildDateMap(dreams), [dreams]);

  const today = new Date();
  const start = startOfWeek(subDays(today, Math.max(30 * months, 30)), { weekStartsOn: 0 });

  const totalWeeks = differenceInCalendarWeeks(today, start) + 1;

  // build weeks array: each week is array of 7 dates
  const weeks: Date[][] = [];
  for (let w = 0; w < totalWeeks; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      const day = addDays(start, w * 7 + d);
      week.push(day);
    }
    weeks.push(week);
  }

  return (
    <div className="bg-[var(--card-bg)] p-4 rounded-lg shadow-sm">
      <h4 className="font-heading text-sm font-medium mb-3 text-[var(--text-primary)]">Activity Calendar</h4>
      <div className="overflow-x-auto">
        <div className="flex items-start gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day, di) => {
                const key = format(day, "yyyy-MM-dd");
                const info = dateMap[key];
                const color = info && info.dominant ? (EMOTION_COLORS[info.dominant] || EMOTION_COLORS.other) : "transparent";
                const title = info ? `${key}: ${info.count} dream(s) — ${info.dominant || 'N/A'}` : `${key}: no dreams`;
                return (
                  <div
                    key={di}
                    title={title}
                    className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm border border-transparent"
                    style={{ backgroundColor: color, minWidth: 12 }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 text-xs text-[var(--text-body)]">Color indicates the dominant emotion recorded that day. Hover a square to see details.</div>
    </div>
  );
}
