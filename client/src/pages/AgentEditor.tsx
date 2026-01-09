import { useRoute, useLocation } from "wouter";
import { useAgent, useUpdateAgent } from "@/hooks/use-agents";
import { AgentForm } from "@/components/AgentForm";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function AgentEditor() {
  const [match, params] = useRoute("/agents/:id");
  const [, setLocation] = useLocation();
  const id = parseInt(params?.id || "0");
  const { data: agent, isLoading } = useAgent(id);
  const updateMutation = useUpdateAgent();
  const { toast } = useToast();

  const handleUpdate = async (data: any) => {
    try {
      await updateMutation.mutateAsync({ id, ...data });
      toast({ title: "Saved", description: "Agent configuration updated successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update agent", variant: "destructive" });
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
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/agents")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-display font-bold text-white">Edit Agent: {agent.name}</h2>
          <p className="text-muted-foreground">Configure behavior, voice, and LLM settings</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-8 border border-white/10">
        <AgentForm 
          defaultValues={agent}
          isLoading={updateMutation.isPending}
          onSubmit={handleUpdate}
          onCancel={() => setLocation("/agents")}
        />
      </div>
    </div>
  );
}
