import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/Sidebar";

import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Agents from "@/pages/Agents";
import AgentEditor from "@/pages/AgentEditor";
import Playground from "@/pages/Playground";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/agents" component={Agents} />
      <Route path="/agents/:id" component={AgentEditor} />
      <Route path="/playground" component={Playground} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex min-h-screen bg-background text-foreground font-sans">
          <Sidebar />
          <main className="flex-1 p-8 overflow-y-auto h-screen">
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
