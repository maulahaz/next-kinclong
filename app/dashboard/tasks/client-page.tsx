"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { submitWashEvidence } from "./actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { toast } from "sonner";
import { Camera, CheckCircle2, Car, User, Loader2, ClipboardList } from "lucide-react";

type WashTask = {
  id: number;
  type: string;
  completed: number;
  target: number;
  car: {
    plateNumber: string;
    type: "small" | "big";
  };
  customer: {
    name: string;
  };
};

export function TasksClientPage({ tasks }: { tasks: WashTask[] }) {
  const [selectedTask, setSelectedTask] = useState<WashTask | null>(null);

  if (!tasks.length) {
    return (
      <EmptyState
        icon={CheckCircle2}
        title="All caught up!"
        description="There are no pending wash tasks assigned to the queue. Keep up the great work!"
      />
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => {
          const progress = task.target > 0 ? Math.round((task.completed / task.target) * 100) : 0;
          return (
            <Card key={task.id} className="justify-between transition-shadow hover:shadow-card-hover">
              <CardHeader className="pb-1">
                <div className="flex justify-between items-center mb-3">
                  <Badge variant="outline" className="h-6 gap-1.5 border-primary/20 bg-primary/5 font-semibold capitalize text-primary">
                    <ClipboardList className="size-3" />
                    {task.type}
                  </Badge>
                  <div className="text-xs font-medium text-muted-foreground">
                    #{task.id}
                  </div>
                </div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Car className="size-4.5 text-primary" />
                  {task.car.plateNumber}
                </CardTitle>
                <CardDescription className="capitalize">
                  {task.car.type} car
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5 text-sm pb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="size-4 text-muted-foreground/70" />
                  <span className="truncate">{task.customer.name}</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Contract progress</span>
                    <span className="font-semibold tabular-nums text-foreground">{task.completed}/{task.target}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pb-4">
                <Button className="w-full" onClick={() => setSelectedTask(task)}>
                  <Camera />
                  Upload Evidence
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {selectedTask && (
        <UploadDialog
          task={selectedTask}
          open={!!selectedTask}
          onOpenChange={(open) => !open && setSelectedTask(null)}
        />
      )}
    </>
  );
}

function UploadDialog({
  task,
  open,
  onOpenChange
}: {
  task: WashTask;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [state, formAction, isPending] = useActionState(submitWashEvidence, null);
  const [preview, setPreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      onOpenChange(false);
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, onOpenChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Complete wash #{task.id}</DialogTitle>
          <DialogDescription>
            Upload proof of completion for {task.car.plateNumber} ({task.type}).
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="space-y-4 py-2">
          <input type="hidden" name="washId" value={task.id} />
          <div className="space-y-2">
            <Label htmlFor="washedDate">Washed Date</Label>
            <Input
              id="washedDate"
              name="washedDate"
              type="date"
              max={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">Photo Evidence</Label>
            {/* Using capture="environment" to default directly to the rear camera on mobile */}
            <Input
              id="file"
              name="file"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              required
              className="cursor-pointer pt-2 file:mr-2 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:text-xs file:font-semibold file:text-primary"
            />
          </div>

          {preview && (
            <div className="mt-2 overflow-hidden rounded-xl border border-border bg-secondary/40 shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Upload Preview" className="h-48 w-full object-cover" />
            </div>
          )}

          <DialogFooter className="mt-4 border-t border-border pt-5">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !preview}>
              {isPending ? (
                <><Loader2 className="animate-spin" /> Uploading…</>
              ) : (
                <><CheckCircle2 /> Confirm & Complete</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
