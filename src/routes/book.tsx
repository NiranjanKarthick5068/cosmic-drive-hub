import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AppShell } from "@/components/dl/AppShell";
import { fadeUp, stagger } from "@/components/dl/PageTransition";
import { RippleButton } from "@/components/dl/RippleButton";
import { CountUp } from "@/components/dl/CountUp";
import { Navigation, Calendar, Sparkles, Car } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { predictFare } from "@/lib/fare.functions";
import { createRide } from "@/lib/rides.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/book")({ component: Book });

const cars = ["Hatchback", "Sedan", "SUV"] as const;
type CarType = (typeof cars)[number];

function Book() {
  const nav = useNavigate();
  const [pickup, setPickup] = useState("Connaught Place, New Delhi");
  const [drop, setDrop] = useState("");
  const [car, setCar] = useState<CarType>("Sedan");
  const [when, setWhen] = useState<"now" | "later">("now");

  const predict = useServerFn(predictFare);
  const create = useServerFn(createRide);

  const fareM = useMutation({
    mutationFn: (input: { pickup: string; drop: string; carType: CarType; when: "now" | "later" }) =>
      predict({ data: input }),
    onSuccess: (res) => {
      if (!res.ok) toast.error(res.error);
    },
    onError: () => toast.error("Network error, try again"),
  });

  const bookM = useMutation({
    mutationFn: async () => {
      if (!fareM.data?.ok) throw new Error("No fare");
      await create({
        data: {
          pickup, drop, carType: car,
          fareEstimate: fareM.data.fare.total,
          reasoning: fareM.data.fare.reasoning,
        },
      });
    },
    onSuccess: () => nav({ to: "/searching" }),
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Could not book — please sign in"),
  });

  const fare = fareM.data?.ok ? fareM.data.fare : null;

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

        <motion.div variants={fadeUp}>
          <p className="text-xs uppercase tracking-wider text-text-secondary mb-2">Car type</p>
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

        <motion.div variants={fadeUp}>
          <p className="text-xs uppercase tracking-wider text-text-secondary mb-2">When</p>
          <div className="flex gap-2">
            {[
              { id: "now" as const, label: "Now", icon: Navigation },
              { id: "later" as const, label: "Schedule", icon: Calendar },
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

        <motion.div variants={fadeUp}>
          <RippleButton
            size="lg"
            block
            variant="primary"
            onClick={() => fareM.mutate({ pickup, drop, carType: car, when })}
            disabled={!drop || fareM.isPending}
          >
            <Sparkles className="w-4 h-4" />
            {fareM.isPending ? "AI thinking…" : "Predict fare with AI"}
          </RippleButton>
        </motion.div>

        <AnimatePresence>
          {fareM.isPending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-5 rounded-3xl bg-surface/60 ring-1 ring-border space-y-3 animate-pulse"
            >
              <div className="h-3 w-24 bg-border rounded" />
              <div className="h-12 w-40 bg-border rounded" />
              <div className="h-3 w-full bg-border rounded" />
              <div className="h-3 w-3/4 bg-border rounded" />
            </motion.div>
          )}

          {fare && !fareM.isPending && (
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
                  AI · {Math.round(fare.confidence)}% conf
                </span>
              </div>
              <p className="font-display font-bold text-5xl my-2 tabular-nums">
                ₹<CountUp to={fare.total} />
              </p>
              <div className="space-y-1.5 mt-4 text-sm">
                {[
                  ["Base fare", fare.base],
                  [`Distance · ${fare.distanceKm.toFixed(1)} km`, fare.distanceCost],
                  ["Time of day surge", fare.surge],
                ].map(([k, v]) => (
                  <div key={k as string} className="flex justify-between text-text-secondary">
                    <span>{k}</span>
                    <span className="font-mono">₹{v}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-text-secondary italic">{fare.reasoning}</p>
              <RippleButton
                variant="lime"
                size="lg"
                block
                className="mt-5"
                onClick={() => bookM.mutate()}
                disabled={bookM.isPending}
              >
                <Car className="w-4 h-4" />
                {bookM.isPending ? "Booking…" : "Find driver"}
              </RippleButton>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AppShell>
  );
}
