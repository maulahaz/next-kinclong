import Image from "next/image";
import Link from "next/link";
import { Droplets, Shield, Clock, Star, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-foreground text-background">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/car-wash.jpg"
          alt="Kinclong Car Wash"
          fill
          className="object-cover opacity-45"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/70 to-foreground" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-12">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Droplets className="size-4.5" />
          </span>
          <span className="text-lg font-bold tracking-tight">Kinclong</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-background/80 transition-colors hover:text-background"
          >
            Sign In
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:bg-primary/90 active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:px-12">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-background/15 bg-background/5 px-3 py-1 text-xs font-medium text-background/80 backdrop-blur-sm">
            <Star className="size-3.5 fill-current text-primary" />
            Trusted by 500+ car owners
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Your car deserves
            <span className="block text-primary">the best care</span>
          </h1>

          <p className="mx-auto max-w-lg text-base leading-relaxed text-background/70 sm:text-lg">
            Premium car wash management platform. Track washes, manage
            contracts, and keep your fleet spotless — all in one place.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:bg-primary/90 active:scale-[0.97] sm:w-auto"
            >
              Start Managing
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-full border border-background/15 bg-background/5 px-8 py-3.5 text-sm font-medium backdrop-blur-sm transition-all hover:bg-background/10 sm:w-auto"
            >
              Book a Wash
            </Link>
          </div>
        </div>
      </main>

      {/* Feature Cards */}
      <section className="relative z-10 px-6 pb-14 sm:px-12">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              icon: Droplets,
              title: "Premium Wash",
              desc: "Exterior and interior cleaning with quality products.",
            },
            {
              icon: Shield,
              title: "Trusted Service",
              desc: "Photo evidence for every wash with real-time tracking.",
            },
            {
              icon: Clock,
              title: "Smart Scheduling",
              desc: "Flexible monthly packages that fit your lifestyle.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="group flex items-start gap-3.5 rounded-2xl border border-background/10 bg-background/5 p-5 backdrop-blur-sm transition-all hover:bg-background/10"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                <f.icon className="size-4.5" />
              </span>
              <div>
                <h3 className="text-sm font-semibold">{f.title}</h3>
                <p className="mt-0.5 text-xs leading-relaxed text-background/60">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
