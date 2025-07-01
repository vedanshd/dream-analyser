import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
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
        
        <div className="bg-white/90 rounded-lg shadow-xl p-6 md:p-8">
          <h1 className="text-3xl font-bold text-[#2D3A6A] mb-6">Privacy Policy</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-[#6D5A9E] mb-3">1. Introduction</h2>
              <p>
                Welcome to VDreamScape's Privacy Policy. At VDreamScape, we respect your privacy and are committed to protecting your personal data. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our dream analysis service.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-[#6D5A9E] mb-3">2. Information We Collect</h2>
              <p>
                To provide you with our dream analysis service, we collect:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Dream descriptions and fragments you share with us</li>
                <li>Emotional context associated with your dreams</li>
                <li>User preferences and settings</li>
                <li>Usage data to improve our service</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-[#6D5A9E] mb-3">3. How We Use Your Information</h2>
              <p>
                We use your information to:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Generate dream narratives and psychological interpretations</li>
                <li>Improve our dream analysis algorithms</li>
                <li>Enhance user experience</li>
                <li>Respond to your inquiries and support requests</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-[#6D5A9E] mb-3">4. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information from unauthorized access, 
                alteration, disclosure, or destruction. Your dream data is stored securely and only accessed for the purposes described in this policy.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-[#6D5A9E] mb-3">5. Your Rights</h2>
              <p>
                You have the right to:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of your personal data</li>
                <li>Request deletion of your data</li>
                <li>Object to our processing of your data</li>
                <li>Request restriction of processing your data</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-[#6D5A9E] mb-3">6. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or our data practices, please contact us at:
                <br />
                <a href="mailto:vd.io.sb@gmail.com" className="text-[#6D5A9E] hover:underline">vd.io.sb@gmail.com</a>
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-[#6D5A9E] mb-3">7. Policy Updates</h2>
              <p>
                We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last Updated" date.
                <br />
                <strong>Last Updated:</strong> March 10, 2025
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}