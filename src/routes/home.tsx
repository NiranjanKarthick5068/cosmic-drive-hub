import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppShell } from "@/components/dl/AppShell";
import { fadeUp, stagger } from "@/components/dl/PageTransition";
import { RippleButton } from "@/components/dl/RippleButton";
import { CountUp } from "@/components/dl/CountUp";
import { mockDrivers, mockRides } from "@/lib/mock";
import {
  Sparkles,
  TrendingUp,
  Wallet,
  Star,
  ArrowRight,
  Zap,
  Crown,
  MapPin,
} from "lucide-react";

export const Route = createFileRoute("/home")({ component: Home });

function Home() {
  const nav = useNavigate();
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <AppShell>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="px-5 pt-2 pb-8 space-y-6"
      >
        {/* greeting */}
        <motion.div variants={fadeUp} className="flex items-center justify-between">
          <div>
            <p className="text-text-secondary text-sm">{greet},</p>
            <h1 className="font-display font-bold text-2xl">Arjun</h1>
          </div>
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet to-violet-light flex items-center justify-center font-display font-bold ring-2 ring-violet/40">
            A
          </div>
        </motion.div>

        {/* big book CTA */}
        <motion.div variants={fadeUp}>
          <button
            onClick={() => nav({ to: "/book" })}
            className="ripple-host relative w-full p-5 rounded-3xl bg-gradient-to-br from-violet via-violet to-violet-light text-white text-left overflow-hidden shadow-[var(--shadow-glow-violet)] active:scale-[0.99] transition"
          >
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-80">
                <Zap className="w-3.5 h-3.5" /> Quick book
              </div>
              <p className="font-display font-bold text-2xl mt-1 leading-tight">
                Find a driver <br />
                in under 5 min
              </p>
              <div className="flex items-center gap-2 mt-4 text-sm font-semibold">
                Book now <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </button>
        </motion.div>

        {/* stats row */}
        <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
          {[
            { Icon: TrendingUp, label: "Rides", value: 24, color: "text-violet-light" },
            { Icon: Wallet, label: "Saved ₹", value: 1240, color: "text-lime" },
            { Icon: Star, label: "Rating", value: 4.9, color: "text-warning" },
          ].map((s) => (
            <div
              key={s.label}
              className="p-3 rounded-2xl bg-surface ring-1 ring-border"
            >
              <s.Icon className={`w-4 h-4 mb-2 ${s.color}`} />
              <p className="font-display font-bold text-lg tabular-nums">
                {typeof s.value === "number" && Number.isInteger(s.value) ? (
                  <CountUp to={s.value} />
                ) : (
                  s.value
                )}
              </p>
              <p className="text-[11px] text-text-secondary">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* AI tip */}
        <motion.div variants={fadeUp}>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-lime/10 to-transparent ring-1 ring-lime/30">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-lime" />
              <span className="text-xs uppercase tracking-wider text-lime font-semibold">
                AI tip · today
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Traffic to airport is{" "}
              <span className="text-lime font-semibold">28% lighter</span> if you leave
              before 7:30 AM. Want me to book Rahul?
            </p>
          </div>
        </motion.div>

        {/* subscription card */}
        <motion.div variants={fadeUp}>
          <button
            onClick={() => nav({ to: "/subscription" })}
            className="w-full p-4 rounded-2xl bg-surface ring-1 ring-border flex items-center gap-3 text-left active:scale-[0.99] transition"
          >
            <div className="w-11 h-11 rounded-xl bg-warning/15 text-warning flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Lock your driver</p>
              <p className="text-xs text-text-secondary">
                Same driver every ride · from ₹99/day
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-text-secondary" />
          </button>
        </motion.div>

        {/* recent drivers carousel */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold">Recent drivers</h3>
            <button className="text-xs text-violet-light">See all</button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-5 px-5 pb-2">
            {mockDrivers.map((d) => (
              <div
                key={d.id}
                className="shrink-0 w-36 p-3 rounded-2xl bg-surface ring-1 ring-border"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet to-violet-light flex items-center justify-center font-display font-bold text-lg mb-2">
                  {d.photo}
                </div>
                <p className="font-semibold text-sm truncate">{d.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 text-warning fill-warning" />
                  <span className="text-xs font-mono">{d.rating}</span>
                  <span className="text-xs text-text-secondary">· {d.trips}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* recent rides */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold">Last rides</h3>
            <button
              onClick={() => nav({ to: "/bookings" })}
              className="text-xs text-violet-light"
            >
              See all
            </button>
          </div>
          <div className="space-y-2">
            {mockRides.slice(0, 2).map((r) => (
              <div
                key={r.id}
                className="p-3 rounded-2xl bg-surface ring-1 ring-border flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-violet/15 text-violet-light flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {r.from} → {r.to}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {r.date} · {r.driver}
                  </p>
                </div>
                <span className="font-mono text-sm font-semibold">₹{r.fare}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <RippleButton
          variant="ghost"
          block
          size="md"
          onClick={() => nav({ to: "/role" })}
        >
          Switch to driver mode
        </RippleButton>
      </motion.div>
    </AppShell>
  );
}
