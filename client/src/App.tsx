import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import AgentsList from "@/pages/AgentsList";
import AgentDetail from "@/pages/AgentDetail";
import Settings from "@/pages/Settings";
import Deployments from "@/pages/Deployments";
import WhatsAppModule from "@/pages/WhatsApp";
import Statistics from "@/pages/Statistics";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/agents" component={AgentsList} />
      <Route path="/agents/:id" component={AgentDetail} />
      <Route path="/settings" component={Settings} />
      <Route path="/deployments" component={Deployments} />
      <Route path="/whatsapp" component={WhatsAppModule} />
      <Route path="/statistics" component={Statistics} />
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
