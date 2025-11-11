import { DreamInput, DreamAnalysis } from "@shared/schema";

// Mock dream analyzer for GitHub Pages deployment
function mockAnalyzeDream(dreamInput: DreamInput): DreamAnalysis & { id: number } {
  return {
    id: Date.now(),
    title: `Dream Analysis: ${dreamInput.primaryEmotion} Journey`,
    dreamNarrative: `I found myself in a surreal landscape that seemed to shift between familiar and unknown territories. ${dreamInput.dreamCues} The atmosphere was thick with ${dreamInput.primaryEmotion}, creating an emotional backdrop that colored every interaction and scene.\n\nAs I moved through this dreamscape, the symbols around me began to take on deeper meaning. Each element seemed purposeful, as if my subconscious was carefully crafting a narrative to help me process recent experiences and emotions.\n\nThe dream reached its climax when I realized that every symbol, every emotion, and every interaction was connected to my waking life in ways I hadn't previously understood. This revelation brought both clarity and new questions.\n\nAs I began to wake, I felt a sense that this dream held important insights about my current life situation and emotional state. The vivid imagery and strong emotions suggested that my mind was working through something significant.`,
    psychologicalReport: {
      keySymbols: [
        {
          symbol: "Journey",
          icon: "map-pin-line",
          meaning: "Represents your personal growth and the path you're currently navigating in life."
        },
        {
          symbol: "Emotions",
          icon: "heart-line",
          meaning: "Your dream's emotional landscape reflects your current feelings and how you're processing recent experiences."
        },
        {
          symbol: "Transformation",
          icon: "star-line",
          meaning: "The shifting scenes in your dream suggest you're in a period of personal change and development."
        }
      ],
      analysisSummary: `Your dream reveals themes connected to ${dreamInput.primaryEmotion} and personal reflection. The emotional landscape suggests you are processing feelings related to recent life experiences. The symbols in your dream act as metaphors for aspects of your inner world that need attention or integration.\n\nThis dream appears to be your mind's way of working through current challenges or transitions. The ${dreamInput.isRecurring ? 'recurring nature' : 'unique elements'} of this dream ${dreamInput.isRecurring ? 'suggests persistent themes that need resolution' : 'indicates fresh insights emerging from your subconscious'}.`,
      reflectionQuestions: [
        `How does the feeling of ${dreamInput.primaryEmotion} in your dream relate to your current life circumstances?`,
        "What aspects of your recent experiences might your dream be helping you process?",
        "How might the symbols in your dream connect to your relationships or personal goals?",
        "What insights from this dream could you apply to your waking life?"
      ]
    }
  };
}

export async function analyzeDreamClient(dreamInput: DreamInput): Promise<DreamAnalysis & { id: number }> {
  try {
    // Call the server API endpoint to analyze and save the dream
    const response = await fetch('/api/dreams/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dreamInput),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to analyze dream: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Dream analysis error:', error);
    
    // If the API call fails, fall back to mock analyzer
    // This ensures the app still works even if the server is down
    console.warn('Falling back to mock analyzer due to API error');
    await new Promise(resolve => setTimeout(resolve, 2000));
    return mockAnalyzeDream(dreamInput);
  }
}
