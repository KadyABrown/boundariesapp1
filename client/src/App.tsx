import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";

// Marketing pages (for unauthenticated users)
import MarketingHomepage from "@/pages/marketing/homepage";
import PricingPage from "@/pages/marketing/pricing";
import DemoPage from "@/pages/marketing/demo";
import FAQPage from "@/pages/marketing/faq";

// App pages (for authenticated users)
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Boundaries from "@/pages/boundaries";
import Relationships from "@/pages/relationships";
import RelationshipDetail from "@/pages/relationship-detail";
import Profile from "@/pages/profile";
import Friends from "@/pages/friends";
import Insights from "@/pages/insights";
import FlagExamples from "@/pages/flag-examples";
import BaselinePage from "@/pages/baseline";
import AdminPage from "@/pages/admin";

import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        // Marketing website for unauthenticated users
        <>
          <Route path="/" component={MarketingHomepage} />
          <Route path="/pricing" component={PricingPage} />
          <Route path="/demo" component={DemoPage} />
          <Route path="/faq" component={FAQPage} />
          <Route component={NotFound} />
        </>
      ) : (
        // App interface for authenticated users
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/boundaries" component={Boundaries} />
          <Route path="/relationships" component={Relationships} />
          <Route path="/relationships/:id" component={RelationshipDetail} />
          <Route path="/baseline" component={BaselinePage} />
          <Route path="/friends" component={Friends} />
          <Route path="/profile" component={Profile} />
          <Route path="/insights" component={Insights} />
          <Route path="/flag-examples" component={FlagExamples} />
          <Route path="/admin" component={AdminPage} />
          <Route component={NotFound} />
        </>
      )}
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
