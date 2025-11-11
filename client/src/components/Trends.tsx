import React, { useMemo } from "react";
import { Dream } from "@shared/schema";
import { format, parseISO } from "date-fns";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from "recharts";
import Timeline from "./Timeline";

interface TrendsProps {
  dreams: Dream[];
}

const COLORS = ["#6D5A9E", "#9E6D78", "#5AAE9E", "#E09E5A", "#5A9EE0", "#E05A9E"];

function aggregateEmotions(dreams: Dream[]) {
  const counts: Record<string, number> = {};
  for (const d of dreams) {
    const e = (d.primaryEmotion || "other").toLowerCase();
    counts[e] = (counts[e] || 0) + 1;
  }
  return Object.entries(counts).map(([emotion, value]) => ({ emotion, value }));
}

function aggregateSymbols(dreams: Dream[]) {
  const counts: Record<string, number> = {};
  for (const d of dreams) {
    try {
      const report: any = d.psychologicalReport;
      const keys = report?.keySymbols;
      if (Array.isArray(keys)) {
        for (const k of keys) {
          const s = (k?.symbol || "").toLowerCase();
          if (!s) continue;
          counts[s] = (counts[s] || 0) + 1;
        }
      }
    } catch (e) {
      // ignore malformed reports
    }
  }
  // convert to array sorted by count
  return Object.entries(counts)
    .map(([symbol, value]) => ({ symbol, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
}

function aggregateTimeSeries(dreams: Dream[]) {
  const map: Record<string, { date: string; count: number; avgWake: number; totalWake: number }> = {};
  for (const d of dreams) {
    const date = d.createdAt ? format(new Date(d.createdAt as any), "yyyy-MM-dd") : "unknown";
    if (!map[date]) map[date] = { date, count: 0, avgWake: 0, totalWake: 0 };
    map[date].count += 1;
    map[date].totalWake += (d.wakeFeeling || 0) as number;
  }
  const arr = Object.values(map).map((v) => ({ date: v.date, count: v.count, avgWake: v.totalWake / Math.max(1, v.count) }));
  // sort by date
  arr.sort((a, b) => (a.date > b.date ? 1 : -1));
  return arr;
}

export default function Trends({ dreams }: TrendsProps) {
  const emotionData = useMemo(() => aggregateEmotions(dreams), [dreams]);
  const symbolData = useMemo(() => aggregateSymbols(dreams), [dreams]);
  const timeSeries = useMemo(() => aggregateTimeSeries(dreams), [dreams]);

  if (!dreams || dreams.length === 0) return null;

  return (
    <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="col-span-1 lg:col-span-1 bg-[var(--card-bg)] p-4 rounded-lg shadow-sm">
        <h4 className="font-heading text-sm font-medium mb-2 text-[var(--text-primary)]">Emotions</h4>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie dataKey="value" data={emotionData} nameKey="emotion" outerRadius={80} label>
                {emotionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="col-span-1 lg:col-span-1 bg-[var(--card-bg)] p-4 rounded-lg shadow-sm">
        <h4 className="font-heading text-sm font-medium mb-2 text-[var(--text-primary)]">Top Symbols</h4>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={symbolData} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="symbol" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="value" fill={COLORS[0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="col-span-1 lg:col-span-1 bg-[var(--card-bg)] p-4 rounded-lg shadow-sm">
        <h4 className="font-heading text-sm font-medium mb-2 text-[var(--text-primary)]">Activity & Wake Feeling</h4>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <LineChart data={timeSeries} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="count" stroke={COLORS[2]} />
              <Line yAxisId="right" type="monotone" dataKey="avgWake" stroke={COLORS[4]} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Full-width activity calendar */}
      <div className="col-span-1 lg:col-span-3">
        <Timeline dreams={dreams} months={6} />
      </div>
    </div>
  );
}
