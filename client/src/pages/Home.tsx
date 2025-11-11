import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DreamAnalyzer from "@/components/DreamAnalyzer";
import DreamHistory from "@/components/DreamHistory";
import StarsBackground from "@/components/StarsBackground";
import { DreamAnalysis } from "@shared/schema";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";

export default function Home() {
  const [showHistory, setShowHistory] = useState(false);
  const { theme } = useTheme();

  const handleSaveDream = (dreamAnalysis: DreamAnalysis & { id: number }) => {
    // Dream is already saved by the backend during analysis
    // Just show the history with a nice animation
    setShowHistory(true);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className="relative min-h-screen overflow-hidden font-sans">
      {/* Background Elements */}
      <StarsBackground />
      
      {/* Animated Floating Orbs */}
      <motion.div 
        className="hidden md:block absolute top-20 left-10 w-32 h-32 bg-[#B2A4D4]/20 rounded-full filter blur-3xl"
        animate={{ 
          y: [-20, 20, -20],
          x: [-10, 10, -10],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ opacity: theme === 'dark' ? 0.15 : 0.2 }}
      />
      <motion.div 
        className="hidden md:block absolute bottom-20 right-10 w-40 h-40 bg-[#6D5A9E]/20 rounded-full filter blur-3xl"
        animate={{ 
          y: [-20, 20, -20],
          x: [10, -10, 10],
          scale: [1, 1.15, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{ opacity: theme === 'dark' ? 0.15 : 0.2 }}
      />
      <motion.div 
        className="hidden md:block absolute top-1/2 left-1/4 w-24 h-24 bg-purple-400/10 rounded-full filter blur-2xl"
        animate={{ 
          y: [-30, 30, -30],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div 
        className="hidden md:block absolute top-1/3 right-1/4 w-28 h-28 bg-indigo-400/10 rounded-full filter blur-2xl"
        animate={{ 
          y: [30, -30, 30],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      
      {/* Content */}
  <Header showHistory={showHistory} toggleHistory={toggleHistory} />
      
      <main className="relative z-10 container mx-auto px-4 pb-16">
        <DreamAnalyzer onSaveDream={handleSaveDream} />
        <DreamHistory showHistory={showHistory} toggleHistory={toggleHistory} />
      </main>
      
      <Footer />
    </div>
  );
}
