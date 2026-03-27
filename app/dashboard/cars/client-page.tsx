"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Edit, Trash, Car as CarIcon, User, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function CarsClientPage({ cars, customers }: { cars: any[]; customers: any[] }) {
  const router = useRouter();
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [plateNumber, setPlateNumber] = useState("");
  const [carType, setCarType] = useState<"small" | "big">("small");
  const [customerId, setCustomerId] = useState("");

  const resetForm = () => {
    setPlateNumber("");
    setCarType("small");
    setCustomerId("");
    setSelectedCar(null);
  };

  const openEdit = (car: any) => {
    setSelectedCar(car);
    setPlateNumber(car.plateNumber);
    setCarType(car.type);
    setCustomerId(car.customerId.toString());
    setIsEditOpen(true);
  };

  const openDelete = (car: any) => {
    setSelectedCar(car);
    setIsDeleteOpen(true);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/cars", {
        method: "POST",
        body: JSON.stringify({
          plateNumber,
          type: carType,
          customerId: parseInt(customerId),
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      
      toast.success("Car registered successfully");
      setIsAddOpen(false);
      resetForm();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to register car");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`/api/cars/${selectedCar.id}`, {
        method: "PUT",
        body: JSON.stringify({
          plateNumber,
          type: carType,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      
      toast.success("Car updated successfully");
      setIsEditOpen(false);
      resetForm();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update car");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/cars/${selectedCar.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      
      toast.success("Car deleted successfully");
      setIsDeleteOpen(false);
      resetForm();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete car");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Fleet Directory</h2>
          <p className="text-muted-foreground mt-1">
            Browse and manage all customer registered vehicles (Cars) in the application.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-primary hover:bg-primary/90 shadow-[0_4px_10px_rgba(46,213,115,0.2)] text-white">
          <Plus className="w-4 h-4 mr-2" /> Register Car
        </Button>
      </div>

      <Card className="border-primary/20 shadow-sm bg-card overflow-hidden flex flex-col items-stretch">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-primary/5">
              <TableRow>
                <TableHead className="font-semibold text-foreground">Reg ID</TableHead>
                <TableHead className="font-semibold text-foreground">Plate Number</TableHead>
                <TableHead className="font-semibold text-foreground">Vehicle Type</TableHead>
                <TableHead className="font-semibold text-foreground">Registered Owner</TableHead>
                <TableHead className="font-semibold text-foreground">Added Date</TableHead>
                <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cars.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No registered vehicles found.
                  </TableCell>
                </TableRow>
              )}
              {cars.map((car) => {
                return (
                  <TableRow key={car.id} className="hover:bg-primary/5 transition-colors">
                    <TableCell className="font-medium text-xs text-muted-foreground">CAR-{car.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 font-bold text-foreground">
                        <CarIcon className="w-4 h-4 text-primary shrink-0" />
                        {car.plateNumber}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize text-xs font-semibold tracking-wide border-primary/30 text-primary">
                        {car.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2 text-sm text-foreground">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {car.customer?.user?.name || "Unassigned"}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm flex items-center h-full">
                       {new Date(car.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0 border-none outline-none focus-visible:ring-0" />}>
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(car)} className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" /> Edit Car
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDelete(car)} className="cursor-pointer text-destructive focus:text-destructive">
                            <Trash className="mr-2 h-4 w-4" /> Unregister Vehicle
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* ADD DIALOG */}
      <Dialog open={isAddOpen} onOpenChange={(v) => { if(!v) { setIsAddOpen(false); resetForm(); } }}>
        <DialogContent>
          <form onSubmit={handleAdd}>
            <DialogHeader>
              <DialogTitle>Register New Car</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="plate">Plate Number</Label>
                <Input id="plate" required value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} placeholder="e.g. B 1234 ABC" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Vehicle Type</Label>
                <select id="type" required value={carType} onChange={(e) => setCarType(e.target.value as any)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="small">Small</option>
                  <option value="big">Big</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer">Customer</Label>
                <select id="customer" required value={customerId} onChange={(e) => setCustomerId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="">Select a customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.user?.name} ({c.user?.email})</option>
                  ))}
                </select>
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
              <DialogTitle>Edit Car</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-plate">Plate Number</Label>
                <Input id="edit-plate" required value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Vehicle Type</Label>
                <select id="edit-type" required value={carType} onChange={(e) => setCarType(e.target.value as any)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="small">Small</option>
                  <option value="big">Big</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Customer</Label>
                <Input disabled value={customers.find((c) => c.id.toString() === customerId)?.user?.name || ""} />
                <p className="text-xs text-muted-foreground">Customer cannot be changed after registration.</p>
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
            Are you sure you want to unregister <strong>{selectedCar?.plateNumber}</strong>? 
            This action cannot be undone and will delete all associated contracts and wash records.
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
