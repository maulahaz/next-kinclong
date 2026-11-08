/**
 * Lightweight SVG/CSS chart primitives — no external charting library.
 * Colors come from the --chart-* design tokens.
 */
import * as React from "react";
import { cn } from "@/lib/utils";

/* ── Donut ──────────────────────────────────────────────────────────────── */

function DonutChart({
  segments,
  size = 148,
  thickness = 14,
  centerLabel,
  centerValue,
  className,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: React.ReactNode;
  centerValue?: React.ReactNode;
  className?: string;
}) {
  const total = segments.reduce((acc, s) => acc + s.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className={cn("flex items-center gap-5", className)}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={thickness}
            className="stroke-secondary"
          />
          {total > 0 &&
            segments.map((s) => {
              if (s.value <= 0) return null;
              const fraction = s.value / total;
              const dash = fraction * circumference;
              const circle = (
                <circle
                  key={s.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  strokeWidth={thickness}
                  strokeLinecap="round"
                  stroke={s.color}
                  strokeDasharray={`${Math.max(dash - (segments.length > 1 ? 2 : 0), 0)} ${circumference}`}
                  strokeDashoffset={-offset}
                />
              );
              offset += dash;
              return circle;
            })}
        </svg>
        {(centerValue != null || centerLabel != null) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-bold leading-none text-foreground">
              {centerValue}
            </span>
            {centerLabel && (
              <span className="mt-1 text-xs text-muted-foreground">
                {centerLabel}
              </span>
            )}
          </div>
        )}
      </div>
      <ul className="min-w-0 space-y-2.5">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2.5 text-sm">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: s.color }}
              aria-hidden="true"
            />
            <span className="truncate text-muted-foreground">{s.label}</span>
            <span className="ml-auto font-semibold tabular-nums text-foreground">
              {s.value.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Bar chart ──────────────────────────────────────────────────────────── */

function BarChart({
  data,
  height = 160,
  className,
}: {
  data: { label: string; value: number }[];
  height?: number;
  className?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={className}>
      <div
        className="flex items-end gap-2 sm:gap-3"
        style={{ height }}
        role="img"
        aria-label="Bar chart"
      >
        {data.map((d) => {
          const h = Math.round((d.value / max) * 100);
          return (
            <div
              key={d.label}
              className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
              title={`${d.label}: ${d.value}`}
            >
              <span className="text-xs font-semibold tabular-nums text-foreground/0 transition-colors group-hover:text-foreground">
                {d.value}
              </span>
              <div
                className="w-full max-w-8 rounded-t-lg rounded-b-sm transition-all duration-300 group-hover:opacity-80"
                style={{
                  height: `${Math.max(h, 2)}%`,
                  backgroundColor: "var(--chart-1)",
                  opacity: d.value === 0 ? 0.15 : 1,
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-2 sm:gap-3 border-t border-border pt-2">
        {data.map((d) => (
          <span
            key={d.label}
            className="min-w-0 flex-1 truncate text-center text-[0.7rem] text-muted-foreground"
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Ring progress ──────────────────────────────────────────────────────── */

function RingProgress({
  percent,
  size = 96,
  thickness = 8,
  children,
  className,
}: {
  percent: number;
  size?: number;
  thickness?: number;
  children?: React.ReactNode;
  className?: string;
}) {
  const clamped = Math.min(Math.max(percent, 0), 100);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (clamped / 100) * circumference;

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          className="stroke-secondary"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
          stroke="var(--primary)"
          strokeDasharray={`${dash} ${circumference}`}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {children}
        </div>
      )}
    </div>
  );
}

export { DonutChart, BarChart, RingProgress };
