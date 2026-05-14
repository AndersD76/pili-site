import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "flat";
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: StatsCardProps) {
  return (
    <Card className="border-pili-mist shadow-none">
      <CardContent className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wider text-pili-cement">
            {title}
          </span>
          <span className="font-display text-2xl font-bold text-pili-black">
            {value}
          </span>
          {description && (
            <span
              className={cn(
                "text-xs",
                trend === "up" && "text-pili-success",
                trend === "down" && "text-pili-danger",
                (!trend || trend === "flat") && "text-pili-cement"
              )}
            >
              {description}
            </span>
          )}
        </div>
        <div className="rounded-lg bg-pili-paper p-2.5">
          <Icon className="size-5 text-pili-safety" />
        </div>
      </CardContent>
    </Card>
  );
}
