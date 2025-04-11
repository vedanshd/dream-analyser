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
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
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
  BookMarked
} from "lucide-react";

interface DreamAnalyzerProps {
  onSaveDream: (dreamAnalysis: DreamAnalysis & { id: number }) => void;
}

export default function DreamAnalyzer({ onSaveDream }: DreamAnalyzerProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [analysisResult, setAnalysisResult] = useState<(DreamAnalysis & { id: number }) | null>(null);
  const { toast } = useToast();

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

  const analyzeDreamMutation = useMutation({
    mutationFn: async (data: DreamInput) => {
      const response = await apiRequest("POST", "/api/dreams/analyze", data);
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
      queryClient.invalidateQueries({ queryKey: ['/api/dreams'] });
    },
    onError: (error) => {
      toast({
        title: "Error analyzing dream",
        description: error instanceof Error ? error.message : "An unknown error occurred",
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
    <div className="dream-card rounded-xl shadow-[0_10px_25px_-5px_rgba(109,90,158,0.2),0_10px_10px_-5px_rgba(109,90,158,0.1)] hover:shadow-[0_15px_30px_-5px_rgba(109,90,158,0.25),0_10px_15px_-5px_rgba(109,90,158,0.15)] transition-all duration-300 max-w-4xl mx-auto overflow-hidden bg-card backdrop-blur-md border border-[var(--border-color)]">
      {/* Progress Bar */}
      <div className="bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] p-1">
        <Progress value={(currentStep / totalSteps) * 100} className="h-2 rounded-sm bg-black/10 progress-indicator" />
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
                <div className="text-center mb-8">
                  <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-[var(--heading-color)] mb-3">Welcome to VDreamScape</h2>
                  <p className="font-body text-gray-600 max-w-2xl mx-auto">
                    Unlock the mysteries of your dreams through advanced dream analysis. Share fragments of what you remember, and we'll help you understand their deeper meaning.
                  </p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6 justify-center">
                  <div className="flex-1 p-5 border border-[var(--border-color)] rounded-lg bg-card text-center">
                    <QuillPen className="mx-auto h-6 w-6 text-[var(--text-secondary)] mb-2" />
                    <h3 className="font-heading font-medium text-lg mb-2">Share Dream Fragments</h3>
                    <p className="font-body text-sm">Tell us what you remember from your dream, even small details matter.</p>
                  </div>
                  
                  <div className="flex-1 p-5 border border-[var(--border-color)] rounded-lg bg-card text-center">
                    <FaceSmile className="mx-auto h-6 w-6 text-[var(--text-secondary)] mb-2" />
                    <h3 className="font-heading font-medium text-lg mb-2">Record Your Emotions</h3>
                    <p className="font-body text-sm">How did you feel during and after the dream? Emotions provide valuable context.</p>
                  </div>
                  
                  <div className="flex-1 p-5 border border-[var(--border-color)] rounded-lg bg-card text-center">
                    <BookMarked className="mx-auto h-6 w-6 text-[var(--text-secondary)] mb-2" />
                    <h3 className="font-heading font-medium text-lg mb-2">Receive Analysis</h3>
                    <p className="font-body text-sm">Get a complete dream narrative and psychological interpretation.</p>
                  </div>
                </div>
                
                <div className="flex justify-center mt-8">
                  <Button 
                    onClick={handleNextStep}
                    className="px-8 py-6 bg-[var(--text-secondary)] hover:bg-[var(--text-accent)] text-white font-heading font-medium rounded-full transition-colors duration-300"
                  >
                    Begin Analysis
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
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
                          <Textarea 
                            placeholder="Describe what you remember: people, places, objects, actions, feelings, or any other details that stood out to you..." 
                            className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-[#6D5A9E]/50 focus:border-[#6D5A9E]"
                            rows={6}
                            {...field} 
                          />
                        </FormControl>
                        <p className="mt-1 text-sm text-gray-500 font-body">Be as detailed as possible, but don't worry if your memory is fragmented.</p>
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
                <div className="text-center mb-6">
                  <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-[var(--heading-color)] mb-3">How Did You Feel?</h2>
                  <p className="font-body text-gray-600 max-w-2xl mx-auto">
                    Select the emotions you felt during the dream and upon waking up. This helps us understand the emotional context.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="primaryEmotion"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="block font-heading font-medium text-gray-700">Primary emotion during the dream</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {allEmotions.map((emotion) => {
                              const EmotionIcon = getEmotionIcon(emotion.value);
                              return (
                                <div key={emotion.value} className="relative">
                                  <input 
                                    type="radio"
                                    id={`emotion-${emotion.value}`}
                                    value={emotion.value}
                                    checked={field.value === emotion.value}
                                    onChange={() => field.onChange(emotion.value)}
                                    className="peer sr-only"
                                  />
                                  <label 
                                    htmlFor={`emotion-${emotion.value}`} 
                                    className={cn(
                                      "flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50",
                                      field.value === emotion.value ? "border-[var(--text-secondary)] bg-[var(--icon-bg)]" : "border-gray-200"
                                    )}
                                  >
                                    <EmotionIcon className="h-6 w-6 text-[var(--text-secondary)] mb-2" />
                                    <span className="font-body text-center">{emotion.label}</span>
                                  </label>
                                </div>
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
                        <FormLabel className="block font-heading font-medium text-gray-700">How did you feel upon waking?</FormLabel>
                        <div className="flex items-center space-x-3 my-3">
                          <span className="text-sm font-body text-gray-500">Unsettled</span>
                          <FormControl>
                            <Slider
                              min={1}
                              max={5}
                              step={1}
                              value={[field.value]}
                              onValueChange={(values) => field.onChange(values[0])}
                              className="w-full h-2 bg-gray-200 rounded-lg accent-[#6D5A9E]"
                            />
                          </FormControl>
                          <span className="text-sm font-body text-gray-500">Refreshed</span>
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
                    <div className="text-center mb-8">
                      <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-[var(--heading-color)] mb-3">Interpreting Your Dream</h2>
                      <p className="font-body text-gray-600 max-w-2xl mx-auto">
                        We're analyzing your dream fragments and emotions to create a complete narrative and psychological interpretation.
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center">
                      <div className="relative w-24 h-24">
                        <div className="absolute inset-0 rounded-full border-4 border-[#B2A4D4]/30 border-dashed animate-spin"></div>
                        <div className="absolute inset-2 flex items-center justify-center">
                          <Sparkles className="h-8 w-8 text-[var(--icon-primary)] animate-pulse" />
                        </div>
                      </div>
                      <p className="font-body text-gray-500 mt-4">This may take a moment...</p>
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
                    <div className="flex flex-col sm:flex-row gap-4 justify-between pt-4">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={startNewAnalysis}
                        className="px-5 py-2.5 border border-[var(--border-color)] hover:bg-[var(--button-hover-bg)] font-heading font-medium rounded-full transition-colors duration-300"
                      >
                        <RefreshCw className="mr-2 h-4 w-4 text-[var(--icon-primary)]" />
                        New Analysis
                      </Button>
                      
                      <div className="flex gap-3">
                        <Button 
                          type="button"
                          onClick={handleSaveAnalysis}
                          className="px-5 py-2.5 bg-[var(--button-secondary)] hover:bg-[var(--button-secondary-hover)] text-white font-heading font-medium rounded-full transition-colors duration-300"
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                        
                        <Button 
                          type="button"
                          onClick={handleShareAnalysis}
                          className="px-5 py-2.5 bg-[var(--text-secondary)] hover:bg-[var(--text-accent)] text-white font-heading font-medium rounded-full transition-colors duration-300"
                        >
                          <Share className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </Form>
    </div>
  );
}
