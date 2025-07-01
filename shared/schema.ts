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

// Helper function to validate meaningful content
const validateMeaningfulContent = (content: string) => {
  // Check for random gibberish patterns
  const hasConsecutiveChars = /([a-z])\1{3,}/i.test(content);
  const hasRandomPattern = /^[a-z]{15,}$/i.test(content.replace(/\s/g, ''));
  const wordCount = content.trim().split(/\s+/).length;
  const hasVowels = /[aeiou]/i.test(content);
  
  // Must have at least 2 words and contain vowels
  if (wordCount < 2 || !hasVowels) {
    throw new Error("Please provide a meaningful description of your dream with real words.");
  }
  
  // Check for obvious gibberish patterns
  if (hasConsecutiveChars || hasRandomPattern) {
    throw new Error("Your description appears to contain random characters. Please describe your dream using meaningful words.");
  }
  
  return true;
};

export const dreamInputSchema = z.object({
  title: z.string().optional().refine((val) => {
    if (val && val.trim().length > 0) {
      return validateMeaningfulContent(val);
    }
    return true;
  }, { message: "Please provide a meaningful title using real words." }),
  dreamCues: z.string()
    .min(10, { message: "Please provide at least 10 characters about your dream" })
    .max(2000, { message: "Dream description is too long. Please keep it under 2000 characters." })
    .refine((val) => validateMeaningfulContent(val), {
      message: "Please provide a meaningful description of your dream using real words and complete thoughts."
    }),
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
