import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useAgent, useUpdateAgent, useDeleteAgent } from "@/hooks/use-agents";
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
import { ArrowLeft, Save, Trash2, Bot, Mic2, FileCode } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
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

// Schema for the edit form
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  voiceId: z.string().optional(),
  llmId: z.string().optional(),
  generalPrompt: z.string().min(10, "Prompt must be at least 10 characters"),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AgentDetail() {
  const [, params] = useRoute("/agents/:id");
  const [, setLocation] = useLocation();
  const id = Number(params?.id);
  
  const { data: agent, isLoading } = useAgent(id);
  const updateAgent = useUpdateAgent();
  const deleteAgent = useDeleteAgent();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      voiceId: "",
      llmId: "",
      generalPrompt: "",
      isActive: false,
    },
  });

  // Load data into form when agent is fetched
  useEffect(() => {
    if (agent) {
      const config = agent.config as Record<string, any>;
      form.reset({
        name: agent.name,
        description: agent.description || "",
        voiceId: config.voice_id || "",
        llmId: config.llm_id || "",
        generalPrompt: config.general_prompt || "",
        isActive: agent.isActive || false,
      });
    }
  }, [agent, form]);

  const onSubmit = (data: FormValues) => {
    // Reconstruct the config object
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
          <h2 className="text-2xl font-bold">Agent Not Found</h2>
          <Button className="mt-4" onClick={() => setLocation("/agents")}>Back to List</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/agents")} className="rounded-full hover:bg-white/5">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold font-display">{agent.name}</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary/50" />
                {agent.type.toUpperCase()} AGENT
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
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the agent
                    and remove its data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete Agent
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={updateAgent.isPending} className="bg-primary hover:bg-primary/90">
              {updateAgent.isPending ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Config */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="glass-card border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-primary" /> Agent Configuration
                    </CardTitle>
                    <CardDescription>
                      Basic settings for identity and behavior.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Agent Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Sales Rep Santi" {...field} className="bg-background/50 border-border/50 focus:ring-primary/20" />
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
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input placeholder="Internal description" {...field} className="bg-background/50 border-border/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="voiceId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Mic2 className="h-3 w-3" /> Voice ID
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Retell Voice ID" {...field} className="bg-background/50 border-border/50 font-mono text-sm" />
                            </FormControl>
                            <FormDescription className="text-xs">
                              ID from Retell dashboard
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
                              The linked LLM configuration
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
                    <TabsTrigger value="json">Raw JSON</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="prompt" className="mt-4">
                    <Card className="glass-card border-border/50">
                      <CardHeader>
                        <CardTitle>System Prompt</CardTitle>
                        <CardDescription>
                          Define the personality, knowledge base, and instructions for the agent.
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
                                  placeholder="You are a helpful assistant..." 
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

              {/* Right Column: Status & Metadata */}
              <div className="space-y-6">
                <Card className="glass-card border-border/50">
                  <CardHeader>
                    <CardTitle>Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                     <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border/50 p-4 bg-background/30">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Active Status</FormLabel>
                            <FormDescription>
                              Enable to allow calls.
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
                        <span className="text-muted-foreground">Created</span>
                        <span>{new Date(agent.createdAt!).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last Updated</span>
                        <span>{new Date(agent.updatedAt!).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Type</span>
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
