"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { submitWashEvidence } from "./actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Camera, CheckCircle2, Car, User, Calendar, Loader2 } from "lucide-react";

type WashTask = {
  id: number;
  type: string;
  // type: "inside" | "outside";
  // status: "pending" | "done" | "acknowledged";
  // createdAt: Date;
  completed: number;
  target: number;
  // contractId: number;
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
      <div className="flex flex-col items-center justify-center p-8 bg-background rounded-xl border border-border shadow-sm text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground">All Caught Up!</h3>
        <p className="text-muted-foreground mt-2 max-w-sm">
          There are no pending wash tasks assigned to the queue. Keep up the great work!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <Card key={task.id} className="border-primary/20 shadow-sm flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <Badge variant={task.type === "inside" ? "secondary" : "default"} className="uppercase tracking-wider">
                  {task.type} Wash
                </Badge>
                <div className="text-xs text-muted-foreground font-medium">
                  ID: #{task.id}
                </div>
              </div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Car className="w-4 h-4 text-primary" />
                {task.car.plateNumber}
              </CardTitle>
              <CardDescription className="capitalize">
                {task.car.type} Car
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm pb-4">
              <div className="flex items-center gap-2 text-foreground">
                <User className="w-4 h-4 text-primary" />
                <span className="font-medium text-muted-foreground">Owner:</span> {task.customer.name}
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="font-medium text-muted-foreground">Contract Progress:</span> {task.completed}/{task.target} done
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                className="w-full bg-primary hover:bg-primary/90 shadow-[0_4px_10px_rgba(46,213,115,0.2)]" 
                onClick={() => setSelectedTask(task)}
              >
                <Camera className="w-4 h-4 mr-2" />
                Upload Evidence
              </Button>
            </CardFooter>
          </Card>
        ))}
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contract ID #{task.id}</DialogTitle>
          <DialogDescription>
            Upload proof of completion for {task.car.plateNumber} ({task.type} wash).
          </DialogDescription>
        </DialogHeader>
        
        <form ref={formRef} action={formAction} className="space-y-4 py-4">
          <input type="hidden" name="washId" value={task.id} />
          <div className="space-y-2">
            <Label htmlFor="washedDate">Washed Date</Label>
            <Input 
              id="washedDate" 
              name="washedDate" 
              type="date"
              max={new Date().toISOString().split("T")[0]}
              required
              className="border-primary/20"
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
              className="cursor-pointer border-primary/20"
            />
          </div>

          {preview && (
            <div className="mt-4 rounded-lg overflow-hidden border border-border shadow-sm flex items-center justify-center bg-secondary/30 h-48">
              <img src={preview} alt="Upload Preview" className="object-cover w-full h-full" />
            </div>
          )}

          <DialogFooter className="mt-6 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !preview} className="bg-primary hover:bg-primary/90">
              {isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
              ) : (
                <><CheckCircle2 className="mr-2 h-4 w-4" /> Confirm & Complete</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
