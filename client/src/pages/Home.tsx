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
    setShowHistory(true);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className="relative min-h-screen overflow-hidden font-sans">
      {/* Background Elements */}
      <StarsBackground />
      
      {/* Floating Elements */}
      <motion.div 
        className="hidden md:block absolute top-20 left-10 w-32 h-32 bg-[#B2A4D4]/20 rounded-full filter blur-3xl"
        animate={{ y: [-20, 0, -20] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ opacity: theme === 'dark' ? 0.15 : 0.2 }}
      />
      <motion.div 
        className="hidden md:block absolute bottom-20 right-10 w-40 h-40 bg-[#6D5A9E]/20 rounded-full filter blur-3xl"
        animate={{ y: [-20, 0, -20] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{ opacity: theme === 'dark' ? 0.15 : 0.2 }}
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
