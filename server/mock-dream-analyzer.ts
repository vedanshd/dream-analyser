import { DreamInput } from "@shared/schema";

/**
 * Mock dream analyzer for demonstration purposes when API keys are not available
 */
export function mockAnalyzeDream(dreamInput: DreamInput) {
  // Process the dream input
  const theme = getThemeFromEmotion(dreamInput.primaryEmotion);
  const isPositive = dreamInput.wakeFeeling > 3;
  const isRecurring = dreamInput.isRecurring;
  
  // Generate dream title based on cues and emotion
  const title = generateDreamTitle(dreamInput.dreamCues, dreamInput.primaryEmotion);
  
  // Generate a dream narrative
  const dreamNarrative = generateDreamNarrative(
    dreamInput.dreamCues, 
    dreamInput.primaryEmotion,
    isPositive,
    isRecurring
  );
  
  // Generate psychological analysis
  const keySymbols = extractKeySymbols(dreamInput.dreamCues);
  const analysisSummary = generateAnalysisSummary(
    dreamInput.dreamCues,
    dreamInput.primaryEmotion,
    isPositive,
    isRecurring
  );
  const reflectionQuestions = generateReflectionQuestions(
    dreamInput.dreamCues,
    dreamInput.primaryEmotion,
    theme
  );
  
  // Return the analysis
  return {
    title,
    dreamNarrative,
    psychologicalReport: {
      keySymbols,
      analysisSummary,
      reflectionQuestions
    }
  };
}

/**
 * Utility functions
 */
function getThemeFromEmotion(emotion: string): string {
  const emotionThemes: {[key: string]: string} = {
    "joy": "fulfillment and happiness",
    "fear": "anxiety and insecurity",
    "sadness": "loss and grief",
    "anger": "frustration and boundaries",
    "surprise": "unexpected change",
    "disgust": "rejection and aversion",
    "anticipation": "expectation and preparation",
    "trust": "security and relationships",
    "confusion": "uncertainty and decision-making",
    "anxiety": "worries and stress",
    "love": "connection and intimacy",
    "nostalgia": "past and memory",
    "awe": "wonder and transcendence",
    "guilt": "responsibility and regret",
    "shame": "self-image and acceptance",
    "pride": "accomplishment and recognition",
    "contentment": "peace and satisfaction"
  };
  
  return emotionThemes[emotion.toLowerCase()] || "personal growth and change";
}

