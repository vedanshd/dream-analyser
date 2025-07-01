import { useState } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StarsBackground from "@/components/StarsBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/lib/theme-context";
import { motion } from "framer-motion";

export default function Contact() {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, we would send this data to an API
    // For now, we'll just simulate success
    setIsSubmitted(true);
    toast({
      title: "Message Sent",
      description: "We'll get back to you as soon as possible!",
    });
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setName("");
      setEmail("");
      setMessage("");
      setIsSubmitted(false);
    }, 3000);
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
      
      <Header />
      
      <main className="relative z-10 container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg shadow-xl p-6 md:p-8 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-[var(--heading-color)] mb-6">Contact Us</h1>
          
          {isSubmitted ? (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-semibold text-[var(--text-secondary)] mb-2">Thank You!</h2>
              <p className="text-[var(--text-body)]">Your message has been sent successfully. We'll get back to you soon.</p>
            </div>
          ) : (
            <>
              <p className="text-[var(--text-body)] mb-6">
                Have questions about your dream analysis? Want to share your experience with VDreamScape?
                We'd love to hear from you! Fill out the form below and we'll get back to you as soon as possible.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="What would you like to tell us?"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full resize-none"
                  />
                </div>
                
                <Button type="submit" className="w-full bg-gradient-to-r from-[#6D5A9E] to-[#2D3A6A] hover:opacity-90">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
              
              <div className="mt-8 pt-6 border-t border-[var(--border-color)]">
                <h2 className="text-xl font-semibold text-[var(--text-secondary)] mb-3">Other Ways to Reach Us</h2>
                <p className="text-[var(--text-body)]">
                  <strong>Email:</strong>{" "}
                  <a href="mailto:vd.io.sb@gmail.com" className="text-[var(--text-secondary)] hover:underline">
                    vd.io.sb@gmail.com
                  </a>
                </p>
                <p className="text-[var(--text-body)] mt-2">
                  <strong>Hours:</strong> Monday - Friday, 9am - 5pm EST
                </p>
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}