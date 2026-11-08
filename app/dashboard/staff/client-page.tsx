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
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/components/ui/avatar";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { MoreHorizontal, Edit, Trash, UserPlus, Loader2, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { formatDayMonth_fromDate } from "@/lib/utils";

export function StaffClientPage({ staffs }: { staffs: any[] }) {
  const router = useRouter();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  const [hireDate, setHireDate] = useState("");

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setPosition("");
    setSalary(0);
    setIsActive(true);
    setHireDate("");
    setSelectedStaff(null);
  };

  const openEdit = (staff: any) => {
    setSelectedStaff(staff);
    setName(staff.user?.name || "");
    setEmail(staff.user?.email || "");
    setPhone(staff.phone || "");
    setAddress(staff.address || "");
    setPosition(staff.position || "");
    setSalary(staff.salary || 0);
    setIsActive(staff.isActive !== false);
    setHireDate(staff.hireDate ? new Date(staff.hireDate).toISOString().split('T')[0] : "");
    setIsEditOpen(true);
  };

  const openDelete = (staff: any) => {
    setSelectedStaff(staff);
    setIsDeleteOpen(true);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, address, position, salary, isActive, hireDate: hireDate ? new Date(hireDate) : undefined }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      toast.success("Staff added successfully");
      setIsAddOpen(false);
      resetForm();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to add staff");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`/api/staff/${selectedStaff.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, address, position, salary, isActive, hireDate: hireDate ? new Date(hireDate) : undefined }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      toast.success("Staff updated successfully");
      setIsEditOpen(false);
      resetForm();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update staff");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/staff/${selectedStaff.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      toast.success("Staff member deleted");
      setIsDeleteOpen(false);
      resetForm();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete staff");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Staff Management"
        description="Build and manage your car wash service team."
        actions={
          <Button onClick={() => setIsAddOpen(true)}>
            <UserPlus /> New Member
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/60">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Hire Date</TableHead>
                <TableHead>Salary (IDR)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    No staff members found.
                  </TableCell>
                </TableRow>
              )}
              {staffs.map((staff) => (
                <TableRow key={staff.id} className="hover:bg-muted/40">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={staff.user?.name || "?"} />
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-foreground truncate">{staff.user?.name}</span>
                        <span className="text-xs text-muted-foreground">{staff.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Briefcase className="size-4 text-primary" />
                      {staff.position || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                     {staff.hireDate ? formatDayMonth_fromDate(new Date(staff.hireDate)) : "N/A"}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-foreground">IDR {staff.salary?.toLocaleString() || 0}</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge variant={staff.isActive ? "active" : "disabled"}>
                      {staff.isActive ? "Active" : "Disabled"}
                    </StatusBadge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" className="size-8" />}>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(staff)}>
                          <Edit /> Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={() => openDelete(staff)}>
                          <Trash /> Terminate
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
              <DialogTitle>Add New Staff</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto px-1">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name (Login)</Label>
                <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address (Login)</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" required value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input id="position" value={position} onChange={(e) => setPosition(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary (IDR)</Label>
                  <Input id="salary" type="number" value={salary} onChange={(e) => setSalary(parseInt(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hireDate">Hire Date</Label>
                  <Input id="hireDate" type="date" value={hireDate} onChange={(e) => setHireDate(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Checkbox id="isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                <Label htmlFor="isActive" className="text-sm font-medium leading-none">Active Staff Member</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Member
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={(v) => { if (!v) { setIsEditOpen(false); resetForm(); } }}>
        <DialogContent>
          <form onSubmit={handleEdit}>
            <DialogHeader>
              <DialogTitle>Edit Staff Profile</DialogTitle>
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
                <Label htmlFor="edit-position">Position</Label>
                <Input id="edit-position" value={position} onChange={(e) => setPosition(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-salary">Salary (IDR)</Label>
                  <Input id="edit-salary" type="number" value={salary} onChange={(e) => setSalary(parseInt(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-hireDate">Hire Date</Label>
                  <Input id="edit-hireDate" type="date" value={hireDate} onChange={(e) => setHireDate(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input id="edit-address" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Checkbox id="edit-isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                <Label htmlFor="edit-isActive" className="text-sm font-medium leading-none">Status: Active</Label>
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
            <DialogTitle className="text-destructive">Terminate Employee Account</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-sm text-foreground">
            Are you sure you want to terminate <strong>{selectedStaff?.user?.name}</strong>?
            This will remove their profile and login access. Their historical work (washes completed) will be preserved but unlinked from this active profile.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Termination
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
