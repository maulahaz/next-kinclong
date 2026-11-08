import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusVariant = keyof typeof statusStyles;

const statusStyles = {
  // Green / success family
  active: "border-transparent bg-success/12 text-success",
  acknowledged: "border-transparent bg-success/12 text-success",
  // Orange / primary family
  pending: "border-transparent bg-warning/12 text-warning",
  done: "border-transparent bg-primary/12 text-primary",
  needsAttention: "border-transparent bg-primary/12 text-primary",
  // Neutral family
  default: "border-border bg-muted text-muted-foreground",
  completed: "border-transparent bg-muted text-foreground/70",
  // Red / destructive family
  cancelled: "border-transparent bg-destructive/10 text-destructive",
  disabled: "border-transparent bg-destructive/10 text-destructive",
} as const;

export function StatusBadge({
  variant,
  children,
  className,
}: {
  variant: keyof typeof statusStyles;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Badge className={cn("h-6 px-2.5 font-semibold", statusStyles[variant], className)}>
      {children}
    </Badge>
  );
}
