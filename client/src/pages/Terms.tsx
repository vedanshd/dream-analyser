import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
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
          <h1 className="text-3xl font-bold text-[#2D3A6A] mb-6">Terms of Service</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-[#6D5A9E] mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing or using VDreamScape, you agree to be bound by these Terms of Service. If you do not agree to these terms, 
                please do not use our service. These terms apply to all visitors, users, and others who access or use VDreamScape.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-[#6D5A9E] mb-3">2. Service Description</h2>
              <p>
                VDreamScape provides dream analysis services that interpret dream fragments and emotions to generate complete dream narratives 
                and psychological interpretations. Our interpretations are based on common dream symbolism and psychological theories and should 
                not be considered as professional psychological advice.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-[#6D5A9E] mb-3">3. User Responsibilities</h2>
              <p>
                As a user of VDreamScape, you agree to:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Provide accurate and truthful information about your dreams</li>
                <li>Not use the service for any illegal or unauthorized purpose</li>
                <li>Not attempt to manipulate or override any security feature</li>
                <li>Not use the service to harass, abuse, or harm another person</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-[#6D5A9E] mb-3">4. Intellectual Property</h2>
              <p>
                VDreamScape and its original content, features, and functionality are and will remain the exclusive property of Vedansh Dhawan. 
                The service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection 
                with any product or service without prior written consent.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-[#6D5A9E] mb-3">5. Limitation of Liability</h2>
              <p>
                In no event shall VDreamScape, its owners, or operators be liable for any indirect, incidental, special, consequential or punitive 
                damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access 
                to or use of or inability to access or use the service.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-[#6D5A9E] mb-3">6. Disclaimer</h2>
              <p>
                VDreamScape is provided on an "AS IS" and "AS AVAILABLE" basis. The service is provided without warranties of any kind, whether 
                express or implied. Dream interpretations provided by our service are for entertainment purposes only and should not be used for 
                medical, psychological, or other professional advice.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-[#6D5A9E] mb-3">7. Changes to Terms</h2>
              <p>
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 15 days' 
                notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                <br />
                <strong>Last Updated:</strong> March 10, 2025
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-[#6D5A9E] mb-3">8. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
                <br />
                <a href="mailto:vd.io.sb@gmail.com" className="text-[#6D5A9E] hover:underline">vd.io.sb@gmail.com</a>
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}