import { useState, useRef, useEffect } from "react";
import { Mic, Phone, MicOff, Send, MessageSquare, Loader2, ExternalLink, Smartphone, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAgents } from "@/hooks/use-agents";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import clsx from "clsx";

export default function Playground() {
  const { data: agents } = useAgents();
  const { toast } = useToast();
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callData, setCallData] = useState<{ webUrl?: string } | null>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      const agent = agents?.find(a => a.id.toString() === selectedAgent);
      utterance.lang = agent?.language || 'es-ES';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartTest = async () => {
    if (!selectedAgent) return;
    setIsTesting(true);
    try {
      const res = await apiRequest("POST", `/api/agents/${selectedAgent}/test-call`, {});
      const data = await res.json();
      setCallData(data);
      toast({ title: "Prueba de Voz Iniciada", description: "Puedes probar el agente usando el widget web." });
    } catch (error: any) {
      toast({ title: "Error", description: "Asegúrate de que el agente esté desplegado.", variant: "destructive" });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSend = async () => {
    const inputEl = document.getElementById('chat-input') as HTMLInputElement;
    const text = inputEl.value.trim();
    if (text && selectedAgent) {
      setMessages(prev => [...prev, { role: 'user', text }]);
      inputEl.value = "";
      
      try {
        const res = await apiRequest("POST", `/api/agents/${selectedAgent}/chat`, { message: text });
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'bot', text: data.response }]);
        speak(data.response);
      } catch (error) {
        toast({ title: "Error", description: "No se pudo obtener respuesta de la IA", variant: "destructive" });
      }
    }
  };

  const handleRealCall = async () => {
    if (!phoneNumber || !selectedAgent) {
      toast({ title: "Requerido", description: "Número y agente son necesarios", variant: "destructive" });
      return;
    }
    setIsCalling(true);
    try {
      await apiRequest("POST", "/api/integrations/voice-call", { to: phoneNumber, agentId: selectedAgent });
      toast({ title: "Llamada Iniciada", description: `Llamando a ${phoneNumber} via Retell` });
    } catch (error) {
      toast({ title: "Error", description: "Fallo al iniciar llamada real", variant: "destructive" });
    } finally {
      setIsCalling(false);
    }
  };

  const handleSendWhatsApp = async () => {
    if (!phoneNumber || !selectedAgent) {
      toast({ title: "Requerido", description: "Número y agente son necesarios", variant: "destructive" });
      return;
    }
    try {
      await apiRequest("POST", "/api/integrations/whatsapp", { 
        to: phoneNumber, 
        message: "Hola, soy tu asistente virtual de IA. ¿En qué puedo ayudarte?",
        agentId: selectedAgent
      });
      toast({ title: "WhatsApp Enviado", description: `Mensaje enviado a ${phoneNumber}` });
    } catch (error) {
      toast({ title: "Error", description: "Fallo al enviar WhatsApp", variant: "destructive" });
    }
  };

  const currentAgent = agents?.find(a => a.id.toString() === selectedAgent);

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-white">Playground Avanzado</h2>
          <p className="text-muted-foreground mt-1">Prueba Chat, Llamadas Reales y WhatsApp</p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="w-full md:w-64">
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger className="bg-card border-white/10 text-foreground">
                <SelectValue placeholder="Seleccionar Agente" />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10 text-foreground">
                {agents?.map(a => (
                  <SelectItem key={a.id} value={a.id.toString()}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Input 
              placeholder="+57..." 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-40 bg-card border-white/10 text-foreground"
            />
            <Button variant="outline" size="icon" className="border-primary/20 hover:bg-primary/10" onClick={handleSendWhatsApp}>
              <Smartphone className="h-4 w-4 text-green-500" />
            </Button>
            <Button variant="outline" size="icon" className="border-primary/20 hover:bg-primary/10" onClick={handleRealCall} disabled={isCalling}>
              {isCalling ? <Loader2 className="h-4 w-4 animate-spin" /> : <Phone className="h-4 w-4 text-blue-500" />}
            </Button>
            <Button 
              onClick={handleStartTest} 
              disabled={!selectedAgent || isTesting}
              variant="default"
              className="shadow-lg shadow-primary/20"
            >
              {isTesting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ExternalLink className="h-4 w-4 mr-2" />}
              Voz Web
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        <Card className="lg:col-span-2 glass-card rounded-2xl flex flex-col overflow-hidden border border-white/10">
          <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Simulación de Chat</h3>
                  <p className="text-muted-foreground max-w-xs">Escribe un mensaje para ver cómo responde el agente.</p>
                </div>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div key={idx} className={clsx("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "justify-start")}>
                <div className={clsx("p-2 rounded-xl shrink-0", msg.role === 'user' ? "bg-primary text-white" : "bg-white/5 border border-white/10 text-foreground")}>
                  {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={clsx(
                  "max-w-[80%] px-4 py-3 rounded-2xl text-sm",
                  msg.role === 'user' 
                    ? "bg-primary/10 text-foreground rounded-tr-none border border-primary/20" 
                    : "bg-card/50 text-foreground rounded-tl-none border border-white/5"
                )}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 bg-black/20 border-t border-white/5 flex items-center gap-4">
            <div className="flex-1 relative">
              <Input 
                id="chat-input"
                placeholder="Escribe un mensaje..." 
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
        </Card>

        <div className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col gap-6 bg-black/40">
          <div className="text-center py-8 border-b border-white/5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4 border border-white/5">
              <Phone className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold">Estado de Integración</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {currentAgent ? `Agente: ${currentAgent.name}` : "Selecciona un agente"}
            </p>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-xs text-muted-foreground">Retell Voice</span>
                <span className={clsx("text-[10px] font-bold px-2 py-0.5 rounded-full", currentAgent?.isDeployed === "true" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500")}>
                  {currentAgent?.isDeployed === "true" ? "ACTIVO" : "INACTIVO"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-xs text-muted-foreground">WhatsApp API</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                  READY
                </span>
              </div>
            </div>

            {callData?.webUrl && (
              <Button asChild variant="outline" className="mt-4 w-full border-primary/30 hover:bg-primary/5">
                <a href={callData.webUrl} target="_blank" rel="noopener noreferrer">
                  Abrir Widget de Voz <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </div>

          <div className="space-y-4 flex-1">
            <h4 className="font-semibold text-[10px] uppercase tracking-widest text-muted-foreground">Consola de Eventos</h4>
            <div className="space-y-2 text-[10px] font-mono bg-black/30 p-4 rounded-lg h-48 overflow-y-auto">
              <p className="text-green-400 opacity-70">{">"} Back-end connected</p>
              {currentAgent && <p className="text-white opacity-70">{">"} Selected: {currentAgent.name}</p>}
              <p className="text-blue-400 opacity-70">{">"} Integration SDKs loaded</p>
              {phoneNumber && <p className="text-purple-400 opacity-70">{">"} Input target: {phoneNumber}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
