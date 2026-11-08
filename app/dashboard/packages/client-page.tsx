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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash, Plus, Loader2, Package } from "lucide-react";
import { toast } from "sonner";
import { shortenText } from "@/lib/utils";

export function PackagesClientPage({ packages, washTypes }: { packages: any[]; washTypes: any[] }) {
  const router = useRouter();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [price, setPrice] = useState(100000);
  const [totalWash, setTotalWash] = useState(1);
  const [selectedWashTypes, setSelectedWashTypes] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setName("");
    setDescription("");
    setDuration(30);
    setPrice(100000);
    setTotalWash(1);
    setSelectedWashTypes([]);
    setIsActive(true);
    setSelectedPackage(null);
  };

  const openEdit = (pkg: any) => {
    setSelectedPackage(pkg);
    setName(pkg.name);
    setDescription(pkg.description || "");
    setDuration(pkg.duration);
    setPrice(pkg.price);
    setTotalWash(pkg.totalWash || 1);
    setSelectedWashTypes(Array.isArray(pkg.includes) ? pkg.includes : []);
    setIsActive(pkg.isActive);
    setIsEditOpen(true);
  };

  const openDelete = (pkg: any) => {
    setSelectedPackage(pkg);
    setIsDeleteOpen(true);
  };

  const toggleWashType = (wt: string) => {
    setSelectedWashTypes((prev) =>
      prev.includes(wt) ? prev.filter((x) => x !== wt) : [...prev, wt]
    );
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/packages", {
        method: "POST",
        body: JSON.stringify({
          name,
          description,
          duration,
          price,
          totalWash,
          includes: selectedWashTypes,
          isActive,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      toast.success("Package created successfully");
      setIsAddOpen(false);
      resetForm();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to create package");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`/api/packages/${selectedPackage.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name,
          description,
          duration,
          price,
          totalWash,
          includes: selectedWashTypes,
          isActive,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      toast.success("Package updated successfully");
      setIsEditOpen(false);
      resetForm();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update package");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/packages/${selectedPackage.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      toast.success("Package deleted successfully");
      setIsDeleteOpen(false);
      resetForm();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete package");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Service Packages"
        description="Build and configure membership programs and on-demand washes."
        actions={
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus /> New Package
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/60">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-center">Washes</TableHead>
                <TableHead>Price (Rp)</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    No packages defined.
                  </TableCell>
                </TableRow>
              )}
              {packages.map((pkg) => (
                <TableRow key={pkg.id} className="hover:bg-muted/40">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Package className="size-4 text-primary" />
                        {pkg.name}
                      </span>
                      <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]" title={pkg.description}>
                        {shortenText(pkg.description, 30)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {pkg.duration} days
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium text-foreground">{pkg.totalWash || 1}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-foreground">{pkg.price.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[250px]">
                      {(pkg.includes || []).slice(0, 2).map((item: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-[10px] leading-3 py-0.5 border-border bg-muted text-muted-foreground">
                          {item}
                        </Badge>
                      ))}
                      {(pkg.includes || []).length > 2 && (
                        <Badge variant="outline" className="text-[10px] leading-3 py-0.5 border-primary/20 bg-primary/5 text-primary">
                          +{(pkg.includes.length - 2)} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge variant={pkg.isActive ? "active" : "disabled"}>
                      {pkg.isActive ? "Active" : "Disabled"}
                    </StatusBadge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" className="size-8" />}>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(pkg)}>
                          <Edit /> Edit Package
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={() => openDelete(pkg)}>
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
              <DialogTitle>Create New Package</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto px-1">
              <div className="space-y-2">
                <Label htmlFor="name">Package Name</Label>
                <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. VIP Monthly" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the benefits..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Validity (Days)</Label>
                  <Input id="duration" type="number" required value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (Rp)</Label>
                  <Input id="price" type="number" required value={price} onChange={(e) => setPrice(parseInt(e.target.value))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalWash">Total Washes</Label>
                <Input id="totalWash" type="number" required value={totalWash} onChange={(e) => setTotalWash(parseInt(e.target.value))} min="1" />
              </div>
              <div className="space-y-2">
                <Label>Included Features</Label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-3 bg-muted/30">
                  {washTypes.length === 0 && (
                    <p className="text-xs text-muted-foreground col-span-2">No wash types available. Add some first.</p>
                  )}
                  {washTypes.map((wt) => (
                    <label key={wt.id} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={selectedWashTypes.includes(wt.washType)}
                        onChange={() => toggleWashType(wt.washType)}
                      />
                      {wt.washType}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Checkbox id="isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                <Label htmlFor="isActive" className="text-sm font-medium leading-none">Activate Package immediately</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Publish
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={(v) => { if (!v) { setIsEditOpen(false); resetForm(); } }}>
        <DialogContent>
          <form onSubmit={handleEdit}>
            <DialogHeader>
              <DialogTitle>Edit Package</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto px-1">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Package Name</Label>
                <Input id="edit-name" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">Validity (Days)</Label>
                  <Input id="edit-duration" type="number" required value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price (Rp)</Label>
                  <Input id="edit-price" type="number" required value={price} onChange={(e) => setPrice(parseInt(e.target.value))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-totalWash">Total Washes</Label>
                <Input id="edit-totalWash" type="number" required value={totalWash} onChange={(e) => setTotalWash(parseInt(e.target.value))} min="1" />
              </div>
              <div className="space-y-2">
                <Label>Included Features</Label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-3 bg-muted/30">
                  {washTypes.length === 0 && (
                    <p className="text-xs text-muted-foreground col-span-2">No wash types available. Add some first.</p>
                  )}
                  {washTypes.map((wt) => (
                    <label key={wt.id} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={selectedWashTypes.includes(wt.washType)}
                        onChange={() => toggleWashType(wt.washType)}
                      />
                      {wt.washType}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Checkbox id="edit-isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                <Label htmlFor="edit-isActive" className="text-sm font-medium leading-none">Package Active</Label>
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
            Are you sure you want to permanently delete the <strong>{selectedPackage?.name}</strong> package?
            This action might fail if there are existing contracts actively using this package.
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
