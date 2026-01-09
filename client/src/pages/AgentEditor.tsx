import { useRoute, useLocation } from "wouter";
import { useAgent, useUpdateAgent, useActivityLogs } from "@/hooks/use-agents";
import { AgentForm } from "@/components/AgentForm";
import { ArrowLeft, Loader2, CloudIcon, PlayIcon, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AgentEditor() {
  const [match, params] = useRoute("/agents/:id");
  const [, setLocation] = useLocation();
  const id = parseInt(params?.id || "0");
  const { data: agent, isLoading } = useAgent(id);
  const { data: logs } = useActivityLogs(id);
  const updateMutation = useUpdateAgent();
  const { toast } = useToast();
  const [isDeploying, setIsDeploying] = useState(false);

  const handleUpdate = async (data: any) => {
    try {
      await updateMutation.mutateAsync({ id, ...data });
      toast({ title: "Saved", description: "Agent configuration updated successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update agent", variant: "destructive" });
    }
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      const res = await apiRequest("POST", `/api/agents/${id}/deploy`);
      const data = await res.json();
      toast({ 
        title: "Deployed", 
        description: `Agent successfully connected to Retell AI. ID: ${data.agentId}` 
      });
    } catch (error) {
      toast({ title: "Deployment Error", description: "Failed to deploy to Retell AI", variant: "destructive" });
    } finally {
      setIsDeploying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-12 w-1/3 bg-white/5" />
        <Skeleton className="h-[600px] w-full rounded-2xl bg-white/5" />
      </div>
    );
  }

  if (!agent) {
    return <div className="text-center py-12">Agent not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/agents")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-display font-bold text-white">Edit Agent: {agent.name}</h2>
            <p className="text-muted-foreground">Configure behavior, voice, and LLM settings</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="border-white/10 hover:bg-white/5"
            onClick={() => setLocation("/playground")}
          >
            <PlayIcon className="h-4 w-4 mr-2" />
            Test in Playground
          </Button>
          <Button 
            variant="default"
            onClick={handleDeploy}
            disabled={isDeploying}
          >
            {isDeploying ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CloudIcon className="h-4 w-4 mr-2" />}
            {agent.isDeployed === "true" ? "Re-deploy" : "Deploy to Retell"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="config" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 p-1 mb-6">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="activity">
            <History className="h-4 w-4 mr-2" />
            Activity Logs
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="config">
          <div className="glass-card rounded-2xl p-8 border border-white/10">
            <AgentForm 
              defaultValues={agent}
              isLoading={updateMutation.isPending}
              onSubmit={handleUpdate}
              onCancel={() => setLocation("/agents")}
            />
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <div className="glass-card rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {logs?.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No activity logs found for this agent.
                </div>
              ) : (
                logs?.map((log: any) => (
                  <div key={log.id} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className={`mt-1 w-2 h-2 rounded-full ${
                      log.type === 'deployment' ? 'bg-blue-500' : 'bg-green-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold uppercase text-xs tracking-wider">{log.type}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{log.details}</p>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground/50">{log.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
