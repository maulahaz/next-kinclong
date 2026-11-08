"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginWithIdentifier, registerUser } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LogIn, UserRoundPlus, Droplets, ShieldCheck, Truck, Star } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;

    setLoading(true);
    try {
      if (isLogin) {
        const res = (await loginWithIdentifier(identifier, password)) as any;
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Login successful!");
          router.push("/dashboard");
        }
      } else {
        if (!name) {
          toast.error("Please enter your name");
          setLoading(false);
          return;
        }
        const res = (await registerUser({ name, id: identifier, password: password || "pass-123" })) as any;
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Account created successfully!");
          router.push("/dashboard");
        }
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-6 lg:p-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-panel lg:grid lg:grid-cols-2">
        {/* ── Left: brand panel ─────────────────────────────────────────── */}
        <div className="relative hidden overflow-hidden bg-foreground p-10 text-background lg:flex lg:flex-col lg:justify-between">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(48rem 24rem at 80% -10%, rgba(226, 92, 28, 0.55), transparent 60%), radial-gradient(36rem 20rem at -10% 110%, rgba(226, 92, 28, 0.35), transparent 60%)",
            }}
          />
          <div className="relative flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow">
              <Droplets className="size-5" />
            </span>
            <span className="text-lg font-bold tracking-tight">Kinclong</span>
          </div>

          <div className="relative space-y-4">
            <div className="flex items-center gap-1 text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </div>
            <h2 className="text-3xl font-bold leading-tight tracking-tight">
              Your car deserves
              <span className="block text-primary">the best care.</span>
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-background/70">
              Manage monthly wash packages, track every wash with photo
              evidence, and keep your fleet spotless — all in one place.
            </p>
          </div>

          <ul className="relative space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <ShieldCheck className="size-4 shrink-0 text-primary" />
              Photo evidence for every completed wash
            </li>
            <li className="flex items-center gap-3">
              <Truck className="size-4 shrink-0 text-primary" />
              Flexible packages for every vehicle type
            </li>
            <li className="flex items-center gap-3">
              <Droplets className="size-4 shrink-0 text-primary" />
              Real-time wash tracking and status
            </li>
          </ul>
        </div>

        {/* ── Right: form panel ─────────────────────────────────────────── */}
        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Droplets className="size-5" />
            </span>
            <span className="text-lg font-bold tracking-tight text-foreground">Kinclong</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {isLogin ? "Welcome back" : "Create account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLogin
              ? "Sign in to manage your car wash."
              : "Join Kinclong to book your first wash."}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="identifier">Email or Phone Number</Label>
              <Input
                id="identifier"
                placeholder="email@example.com or 08xxxx"
                autoComplete="username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{isLogin ? "" : "Create "}Password</Label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => toast.info("Check your email or contact support to reset.")}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete={isLogin ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? (
                <span className="size-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
              ) : isLogin ? (
                <LogIn />
              ) : (
                <UserRoundPlus />
              )}
              {isLogin ? "Sign In" : "Register"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {isLogin ? "New to Kinclong?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold text-primary hover:underline"
            >
              {isLogin ? "Create an account" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
