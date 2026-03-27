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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Edit, Trash, Car as CarIcon, User, Plus, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { toSentenceCase } from "@/lib/utils";

export function CarsClientPage({ cars, customers }: { cars: any[]; customers: any[] }) {
  const router = useRouter();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [zoomImage, setZoomImage] = useState("");

  // Form states
  const [plateNumber, setPlateNumber] = useState("");
  const [carType, setCarType] = useState<"small" | "big">("small");
  const [customerId, setCustomerId] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const resetForm = () => {
    setPlateNumber("");
    setCarType("small");
    setCustomerId("");
    setBrand("");
    setModel("");
    setColor("");
    setImageUrl("");
    setNotes("");
    setPendingFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    setSelectedCar(null);
  };

  const openEdit = (car: any) => {
    setSelectedCar(car);
    setPlateNumber(car.plateNumber);
    setCarType(car.type);
    setCustomerId(car.customerId.toString());
    setBrand(car.brand || "");
    setModel(car.model || "");
    setColor(car.color || "");
    setImageUrl(car.imageUrl || "");
    setNotes(car.notes || "");
    setPendingFile(null);
    setPreviewUrl("");
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
          brand: brand || undefined,
          model: model || undefined,
          color: color || undefined,
          imageUrl: imageUrl || undefined,
          notes: notes || undefined,
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
      // Upload pending image first if user selected a new one
      let finalImageUrl = imageUrl;
      if (pendingFile) {
        const formData = new FormData();
        formData.append("file", pendingFile);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadJson = await uploadRes.json();
        if (!uploadJson.success) throw new Error(uploadJson.error);
        finalImageUrl = uploadJson.data.url;
      }

      const res = await fetch(`/api/cars/${selectedCar.id}`, {
        method: "PUT",
        body: JSON.stringify({
          plateNumber,
          type: carType,
          brand: brand || undefined,
          model: model || undefined,
          color: color || undefined,
          imageUrl: finalImageUrl || undefined,
          notes: notes || undefined,
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
                {/*--Thumbnail of Car image */}
                <TableHead className="font-semibold text-foreground">Image</TableHead>
                <TableHead className="font-semibold text-foreground">Plate Number</TableHead>
                <TableHead className="font-semibold text-foreground">Vehicle Type</TableHead>
                <TableHead className="font-semibold text-foreground">Owner</TableHead>
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
                      <img
                        src={car.imageUrl || "/images/noimage.jpg"}
                        alt="Car"
                        className="h-10 w-10 rounded-md object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setZoomImage(car.imageUrl || "/images/noimage.jpg")}
                      />
                    </TableCell>
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
      <Dialog open={isAddOpen} onOpenChange={(v) => { if (!v) { setIsAddOpen(false); resetForm(); } }}>
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
                    <option key={c.id} value={c.id}>{toSentenceCase(c.user?.name)}</option>
                  ))}
                </select>
              </div>

              <div className="border-t border-border pt-4 space-y-4">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Vehicle Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Toyota" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input id="model" value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. Yaris" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input id="color" value={color} onChange={(e) => setColor(e.target.value)} placeholder="e.g. Silver" />
                </div>
                <div className="space-y-2">
                  <Label>Car Image</Label>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 px-3 py-2 text-sm border border-input rounded-md cursor-pointer hover:bg-accent transition-colors">
                      <Upload className="w-4 h-4" />
                      {isUploading ? "Uploading..." : "Choose File"}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        disabled={isUploading}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setIsUploading(true);
                          try {
                            const formData = new FormData();
                            formData.append("file", file);
                            const res = await fetch("/api/upload", { method: "POST", body: formData });
                            const json = await res.json();
                            if (!json.success) throw new Error(json.error);
                            setImageUrl(json.data.url);
                            toast.success("Image uploaded");
                          } catch (err: any) {
                            toast.error(err.message || "Upload failed");
                          } finally {
                            setIsUploading(false);
                          }
                        }}
                      />
                    </label>
                    {imageUrl && (
                      <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => setImageUrl("")}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  {imageUrl && (
                    <img src={imageUrl} alt="Car preview" className="mt-1 h-20 w-auto rounded border border-border object-contain" />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Year, condition, scratches, etc." rows={2} />
                </div>
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

              <div className="border-t border-border pt-4 space-y-4">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Vehicle Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="edit-brand">Brand</Label>
                    <Input id="edit-brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Toyota" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-model">Model</Label>
                    <Input id="edit-model" value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. Yaris" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-color">Color</Label>
                  <Input id="edit-color" value={color} onChange={(e) => setColor(e.target.value)} placeholder="e.g. Silver" />
                </div>
                <div className="space-y-2">
                  <Label>Car Image</Label>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 px-3 py-2 text-sm border border-input rounded-md cursor-pointer hover:bg-accent transition-colors">
                      <Upload className="w-4 h-4" />
                      Choose File
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setPendingFile(file);
                          if (previewUrl) URL.revokeObjectURL(previewUrl);
                          setPreviewUrl(URL.createObjectURL(file));
                        }}
                      />
                    </label>
                    {(previewUrl || imageUrl) && (
                      <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => {
                        setPendingFile(null);
                        if (previewUrl) URL.revokeObjectURL(previewUrl);
                        setPreviewUrl("");
                        setImageUrl("");
                      }}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  {(previewUrl || imageUrl) && (
                    <div className="mt-1">
                      <img src={previewUrl || imageUrl} alt="Car preview" className="h-20 w-auto rounded border border-border object-contain" />
                      {pendingFile && <p className="text-xs text-amber-600 mt-1">New image — will be saved on Update.</p>}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-notes">Notes</Label>
                  <Textarea id="edit-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Year, condition, scratches, etc." rows={2} />
                </div>
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

      {/* IMAGE ZOOM OVERLAY */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-pointer"
          onClick={() => setZoomImage("")}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <Button
              variant="ghost"
              size="sm"
              className="absolute -top-10 right-0 text-white hover:text-white/80 hover:bg-white/10"
              onClick={() => setZoomImage("")}
            >
              <X className="w-5 h-5" />
            </Button>
            <img
              src={zoomImage}
              alt="Car zoom"
              className="max-w-full max-h-[85vh] rounded-lg object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}
