import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { 
  dreamInputSchema, 
  type DreamInput, 
  type DreamAnalysis 
} from "@shared/schema";
import { cn } from "@/lib/utils";
import { analyzeDreamClient } from "@/lib/openai-client";
import { useToast } from "@/hooks/use-toast";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { allEmotions, getEmotionIcon } from "@/lib/emotions";
import { motion, AnimatePresence } from "framer-motion";

// Icons
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  BookOpen, 
  Brain, 
  RefreshCw, 
  Save, 
  Share, 
  PenTool as QuillPen, 
  Smile as FaceSmile, 
  BookMarked,
  Mic,
  MicOff
} from "lucide-react";

interface DreamAnalyzerProps {
  onSaveDream: (dreamAnalysis: DreamAnalysis & { id: number }) => void;
}

export default function DreamAnalyzer({ onSaveDream }: DreamAnalyzerProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [analysisResult, setAnalysisResult] = useState<(DreamAnalysis & { id: number }) | null>(null);
  const { toast } = useToast();
  
  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  const form = useForm<DreamInput>({
    resolver: zodResolver(dreamInputSchema),
    defaultValues: {
      title: "",
      dreamCues: "",
      isRecurring: false,
      primaryEmotion: "curious",
      wakeFeeling: 3,
      additionalEmotions: "",
    },
  });

  const [apiError, setApiError] = useState<string | null>(null);

  const analyzeDreamMutation = useMutation({
    mutationFn: async (data: DreamInput) => {
      setApiError(null); // Clear any previous errors
      return await analyzeDreamClient(data);
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
      setApiError(null);
    },
    onError: (error) => {
      let errorMessage = "An unknown error occurred";
      
      if (error instanceof Error) {
        // Try to parse the error message to extract validation errors
        try {
          const errorText = error.message;
          // Extract JSON from error message if it exists
          const jsonMatch = errorText.match(/\{.*\}/);
          if (jsonMatch) {
            const errorData = JSON.parse(jsonMatch[0]);
            errorMessage = errorData.message || errorMessage;
          } else {
            errorMessage = errorText;
          }
        } catch {
          errorMessage = error.message;
        }
      }
      
      setApiError(errorMessage);
      
      // Show toast for all errors
      toast({
        title: "Error analyzing dream",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Voice recording functions
  const startVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Voice recognition not supported",
        description: "Your browser doesn't support voice input. Try Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';

    let finalTranscript = '';

    recognitionInstance.onstart = () => {
      setIsRecording(true);
      toast({
        title: "🎤 Recording started",
        description: "Speak your dream details...",
      });
    };

    recognitionInstance.onresult = (event: any) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      // Update the form field with the transcript
      const currentValue = form.getValues('dreamCues');
      const newValue = currentValue ? currentValue + ' ' + finalTranscript + interimTranscript : finalTranscript + interimTranscript;
      form.setValue('dreamCues', newValue.trim());
    };

    recognitionInstance.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      toast({
        title: "Recording error",
        description: `Error: ${event.error}`,
        variant: "destructive",
      });
    };

    recognitionInstance.onend = () => {
      setIsRecording(false);
    };

    recognitionInstance.start();
    setRecognition(recognitionInstance);
  };

  const stopVoiceRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
      toast({
        title: "Recording stopped",
        description: "Your voice input has been added to the dream details.",
      });
    }
  };

  const submitDreamCues = async () => {
    const dreamCuesValid = await form.trigger(["dreamCues", "title", "isRecurring"]);
    if (dreamCuesValid) {
      handleNextStep();
    }
  };

  const submitEmotions = form.handleSubmit((data) => {
    analyzeDreamMutation.mutate(data);
    handleNextStep();
  });

  const startNewAnalysis = () => {
    form.reset();
    setAnalysisResult(null);
    setCurrentStep(1);
  };

  const handleSaveAnalysis = () => {
    if (analysisResult) {
      onSaveDream(analysisResult);
      toast({
        title: "Dream saved",
        description: "Your dream analysis has been saved to your history.",
      });
    }
  };

  const handleShareAnalysis = () => {
    if (navigator.share && analysisResult) {
      navigator.share({
        title: analysisResult.title,
        text: `Check out my dream analysis: ${analysisResult.title}`,
        url: window.location.href,
      }).catch(() => {
        toast({
          title: "Sharing unavailable",
          description: "Couldn't share this dream analysis.",
        });
      });
    } else {
      toast({
        title: "Sharing unavailable",
        description: "Web Share API is not supported in your browser.",
      });
    }
  };

  return (
    <motion.div 
      className="dream-card rounded-2xl shadow-[0_10px_25px_-5px_rgba(109,90,158,0.2),0_10px_10px_-5px_rgba(109,90,158,0.1)] hover:shadow-[0_20px_40px_-5px_rgba(109,90,158,0.3),0_10px_20px_-5px_rgba(109,90,158,0.2)] transition-all duration-500 max-w-4xl mx-auto overflow-hidden bg-card backdrop-blur-md border border-[var(--border-color)] relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
      
      {/* Progress Bar */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 p-1 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <Progress value={(currentStep / totalSteps) * 100} className="h-2 rounded-sm bg-black/10 progress-indicator relative z-10" />
      </div>
      
      {/* Step Content Container */}
      <Form {...form}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="p-6 sm:p-8"
          >
            {/* Step 1: Introduction */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <motion.div 
                  className="text-center mb-8"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-block mb-4"
                  >
                    <Sparkles className="h-12 w-12 text-[var(--text-accent)] mx-auto" />
                  </motion.div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-[var(--heading-color)] mb-3">
                    Welcome to VDreamScape ✨
                  </h2>
                  <p className="font-body text-[var(--text-body)] max-w-2xl mx-auto">
                    Unlock the mysteries of your dreams through advanced dream analysis. Share fragments of what you remember, and we'll help you understand their deeper meaning.
                  </p>
                </motion.div>
                
                <div className="flex flex-col md:flex-row gap-6 justify-center">
                  <motion.div 
                    className="flex-1 p-6 border border-[var(--border-color)] rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ y: -5 }}
                  >
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <QuillPen className="mx-auto h-8 w-8 text-purple-600 dark:text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                    </motion.div>
                    <h3 className="font-heading font-medium text-lg mb-2 text-[var(--text-primary)]">Share Dream Fragments</h3>
                    <p className="font-body text-sm text-[var(--text-body)]">Tell us what you remember from your dream, even small details matter.</p>
                  </motion.div>
                  
                  <motion.div 
                    className="flex-1 p-6 border border-[var(--border-color)] rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ y: -5 }}
                  >
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    >
                      <FaceSmile className="mx-auto h-8 w-8 text-pink-600 dark:text-pink-400 mb-3 group-hover:scale-110 transition-transform" />
                    </motion.div>
                    <h3 className="font-heading font-medium text-lg mb-2 text-[var(--text-primary)]">Record Your Emotions</h3>
                    <p className="font-body text-sm text-[var(--text-body)]">How did you feel during and after the dream? Emotions provide valuable context.</p>
                  </motion.div>
                  
                  <motion.div 
                    className="flex-1 p-6 border border-[var(--border-color)] rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ y: -5 }}
                  >
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                    >
                      <BookMarked className="mx-auto h-8 w-8 text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                    </motion.div>
                    <h3 className="font-heading font-medium text-lg mb-2 text-[var(--text-primary)]">Receive Analysis</h3>
                    <p className="font-body text-sm text-[var(--text-body)]">Get a complete dream narrative and psychological interpretation.</p>
                  </motion.div>
                </div>
                
                <motion.div 
                  className="flex justify-center mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button 
                    onClick={handleNextStep}
                    className="px-8 py-6 bg-gradient-to-r from-[var(--text-secondary)] to-[var(--text-accent)] hover:from-[var(--text-accent)] hover:to-[var(--text-secondary)] text-white font-heading font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Begin Analysis ✨
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            )}
            
            {/* Step 2: Dream Cues Input */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-[var(--heading-color)] mb-3">Remember Your Dream</h2>
                  <p className="font-body text-gray-600 max-w-2xl mx-auto">
                    Share as many details as you can recall from your dream. Even fragments or impressions are valuable.
                  </p>
                </div>
                
                <div className="space-y-5">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-heading font-medium text-gray-700">Give your dream a title (optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="A short title to identify this dream" 
                            className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-[#6D5A9E]/50 focus:border-[#6D5A9E]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dreamCues"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-heading font-medium text-gray-700">Dream fragments & details</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Textarea 
                              placeholder="Describe what you remember: people, places, objects, actions, feelings, or any other details that stood out to you..." 
                              className="w-full p-3 pr-12 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-[#6D5A9E]/50 focus:border-[#6D5A9E]"
                              rows={6}
                              {...field} 
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className={cn(
                                "absolute right-2 top-2 rounded-full",
                                isRecording && "bg-red-100 text-red-600 animate-pulse"
                              )}
                              onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                              title={isRecording ? "Stop recording" : "Start voice recording"}
                            >
                              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                            </Button>
                          </div>
                        </FormControl>
                        <p className="mt-1 text-sm text-gray-500 font-body">
                          Be as detailed as possible, but don't worry if your memory is fragmented. 
                          {' '}<strong className="text-[var(--text-accent)]">Click the mic to use voice input!</strong>
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isRecurring"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="font-heading font-medium text-gray-700">Did this dream recur or feel familiar?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => field.onChange(value === "yes")}
                            defaultValue={field.value ? "yes" : "no"}
                            className="flex gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="recurring-yes" />
                              <label htmlFor="recurring-yes" className="font-body">Yes</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="recurring-no" />
                              <label htmlFor="recurring-no" className="font-body">No</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="unsure" id="recurring-unsure" />
                              <label htmlFor="recurring-unsure" className="font-body">Unsure</label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex gap-4 justify-between pt-4">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={handlePreviousStep}
                      className="px-5 py-2 border border-gray-300 hover:bg-gray-50 font-heading font-medium rounded-full transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    
                    <Button 
                      type="button"
                      onClick={submitDreamCues}
                      className="px-6 py-2.5 bg-[var(--text-secondary)] hover:bg-[var(--text-accent)] text-white font-heading font-medium rounded-full transition-colors duration-300"
                    >
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Emotions */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <motion.div 
                  className="text-center mb-6"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-block mb-4"
                  >
                    <FaceSmile className="h-12 w-12 text-pink-500 mx-auto" />
                  </motion.div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-[var(--heading-color)] mb-3">How Did You Feel? 💭</h2>
                  <p className="font-body text-[var(--text-body)] max-w-2xl mx-auto">
                    Select the emotions you felt during the dream and upon waking up. This helps us understand the emotional context.
                  </p>
                </motion.div>
                
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="primaryEmotion"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="block font-heading font-medium text-[var(--text-primary)]">Primary emotion during the dream</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {allEmotions.map((emotion, index) => {
                              const EmotionIcon = getEmotionIcon(emotion.value);
                              const isSelected = field.value === emotion.value;
                              return (
                                <motion.div 
                                  key={emotion.value} 
                                  className="relative"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.05 }}
                                  whileHover={{ scale: 1.05, y: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <input 
                                    type="radio"
                                    id={`emotion-${emotion.value}`}
                                    value={emotion.value}
                                    checked={isSelected}
                                    onChange={() => field.onChange(emotion.value)}
                                    className="peer sr-only"
                                  />
                                  <label 
                                    htmlFor={`emotion-${emotion.value}`} 
                                    className={cn(
                                      "flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 relative overflow-hidden",
                                      isSelected
                                        ? "border-[var(--primary-accent)] bg-gradient-to-br from-[var(--primary-accent)] to-purple-600 text-white shadow-lg" 
                                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                                    )}
                                  >
                                    {isSelected && (
                                      <motion.div
                                        className="absolute inset-0 bg-white/20"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 2, opacity: 0 }}
                                        transition={{ duration: 0.6 }}
                                      />
                                    )}
                                    <motion.div
                                      animate={isSelected ? { rotate: [0, -10, 10, 0], y: [0, -5, 0] } : {}}
                                      transition={{ duration: 0.5 }}
                                    >
                                      <EmotionIcon className={cn(
                                        "h-7 w-7 mb-2",
                                        isSelected ? "text-white" : "text-[var(--text-secondary)]"
                                      )} />
                                    </motion.div>
                                    <span className={cn(
                                      "font-body text-center text-sm",
                                      isSelected ? "text-white font-semibold" : "text-[var(--text-body)]"
                                    )}>{emotion.label}</span>
                                  </label>
                                </motion.div>
                              );
                            })}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="wakeFeeling"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block font-heading font-medium text-[var(--text-primary)]">How did you feel upon waking?</FormLabel>
                        <div className="bg-gradient-to-r from-red-50 via-yellow-50 to-green-50 dark:from-red-950/30 dark:via-yellow-950/30 dark:to-green-950/30 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between mb-4">
                            <motion.span 
                              className="text-2xl"
                              animate={{ rotate: field.value <= 2 ? [-5, 5, -5] : 0 }}
                              transition={{ duration: 1, repeat: field.value <= 2 ? Infinity : 0 }}
                            >
                              😰
                            </motion.span>
                            <motion.span 
                              className="text-2xl"
                              animate={{ rotate: field.value === 3 ? [-5, 5, -5] : 0 }}
                              transition={{ duration: 1, repeat: field.value === 3 ? Infinity : 0 }}
                            >
                              😐
                            </motion.span>
                            <motion.span 
                              className="text-2xl"
                              animate={{ rotate: field.value >= 4 ? [-5, 5, -5] : 0, y: field.value >= 4 ? [0, -5, 0] : 0 }}
                              transition={{ duration: 1, repeat: field.value >= 4 ? Infinity : 0 }}
                            >
                              😊
                            </motion.span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-body text-gray-600 dark:text-gray-400 min-w-fit">Unsettled</span>
                            <FormControl>
                              <Slider
                                min={1}
                                max={5}
                                step={1}
                                value={[field.value]}
                                onValueChange={(values) => field.onChange(values[0])}
                                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
                              />
                            </FormControl>
                            <span className="text-sm font-body text-gray-600 dark:text-gray-400 min-w-fit">Refreshed</span>
                          </div>
                          <div className="text-center mt-3">
                            <span className="text-lg font-semibold text-[var(--text-primary)]">
                              {field.value === 1 && "Very Unsettled"}
                              {field.value === 2 && "Somewhat Unsettled"}
                              {field.value === 3 && "Neutral"}
                              {field.value === 4 && "Somewhat Refreshed"}
                              {field.value === 5 && "Very Refreshed"}
                            </span>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="additionalEmotions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block font-heading font-medium text-gray-700">Additional emotional context (optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any additional emotional context about your dream or how it made you feel..." 
                            className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-[#6D5A9E]/50 focus:border-[#6D5A9E]"
                            rows={3}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Error Message Display */}
                  {apiError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-red-800">
                            {apiError}
                          </p>
                          <p className="text-xs text-red-600 mt-1">
                            Please provide a clear description of your dream using real words and complete thoughts.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-4 justify-between pt-4">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={handlePreviousStep}
                      className="px-5 py-2 border border-gray-300 hover:bg-gray-50 font-heading font-medium rounded-full transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    
                    <Button 
                      type="submit"
                      onClick={submitEmotions}
                      className="px-6 py-2.5 bg-[var(--text-secondary)] hover:bg-[var(--text-accent)] text-white font-heading font-medium rounded-full transition-colors duration-300"
                    >
                      Analyze Dream
                      <Sparkles className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 4: Results */}
            {currentStep === 4 && (
              <div className="space-y-6">
                {/* Loading State */}
                {analyzeDreamMutation.isPending && (
                  <div className="py-10">
                    <motion.div 
                      className="text-center mb-8"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-[var(--heading-color)] mb-3">Interpreting Your Dream ✨</h2>
                      <p className="font-body text-[var(--text-body)] max-w-2xl mx-auto">
                        We're analyzing your dream fragments and emotions to create a complete narrative and psychological interpretation.
                      </p>
                    </motion.div>
                    
                    <div className="flex flex-col items-center justify-center">
                      <div className="relative w-32 h-32">
                        {/* Outer spinning ring */}
                        <motion.div 
                          className="absolute inset-0 rounded-full border-4 border-purple-300/40 dark:border-purple-700/40 border-t-purple-600 dark:border-t-purple-400"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                        {/* Middle spinning ring */}
                        <motion.div 
                          className="absolute inset-3 rounded-full border-4 border-pink-300/40 dark:border-pink-700/40 border-b-pink-600 dark:border-b-pink-400"
                          animate={{ rotate: -360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                        {/* Inner pulsing sparkle */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            animate={{ 
                              scale: [1, 1.2, 1],
                              rotate: [0, 180, 360]
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <Sparkles className="h-10 w-10 text-[var(--text-accent)]" />
                          </motion.div>
                        </div>
                      </div>
                      
                      {/* Floating emoji particles */}
                      <div className="relative mt-8 w-full h-16">
                        {['✨', '💭', '🌙', '⭐', '💫'].map((emoji, i) => (
                          <motion.span
                            key={i}
                            className="absolute text-2xl"
                            style={{ left: `${20 + i * 15}%` }}
                            animate={{
                              y: [-20, -60, -20],
                              opacity: [0, 1, 0],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              delay: i * 0.4,
                              ease: "easeInOut"
                            }}
                          >
                            {emoji}
                          </motion.span>
                        ))}
                      </div>
                      
                      <motion.p 
                        className="font-body text-[var(--text-body)] mt-4"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        This may take a moment...
                      </motion.p>
                    </div>
                  </div>
                )}
                
                {/* Results View */}
                {!analyzeDreamMutation.isPending && analysisResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Dream Narrative Section */}
                    <div className="mb-10">
                      <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] mb-4 flex items-center">
                        <BookOpen className="mr-2 h-6 w-6 text-[var(--icon-primary)]" />
                        Complete Dream Narrative
                      </h2>
                      
                      <Card className="bg-[var(--card-bg)] border-[var(--card-border)] shadow-[var(--card-shadow)]">
                        <CardContent className="p-6">
                          <h3 className="font-heading text-xl font-medium text-[var(--text-secondary)] mb-3">{analysisResult.title}</h3>
                          
                          <div className="prose prose-sm sm:prose font-body text-[var(--text-body)] max-w-none">
                            {analysisResult.dreamNarrative.split('\n\n').map((paragraph, i) => (
                              <p key={i}>{paragraph}</p>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Psychological Analysis Section */}
                    <div className="mb-8">
                      <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] mb-4 flex items-center">
                        <Brain className="mr-2 h-6 w-6 text-[var(--icon-primary)]" />
                        Psychological Interpretation
                      </h2>
                      
                      <div className="space-y-6">
                        {/* Key Symbols */}
                        <Card className="bg-[var(--card-bg)] border-[var(--card-border)] shadow-[var(--card-shadow)]">
                          <CardContent className="p-6">
                            <h3 className="font-heading text-xl font-medium text-[var(--text-secondary)] mb-3">Key Symbols</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {analysisResult.psychologicalReport.keySymbols.map((symbol, index) => {
                                const SymbolIcon = getEmotionIcon(symbol.icon);
                                return (
                                  <div className="flex" key={index}>
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[var(--icon-bg)] flex items-center justify-center">
                                      <SymbolIcon className="h-5 w-5 text-[var(--text-secondary)]" />
                                    </div>
                                    <div className="ml-4">
                                      <h4 className="font-heading font-medium text-[var(--text-primary)]">{symbol.symbol}</h4>
                                      <p className="font-body text-sm text-[var(--text-body)]">{symbol.meaning}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </CardContent>
                        </Card>
                        
                        {/* Analysis Summary */}
                        <Card className="bg-[var(--card-bg)] border-[var(--card-border)] shadow-[var(--card-shadow)]">
                          <CardContent className="p-6">
                            <h3 className="font-heading text-xl font-medium text-[var(--text-secondary)] mb-3">Analysis Summary</h3>
                            
                            <div className="prose prose-sm sm:prose font-body text-[var(--text-body)] max-w-none">
                              {analysisResult.psychologicalReport.analysisSummary.split('\n\n').map((paragraph, i) => (
                                <p key={i}>{paragraph}</p>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                        
                        {/* Reflection Questions */}
                        <Card className="bg-[var(--card-bg)] border-[var(--card-border)] shadow-[var(--card-shadow)]">
                          <CardContent className="p-6">
                            <h3 className="font-heading text-xl font-medium text-[var(--text-secondary)] mb-3">Questions for Reflection</h3>
                            
                            <ul className="space-y-2 font-body text-[var(--text-body)]">
                              {analysisResult.psychologicalReport.reflectionQuestions.map((question, index) => (
                                <li className="flex items-start" key={index}>
                                  <span className="text-[var(--text-accent)] mt-1 mr-2">•</span>
                                  <span>{question}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between pt-6">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={startNewAnalysis}
                          className="w-full sm:w-auto px-6 py-3 border-2 border-[var(--border-color)] hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 dark:hover:from-purple-950/30 dark:hover:to-indigo-950/30 font-heading font-medium rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="inline-block mr-2"
                          >
                            <RefreshCw className="h-4 w-4 text-[var(--icon-primary)]" />
                          </motion.div>
                          New Analysis
                        </Button>
                      </motion.div>
                      
                      <div className="flex gap-3">
                        <motion.div
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button 
                            type="button"
                            onClick={handleSaveAnalysis}
                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-heading font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                          >
                            <Save className="mr-2 h-4 w-4" />
                            Save Dream
                          </Button>
                        </motion.div>
                        
                        <motion.div
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button 
                            type="button"
                            onClick={handleShareAnalysis}
                            className="px-6 py-3 bg-gradient-to-r from-[var(--text-secondary)] to-[var(--text-accent)] hover:from-[var(--text-accent)] hover:to-purple-700 text-white font-heading font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                          >
                            <Share className="mr-2 h-4 w-4" />
                            Share
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </Form>
    </motion.div>
  );
}
