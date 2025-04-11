import { Moon } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { Link } from "wouter";

export default function Header() {
  return (
    <header className="relative z-10 py-6 px-4 flex items-center">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex-1">
          {/* Empty div for flex balance */}
        </div>
        
        <div className="flex-1 text-center">
          <Link href="/">
            <div className="flex items-center justify-center cursor-pointer">
              <Moon className="h-6 w-6 text-[var(--icon-primary)] mr-2" />
              <h1 className="font-heading font-bold text-3xl sm:text-4xl tracking-wide text-[var(--text-primary)]">
                V<span className="text-[var(--text-secondary)]">Dream</span>Scape
              </h1>
            </div>
          </Link>
          <p className="font-body text-[var(--text-body)] mt-1">Unlock Your Dream's Hidden Meanings</p>
        </div>
        
        <div className="flex-1 flex justify-end">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
