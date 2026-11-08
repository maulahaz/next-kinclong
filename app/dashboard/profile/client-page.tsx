"use client";

import { useState } from "react";
import { updatePassword } from "@/services/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { toast } from "sonner";
import { KeyRound, ShieldCheck } from "lucide-react";

export function ProfileClientPage({ user }: { user: any }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (password.length < 4) {
      return toast.error("Password must be at least 4 characters");
    }

    setLoading(true);
    try {
      await updatePassword(currentPassword, password);
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="User Profile"
        description="Manage your account settings and security."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <Card className="md:col-span-1 self-start">
          <CardContent className="flex items-center gap-4 pb-2">
            <Avatar name={user.name} className="size-14 text-lg" />
            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email || user.phone}</p>
            </div>
          </CardContent>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label className="text-[0.7rem] uppercase tracking-wider text-muted-foreground font-semibold">Full Name</Label>
              <p className="text-sm font-medium">{user.name}</p>
            </div>
            {user.email && (
              <div className="space-y-1">
                <Label className="text-[0.7rem] uppercase tracking-wider text-muted-foreground font-semibold">Email</Label>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
            )}
            {user.phone && (
              <div className="space-y-1">
                <Label className="text-[0.7rem] uppercase tracking-wider text-muted-foreground font-semibold">Phone</Label>
                <p className="text-sm font-medium">{user.phone}</p>
              </div>
            )}
            <div className="space-y-1.5">
              <Label className="text-[0.7rem] uppercase tracking-wider text-muted-foreground font-semibold">Account Role</Label>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                <StatusBadge variant="default" className="capitalize">{user.role}</StatusBadge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Security</CardTitle>
            <CardDescription>Change your account password here.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Verify current password"
                    className="pl-10"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                   <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm password"
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="pt-2">
                <Button type="submit" disabled={loading}>
                  {loading && <span className="size-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />}
                  Update Password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
