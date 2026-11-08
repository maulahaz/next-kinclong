"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";
import { MoreHorizontal, Edit, Trash, Plus, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function WashTypesClientPage({ washTypes }: { washTypes: any[] }) {
  const router = useRouter();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedWashType, setSelectedWashType] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [washType, setWashType] = useState("");

  const resetForm = () => {
    setWashType("");
    setSelectedWashType(null);
  };

  const openEdit = (wt: any) => {
    setSelectedWashType(wt);
    setWashType(wt.washType);
    setIsEditOpen(true);
  };

  const openDelete = (wt: any) => {
    setSelectedWashType(wt);
    setIsDeleteOpen(true);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/wash-types", {
        method: "POST",
        body: JSON.stringify({ washType }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      toast.success("Wash type created successfully");
      setIsAddOpen(false);
      resetForm();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to create wash type");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`/api/wash-types/${selectedWashType.id}`, {
        method: "PUT",
        body: JSON.stringify({ washType }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      toast.success("Wash type updated successfully");
      setIsEditOpen(false);
      resetForm();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update wash type");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/wash-types/${selectedWashType.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      toast.success("Wash type deleted successfully");
      setIsDeleteOpen(false);
      resetForm();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete wash type");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wash Types"
        description="Manage the catalog of wash features used when building service packages."
        actions={
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus /> New Wash Type
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/60">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Wash Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {washTypes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">
                    No wash types defined.
                  </TableCell>
                </TableRow>
              )}
              {washTypes.map((wt) => (
                <TableRow key={wt.id} className="hover:bg-muted/40">
                  <TableCell className="text-xs font-medium text-muted-foreground">#{wt.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 font-medium text-foreground">
                      <Sparkles className="size-4 text-primary" />
                      {wt.washType}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" className="size-8" />}>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(wt)}>
                          <Edit /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={() => openDelete(wt)}>
                          <Trash /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={isAddOpen} onOpenChange={(v) => { if (!v) { setIsAddOpen(false); resetForm(); } }}>
        <DialogContent>
          <form onSubmit={handleAdd}>
            <DialogHeader>
              <DialogTitle>Create New Wash Type</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 px-1">
              <div className="space-y-2">
                <Label htmlFor="washType">Wash Type Name</Label>
                <Input id="washType" required value={washType} onChange={(e) => setWashType(e.target.value)} placeholder="e.g. Exterior Wash" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={(v) => { if (!v) { setIsEditOpen(false); resetForm(); } }}>
        <DialogContent>
          <form onSubmit={handleEdit}>
            <DialogHeader>
              <DialogTitle>Edit Wash Type</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 px-1">
              <div className="space-y-2">
                <Label htmlFor="edit-washType">Wash Type Name</Label>
                <Input id="edit-washType" required value={washType} onChange={(e) => setWashType(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={(v) => { if (!v) setIsDeleteOpen(false) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Confirm Removal</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to permanently delete the <strong>{selectedWashType?.washType}</strong> wash type?
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Yes, delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
