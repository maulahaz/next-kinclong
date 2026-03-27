"use client";

import { useTransition } from "react";
import { submitAcknowledgeWash } from "./actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      <div className="flex flex-col items-center justify-center p-8 bg-background rounded-xl border border-border shadow-sm text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground">No Contracts Found</h3>
        <p className="text-muted-foreground mt-2 max-w-sm">
          You don't have any active packages yet. Please contact your Kinclong Admin to set one up!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {contracts.map((contract) => {
        const remainingWashes = contract.totalWashes - contract.completedWashes;
        const progressPercent = Math.round((contract.completedWashes / contract.totalWashes) * 100);

        return (
          <Card key={contract.id} className="border-primary/20 shadow-sm overflow-hidden flex flex-col sm:flex-row">
            {/* Left side: Contract Detail */}
            <div className="p-6 flex-1 border-b sm:border-b-0 sm:border-r border-border bg-card">
              <div className="flex justify-between items-start mb-4">
                <Badge variant={contract.status === "completed" ? "secondary" : "default"} className="uppercase tracking-wider">
                  {contract.status}
                </Badge>
                <div className="text-xs text-muted-foreground font-medium">
                  Contract #{contract.id}
                </div>
              </div>
              
              <CardTitle className="text-2xl font-bold mb-1 text-foreground">
                {contract.packageType}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2">
                <Car className="w-4 h-4 text-primary" />
                <span className="font-semibold text-foreground">{contract.car.plateNumber}</span> 
                <span className="capitalize">({contract.car.type})</span>
              </CardDescription>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-muted-foreground">Wash Quota</span>
                  <span className="font-semibold text-primary">{contract.completedWashes} / {contract.totalWashes}</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500 ease-in-out" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                {contract.status === "active" && (
                  <p className="text-xs text-muted-foreground text-right mt-1">
                    {remainingWashes} washes remaining
                  </p>
                )}
                {contract.status === "completed" && (
                  <p className="text-xs text-primary font-medium mt-1">
                    Package Fully Utilized
                  </p>
                )}
              </div>
            </div>

            {/* Right side: Wash History & Acknowledgment */}
            <div className="flex-1 bg-secondary/10 flex flex-col max-h-[400px]">
              <div className="p-4 border-b border-border bg-secondary/30 text-sm font-semibold tracking-wide text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Recent Washes
              </div>
              <div className="overflow-y-auto p-4 space-y-4 flex-1">
                {contract.washes.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">No washes recorded yet.</p>
                )}
                {contract.washes.map((wash) => {
                  const needsAcknowledge = wash.status === "done";
                  
                  return (
                    <div key={wash.id} className={`p-4 rounded-lg border ${needsAcknowledge ? 'border-primary shadow-[0_0_12px_rgba(46,213,115,0.15)] bg-background' : 'border-border bg-card'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium capitalize text-sm">{wash.type} Wash</span>
                        <Badge variant="outline" className={`text-[10px] ${wash.status === 'acknowledged' ? 'text-primary border-primary' : 'text-muted-foreground'}`}>
                          {wash.status}
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-muted-foreground mb-3">
                        {new Date(wash.createdAt).toLocaleDateString()} at {new Date(wash.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>

                      {wash.imageUrl ? (
                        <div className="rounded-md overflow-hidden bg-secondary aspect-video mb-3 relative group border border-border">
                           <img src={wash.imageUrl} alt="Wash Evidence" className="object-cover w-full h-full" />
                        </div>
                      ) : (
                        <div className="text-xs flex items-center gap-1 text-muted-foreground mb-3">
                           <ImageIcon className="w-3 h-3" /> No image
                        </div>
                      )}

                      {needsAcknowledge && (
                        <Button 
                          size="sm" 
                          className="w-full bg-primary hover:bg-primary/90 mt-1 shadow-sm"
                          disabled={isPending}
                          onClick={() => handleAcknowledge(wash.id)}
                        >
                          {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                          Acknowledge Wash
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
