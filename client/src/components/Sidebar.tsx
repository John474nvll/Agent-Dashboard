import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, Settings, Activity, Mic2, FileCode } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/agents", label: "Agents", icon: Users },
  { href: "/playground", label: "Playground", icon: Mic2 },
  { href: "/logs", label: "Activity Logs", icon: Activity },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-xl h-screen sticky top-0 flex flex-col">
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-lg shadow-primary/20">
          <FileCode className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg leading-none">VoiceOS</h1>
          <span className="text-xs text-muted-foreground">Admin Console</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href} className={clsx(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
              isActive 
                ? "bg-primary/10 text-primary font-medium" 
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}>
              <Icon className={clsx("h-5 w-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="bg-gradient-to-br from-primary/10 to-violet-500/10 rounded-xl p-4 border border-primary/10">
          <h4 className="font-semibold text-sm mb-1">System Status</h4>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-xs text-muted-foreground">All Systems Operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
