import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  iconClassName,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: React.ReactNode;
  value: React.ReactNode;
  sub?: React.ReactNode;
  iconClassName?: string;
  className?: string;
}) {
  return (
    <Card className={cn("gap-2 justify-between py-5", className)}>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            {label}
          </span>
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary",
              iconClassName
            )}
          >
            <Icon className="size-4.5" />
          </span>
        </div>
        <div>
          <div className="text-[1.75rem] font-bold leading-none tracking-tight text-foreground">
            {value}
          </div>
          {sub && (
            <p className="mt-1.5 text-xs text-muted-foreground">{sub}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export { StatCard };
