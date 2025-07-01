import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import { ThemeProvider } from "@/lib/theme-context";

// Simple single-page app without routing
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Home />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
