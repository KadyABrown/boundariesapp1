import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
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
import Admin from "@/pages/admin";
import Feedback from "@/pages/feedback";
import Pricing from "@/pages/pricing";
import Demo from "@/pages/demo-clean";
import FAQ from "@/pages/faq";
import Subscribe from "@/pages/subscribe";
import SubscriptionSuccess from "@/pages/subscription-success";

import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Public routes accessible without authentication */}
      <Route path="/pricing" component={Pricing} />
      <Route path="/demo" component={Demo} />
      <Route path="/faq" component={FAQ} />
      <Route path="/subscribe" component={Subscribe} />
      <Route path="/subscription-success" component={SubscriptionSuccess} />
      
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/boundaries" component={Boundaries} />
          <Route path="/relationships" component={Relationships} />
          <Route path="/relationships/:id" component={RelationshipDetail} />
          <Route path="/baseline" component={BaselinePage} />
          <Route path="/friends" component={Friends} />
          <Route path="/profile" component={Profile} />
          <Route path="/insights" component={Insights} />
          <Route path="/feedback" component={Feedback} />
          <Route path="/admin" component={Admin} />
        </>
      )}
      <Route component={NotFound} />
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
