import { Shield, FileText, Mail } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="relative z-10 py-8 mt-12 border-t border-gray-200">
      <div className="container mx-auto px-4 text-center">
        <p className="font-body text-sm">
          VDreamScape © {new Date().getFullYear()} — Powered by Vedansh Dhawan
        </p>
        <div className="flex justify-center gap-6 mt-4">
          <Link href="/privacy" className="hover:text-[var(--text-accent)] transition-colors duration-200">
            <div className="flex flex-col items-center">
              <Shield className="h-4 w-4" />
              <span className="text-xs mt-1">Privacy</span>
            </div>
          </Link>
          <Link href="/terms" className="hover:text-[var(--text-accent)] transition-colors duration-200">
            <div className="flex flex-col items-center">
              <FileText className="h-4 w-4" />
              <span className="text-xs mt-1">Terms</span>
            </div>
          </Link>
          <Link href="/contact" className="hover:text-[var(--text-accent)] transition-colors duration-200">
            <div className="flex flex-col items-center">
              <Mail className="h-4 w-4" />
              <span className="text-xs mt-1">Contact</span>
            </div>
          </Link>
        </div>
        <p className="text-xs mt-6">
          <a href="mailto:vd.io.sb@gmail.com" className="hover:text-[var(--text-accent)] transition-colors duration-200">
            vd.io.sb@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
}
