"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Edit, Trash, Plus, Loader2, Package } from "lucide-react";
import { toast } from "sonner";
import { shortenText } from "@/lib/utils";

export function PackagesClientPage({ packages }: { packages: any[] }) {
  const router = useRouter();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [price, setPrice] = useState(100000);
  const [includesText, setIncludesText] = useState(""); // comma separated
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setName("");
    setDescription("");
    setDuration(30);
    setPrice(100000);
    setIncludesText("");
    setIsActive(true);
    setSelectedPackage(null);
  };

  const openEdit = (pkg: any) => {
    setSelectedPackage(pkg);
    setName(pkg.name);
    setDescription(pkg.description || "");
    setDuration(pkg.duration);
    setPrice(pkg.price);
    setIncludesText(Array.isArray(pkg.includes) ? pkg.includes.join(", ") : "");
    setIsActive(pkg.isActive);
    setIsEditOpen(true);
  };

  const openDelete = (pkg: any) => {
    setSelectedPackage(pkg);
    setIsDeleteOpen(true);
  };

  const parseIncludes = (text: string) => text.split(",").map(i => i.trim()).filter(Boolean);

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
          includes: parseIncludes(includesText),
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
          includes: parseIncludes(includesText),
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
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Service Packages</h2>
          <p className="text-muted-foreground mt-1">
            Build and configure membership programs and on-demand washes.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-primary hover:bg-primary/90 shadow-[0_4px_10px_rgba(46,213,115,0.2)] text-white">
          <Plus className="w-4 h-4 mr-2" /> New Package
        </Button>
      </div>

      <Card className="border-primary/20 shadow-sm bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-primary/5">
              <TableRow>
                <TableHead className="font-semibold text-foreground">Name</TableHead>
                <TableHead className="font-semibold text-foreground bg-primary/0">Duration</TableHead>
                <TableHead className="font-semibold text-foreground">Price (AED)</TableHead>
                <TableHead className="font-semibold text-foreground">Features</TableHead>
                <TableHead className="font-semibold text-foreground">Status</TableHead>
                <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No packages defined.
                  </TableCell>
                </TableRow>
              )}
              {packages.map((pkg) => (
                <TableRow key={pkg.id} className="hover:bg-primary/5 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-primary" />
                        {pkg.name}
                      </span>
                      <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]" title={pkg.description}>
                        {shortenText(pkg.description, 30)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {pkg.duration} Days
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-foreground">{pkg.price.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[250px]">
                      {(pkg.includes || []).slice(0, 2).map((item: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-[10px] leading-3 py-0.5 border-primary/20 text-muted-foreground">
                          {item}
                        </Badge>
                      ))}
                      {(pkg.includes || []).length > 2 && (
                        <Badge variant="outline" className="text-[10px] leading-3 py-0.5 border-primary/20 text-primary bg-primary/5">
                          +{(pkg.includes.length - 2)} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={pkg.isActive ? "default" : "secondary"}>
                      {pkg.isActive ? "Active" : "Disabled"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(pkg)} className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" /> Edit Feature
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDelete(pkg)} className="cursor-pointer text-destructive focus:text-destructive">
                          <Trash className="mr-2 h-4 w-4" /> Delete
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
                <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the benefits..." />
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
                <Label htmlFor="includes">Included Features</Label>
                <Input id="includes" required value={includesText} onChange={(e) => setIncludesText(e.target.value)} placeholder="Exterior wash, Waxing, Vacuum... (comma separated)" />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <input type="checkbox" id="isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 text-primary rounded border-input" />
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
                <Input id="edit-description" value={description} onChange={(e) => setDescription(e.target.value)} />
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
                <Label htmlFor="edit-includes">Included Features</Label>
                <Input id="edit-includes" required value={includesText} onChange={(e) => setIncludesText(e.target.value)} placeholder="Comma separated" />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <input type="checkbox" id="edit-isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 text-primary rounded border-input" />
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
