import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, Send, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function WhatsAppModule() {
  const { data: messages, isLoading } = useQuery<any[]>({
    queryKey: ["/api/whatsapp/messages"],
  });

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-display tracking-tight">WhatsApp Business</h1>
            <p className="text-muted-foreground mt-1">Gestión centralizada de comunicaciones por mensajería.</p>
          </div>
          <Button className="gap-2">
            <MessageSquare className="h-4 w-4" /> Nueva Plantilla
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat List */}
          <Card className="lg:col-span-1 glass-card border-border/50">
            <CardHeader className="p-4 border-b border-border/50">
              <CardTitle className="text-sm">Conversaciones</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="divide-y divide-border/30">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 hover:bg-white/5 cursor-pointer transition-colors flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        U{i}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className="font-medium truncate">Usuario +57...</p>
                          <span className="text-[10px] text-muted-foreground">12:45</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate italic">Buen día, quería consultar sobre...</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Message View */}
          <Card className="lg:col-span-2 glass-card border-border/50 flex flex-col">
            <CardHeader className="p-4 border-b border-border/50 flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-xs">
                  U1
                </div>
                <div>
                  <CardTitle className="text-sm">Usuario +57 300 123 4567</CardTitle>
                  <CardDescription className="text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-500" /> Verificado por WhatsApp
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px]">Agente: Santi</Badge>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  <div className="flex justify-start">
                    <div className="bg-muted p-3 rounded-lg max-w-[80%] text-sm">
                      Hola, estoy interesado en el software SoftGAN.
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-primary p-3 rounded-lg max-w-[80%] text-sm text-primary-foreground">
                      ¡Hola! Soy Santi de SoftGAN. Claro, con gusto te ayudo. ¿Qué dudas tienes?
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-muted p-3 rounded-lg max-w-[80%] text-sm">
                      ¿Tienen demo gratuita?
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <div className="p-4 border-t border-border/50 bg-black/20">
                <div className="flex gap-2">
                  <Input placeholder="Escribe un mensaje..." className="bg-background/50" />
                  <Button size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass-card border-border/50 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <MessageSquare className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Mensajes Hoy</p>
                <p className="text-xl font-bold">124</p>
              </div>
            </div>
          </Card>
          <Card className="glass-card border-border/50 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tiempo de Respuesta</p>
                <p className="text-xl font-bold">45s</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
