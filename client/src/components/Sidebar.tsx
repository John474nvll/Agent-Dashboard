import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, Activity, Settings, Mic2, MessageSquare, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/agents", label: "Agents", icon: Users },
    { href: "/whatsapp", label: "WhatsApp", icon: MessageSquare },
    { href: "/statistics", label: "Statistics", icon: BarChart3 },
    { href: "/deployments", label: "Deployments", icon: Activity },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-border bg-card/30 flex flex-col h-screen fixed left-0 top-0 backdrop-blur-xl z-50">
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Mic2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl leading-none">Retell AI</h1>
            <p className="text-xs text-muted-foreground mt-1">Agent Manager</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href));
          return (
            <Link key={link.href} href={link.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer group",
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <link.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {link.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
        <div className="bg-card rounded-xl p-4 border border-border/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-purple-500" />
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">Admin User</p>
              <p className="text-xs text-muted-foreground truncate">admin@retell.ai</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
