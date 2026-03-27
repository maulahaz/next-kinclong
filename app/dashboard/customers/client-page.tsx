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
import { MoreHorizontal, Edit, Trash, Car as CarIcon, FileText, UserPlus, Loader2, Eye } from "lucide-react";
import { toast } from "sonner";

export function CustomersClientPage({ customers }: { customers: any[] }) {
  const router = useRouter();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [address, setAddress] = useState("");
  const [points, setPoints] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setContactEmail("");
    setAddress("");
    setPoints(0);
    setIsActive(true);
    setSelectedCustomer(null);
  };

  const openEdit = (customer: any) => {
    setSelectedCustomer(customer);
    setName(customer.user?.name || "");
    setEmail(customer.user?.email || "");
    setPhone(customer.phone || "");
    setContactEmail(customer.email || "");
    setAddress(customer.address || "");
    setPoints(customer.points || 0);
    setIsActive(customer.isActive !== false);
    setIsEditOpen(true);
  };

  const openDelete = (customer: any) => {
    setSelectedCustomer(customer);
    setIsDeleteOpen(true);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        body: JSON.stringify({ name, email, phone, contactEmail, address, points, isActive }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      toast.success("Customer created successfully");
      setIsAddOpen(false);
      resetForm();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to create customer");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`/api/customers/${selectedCustomer.id}`, {
        method: "PUT",
        body: JSON.stringify({ name, email, phone, contactEmail, address, points, isActive }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      toast.success("Customer updated successfully");
      setIsEditOpen(false);
      resetForm();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update customer");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/customers/${selectedCustomer.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      toast.success("Customer deleted successfully");
      setIsDeleteOpen(false);
      resetForm();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete customer");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Customer Accounts</h2>
          <p className="text-muted-foreground mt-1">
            View all verified clients in the Kinclong database.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-primary hover:bg-primary/90 shadow-[0_4px_10px_rgba(46,213,115,0.2)] text-white">
          <UserPlus className="w-4 h-4 mr-2" /> Add Customer
        </Button>
      </div>

      <Card className="border-primary/20 shadow-sm bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-primary/5">
              <TableRow>
                <TableHead className="font-semibold text-foreground">Customer Ref</TableHead>
                <TableHead className="font-semibold text-foreground">Name</TableHead>
                <TableHead className="font-semibold text-foreground bg-primary/0">Phone</TableHead>
                <TableHead className="font-semibold text-foreground">Owned Cars</TableHead>
                <TableHead className="font-semibold text-foreground">Active Packages</TableHead>
                <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No customers found.
                  </TableCell>
                </TableRow>
              )}
              {customers.map((customer) => {
                const activePackages = customer.contracts?.filter((c: any) => c.status === "active").length || 0;
                return (
                  <TableRow key={customer.id} className="hover:bg-primary/5 transition-colors">
                    <TableCell className="font-medium text-xs text-muted-foreground">CST-{customer.id}</TableCell>
                    <TableCell className="font-semibold text-foreground">{customer.user?.name}</TableCell>
                    <TableCell className="text-muted-foreground">{customer.phone}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <CarIcon className="w-4 h-4 text-primary" />
                        {customer.cars?.length || 0} registered
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <FileText className="w-4 h-4 text-primary" />
                        {activePackages > 0 ? (
                          <span className="text-primary font-medium">{activePackages} active</span>
                        ) : (
                          <span className="text-muted-foreground">0 active</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(customer)} className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" /> Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDelete(customer)} className="cursor-pointer text-destructive focus:text-destructive">
                            <Trash className="mr-2 h-4 w-4" /> Delete Account
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
      <Dialog open={isAddOpen} onOpenChange={(v) => { if (!v) { setIsAddOpen(false); resetForm(); } }}>
        <DialogContent>
          <form onSubmit={handleAdd}>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto px-1">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name (Login)</Label>
                <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address (Login)</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08123456789" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email (Optional)</Label>
                <Input id="contactEmail" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="contact@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Jl. Sudirman 123" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="points">Points</Label>
                <Input id="points" type="number" value={points} onChange={(e) => setPoints(parseInt(e.target.value))} />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <input type="checkbox" id="isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 text-primary rounded border-input" />
                <Label htmlFor="isActive" className="text-sm font-medium leading-none">Active Customer</Label>
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
      <Dialog open={isEditOpen} onOpenChange={(v) => { if (!v) { setIsEditOpen(false); resetForm(); } }}>
        <DialogContent>
          <form onSubmit={handleEdit}>
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto px-1">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name (Login)</Label>
                <Input id="edit-name" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Address (Login)</Label>
                <Input id="edit-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number *</Label>
                <Input id="edit-phone" required value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-contactEmail">Contact Email</Label>
                <Input id="edit-contactEmail" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input id="edit-address" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-points">Points</Label>
                <Input id="edit-points" type="number" value={points} onChange={(e) => setPoints(parseInt(e.target.value))} />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <input type="checkbox" id="edit-isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 text-primary rounded border-input" />
                <Label htmlFor="edit-isActive" className="text-sm font-medium leading-none">Active Customer</Label>
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
      <Dialog open={isDeleteOpen} onOpenChange={(v) => { if (!v) setIsDeleteOpen(false) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to completely delete <strong>{selectedCustomer?.user?.name}</strong>?
            This will permanently remove the customer, all their registered cars, past contracts, and wash histories.
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
