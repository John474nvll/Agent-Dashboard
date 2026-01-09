import { Layout } from "@/components/Layout";
import { useAgents, useCreateAgent, useDeployAgent } from "@/hooks/use-agents";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Mic, Settings, Play, Radio, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api, buildUrl } from "@shared/routes";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AgentsList() {
  const { data: agents, isLoading } = useAgents();
  const createAgent = useCreateAgent();
  const deployAgent = useDeployAgent();
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [phoneNumber, setPhoneNumber] = useState("+57");
  const { toast } = useToast();

  const makeCall = useMutation({
    mutationFn: async ({ agentId, phoneNumber }: { agentId: number; phoneNumber: string }) => {
      const res = await apiRequest("POST", buildUrl(api.agents.makeCall.path, { id: agentId }), { phoneNumber });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Call Triggered",
        description: "The agent is now calling the provided number.",
      });
      setIsTestModalOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Call Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleCreate = () => {
    createAgent.mutate({
      name: "Nuevo Agente de Ventas",
      description: "Agente especializado en ventas para el mercado colombiano",
      type: "voice",
      config: {
        voice_id: "11labs-Susan",
        llm_id: "gpt-4o",
        general_prompt: "Eres un experto en ventas de Softgan Electronics...",
      },
      isActive: true,
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-display font-bold">Agentes</h1>
            <p className="text-muted-foreground mt-2">Administra y configura tu fuerza de trabajo de voz con IA.</p>
          </div>
          <Button 
            onClick={handleCreate} 
            disabled={createAgent.isPending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
          >
            {createAgent.isPending ? "Creando..." : <><Plus className="mr-2 h-4 w-4" /> Crear Agente</>}
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
                onTest={() => {
                  setSelectedAgent(agent);
                  setIsTestModalOpen(true);
                }}
              />
            ))}
            
            {agents?.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-24 bg-card/30 border border-dashed border-border rounded-xl">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Mic className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No se encontraron agentes</h3>
                <p className="text-muted-foreground mb-6">Crea tu primer agente de voz para comenzar.</p>
                <Button onClick={handleCreate}>Crear Agente</Button>
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={isTestModalOpen} onOpenChange={setIsTestModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Probar Agente: {selectedAgent?.name}</DialogTitle>
            <DialogDescription>
              Ingresa un número de teléfono de Colombia (+57) para probar la llamada.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Número de Teléfono</label>
              <Input 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+57 300 123 4567"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTestModalOpen(false)}>Cancelar</Button>
            <Button 
              onClick={() => makeCall.mutate({ agentId: selectedAgent.id, phoneNumber })}
              disabled={makeCall.isPending}
            >
              {makeCall.isPending ? "Llamando..." : <><Phone className="mr-2 h-4 w-4" /> Iniciar Llamada</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

function AgentCard({ agent, onDeploy, isDeploying, onTest }: { agent: any, onDeploy: () => void, isDeploying: boolean, onTest: () => void }) {
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
                  {agent.isActive ? "Activo" : "Inactivo"}
                </Badge>
                <span className="text-xs text-muted-foreground capitalize">Agente de {agent.type}</span>
              </div>
            </div>
          </div>
          <div className={`h-2 w-2 rounded-full ${agent.isActive ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-muted'}`} />
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {agent.description || config.general_prompt || "Sin descripción disponible."}
        </p>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Voice ID</span>
            <span className="font-mono text-foreground opacity-75">{config.voice_id ? config.voice_id.slice(0, 8) + '...' : 'No definido'}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Modelo</span>
            <span className="font-mono text-foreground opacity-75">GPT-4o</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t border-border/50 gap-2">
        <Link href={`/agents/${agent.id}`} className="flex-1">
          <Button variant="outline" className="w-full bg-transparent border-border/50 hover:bg-white/5 hover:border-primary/30">
            <Settings className="mr-2 h-4 w-4" /> Configurar
          </Button>
        </Link>
        <Button 
          variant="secondary" 
          onClick={onTest}
          className="bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border border-transparent hover:border-primary/20"
        >
          <Phone className="h-4 w-4" />
        </Button>
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
