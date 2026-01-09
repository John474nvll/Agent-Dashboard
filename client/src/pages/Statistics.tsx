import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { TrendingUp, Users, Phone, MessageSquare, Clock, Calendar } from "lucide-react";

const data = [
  { name: "Lun", llamadas: 45, mensajes: 120 },
  { name: "Mar", llamadas: 52, mensajes: 145 },
  { name: "Mie", llamadas: 38, mensajes: 110 },
  { name: "Jue", llamadas: 65, mensajes: 180 },
  { name: "Vie", llamadas: 48, mensajes: 130 },
  { name: "Sab", llamadas: 24, mensajes: 60 },
  { name: "Dom", llamadas: 15, mensajes: 40 },
];

const agentPerformance = [
  { name: "Santi", value: 400 },
  { name: "Valentina", value: 300 },
  { name: "Mateo", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Statistics() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">Estadísticas Detalladas</h1>
          <p className="text-muted-foreground mt-1">Análisis profundo del rendimiento de los agentes e interacciones.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass-card border-border/50 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Llamadas Totales</p>
                <p className="text-2xl font-bold">1,284</p>
                <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                  <TrendingUp className="h-3 w-3" /> +12% vs mes pasado
                </div>
              </div>
            </div>
          </Card>

          <Card className="glass-card border-border/50 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <MessageSquare className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Msg WhatsApp</p>
                <p className="text-2xl font-bold">5,420</p>
                <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                  <TrendingUp className="h-3 w-3" /> +18% vs mes pasado
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="glass-card border-border/50 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/10">
                <Clock className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Tiempos Conversación</p>
                <p className="text-2xl font-bold">4m 22s</p>
                <p className="text-xs text-muted-foreground mt-1">Promedio por llamada</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card border-border/50 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/10">
                <Users className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Leads Generados</p>
                <p className="text-2xl font-bold">342</p>
                <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                  <TrendingUp className="h-3 w-3" /> +5% vs mes pasado
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card border-border/50 p-6">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-lg">Actividad Semanal</CardTitle>
              <CardDescription>Llamadas vs Mensajes de WhatsApp</CardDescription>
            </CardHeader>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorLlamadas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1c1c1c", border: "1px solid #ffffff20", borderRadius: "8px" }}
                    itemStyle={{ fontSize: "12px" }}
                  />
                  <Area type="monotone" dataKey="llamadas" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorLlamadas)" />
                  <Area type="monotone" dataKey="mensajes" stroke="#8b5cf6" fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="glass-card border-border/50 p-6">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-lg">Distribución por Agente</CardTitle>
              <CardDescription>Volumen de interacción total</CardDescription>
            </CardHeader>
            <div className="h-[300px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={agentPerformance}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {agentPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
