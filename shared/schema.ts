import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const dreams = pgTable("dreams", {
  id: serial("id").primaryKey(),
  title: text("title"),
  dreamCues: text("dream_cues").notNull(),
  isRecurring: boolean("is_recurring").default(false),
  primaryEmotion: text("primary_emotion").notNull(),
  wakeFeeling: integer("wake_feeling").notNull(),
  additionalEmotions: text("additional_emotions"),
  dreamNarrative: text("dream_narrative"),
  psychologicalReport: jsonb("psychological_report"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDreamSchema = createInsertSchema(dreams).omit({
  id: true,
  dreamNarrative: true,
  psychologicalReport: true,
  createdAt: true,
});

export type InsertDream = z.infer<typeof insertDreamSchema>;
export type Dream = typeof dreams.$inferSelect;

export const dreamInputSchema = z.object({
  title: z.string().optional(),
  dreamCues: z.string().min(10, { message: "Please provide at least 10 characters about your dream" }),
  isRecurring: z.boolean().default(false),
  primaryEmotion: z.string().min(1, { message: "Please select an emotion" }),
  wakeFeeling: z.number().min(1).max(5),
  additionalEmotions: z.string().optional(),
});

export type DreamInput = z.infer<typeof dreamInputSchema>;

export const dreamAnalysisSchema = z.object({
  title: z.string(),
  dreamNarrative: z.string(),
  psychologicalReport: z.object({
    keySymbols: z.array(z.object({
      symbol: z.string(),
      icon: z.string(),
      meaning: z.string()
    })),
    analysisSummary: z.string(),
    reflectionQuestions: z.array(z.string())
  })
});

export type DreamAnalysis = z.infer<typeof dreamAnalysisSchema>;
