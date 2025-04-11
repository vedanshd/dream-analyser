import { 
  Compass, 
  Ghost, 
  HelpCircle, 
  Sun, 
  HeartPulse, 
  Star, 
  Cloud, 
  MoreHorizontal,
  TreePine as Plant,
  Home,
  Search,
  Smile,
  Sparkles,
  Building,
  PenTool as PenLine,
  Luggage,
  Leaf,
  Car,
  Waves,
  Mountain,
  Ship,
  Egg,
  Bird,
  Dog,
  Cat
} from "lucide-react";

// Emotion options for the primary emotion selector
export const allEmotions = [
  { value: "curious", label: "Curious", icon: "Compass" },
  { value: "afraid", label: "Afraid", icon: "Ghost" },
  { value: "confused", label: "Confused", icon: "HelpCircle" },
  { value: "peaceful", label: "Peaceful", icon: "Sun" },
  { value: "anxious", label: "Anxious", icon: "HeartPulse" },
  { value: "excited", label: "Excited", icon: "Star" },
  { value: "sad", label: "Sad", icon: "Cloud" },
  { value: "other", label: "Other", icon: "MoreHorizontal" }
];

// Extended icon map for symbol icons (dream elements)
const iconMap: Record<string, any> = {
  // Emotions
  "Compass": Compass,
  "Ghost": Ghost,
  "HelpCircle": HelpCircle,
  "Sun": Sun,
  "HeartPulse": HeartPulse,
  "Star": Star,
  "Cloud": Cloud,
  "MoreHorizontal": MoreHorizontal,
  
  // Dream objects
  "plant-line": Plant,
  "home-4-line": Home,
  "search-line": Search,
  "ghost-smile-line": Cat,
  "smile-line": Smile,
  "star-line": Sparkles,
  "building-line": Building,
  "quill-pen-line": PenLine,
  "luggage-line": Luggage,
  "leaf-line": Leaf,
  "car-line": Car,
  "water-line": Waves,
  "mountain-line": Mountain,
  "ship-line": Ship,
  "egg-line": Egg,
  "bird-line": Bird,
  "dog-line": Dog,
  "cat-line": Cat
};

export function getEmotionIcon(iconName: string) {
  // First try the exact match
  if (iconMap[iconName]) {
    return iconMap[iconName];
  }
  
  // If not found, try a fuzzy match (e.g., "plant" should match "plant-line")
  const fuzzyMatch = Object.keys(iconMap).find(key => 
    key.includes(iconName) || iconName.includes(key.replace("-line", ""))
  );
  
  if (fuzzyMatch) {
    return iconMap[fuzzyMatch];
  }
  
  // Default fallback
  return Star;
}
