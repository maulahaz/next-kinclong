"use client";

import { useTransition } from "react";
import { submitAcknowledgeWash } from "./actions";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { RingProgress } from "@/components/charts";
import { toast } from "sonner";
import { Car, CheckCircle2, FileText, Image as ImageIcon, Loader2 } from "lucide-react";

type Wash = {
  id: number;
  type: "inside" | "outside";
  status: "pending" | "done" | "acknowledged";
  imageUrl: string | null;
  createdAt: Date;
};

type Contract = {
  id: number;
  packageType: string;
  totalWashes: number;
  completedWashes: number;
  status: "active" | "completed" | "cancelled";
  createdAt: Date;
  car: {
    plateNumber: string;
    type: "small" | "big";
  };
  washes: Wash[];
};

const washStatusVariant: Record<Wash["status"], "acknowledged" | "done" | "pending"> = {
  acknowledged: "acknowledged",
  done: "done",
  pending: "pending",
};

export function MyContractsClientPage({ contracts }: { contracts: Contract[] }) {
  const [isPending, startTransition] = useTransition();

  const handleAcknowledge = (washId: number) => {
    startTransition(async () => {
      const result = await submitAcknowledgeWash(washId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.message);
      }
    });
  };

  if (!contracts.length) {
    return (
      <EmptyState
        icon={FileText}
        title="No contracts found"
        description="You don't have any active packages yet. Please contact your Kinclong Admin to set one up!"
      />
    );
  }

  return (
    <div className="grid gap-6">
      {contracts.map((contract) => {
        const remainingWashes = contract.totalWashes - contract.completedWashes;
        const progressPercent = contract.totalWashes > 0 ? Math.round((contract.completedWashes / contract.totalWashes) * 100) : 0;

        return (
          <Card key={contract.id} className="overflow-hidden gap-0 py-0 lg:flex-row">
            {/* Left side: Contract Detail */}
            <div className="flex-1 border-b p-6 sm:p-7 lg:border-b-0 lg:border-r">
              <div className="flex items-start justify-between mb-5">
                <StatusBadge variant={contract.status}>{contract.status}</StatusBadge>
                <div className="text-xs font-medium text-muted-foreground">
                  Contract #{contract.id}
                </div>
              </div>

              <div className="flex items-start gap-4 sm:items-center">
                <RingProgress percent={progressPercent} size={88} thickness={7} className="hidden sm:block">
                  <span className="text-sm font-bold tabular-nums">{progressPercent}%</span>
                </RingProgress>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    {contract.packageType}
                  </h3>
                  <p className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
                    <Car className="size-4 shrink-0 text-primary" />
                    <span className="font-semibold text-foreground">{contract.car.plateNumber}</span>
                    <span className="capitalize">({contract.car.type} car)</span>
                  </p>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Wash quota</span>
                      <span className="font-semibold tabular-nums text-foreground">
                        {contract.completedWashes} / {contract.totalWashes}
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-secondary sm:hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500 ease-in-out"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="mt-1 text-right text-xs text-muted-foreground">
                      {contract.status === "active" && `${remainingWashes} washes remaining`}
                      {contract.status === "completed" && "Package fully utilized"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Wash History & Acknowledgment */}
            <div className="flex flex-1 flex-col max-h-[420px] bg-muted/40">
              <div className="border-b border-border bg-muted/60 px-5 py-3 text-sm font-semibold tracking-wide text-foreground flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                Recent Washes
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {contract.washes.length === 0 && (
                  <p className="py-6 text-center text-xs italic text-muted-foreground">
                    No washes recorded yet.
                  </p>
                )}
                {contract.washes.map((wash) => {
                  const needsAcknowledge = wash.status === "done";

                  return (
                    <div key={wash.id} className={`rounded-xl border p-3.5 transition-all ${needsAcknowledge ? "border-primary/50 bg-card shadow-card" : "border-border bg-card/80"}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-semibold capitalize text-foreground">{wash.type} wash</span>
                        <StatusBadge variant={washStatusVariant[wash.status]} className="text-[10px]">
                          {wash.status}
                        </StatusBadge>
                      </div>

                      <div className="mb-2.5 text-xs text-muted-foreground">
                        {new Date(wash.createdAt).toLocaleDateString()} at {new Date(wash.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>

                      {wash.imageUrl && wash.imageUrl !== "x" ? (
                        <div className="mb-2.5 overflow-hidden rounded-lg border border-border bg-secondary aspect-video">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={wash.imageUrl} alt="Wash Evidence" className="size-full object-cover" />
                        </div>
                      ) : (
                        <div className="mb-2.5 flex items-center gap-1.5 rounded-lg border border-dashed border-border bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
                          <ImageIcon className="size-3.5" /> No evidence image
                        </div>
                      )}

                      {needsAcknowledge && (
                        <Button
                          size="sm"
                          className="mt-1 w-full"
                          disabled={isPending}
                          onClick={() => handleAcknowledge(wash.id)}
                        >
                          {isPending ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                          Acknowledge Wash
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
              <CardFooter className="justify-between text-xs text-muted-foreground border-t bg-card">
                <span className="capitalize truncate">{contract.washes.length} wash{contract.washes.length === 1 ? "" : "es"} recorded</span>
              </CardFooter>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