function generateDreamTitle(dreamCues: string, emotion: string): string {
  const cueWords = dreamCues.split(/\s+/).filter(word => word.length > 3);
  const randomCueWord = cueWords[Math.floor(Math.random() * cueWords.length)] || "Journey";
  
  const titleFormats = [
    `The ${capitalizeFirstLetter(randomCueWord)} of ${capitalizeFirstLetter(emotion)}`,
    `${capitalizeFirstLetter(emotion)}'s Whisper`,
    `Beyond the ${capitalizeFirstLetter(randomCueWord)}`,
    `Shadows of ${capitalizeFirstLetter(randomCueWord)}`,
    `The ${capitalizeFirstLetter(emotion)} Labyrinth`,
    `Echoes of ${capitalizeFirstLetter(randomCueWord)}`,
    `When ${capitalizeFirstLetter(randomCueWord)} Meets ${capitalizeFirstLetter(emotion)}`,
    `The ${capitalizeFirstLetter(randomCueWord)} Within`,
    `${capitalizeFirstLetter(emotion)}'s Reflection`,
    `The Hidden ${capitalizeFirstLetter(randomCueWord)}`
  ];
  
  return titleFormats[Math.floor(Math.random() * titleFormats.length)];
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function generateDreamNarrative(dreamCues: string, emotion: string, isPositive: boolean, isRecurring: boolean): string {
  const cues = dreamCues.split(/[,.;]/).filter(cue => cue.trim().length > 0);
  const theme = getThemeFromEmotion(emotion);
  
  // Intro paragraph
  let narrative = `I found myself in a strange yet familiar place. ${cues[0] || "The surroundings were hazy at first"}. As my awareness grew, I noticed ${cues[1] || "unusual details around me"}.\n\n`;
  
  // Middle section 
  narrative += `${isRecurring ? "As in previous dreams, I recognized " : "I was surprised to see "}${cues[2] || "elements that seemed significant"}. The atmosphere was filled with a sense of ${emotion.toLowerCase()}. ${cues[3] || "I moved through this dreamscape with curiosity"}.\n\n`;
  
  // Development
  narrative += `${cues[4] || "As the dream continued"}, I experienced ${isPositive ? "a growing sense of clarity" : "increasing uncertainty"}. ${cues[5] || "The symbols around me seemed to carry meaning"}. I felt drawn to ${cues[6] || "explore further into this symbolic landscape"}.\n\n`;
  
  // Climax
  narrative += `Then, something shifted. ${cues[7] || "The entire scene transformed in an instant"}. I felt an overwhelming sense of ${emotion.toLowerCase()} as ${cues[8] || "the true nature of the dream revealed itself"}. ${isPositive ? "This revelation brought a sense of peace" : "This realization was unsettling"}.\n\n`;
  
  // Resolution
  narrative += `As the dream began to fade, ${cues[9] || "I tried to hold onto the essential meaning"}. There was a feeling that ${isRecurring ? "this recurring dream was trying to convey something important" : "this unique experience held significance for my waking life"}. The last thing I remember before waking was ${cues[10] || "a sense that this experience would stay with me"}.`;
  
  return narrative;
}

function extractKeySymbols(dreamCues: string): Array<{symbol: string, icon: string, meaning: string}> {
  const cues = dreamCues.split(/\s+/).filter(word => word.length > 3);
  const symbols = [];
  const usedIcons = new Set();
  
  // Map of possible icons to use
  const iconOptions = [
    "moon-line", "star-line", "cloud-line", "home-4-line", "map-pin-line", 
    "door-open-line", "key-line", "compass-line", "flashlight-line", "eye-line",
    "heart-line", "user-line", "group-line", "plant-line", "leaf-line",
    "fire-line", "water-flash-line", "mountain-line", "road-map-line", "building-line"
  ];
  
  // Get 3-5 unique symbols from the cues
  const symbolCount = Math.min(Math.max(3, Math.floor(cues.length / 3)), 5);
  const selectedCues = new Set();
  
  for (let i = 0; i < symbolCount && cues.length > 0; i++) {
    // Select a random cue
    let randomIndex = Math.floor(Math.random() * cues.length);
    let selectedCue = cues[randomIndex];
    
    // Make sure we don't use the same cue twice
    while (selectedCues.has(selectedCue)) {
      randomIndex = Math.floor(Math.random() * cues.length);
      selectedCue = cues[randomIndex];
    }
    
    selectedCues.add(selectedCue);
    
    // Select a random icon that hasn't been used
    let icon;
    do {
      icon = iconOptions[Math.floor(Math.random() * iconOptions.length)];
    } while (usedIcons.has(icon) && usedIcons.size < iconOptions.length);
    
    usedIcons.add(icon);
    
    // Generate meaning
    const meanings = [
      `Represents your inner ${selectedCue} and how it influences your life choices.`,
      `Symbolizes a ${selectedCue} that you're trying to understand or integrate.`,
      `The ${selectedCue} points to unresolved feelings or thoughts in your subconscious.`,
      `This ${selectedCue} represents a transition or transformation you're experiencing.`,
      `The presence of ${selectedCue} suggests a need for acknowledgment or attention.`
    ];
    
    const meaning = meanings[Math.floor(Math.random() * meanings.length)];
    
    symbols.push({
      symbol: capitalizeFirstLetter(selectedCue),
      icon,
      meaning
    });
  }
  
  return symbols;
}

function generateAnalysisSummary(dreamCues: string, emotion: string, isPositive: boolean, isRecurring: boolean): string {
  const theme = getThemeFromEmotion(emotion);
  
  let summary = `Your dream reveals themes connected to ${theme}. `;
  
  summary += `The emotional landscape of ${emotion.toLowerCase()} suggests that you are processing feelings related to ${theme}. `;
  
  if (isRecurring) {
    summary += `As a recurring dream, this suggests that your mind is repeatedly trying to process or resolve something important. `;
  } else {
    summary += `This dream appears to be responding to recent experiences or thoughts in your waking life. `;
  }
  
  summary += `\n\nThe symbols in your dream act as metaphors for aspects of your inner world. `;
  
  summary += `Your ${isPositive ? "positive" : "challenging"} feeling upon waking (${isPositive ? "refreshed" : "unsettled"}) indicates that this dream experience is ${isPositive ? "helping you integrate these emotions" : "highlighting unresolved tensions"}. `;
  
  summary += `\n\nFrom a psychological perspective, dreams about ${dreamCues.split(" ").slice(0, 3).join(" ")}... often connect to how we navigate our relationships, challenges, and self-perception. Your subconscious may be working through feelings or situations that you haven't fully processed in your waking life.`;
  
  return summary;
}

function generateReflectionQuestions(dreamCues: string, emotion: string, theme: string): string[] {
  const cues = dreamCues.split(/\s+/).filter(word => word.length > 3);
  const randomCue = cues[Math.floor(Math.random() * cues.length)] || "element";
  
  const questionBank = [
    `How does the feeling of ${emotion.toLowerCase()} in your dream relate to your current life circumstances?`,
    `What does the ${randomCue} in your dream remind you of in your waking life?`,
    `If you could change one aspect of this dream, what would it be and why?`,
    `How might this dream be offering guidance related to ${theme}?`,
    `What parts of yourself might the different characters or elements in this dream represent?`,
    `What unresolved situation might this dream be processing for you?`,
    `How do the symbols in this dream connect to your past experiences?`,
    `What boundary or limitation in your life might this dream be addressing?`,
    `What change or transition in your life could this dream be reflecting?`,
    `How might acknowledging the message of this dream benefit your waking life?`
  ];
  
  // Shuffle and select 4 questions
  return shuffleArray(questionBank).slice(0, 4);
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}