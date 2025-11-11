/**
 * Calculate moon phase for a given date
 * Returns moon phase data including emoji, name, and illumination percentage
 */

export interface MoonPhase {
  phase: number; // 0-1 (0 = new moon, 0.5 = full moon)
  emoji: string;
  name: string;
  illumination: number; // 0-100%
}

/**
 * Calculate moon phase for a given date
 * Using astronomical algorithm
 */
export function getMoonPhase(date: Date): MoonPhase {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Julian date calculation
  let jd = 0;
  if (month <= 2) {
    jd = 
      367 * (year - 1) -
      Math.floor(7 * (year - 1 + Math.floor((month + 9) / 12)) / 4) +
      Math.floor((275 * month) / 9) +
      day +
      1721013.5;
  } else {
    jd =
      367 * year -
      Math.floor(7 * (year + Math.floor((month + 9) / 12)) / 4) +
      Math.floor((275 * month) / 9) +
      day +
      1721013.5;
  }

  // Days since known new moon (Jan 6, 2000)
  const daysSinceNew = jd - 2451549.5;
  
  // Moon synodic period (days)
  const synodicMonth = 29.53058867;
  
  // Calculate phase (0-1)
  const phase = (daysSinceNew % synodicMonth) / synodicMonth;
  
  // Calculate illumination percentage
  const illumination = (1 - Math.cos(phase * 2 * Math.PI)) / 2 * 100;

  return {
    phase,
    emoji: getMoonEmoji(phase),
    name: getMoonName(phase),
    illumination: Math.round(illumination),
  };
}

function getMoonEmoji(phase: number): string {
  if (phase < 0.0625) return "🌑"; // New Moon
  if (phase < 0.1875) return "🌒"; // Waxing Crescent
  if (phase < 0.3125) return "🌓"; // First Quarter
  if (phase < 0.4375) return "🌔"; // Waxing Gibbous
  if (phase < 0.5625) return "🌕"; // Full Moon
  if (phase < 0.6875) return "🌖"; // Waning Gibbous
  if (phase < 0.8125) return "🌗"; // Last Quarter
  if (phase < 0.9375) return "🌘"; // Waning Crescent
  return "🌑"; // New Moon
}

function getMoonName(phase: number): string {
  if (phase < 0.0625) return "New Moon";
  if (phase < 0.1875) return "Waxing Crescent";
  if (phase < 0.3125) return "First Quarter";
  if (phase < 0.4375) return "Waxing Gibbous";
  if (phase < 0.5625) return "Full Moon";
  if (phase < 0.6875) return "Waning Gibbous";
  if (phase < 0.8125) return "Last Quarter";
  if (phase < 0.9375) return "Waning Crescent";
  return "New Moon";
}

/**
 * Get moon insights based on dream patterns and moon phases
 */
export function getMoonInsights(dreams: Array<{ createdAt: Date | string; primaryEmotion: string }>): {
  fullMoonDreams: number;
  newMoonDreams: number;
  mostCommonPhase: string;
  fullMoonEmotions: Record<string, number>;
} {
  const phaseMap: Record<string, number> = {};
  const fullMoonEmotions: Record<string, number> = {};
  let fullMoonCount = 0;
  let newMoonCount = 0;

  for (const dream of dreams) {
    const date = typeof dream.createdAt === 'string' ? new Date(dream.createdAt) : dream.createdAt;
    const moonData = getMoonPhase(date);
    
    phaseMap[moonData.name] = (phaseMap[moonData.name] || 0) + 1;
    
    // Count full moon dreams (phase 0.4375 - 0.5625)
    if (moonData.phase >= 0.4375 && moonData.phase <= 0.5625) {
      fullMoonCount++;
      fullMoonEmotions[dream.primaryEmotion] = (fullMoonEmotions[dream.primaryEmotion] || 0) + 1;
    }
    
    // Count new moon dreams (phase 0 - 0.0625 or 0.9375 - 1)
    if (moonData.phase < 0.0625 || moonData.phase > 0.9375) {
      newMoonCount++;
    }
  }

  // Find most common phase
  let mostCommonPhase = "Unknown";
  let maxCount = 0;
  for (const [phase, count] of Object.entries(phaseMap)) {
    if (count > maxCount) {
      maxCount = count;
      mostCommonPhase = phase;
    }
  }

  return {
    fullMoonDreams: fullMoonCount,
    newMoonDreams: newMoonCount,
    mostCommonPhase,
    fullMoonEmotions,
  };
}
