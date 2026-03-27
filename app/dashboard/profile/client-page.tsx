"use client";

import { useState } from "react";
import { updatePassword } from "@/services/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">User Profile</h2>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and security.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-primary/20 bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Account Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground font-semibold">FULL NAME</Label>
              <p className="font-medium">{user.name}</p>
            </div>
            {user.email && (
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground font-semibold">EMAIL</Label>
                <p className="font-medium">{user.email}</p>
              </div>
            )}
            {user.phone && (
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground font-semibold">PHONE</Label>
                <p className="font-medium">{user.phone}</p>
              </div>
            )}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground font-semibold">ACCOUNT ROLE</Label>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <p className="font-medium capitalize">{user.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-primary/20 bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Security</CardTitle>
            <CardDescription>Change your account password here.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="current-password" 
                    type="password" 
                    placeholder="Verify current password"
                    className="pl-10 border-primary/20 focus-visible:ring-primary"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="new-password" 
                    type="password" 
                    placeholder="Enter new password"
                    className="pl-10 border-primary/20 focus-visible:ring-primary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                   <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    placeholder="Confirm password"
                    className="pl-10 border-primary/20 focus-visible:ring-primary"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90 text-white shadow-[0_4px_10px_rgba(46,213,115,0.2)]"
                >
                  {loading && <span className="mr-2 w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
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
