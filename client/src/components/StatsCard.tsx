import { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface StatsCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  color?: "blue" | "purple" | "green" | "orange";
}

export function StatsCard({ title, value, trend, trendUp, icon: Icon, color = "blue" }: StatsCardProps) {
  const colorStyles = {
    blue: "from-blue-500/20 to-cyan-500/20 text-blue-500",
    purple: "from-violet-500/20 to-fuchsia-500/20 text-violet-500",
    green: "from-emerald-500/20 to-teal-500/20 text-emerald-500",
    orange: "from-orange-500/20 to-amber-500/20 text-orange-500",
  };

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
      <div className={clsx("absolute top-0 right-0 p-4 opacity-50 transition-opacity group-hover:opacity-100", colorStyles[color].split(" ")[2])}>
        <Icon className="h-12 w-12 opacity-20 -rotate-12" />
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <div className={clsx("h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center", colorStyles[color])}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold font-display">{value}</h3>
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-2 text-sm">
          <span className={clsx("font-medium", trendUp ? "text-green-500" : "text-red-500")}>
            {trend}
          </span>
          <span className="text-muted-foreground">vs last month</span>
        </div>
      )}
    </div>
  );
}
