import { useState } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#0A0E21] to-[#1F2444]">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="text-white mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        
        <div className="bg-white/90 rounded-lg shadow-xl p-6 md:p-8 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-[#2D3A6A] mb-6">Contact Us</h1>
          
          {isSubmitted ? (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-semibold text-[#6D5A9E] mb-2">Thank You!</h2>
              <p className="text-gray-700">Your message has been sent successfully. We'll get back to you soon.</p>
            </div>
          ) : (
            <>
              <p className="text-gray-700 mb-6">
                Have questions about your dream analysis? Want to share your experience with VDreamScape?
                We'd love to hear from you! Fill out the form below and we'll get back to you as soon as possible.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
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
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h2 className="text-xl font-semibold text-[#6D5A9E] mb-3">Other Ways to Reach Us</h2>
                <p className="text-gray-700">
                  <strong>Email:</strong>{" "}
                  <a href="mailto:vd.io.sb@gmail.com" className="text-[#6D5A9E] hover:underline">
                    vd.io.sb@gmail.com
                  </a>
                </p>
                <p className="text-gray-700 mt-2">
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