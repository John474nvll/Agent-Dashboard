import { useState } from "react";
import { Mic, Phone, MicOff, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAgents } from "@/hooks/use-agents";
import { Input } from "@/components/ui/input";
import clsx from "clsx";

export default function Playground() {
  const { data: agents } = useAgents();
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: "Hello! Select an agent to start testing." }
  ]);

  const handleSend = () => {
    // Mock interaction for UI purposes
    const input = document.getElementById('chat-input') as HTMLInputElement;
    if (input.value.trim()) {
      setMessages(prev => [...prev, { role: 'user', text: input.value }]);
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'bot', text: "I'm a simulation response. Connect to Retell AI to enable real voice interaction." }]);
      }, 1000);
      input.value = "";
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display font-bold text-white">Playground</h2>
          <p className="text-muted-foreground">Test your agents in a simulated environment</p>
        </div>
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
          </div>

          <div className="space-y-4 flex-1">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Debug Info</h4>
            <div className="space-y-2 text-xs font-mono bg-black/30 p-4 rounded-lg h-full overflow-y-auto">
              <p className="text-green-400">{">"} Connection established</p>
              <p className="text-blue-400">{">"} Latency: 45ms</p>
              <p className="text-yellow-400">{">"} Voice VAD: Active</p>
              {isRecording && <p className="text-white animate-pulse">{">"} Detecting speech...</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
