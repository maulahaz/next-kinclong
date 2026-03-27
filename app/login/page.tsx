"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginWithIdentifier, registerUser } from "@/services/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LogIn, UserPlus, KeyRound } from "lucide-react";

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
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const seedLogins = [
    { id: "admin@kinclong.com", label: "Admin" },
    { id: "08111111112", label: "Staff (Phone)" },
    { id: "08111111114", label: "Customer (Phone)" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-secondary/30">
      <Card className="w-full max-w-sm shadow-xl border-primary/20 bg-background overflow-hidden">
        <CardHeader className="text-center space-y-2 bg-primary/5 pb-8">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            {isLogin ? <LogIn className="w-6 h-6 text-primary" /> : <UserPlus className="w-6 h-6 text-primary" />}
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            {isLogin ? "Welcome back" : "Create Account"}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {isLogin ? "Sign in to manage your car wash" : "Join Kinclong to book your first wash"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className="border-primary/20 focus-visible:ring-primary"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="identifier">Email or Phone Number</Label>
              <Input
                id="identifier"
                placeholder="email@example.com or 08xxxx"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="border-primary/20 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{isLogin ? "" : "Create "}Password</Label>
              {isLogin && (
                <div className="flex items-center justify-end -mt-6 mb-1">
                  <button
                    type="button"
                    onClick={() => toast.info("Check your email or contact support to reset.")}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-primary/20 focus-visible:ring-primary"
              />
            </div>



            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 shadow-[0_0_8px_rgba(46,213,115,0.4)] transition-all active:scale-95 text-white font-semibold">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                isLogin ? <><LogIn className="mr-2 h-4 w-4" /> Sign In</> : <><UserPlus className="mr-2 h-4 w-4" /> Register</>
              )}
            </Button>
          </form>

          <div className="mt-6 flex flex-col gap-4">
            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                {isLogin ? "New to Kinclong?" : "Already have an account?"}
              </span>{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline font-semibold"
              >
                {isLogin ? "Create an account" : "Sign In"}
              </button>
            </div>

            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground font-medium">Quick Access</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 mt-2">
              {seedLogins.map((s) => (
                <Button
                  key={s.id}
                  variant="outline"
                  className="border-primary/30 text-foreground hover:bg-primary/5 text-xs py-1 h-8 justify-between px-3"
                  onClick={() => {
                    setIdentifier(s.id);
                    setPassword("pass-123");
                    setIsLogin(true);
                    setTimeout(() => document.querySelector("form")?.requestSubmit(), 100);
                  }}
                >
                  <span className="font-medium">{s.label}</span>
                  <span className="text-muted-foreground bg-primary/10 px-1.5 py-0.5 rounded text-[10px]">{s.id}</span>
                </Button>
              ))}
            </div> */}

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
