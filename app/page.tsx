import Image from "next/image";
import Link from "next/link";
import { Droplets, Shield, Clock, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/car-wash.jpg"
          alt="Kinclong Car Wash"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 sm:px-12 py-5">
        <div className="flex items-center gap-2">
          <Droplets className="w-7 h-7 text-emerald-400" />
          <span className="text-xl font-bold tracking-tight">Kinclong</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/login"
            className="px-5 py-2 text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 rounded-lg transition-all shadow-[0_4px_20px_rgba(46,213,115,0.3)] hover:shadow-[0_4px_24px_rgba(46,213,115,0.5)] active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 sm:px-12 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-xs font-medium text-emerald-300 mb-4">
            <Star className="w-3.5 h-3.5" />
            Trusted by 500+ car owners
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
            Your car deserves
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              the best care
            </span>
          </h1>

          <p className="text-base sm:text-lg text-white/70 max-w-lg mx-auto leading-relaxed">
            Premium car wash management platform. Track washes, manage contracts,
            and keep your fleet spotless — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 rounded-xl transition-all shadow-[0_4px_24px_rgba(46,213,115,0.35)] hover:shadow-[0_6px_32px_rgba(46,213,115,0.5)] active:scale-[0.97]"
            >
              Start Managing →
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-medium bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 rounded-xl transition-all"
            >
              Book a Wash
            </Link>
          </div>
        </div>
      </main>

      {/* Feature Cards */}
      <section className="relative z-10 px-6 sm:px-12 pb-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Droplets,
              title: "Premium Wash",
              desc: "Exterior & interior cleaning with quality products",
            },
            {
              icon: Shield,
              title: "Trusted Service",
              desc: "Photo evidence for every wash with real-time tracking",
            },
            {
              icon: Clock,
              title: "Smart Scheduling",
              desc: "Flexible monthly packages that fit your lifestyle",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="group flex items-start gap-3 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all"
            >
              <div className="p-2 bg-emerald-500/20 rounded-lg shrink-0">
                <f.icon className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">{f.title}</h3>
                <p className="text-xs text-white/50 mt-0.5 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
