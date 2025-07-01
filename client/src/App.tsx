import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Contact from "@/pages/Contact";
import { ThemeProvider } from "@/lib/theme-context";

// Get base path from the current URL for GitHub Pages
function getBasePath() {
  if (typeof window === 'undefined') return '';
  
  // For GitHub Pages, extract base path from pathname
  if (window.location.hostname.includes('github.io')) {
    const pathSegments = window.location.pathname.split('/');
    if (pathSegments.length > 1 && pathSegments[1] === 'dream-analyser') {
      return '/dream-analyser';
    }
  }
  
  return '';
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const basePath = getBasePath();
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <WouterRouter base={basePath}>
          <Router />
        </WouterRouter>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
