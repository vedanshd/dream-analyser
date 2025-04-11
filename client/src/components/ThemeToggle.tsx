import React from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { AnimatePresence, motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="rounded-full px-3 py-2 border border-[var(--border-accent)] bg-[var(--background-accent)] hover:bg-[var(--background-accent-hover)] transition-all duration-300"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center"
        >
          {theme === "light" ? (
            <>
              <Moon className="h-4 w-4 mr-2 text-[var(--text-accent)]" />
              <span className="text-sm font-medium">Dark Mode</span>
            </>
          ) : (
            <>
              <Sun className="h-4 w-4 mr-2 text-[var(--text-accent)]" />
              <span className="text-sm font-medium">Light Mode</span>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </Button>
  );
}