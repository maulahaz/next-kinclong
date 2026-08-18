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
import { MoreHorizontal, Edit, Trash, Plus, Loader2, Eye } from "lucide-react";
import { toast } from "sonner";

export function ContractsClientPage({ contracts, cars, packages }: { contracts: any[]; cars: any[]; packages: any[] }) {
  const router = useRouter();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [carId, setCarId] = useState("");
  const [packageId, setPackageId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [status, setStatus] = useState<"active" | "completed" | "cancelled">("active");

  const resetForm = () => {
    setCarId("");
    setPackageId("");
    setStartDate("");
    setStatus("active");
    setSelectedContract(null);
  };

  const openEdit = (contract: any) => {
    setSelectedContract(contract);
    setCarId(contract.carId?.toString() || "");
    setPackageId(contract.packageId?.toString() || "");
    setStartDate(contract.startDate ? new Date(contract.startDate).toISOString().split('T')[0] : "");
    setStatus(contract.status);
    setIsEditOpen(true);
  };

  const openDelete = (contract: any) => {
    setSelectedContract(contract);
    setIsDeleteOpen(true);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Find car to get customerId
    const selectedCar = cars.find(c => c.id.toString() === carId);
    if (!selectedCar) {
      toast.error("Please select a valid car");
      setIsLoading(false);
      return;
    }

    if (!startDate) {
      toast.error("Please select a start date");
      setIsLoading(false);
      return;
    }

    // Get selected package
    const selectedPackage = packages.find(p => p.id.toString() === packageId);
    if (!selectedPackage) {
      toast.error("Please select a valid package");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/contracts", {
        method: "POST",
        body: JSON.stringify({
          carId: parseInt(carId),
          customerId: selectedCar.customerId,
          packageId: parseInt(packageId),
          packageType: selectedPackage.name,
          totalWashes: selectedPackage.totalWash,
          startDate: startDate, // Send as YYYY-MM-DD format
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      
      toast.success("Contract created successfully");
      setIsAddOpen(false);
      resetForm();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to create contract");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Get selected package
      const selectedPackage = packages.find(p => p.id.toString() === packageId);
      if (!selectedPackage) {
        toast.error("Please select a valid package");
        setIsLoading(false);
        return;
      }

      const res = await fetch(`/api/contracts/${selectedContract.id}`, {
        method: "PUT",
        body: JSON.stringify({
          packageId: parseInt(packageId),
          packageType: selectedPackage.name,
          totalWashes: selectedPackage.totalWash,
          status,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      
      toast.success("Contract updated successfully");
      setIsEditOpen(false);
      resetForm();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update contract");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/contracts/${selectedContract.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      
      toast.success("Contract deleted successfully");
      setIsDeleteOpen(false);
      resetForm();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete contract");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Contracts Overview</h2>
          <p className="text-muted-foreground mt-1">
            Manage customer packages, monitor washes progress, and define new contracts.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-primary hover:bg-primary/90 shadow-[0_4px_10px_rgba(46,213,115,0.2)] text-white">
          <Plus className="w-4 h-4 mr-2" /> Create Contract
        </Button>
      </div>

      <Card className="border-primary/20 shadow-sm bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-primary/5">
              <TableRow>
                <TableHead className="font-semibold text-foreground">ID</TableHead>
                <TableHead className="font-semibold text-foreground">Customer</TableHead>
                {/* <TableHead className="font-semibold text-foreground">Car (Plate)</TableHead> */}
                <TableHead className="font-semibold text-foreground">Package Type</TableHead>
                <TableHead className="font-semibold text-foreground">Start Date</TableHead>
                <TableHead className="font-semibold text-foreground">Progress</TableHead>
                <TableHead className="font-semibold text-foreground">Status</TableHead>
                <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No contracts found.
                  </TableCell>
                </TableRow>
              )}
              {contracts.map((contract) => (
                <TableRow key={contract.id} className="hover:bg-primary/5 transition-colors">
                  <TableCell className="font-medium text-xs">#{contract.id}</TableCell>
                  {/* <TableCell>{contract.customer?.user?.name || "Unknown"}</TableCell> */}
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{contract.car?.plateNumber} </span>
                      <span className="text-xs text-muted-foreground capitalize">{contract.customer?.user?.name}- {contract.car?.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{contract.packageType}</TableCell>
                  <TableCell>
                    <span className="text-sm font-semibold">{contract.startDate}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-semibold">{contract.completedWashes} / {contract.totalWashes}</span>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden mt-1 max-w-[100px]">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${Math.min((contract.completedWashes / contract.totalWashes) * 100, 100)}%` }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={contract.status === "active" ? "default" : "secondary"} className="uppercase">
                      {contract.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(contract)} className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDelete(contract)} className="cursor-pointer text-destructive focus:text-destructive">
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

      {/* ADD DIALOG */}
      <Dialog open={isAddOpen} onOpenChange={(v) => { if(!v) { setIsAddOpen(false); resetForm(); } }}>
        <DialogContent>
          <form onSubmit={handleAdd}>
            <DialogHeader>
              <DialogTitle>Create New Contract</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="car">Target Car</Label>
                <select id="car" required value={carId} onChange={(e) => setCarId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="">Select a car</option>
                  {cars.map((c) => (
                    <option key={c.id} value={c.id}>{c.plateNumber} ({c.customer?.user?.name || "Unknown"})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="package">Package Type</Label>
                <select id="package" required value={packageId} onChange={(e) => setPackageId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="">Select a package</option>
                  {packages.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.totalWash} washes)</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Contract Start Date</Label>
                <Input id="startDate" type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={(v) => { if(!v) { setIsEditOpen(false); resetForm(); } }}>
        <DialogContent>
          <form onSubmit={handleEdit}>
            <DialogHeader>
              <DialogTitle>Edit Contract</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Car / Customer</Label>
                <Input disabled value={selectedContract?.car?.plateNumber + " - " + (selectedContract?.customer?.user?.name || "Unknown")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-package">Package Type</Label>
                <select id="edit-package" required value={packageId} onChange={(e) => setPackageId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="">Select a package</option>
                  {packages.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.totalWash} washes)</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Contract Start Date</Label>
                <Input id="startDate" type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <select id="edit-status" required value={status} onChange={(e) => setStatus(e.target.value as any)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={isDeleteOpen} onOpenChange={(v) => { if(!v) setIsDeleteOpen(false) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to delete this contract for <strong>{selectedContract?.car?.plateNumber}</strong>? 
            This will permanently remove the contract and its associated wash history.
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
    </>
  );
}
