import { useState } from "react";
import { useAgents, useCreateAgent, useDeleteAgent } from "@/hooks/use-agents";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Search, MoreVertical, Edit2, Trash2, Play } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AgentForm } from "@/components/AgentForm";
import { Link, useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import clsx from "clsx";

export default function Agents() {
  const { data: agents, isLoading } = useAgents();
  const createMutation = useCreateAgent();
  const deleteMutation = useDeleteAgent();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleCreate = async (data: any) => {
    try {
      await createMutation.mutateAsync(data);
      setIsCreateOpen(false);
      toast({ title: "Success", description: "Agent created successfully" });
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this agent?")) {
      try {
        await deleteMutation.mutateAsync(id);
        toast({ title: "Deleted", description: "Agent removed successfully" });
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete agent", variant: "destructive" });
      }
    }
  };

  const filteredAgents = agents?.filter(agent => 
    agent.name.toLowerCase().includes(search.toLowerCase()) || 
    agent.agentId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-white">Agents</h2>
          <p className="text-muted-foreground mt-1">Manage and configure your voice assistants</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4 mr-2" />
              New Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl bg-card border-white/10 text-foreground">
            <DialogHeader>
              <DialogTitle>Create New Agent</DialogTitle>
            </DialogHeader>
            <AgentForm 
              isLoading={createMutation.isPending} 
              onSubmit={handleCreate} 
              onCancel={() => setIsCreateOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 bg-card/50 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search agents..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none focus-visible:ring-0 text-lg placeholder:text-muted-foreground/50"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents?.map((agent) => {
            const config = agent.config as any;
            const isPublished = config?.is_published;
            
            return (
              <div key={agent.id} className="glass-card rounded-2xl p-6 group hover:border-primary/50 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className={clsx(
                    "px-2.5 py-1 rounded-full text-xs font-medium border",
                    isPublished 
                      ? "bg-green-500/10 text-green-500 border-green-500/20" 
                      : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                  )}>
                    {isPublished ? "Published" : "Draft"}
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-white/10 text-foreground">
                      <DropdownMenuItem asChild>
                        <Link href={`/agents/${agent.id}`}>
                          <Edit2 className="h-4 w-4 mr-2" /> Edit Configuration
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
                        onClick={() => handleDelete(agent.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete Agent
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold font-display text-white mb-1">{agent.name}</h3>
                  <p className="text-sm text-muted-foreground font-mono truncate">ID: {agent.agentId || "N/A"}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Voice ID</span>
                    <span className="font-mono text-xs bg-white/5 px-2 py-1 rounded">{agent.voiceId || "Default"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Language</span>
                    <span>{agent.language || "en-US"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link href={`/agents/${agent.id}`} className="flex-1">
                    <Button variant="outline" className="w-full border-white/10 hover:bg-white/5">
                      <Edit2 className="h-4 w-4 mr-2" /> Edit
                    </Button>
                  </Link>
                  <Button 
                    className="flex-1 bg-primary/10 text-primary hover:bg-primary/20 hover:text-white border border-primary/20"
                    onClick={() => setLocation("/playground")}
                  >
                    <Play className="h-4 w-4 mr-2" /> Test
                  </Button>
                </div>
              </div>
            );
          })}
          
          {filteredAgents?.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              <p>No agents found matching "{search}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
