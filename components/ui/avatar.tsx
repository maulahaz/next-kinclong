import * as React from "react";
import { cn } from "@/lib/utils";

function Avatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");

  return (
    <span
      data-slot="avatar"
      className={cn(
        "flex size-8 shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-primary/12 text-xs font-semibold text-primary",
        className
      )}
      aria-hidden="true"
    >
      {initials || "•"}
    </span>
  );
}

export { Avatar };
