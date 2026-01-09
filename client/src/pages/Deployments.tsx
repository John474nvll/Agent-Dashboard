import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Rocket, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Agent } from "@shared/schema";

export default function Deployments() {
  const { data: agents } = useQuery<Agent[]>({
    queryKey: ["/api/agents"],
  });

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold tracking-tight">Deployments</h1>
              <p className="text-muted-foreground mt-2">Monitor your AI agents' production status and synchronization.</p>
            </div>
            <Button className="gap-2">
              <Rocket className="h-4 w-4" />
              Deploy All
            </Button>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <CardTitle>Active Agents Status</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agents?.map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/50">
                      <div className="flex items-center gap-4">
                        <div className={`h-2 w-2 rounded-full ${agent.isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-muted'}`} />
                        <div>
                          <p className="font-medium">{agent.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{agent.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Retell ID</p>
                          <p className="text-xs font-mono">{agent.phoneId || 'Not Linked'}</p>
                        </div>
                        <Badge variant={agent.phoneId ? "default" : "secondary"}>
                          {agent.phoneId ? 'Synced' : 'Pending'}
                        </Badge>
                        <Button variant="outline" size="sm">Logs</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-green-500/5 border-green-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Success Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">98.2%</div>
                  <p className="text-xs text-muted-foreground">+2.1% from last week</p>
                </CardContent>
              </Card>
              <Card className="bg-blue-500/5 border-blue-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    Avg Sync Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1.2s</div>
                  <p className="text-xs text-muted-foreground">Vite + Esbuild optimized</p>
                </CardContent>
              </Card>
              <Card className="bg-amber-500/5 border-amber-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    Pending Sync
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">All agents up to date</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
