import { StatsCard } from "@/components/StatsCard";
import { useAgents, useAllActivityLogs } from "@/hooks/use-agents";
import { Users, PhoneCall, Clock, Activity, ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: 'Mon', calls: 40 },
  { name: 'Tue', calls: 30 },
  { name: 'Wed', calls: 20 },
  { name: 'Thu', calls: 27 },
  { name: 'Fri', calls: 18 },
  { name: 'Sat', calls: 23 },
  { name: 'Sun', calls: 34 },
];

export default function Dashboard() {
  const { data: agents, isLoading: isLoadingAgents } = useAgents();
  const { data: logs, isLoading: isLoadingLogs } = useAllActivityLogs();
  const [, setLocation] = useLocation();

  const totalAgents = agents?.length || 0;
  const activeAgents = agents?.filter(a => (a.config as any)?.is_published || a.isDeployed === "true").length || 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold text-white">Dashboard</h2>
          <p className="text-muted-foreground mt-1">Overview of your voice agent performance</p>
        </div>
        <Link href="/agents" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
          Manage Agents <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Agents" 
          value={isLoadingAgents ? "..." : totalAgents.toString()} 
          icon={Users} 
          color="blue"
          trend="+2"
          trendUp={true}
        />
        <StatsCard 
          title="Total Calls" 
          value="1,284" 
          icon={PhoneCall} 
          color="purple"
          trend="+12%"
          trendUp={true}
        />
        <StatsCard 
          title="Avg. Duration" 
          value="4m 12s" 
          icon={Clock} 
          color="green"
        />
        <StatsCard 
          title="Active Deployments" 
          value={isLoadingAgents ? "..." : activeAgents.toString()} 
          icon={Activity} 
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6">Call Volume History</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="calls" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCalls)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {isLoadingLogs ? (
              [1, 2, 3].map(i => <div key={i} className="h-12 w-full animate-pulse bg-white/5 rounded-lg" />)
            ) : logs?.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-8">No recent activity</div>
            ) : (
              logs?.map((log: any) => (
                <div 
                  key={log.id} 
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => setLocation(`/agents/${log.agentId}`)}
                >
                  <div className={`h-2 w-2 mt-2 rounded-full shrink-0 ${
                    log.type === 'deployment' ? 'bg-blue-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{log.details}</p>
                    <p className="text-xs text-muted-foreground">
                      {log.type} • {new Date(log.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link href="/agents">
            <button className="w-full mt-4 text-xs font-medium text-muted-foreground hover:text-primary transition-colors text-center py-2">
              Manage All Agents
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
