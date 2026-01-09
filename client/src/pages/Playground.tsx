import { useState } from "react";
import { Mic, Phone, MicOff, Send, MessageSquare, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAgents } from "@/hooks/use-agents";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import clsx from "clsx";

export default function Playground() {
  const { data: agents } = useAgents();
  const { toast } = useToast();
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [callData, setCallData] = useState<{ webUrl?: string } | null>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: "Hello! Select an agent to start testing." }
  ]);

  const handleStartTest = async () => {
    if (!selectedAgent) return;
    setIsTesting(true);
    try {
      const res = await apiRequest("POST", `/api/agents/${selectedAgent}/test-call`, {});
      const data = await res.json();
      setCallData(data);
      toast({ title: "Test Call Started", description: "You can now test the agent using the web widget." });
    } catch (error: any) {
      toast({ 
        title: "Test Error", 
        description: error.message || "Ensure the agent is deployed before testing.", 
        variant: "destructive" 
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSend = async () => {
    const input = document.getElementById('chat-input') as HTMLInputElement;
    const text = input.value.trim();
    if (text && selectedAgent) {
      setMessages(prev => [...prev, { role: 'user', text }]);
      input.value = "";
      
      try {
        const res = await apiRequest("POST", `/api/agents/${selectedAgent}/chat`, { message: text });
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'bot', text: data.response }]);
        
        // Voice synthesis (browser based for simplicity in playground)
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(data.response);
          utterance.lang = currentAgent?.language || 'es-ES';
          window.speechSynthesis.speak(utterance);
        }
      } catch (error) {
        toast({ title: "Error", description: "Failed to get AI response", variant: "destructive" });
      }
    }
  };

  const currentAgent = agents?.find(a => a.id.toString() === selectedAgent);

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display font-bold text-white">Playground</h2>
          <p className="text-muted-foreground">Test your agents in a simulated environment</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="w-64">
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger className="bg-card border-white/10">
                <SelectValue placeholder="Select Agent to Test" />
              </SelectTrigger>
              <SelectContent>
                {agents?.map(a => (
                  <SelectItem key={a.id} value={a.id.toString()}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleStartTest} 
            disabled={!selectedAgent || isTesting}
            variant="default"
          >
            {isTesting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Phone className="h-4 w-4 mr-2" />}
            {currentAgent?.isDeployed === "true" ? "Start Voice Test" : "Deploy First"}
          </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        <div className="lg:col-span-2 glass-card rounded-2xl flex flex-col overflow-hidden border border-white/10">
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={clsx("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                <div className={clsx(
                  "max-w-[80%] px-4 py-3 rounded-2xl text-sm",
                  msg.role === 'user' 
                    ? "bg-primary text-white rounded-br-none" 
                    : "bg-white/10 text-foreground rounded-bl-none"
                )}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 bg-black/20 border-t border-white/5 flex items-center gap-4">
            <Button 
              variant={isRecording ? "destructive" : "secondary"}
              size="icon"
              className="rounded-full h-12 w-12 shrink-0"
              onClick={() => setIsRecording(!isRecording)}
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            
            <div className="flex-1 relative">
              <Input 
                id="chat-input"
                placeholder="Type a message or use voice..." 
                className="pr-12 bg-white/5 border-transparent focus:bg-white/10 h-12 rounded-full px-6"
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button 
                size="icon" 
                variant="ghost" 
                className="absolute right-1 top-1 h-10 w-10 rounded-full hover:bg-primary/20 hover:text-primary"
                onClick={handleSend}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col gap-6">
          <div className="text-center py-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4 border border-white/5 relative">
              <div className="absolute inset-0 rounded-full border border-primary/30 animate-ping opacity-20" />
              <Phone className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-lg font-bold">Voice Simulation</h3>
            <p className="text-sm text-muted-foreground">Status: {isRecording ? "Listening..." : "Idle"}</p>
            
            <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Voice AI (OpenAI)</p>
              <div className="flex items-center justify-center gap-2">
                <div className={clsx("w-2 h-2 rounded-full", isRecording ? "bg-red-500 animate-pulse" : "bg-green-500")} />
                <span className="text-xs">{isRecording ? "Transcribing..." : "Ready to speak"}</span>
              </div>
            </div>

            {callData?.webUrl && (
              <Button asChild variant="outline" className="mt-4 border-white/10">
                <a href={callData.webUrl} target="_blank" rel="noopener noreferrer">
                  Open Retell Widget <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </div>

          <div className="space-y-4 flex-1">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Debug Info</h4>
            <div className="space-y-2 text-xs font-mono bg-black/30 p-4 rounded-lg h-full overflow-y-auto">
              <p className="text-green-400">{">"} Connection established</p>
              {currentAgent && <p className="text-white">{">"} Agent: {currentAgent.name}</p>}
              <p className="text-blue-400">{">"} Status: {currentAgent?.isDeployed === "true" ? "Deployed" : "Not Deployed"}</p>
              {callData && <p className="text-purple-400">{">"} Call session started</p>}
              {isRecording && <p className="text-white animate-pulse">{">"} Detecting speech...</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
