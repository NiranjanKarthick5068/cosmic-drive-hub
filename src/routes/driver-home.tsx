import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/dl/AppShell";
import { fadeUp, stagger } from "@/components/dl/PageTransition";
import { RippleButton } from "@/components/dl/RippleButton";
import { CountUp } from "@/components/dl/CountUp";
import { TrustGauge } from "@/components/dl/TrustGauge";
import { Power, Zap, TrendingUp, IndianRupee, Clock } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { upsertDriverLocation } from "@/lib/rides.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/driver-home")({ component: DriverHome });

const bars = [40, 65, 30, 80, 55, 90, 72];
const days = ["M", "T", "W", "T", "F", "S", "S"];

function DriverHome() {
  const nav = useNavigate();
  const [online, setOnline] = useState(false);
  const upsert = useServerFn(upsertDriverLocation);
  const watchRef = useRef<number | null>(null);

  useEffect(() => {
    if (!online) {
      if (watchRef.current != null && "geolocation" in navigator) {
        navigator.geolocation.clearWatch(watchRef.current);
        watchRef.current = null;
      }
      return;
    }
    if (!("geolocation" in navigator)) {
      toast.error("Geolocation unavailable");
      return;
    }
    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        upsert({
          data: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            heading: pos.coords.heading ?? null,
            online: true,
          },
        }).catch(() => {});
      },
      (err) => {
        toast.error(err.message);
        setOnline(false);
      },
      { enableHighAccuracy: true, maximumAge: 5000 },
    );
    return () => {
      if (watchRef.current != null)
        navigator.geolocation.clearWatch(watchRef.current);
    };
  }, [online, upsert]);

  return (
    <AppShell hideNav>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="px-5 pt-2 pb-8 space-y-5"
      >
        <motion.div variants={fadeUp} className="flex items-center justify-between">
          <div>
            <p className="text-text-secondary text-sm">Driver mode</p>
            <h1 className="font-display font-bold text-2xl">Hey, driver</h1>
          </div>
          <button onClick={() => nav({ to: "/home" })} className="text-xs text-violet-light font-semibold">
            Switch
          </button>
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-col items-center py-2">
          <button
            onClick={() => setOnline(!online)}
            className={`relative w-[280px] h-[72px] rounded-full p-1 transition-all duration-300 ${
              online ? "bg-lime shadow-[var(--shadow-glow-lime)]" : "bg-surface ring-1 ring-border"
            }`}
          >
            <motion.div
              animate={{ x: online ? 208 : 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                online ? "bg-base text-lime" : "bg-surface-high text-text-secondary"
              }`}
            >
              <Power className="w-6 h-6" strokeWidth={2.5} />
            </motion.div>
            <span
              className={`absolute top-1/2 -translate-y-1/2 font-display font-bold text-base ${
                online ? "left-6 text-base" : "right-6 text-text-secondary"
              }`}
            >
              {online ? "ONLINE" : "OFFLINE"}
            </span>
          </button>
          <p className="text-xs text-text-secondary mt-3">
            {online
              ? "Broadcasting your live location to nearby riders"
              : "Tap to start receiving ride requests"}
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-lime/15 to-transparent ring-1 ring-lime/30">
            <Zap className="w-4 h-4 text-lime mb-2" />
            <p className="text-xs text-text-secondary">Today</p>
            <p className="font-display font-bold text-2xl tabular-nums">
              ₹<CountUp to={1840} />
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-surface ring-1 ring-border">
            <TrendingUp className="w-4 h-4 text-violet-light mb-2" />
            <p className="text-xs text-text-secondary">This week</p>
            <p className="font-display font-bold text-2xl tabular-nums">
              ₹<CountUp to={11420} />
            </p>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="p-5 rounded-3xl bg-surface ring-1 ring-border flex items-center gap-5">
          <TrustGauge score={94} size={120} />
          <div>
            <p className="text-xs uppercase tracking-wider text-text-secondary">Your trust score</p>
            <p className="font-display font-bold text-xl mt-1">Excellent</p>
            <p className="text-xs text-text-secondary mt-1">Top 4% of drivers in Delhi</p>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="p-4 rounded-2xl bg-surface ring-1 ring-border">
          <div className="flex items-center justify-between mb-3">
            <p className="font-display font-bold">This week</p>
            <span className="text-xs text-lime font-semibold">+12%</span>
          </div>
          <div className="flex items-end gap-2 h-32">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.2 + i * 0.06, duration: 0.6, ease: "easeOut" }}
                  className={`w-full rounded-t-lg ${i === 5 ? "bg-lime" : "bg-violet/70"}`}
                />
                <span className="text-[10px] text-text-secondary">{days[i]}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
          {[
            { Icon: IndianRupee, label: "Avg/trip", v: "₹385" },
            { Icon: Clock, label: "Online hrs", v: "5.2" },
            { Icon: TrendingUp, label: "Trips", v: "12" },
          ].map((s) => (
            <div key={s.label} className="p-3 rounded-2xl bg-surface ring-1 ring-border text-center">
              <s.Icon className="w-4 h-4 mx-auto text-violet-light mb-1.5" />
              <p className="font-display font-bold text-sm">{s.v}</p>
              <p className="text-[10px] text-text-secondary">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {online && (
          <RippleButton variant="lime" size="lg" block onClick={() => nav({ to: "/incoming-ride" })}>
            Demo: incoming ride
          </RippleButton>
        )}
      </motion.div>
    </AppShell>
  );
}
