"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Edit, Trash, Car as CarIcon, FileText, UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface UnverifiedUser {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
}

export function CustomersClientPage({ customers }: { customers: any[] }) {
  const router = useRouter();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Unverified users list
  const [unverifiedUsers, setUnverifiedUsers] = useState<UnverifiedUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  // Customer-specific form states (optional fields)
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [address, setAddress] = useState("");
  const [points, setPoints] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);

  // Edit-only user fields
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const resetForm = () => {
    setSelectedUserId("");
    setContactPhone("");
    setContactEmail("");
    setAddress("");
    setPoints(0);
    setIsActive(true);
    setEditName("");
    setEditEmail("");
    setSelectedCustomer(null);
  };

  const fetchUnverifiedUsers = async () => {
    try {
      const res = await fetch("/api/users/unverified");
      const json = await res.json();
      if (json.success) {
        setUnverifiedUsers(json.data);
      }
    } catch {
      // silent
    }
  };

  const openAdd = () => {
    resetForm();
    fetchUnverifiedUsers();
    setIsAddOpen(true);
  };

  const openEdit = (customer: any) => {
    setSelectedCustomer(customer);
    setEditName(customer.user?.name || "");
    setEditEmail(customer.user?.email || "");
    setContactPhone(customer.phone || "");
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
    if (!selectedUserId) {
      toast.error("Please select an unverified user");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: parseInt(selectedUserId),
          phone: contactPhone || undefined,
          email: contactEmail || undefined,
          address: address || undefined,
          points,
          isActive,
        }),
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          phone: contactPhone || undefined,
          contactEmail: contactEmail || undefined,
          address: address || undefined,
          points,
          isActive,
        }),
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

  const selectedUser = unverifiedUsers.find((u) => u.id === parseInt(selectedUserId));

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Customer Accounts</h2>
          <p className="text-muted-foreground mt-1">
            View all verified clients in the Kinclong database.
          </p>
        </div>
        <Button onClick={openAdd} className="bg-primary hover:bg-primary/90 shadow-[0_4px_10px_rgba(46,213,115,0.2)] text-white">
          <UserPlus className="w-4 h-4 mr-2" /> Add Customer
        </Button>
      </div>

      <Card className="border-primary/20 shadow-sm bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-primary/5">
              <TableRow>
                <TableHead className="font-semibold text-foreground">Ref</TableHead>
                <TableHead className="font-semibold text-foreground">Name</TableHead>
                <TableHead className="font-semibold text-foreground">Phone</TableHead>
                <TableHead className="font-semibold text-foreground">Cars</TableHead>
                <TableHead className="font-semibold text-foreground">Packages</TableHead>
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
                    <TableCell className="text-muted-foreground">{customer.user?.phone || customer.phone || "—"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <CarIcon className="w-4 h-4 text-primary" />
                        {customer.cars?.length || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <FileText className="w-4 h-4 text-primary" />
                        {activePackages > 0 ? (
                          <span className="text-primary font-medium">{activePackages} active</span>
                        ) : (
                          <span className="text-muted-foreground">0</span>
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
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDelete(customer)} className="cursor-pointer text-destructive focus:text-destructive">
                            <Trash className="mr-2 h-4 w-4" /> Delete
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

      {/* ADD DIALOG — Select from unverified users */}
      <Dialog open={isAddOpen} onOpenChange={(v) => { if (!v) { setIsAddOpen(false); resetForm(); } }}>
        <DialogContent>
          <form onSubmit={handleAdd}>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto px-1">
              <div className="space-y-2">
                <Label htmlFor="userId">Select Registered User</Label>
                <select
                  id="userId"
                  required
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">— Choose an unverified user —</option>
                  {unverifiedUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email || u.phone || `ID #${u.id}`})
                    </option>
                  ))}
                </select>
                {unverifiedUsers.length === 0 && (
                  <p className="text-xs text-muted-foreground">No unverified users available. Users must register first.</p>
                )}
              </div>

              {selectedUser && (
                <div className="rounded-md bg-primary/5 border border-primary/10 p-3 text-sm space-y-1">
                  <p className="font-semibold text-foreground">{selectedUser.name}</p>
                  {selectedUser.email && <p className="text-muted-foreground text-xs">Email: {selectedUser.email}</p>}
                  {selectedUser.phone && <p className="text-muted-foreground text-xs">Phone: {selectedUser.phone}</p>}
                </div>
              )}

              <div className="border-t border-border pt-4 space-y-4">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Optional Customer Details</p>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Alt. Phone</Label>
                  <Input id="contactPhone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="Other phone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Alt. Email</Label>
                  <Input id="contactEmail" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="Other email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Jl. Sudirman 123" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="points">Points</Label>
                  <Input id="points" type="number" value={points} onChange={(e) => setPoints(parseInt(e.target.value) || 0)} />
                </div>
                {/* --Disable isActive from 'customers' table, let it control from 'users' table-- */}
                {/* <div className="flex items-center space-x-2 pt-1">
                  <input type="checkbox" id="isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 text-primary rounded border-input" />
                  <Label htmlFor="isActive" className="text-sm font-medium leading-none">Active Customer</Label>
                </div> */}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isLoading || !selectedUserId}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm
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
                <Label htmlFor="edit-name">Full Name</Label>
                <Input id="edit-name" required value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Login Email</Label>
                <Input id="edit-email" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
              </div>

              <div className="border-t border-border pt-4 space-y-4">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Optional Contact</p>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Alt. Phone</Label>
                  <Input id="edit-phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-contactEmail">Alt. Email</Label>
                  <Input id="edit-contactEmail" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-address">Address</Label>
                  <Input id="edit-address" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-points">Points</Label>
                  <Input id="edit-points" type="number" value={points} onChange={(e) => setPoints(parseInt(e.target.value) || 0)} />
                </div>
                {/* --Disable isActive from 'customers' table, let it control from 'users' table-- */}
                {/* <div className="flex items-center space-x-2 pt-1">
                  <input type="checkbox" id="edit-isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 text-primary rounded border-input" />
                  <Label htmlFor="edit-isActive" className="text-sm font-medium leading-none">Active Customer</Label>
                </div> */}
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
