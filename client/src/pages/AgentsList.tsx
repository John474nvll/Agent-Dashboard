import { Layout } from "@/components/Layout";
import { useAgents, useCreateAgent, useDeployAgent } from "@/hooks/use-agents";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Mic, Settings, Play, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function AgentsList() {
  const { data: agents, isLoading } = useAgents();
  const createAgent = useCreateAgent();
  const deployAgent = useDeployAgent();

  const handleCreate = () => {
    createAgent.mutate({
      name: "New Agent",
      type: "voice",
      config: {
        voice_id: "",
        llm_id: "",
        general_prompt: "You are a helpful assistant.",
      },
      isActive: false,
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-display font-bold">Agents</h1>
            <p className="text-muted-foreground mt-2">Manage and configure your AI voice workforce.</p>
          </div>
          <Button 
            onClick={handleCreate} 
            disabled={createAgent.isPending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
          >
            {createAgent.isPending ? "Creating..." : <><Plus className="mr-2 h-4 w-4" /> Create Agent</>}
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-64 border-border/50 bg-card/50">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents?.map((agent) => (
              <AgentCard 
                key={agent.id} 
                agent={agent} 
                onDeploy={() => deployAgent.mutate(agent.id)}
                isDeploying={deployAgent.isPending}
              />
            ))}
            
            {agents?.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-24 bg-card/30 border border-dashed border-border rounded-xl">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Mic className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No agents found</h3>
                <p className="text-muted-foreground mb-6">Create your first voice agent to get started.</p>
                <Button onClick={handleCreate}>Create Agent</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

function AgentCard({ agent, onDeploy, isDeploying }: { agent: any, onDeploy: () => void, isDeploying: boolean }) {
  const config = agent.config as Record<string, any>;
  
  return (
    <Card className="glass-card hover:border-primary/50 transition-all duration-300 group flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-primary border border-white/5">
              <Mic className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{agent.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={agent.isActive ? "default" : "secondary"} className="text-[10px] h-5">
                  {agent.isActive ? "Active" : "Inactive"}
                </Badge>
                <span className="text-xs text-muted-foreground capitalize">{agent.type} Agent</span>
              </div>
            </div>
          </div>
          <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {agent.description || config.general_prompt || "No description provided."}
        </p>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Voice ID</span>
            <span className="font-mono text-foreground opacity-75">{config.voice_id ? config.voice_id.slice(0, 8) + '...' : 'Not set'}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Model</span>
            <span className="font-mono text-foreground opacity-75">GPT-4o</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t border-border/50 gap-2">
        <Link href={`/agents/${agent.id}`} className="w-full">
          <Button variant="outline" className="w-full bg-transparent border-border/50 hover:bg-white/5 hover:border-primary/30">
            <Settings className="mr-2 h-4 w-4" /> Configure
          </Button>
        </Link>
        <Button 
          variant="secondary" 
          onClick={onDeploy}
          disabled={isDeploying}
          className="bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border border-transparent hover:border-primary/20"
        >
          {isDeploying ? <Radio className="h-4 w-4 animate-pulse" /> : <Play className="h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
}
