import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { useAgent, useUpdateAgent, useDeleteAgent, useMakeCall } from "@/hooks/use-agents";
import { useRoute, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Trash2, Bot, Mic2, FileCode, History, Phone, Clock, Play } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().optional(),
  voiceId: z.string().optional(),
  llmId: z.string().optional(),
  generalPrompt: z.string().min(10, "El prompt debe tener al menos 10 caracteres"),
  isActive: z.boolean(),
  phoneNumber: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AgentDetail() {
  const [, params] = useRoute("/agents/:id");
  const [, setLocation] = useLocation();
  const id = Number(params?.id);
  
  const { data: agent, isLoading } = useAgent(id);
  const updateAgent = useUpdateAgent();
  const deleteAgent = useDeleteAgent();
  const makeCall = useMakeCall();
  const [testPhoneNumber, setTestPhoneNumber] = useState("");

  const handleTestCall = () => {
    if (!testPhoneNumber) return;
    makeCall.mutate({ agentId: id, phoneNumber: testPhoneNumber });
  };

  const { data: calls } = useQuery<any[]>({
    queryKey: [`/api/agents/${id}/calls`],
    enabled: !!id,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      voiceId: "",
      llmId: "",
      generalPrompt: "",
      isActive: false,
      phoneNumber: "",
    },
  });

  useEffect(() => {
    if (agent) {
      const config = agent.config as Record<string, any>;
      form.reset({
        name: agent.name,
        description: agent.description || "",
        voiceId: config.voice_id || "",
        llmId: config.llm_id || "",
        generalPrompt: config.general_prompt || config.retellLlmData?.general_prompt || "",
        isActive: agent.isActive || false,
        phoneNumber: agent.phoneNumber || "",
      });
    }
  }, [agent, form]);

  const onSubmit = (data: FormValues) => {
    const updatedConfig = {
      ...(agent?.config as object || {}),
      voice_id: data.voiceId,
      llm_id: data.llmId,
      general_prompt: data.generalPrompt,
    };

    updateAgent.mutate({
      id,
      name: data.name,
      description: data.description,
      isActive: data.isActive,
      phoneNumber: data.phoneNumber,
      config: updatedConfig,
    });
  };

  const handleDelete = async () => {
    await deleteAgent.mutateAsync(id);
    setLocation("/agents");
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-[500px] w-full rounded-xl" />
        </div>
      </Layout>
    );
  }

  if (!agent) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">Agente no encontrado</h2>
          <Button className="mt-4" onClick={() => setLocation("/agents")}>Volver a la lista</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/agents")} className="rounded-full hover:bg-white/5">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold font-display">{agent.name}</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary/50" />
                AGENTE DE {agent.type.toUpperCase()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon" className="rounded-full opacity-80 hover:opacity-100">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente al agente
                    y sus datos de nuestros servidores.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Eliminar Agente
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={updateAgent.isPending} className="bg-primary hover:bg-primary/90">
              {updateAgent.isPending ? "Guardando..." : <><Save className="mr-2 h-4 w-4" /> Guardar Cambios</>}
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card className="glass-card border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-primary" /> Configuración del Agente
                    </CardTitle>
                    <CardDescription>
                      Ajustes básicos de identidad y comportamiento.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre del Agente</FormLabel>
                          <FormControl>
                            <Input placeholder="ej. Representante de Ventas Santi" {...field} className="bg-background/50 border-border/50 focus:ring-primary/20" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción</FormLabel>
                          <FormControl>
                            <Input placeholder="Descripción interna" {...field} className="bg-background/50 border-border/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Phone className="h-3 w-3" /> Número de Celular (Admin)
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="+57..." {...field} className="bg-background/50 border-border/50 font-mono text-sm" />
                            </FormControl>
                            <FormDescription className="text-xs">
                              Número personal para recibir alertas o pruebas.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="voiceId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Mic2 className="h-3 w-3" /> Voice ID & Accent
                            </FormLabel>
                            <FormControl>
                              <select 
                                {...field} 
                                className="w-full bg-background/50 border border-border/50 rounded-md p-2 text-sm font-mono"
                              >
                                <optgroup label="Español (Acentos)">
                                  <option value="11labs-Bing">Santi (España - Enérgico)</option>
                                  <option value="11labs-Susan">Valentina (Bogotá - Ejecutivo)</option>
                                  <option value="11labs-Adrian">Mateo (México - Consultor)</option>
                                  <option value="11labs-Bella">Sofía (Argentina - Cercano)</option>
                                  <option value="11labs-Domi">Elena (Chile - Profesional)</option>
                                </optgroup>
                                <optgroup label="English">
                                  <option value="11labs-Brian">Brian (US - Deep)</option>
                                  <option value="11labs-Sarah">Sarah (UK - Clear)</option>
                                </optgroup>
                                <option value="custom">-- Otro (Ingresar ID manual) --</option>
                              </select>
                            </FormControl>
                            <FormDescription className="text-xs">
                              Selecciona la voz y el acento regional del agente.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="llmId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <FileCode className="h-3 w-3" /> LLM Model ID
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="LLM ID" {...field} className="bg-background/50 border-border/50 font-mono text-sm" />
                            </FormControl>
                            <FormDescription className="text-xs">
                              La configuración del LLM vinculado
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Tabs defaultValue="prompt" className="w-full">
                  <TabsList className="bg-card/50 border border-border/50 p-1">
                    <TabsTrigger value="prompt">System Prompt</TabsTrigger>
                    <TabsTrigger value="tools">Herramientas (Tools)</TabsTrigger>
                    <TabsTrigger value="history">Historial de Llamadas</TabsTrigger>
                    <TabsTrigger value="json">Raw JSON</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="prompt" className="mt-4">
                    <Card className="glass-card border-border/50">
                      <CardHeader>
                        <CardTitle>System Prompt</CardTitle>
                        <CardDescription>
                          Define la personalidad, base de conocimientos e instrucciones para el agente.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <FormField
                          control={form.control}
                          name="generalPrompt"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea 
                                  placeholder="Eres un asistente útil..." 
                                  className="min-h-[300px] font-mono text-sm bg-background/50 border-border/50 leading-relaxed resize-y focus:ring-primary/20" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="tools" className="mt-4">
                    <Card className="glass-card border-border/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileCode className="h-5 w-5 text-primary" /> Herramientas Disponibles
                        </CardTitle>
                        <CardDescription>
                          Habilita funciones especiales que el agente puede ejecutar durante una conversación.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[
                            { name: "send_whatsapp", label: "Enviar WhatsApp", description: "Permite al agente enviar mensajes de seguimiento." },
                            { name: "check_inventory", label: "Consultar Inventario", description: "Permite verificar disponibilidad de productos." },
                            { name: "schedule_meeting", label: "Agendar Cita", description: "Integración con calendario para programar reuniones." }
                          ].map((tool) => (
                            <div key={tool.name} className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-border/50">
                              <div>
                                <p className="font-medium">{tool.label}</p>
                                <p className="text-xs text-muted-foreground">{tool.description}</p>
                              </div>
                              <Switch defaultChecked={true} />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="history" className="mt-4">
                    <Card className="glass-card border-border/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <History className="h-5 w-5 text-primary" /> Llamadas Recientes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {!calls || calls.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground italic">
                              No hay llamadas registradas para este agente.
                            </div>
                          ) : (
                            calls.map((call: any) => (
                              <div key={call.id} className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-border/50">
                                <div className="flex items-center gap-4">
                                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Phone className="h-4 w-4 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{call.phoneNumber}</p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Clock className="h-3 w-3" /> {new Date(call.createdAt).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                                <Badge variant={call.status === 'completed' ? 'default' : 'secondary'}>
                                  {call.status}
                                </Badge>
                              </div>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="json" className="mt-4">
                    <Card className="glass-card border-border/50 bg-black/40">
                      <CardContent className="p-4">
                        <pre className="text-xs font-mono text-green-400 overflow-auto max-h-[400px]">
                          {JSON.stringify(agent.config, null, 2)}
                        </pre>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="space-y-6">
                <Card className="glass-card border-border/50">
                  <CardHeader>
                    <CardTitle>Prueba de Voz</CardTitle>
                    <CardDescription>Realiza una llamada de prueba para escuchar al agente.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <FormLabel>Número de Teléfono</FormLabel>
                      <Input 
                        placeholder="+57..." 
                        value={testPhoneNumber}
                        onChange={(e) => setTestPhoneNumber(e.target.value)}
                        className="bg-background/50 border-border/50" 
                      />
                    </div>
                    <Button 
                      className="w-full gap-2" 
                      onClick={handleTestCall}
                      disabled={makeCall.isPending || !testPhoneNumber}
                    >
                      <Play className="h-4 w-4" />
                      {makeCall.isPending ? "Iniciando..." : "Llamar ahora"}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="glass-card border-border/50">
                  <CardHeader>
                    <CardTitle>Estado</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                     <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border/50 p-4 bg-background/30">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Estado Activo</FormLabel>
                            <FormDescription>
                              Habilita para permitir llamadas.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-4 border-t border-border/50 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Creado</span>
                        <span>{new Date(agent.createdAt!).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Última actualización</span>
                        <span>{new Date(agent.updatedAt!).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tipo</span>
                        <span className="capitalize">{agent.type}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
}
