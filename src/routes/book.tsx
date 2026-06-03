import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AppShell } from "@/components/dl/AppShell";
import { fadeUp, stagger } from "@/components/dl/PageTransition";
import { RippleButton } from "@/components/dl/RippleButton";
import { CountUp } from "@/components/dl/CountUp";
import { MapPin, Navigation, Calendar, Sparkles, Car } from "lucide-react";

export const Route = createFileRoute("/book")({ component: Book });

const cars = ["Hatchback", "Sedan", "SUV"];

function Book() {
  const nav = useNavigate();
  const [pickup, setPickup] = useState("Connaught Place, New Delhi");
  const [drop, setDrop] = useState("");
  const [car, setCar] = useState("Sedan");
  const [when, setWhen] = useState("now");
  const [fare, setFare] = useState<null | {
    base: number;
    distance: number;
    surge: number;
    total: number;
  }>(null);
  const [loading, setLoading] = useState(false);

  const predict = () => {
    setLoading(true);
    setTimeout(() => {
      setFare({ base: 80, distance: 320, surge: 45, total: 445 });
      setLoading(false);
    }, 900);
  };

  return (
    <AppShell>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="px-5 pt-2 pb-6 space-y-5"
      >
        <motion.h1 variants={fadeUp} className="font-display font-bold text-2xl">
          Book a <span className="text-gradient-violet">driver</span>
        </motion.h1>

        {/* Pickup + drop */}
        <motion.div variants={fadeUp} className="p-4 rounded-2xl bg-surface ring-1 ring-border space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center pt-1">
              <div className="w-2.5 h-2.5 rounded-full bg-violet ring-4 ring-violet/20" />
              <div className="w-px h-8 bg-border my-1" />
              <div className="w-2.5 h-2.5 rounded-sm bg-lime ring-4 ring-lime/20" />
            </div>
            <div className="flex-1 space-y-3">
              <input
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder="Pickup"
                className="w-full bg-transparent outline-none text-sm font-medium"
              />
              <div className="h-px bg-border" />
              <input
                value={drop}
                onChange={(e) => setDrop(e.target.value)}
                placeholder="Where to?"
                className="w-full bg-transparent outline-none text-sm font-medium placeholder:text-text-secondary"
              />
            </div>
          </div>
        </motion.div>

        {/* Car type */}
        <motion.div variants={fadeUp}>
          <p className="text-xs uppercase tracking-wider text-text-secondary mb-2">
            Car type
          </p>
          <div className="flex gap-2">
            {cars.map((c) => (
              <button
                key={c}
                onClick={() => setCar(c)}
                className={`flex-1 h-11 rounded-2xl text-sm font-semibold transition-all ${
                  c === car
                    ? "bg-violet text-white shadow-[var(--shadow-glow-violet)]"
                    : "bg-surface ring-1 ring-border text-text-secondary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </motion.div>

        {/* When */}
        <motion.div variants={fadeUp}>
          <p className="text-xs uppercase tracking-wider text-text-secondary mb-2">
            When
          </p>
          <div className="flex gap-2">
            {[
              { id: "now", label: "Now", icon: Navigation },
              { id: "later", label: "Schedule", icon: Calendar },
            ].map((o) => (
              <button
                key={o.id}
                onClick={() => setWhen(o.id)}
                className={`flex-1 h-11 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  o.id === when
                    ? "bg-lime text-base"
                    : "bg-surface ring-1 ring-border text-text-secondary"
                }`}
              >
                <o.icon className="w-4 h-4" /> {o.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Predict button */}
        <motion.div variants={fadeUp}>
          <RippleButton
            size="lg"
            block
            variant="primary"
            onClick={predict}
            disabled={!drop || loading}
          >
            <Sparkles className="w-4 h-4" />
            {loading ? "AI thinking…" : "Predict fare with AI"}
          </RippleButton>
        </motion.div>

        {/* Fare card */}
        <AnimatePresence>
          {fare && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="p-5 rounded-3xl bg-gradient-to-br from-surface to-base ring-1 ring-violet/40 shadow-[var(--shadow-glow-violet)]"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs uppercase tracking-wider text-text-secondary">
                  Estimated fare
                </span>
                <span className="px-2 py-0.5 rounded-md bg-lime/15 text-lime text-[10px] font-bold uppercase tracking-wider">
                  AI predicted · 94% conf
                </span>
              </div>
              <p className="font-display font-bold text-5xl my-2 tabular-nums">
                ₹<CountUp to={fare.total} />
              </p>
              <div className="space-y-1.5 mt-4 text-sm">
                {[
                  ["Base fare", fare.base],
                  ["Distance · 8.2 km", fare.distance],
                  ["Time of day surge", fare.surge],
                ].map(([k, v], idx) => (
                  <motion.div
                    key={k as string}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + idx * 0.08 }}
                    className="flex justify-between text-text-secondary"
                  >
                    <span>{k}</span>
                    <span className="font-mono">₹{v}</span>
                  </motion.div>
                ))}
              </div>
              <RippleButton
                variant="lime"
                size="lg"
                block
                className="mt-5"
                onClick={() => nav({ to: "/searching" })}
              >
                <Car className="w-4 h-4" /> Find driver
              </RippleButton>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AppShell>
  );
}
