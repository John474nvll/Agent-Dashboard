import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Bell } from "lucide-react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen flex flex-col relative overflow-hidden">
        {/* Ambient Background Glow */}
        <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
        
        {/* Top Header */}
        <header className="h-16 border-b border-border/50 px-8 flex items-center justify-between bg-background/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            System Operational
          </div>
          <div className="flex items-center gap-4">
            <button className="h-10 w-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
