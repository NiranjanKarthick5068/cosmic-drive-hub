import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneFrame, StatusBar } from "@/components/dl/PhoneFrame";
import { RippleButton } from "@/components/dl/RippleButton";
import { mockDrivers } from "@/lib/mock";
import { Phone, ShieldAlert, AlertTriangle, X, Navigation } from "lucide-react";

export const Route = createFileRoute("/tracking")({ component: Tracking });

function Tracking() {
  const nav = useNavigate();
  const d = mockDrivers[0];
  const [eta, setEta] = useState(d.etaMin * 60);
  const [anomaly, setAnomaly] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const i = setInterval(() => {
      setEta((e) => Math.max(0, e - 5));
      setProgress((p) => Math.min(1, p + 0.04));
    }, 800);
    const a = setTimeout(() => setAnomaly(true), 5500);
    return () => {
      clearInterval(i);
      clearTimeout(a);
    };
  }, []);

  useEffect(() => {
    if (eta === 0) {
      const t = setTimeout(() => nav({ to: "/ride-complete" }), 1000);
      return () => clearTimeout(t);
    }
  }, [eta, nav]);

  const mm = Math.floor(eta / 60);
  const ss = (eta % 60).toString().padStart(2, "0");

  return (
    <PhoneFrame>
      <StatusBar />
      <div className="relative flex-1 flex flex-col overflow-hidden">
        {/* faux map */}
        <div className="absolute inset-0">
          <svg width="100%" height="100%" className="opacity-40">
            <defs>
              <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="oklch(0.22 0.04 282)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid2)" />
          </svg>
          {/* route polyline */}
          <svg className="absolute inset-0" viewBox="0 0 400 700" preserveAspectRatio="none">
            <motion.path
              d="M60 600 Q 150 500 200 400 T 340 100"
              stroke="oklch(0.65 0.25 295)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="6 8"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            />
            <circle cx="60" cy="600" r="8" fill="oklch(0.86 0.21 130)" />
            <circle cx="340" cy="100" r="8" fill="oklch(0.65 0.25 295)" />
          </svg>
          {/* moving car dot */}
          <motion.div
            className="absolute w-6 h-6 rounded-full bg-violet ring-4 ring-violet/40 shadow-[var(--shadow-glow-violet)]"
            animate={{
              left: `${15 + progress * 70}%`,
              top: `${85 - progress * 70}%`,
            }}
            transition={{ duration: 0.8, ease: "linear" }}
          >
            <div className="absolute inset-0 rounded-full bg-violet animate-ping opacity-40" />
          </motion.div>
        </div>

        {/* SOS */}
        <button className="absolute top-16 right-5 z-30 w-12 h-12 rounded-full bg-danger text-white shadow-[var(--shadow-glow-danger)] flex items-center justify-center ring-2 ring-danger/40">
          <ShieldAlert className="w-5 h-5" />
        </button>

        {/* anomaly banner */}
        <AnimatePresence>
          {anomaly && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100 }}
              className="absolute top-16 left-5 right-20 z-30 p-3 rounded-2xl bg-danger/20 ring-1 ring-danger/50 backdrop-blur-md flex items-center gap-2"
            >
              <AlertTriangle className="w-5 h-5 text-danger shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-bold text-danger">Route deviation</p>
                <p className="text-[11px] text-text-primary">800m off optimal · 2m ago</p>
              </div>
              <button onClick={() => setAnomaly(false)}>
                <X className="w-4 h-4 text-danger" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* bottom sheet */}
        <motion.div
          initial={{ y: 200 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 28, delay: 0.2 }}
          className="relative mt-auto glass rounded-t-[2rem] p-5 pb-8"
        >
          <div className="w-12 h-1.5 rounded-full bg-border mx-auto mb-4" />
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet to-violet-light flex items-center justify-center font-display font-bold text-lg ring-2 ring-violet/40">
              {d.photo}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold">{d.name}</p>
              <p className="text-xs text-text-secondary font-mono">
                {d.vehicle} · {d.plate}
              </p>
            </div>
            <button className="w-11 h-11 rounded-full bg-lime text-base flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-surface ring-1 ring-border">
              <p className="text-[10px] uppercase tracking-wider text-text-secondary">
                Arriving in
              </p>
              <p className="font-display font-bold text-2xl tabular-nums mt-1">
                {mm}:{ss}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-surface ring-1 ring-border">
              <p className="text-[10px] uppercase tracking-wider text-text-secondary">
                Status
              </p>
              <p className="font-display font-bold text-base mt-1 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-violet-light" />
                On the way
              </p>
            </div>
          </div>

          <RippleButton variant="outline" size="md" block className="mt-4">
            Cancel ride · ₹50 fee
          </RippleButton>
        </motion.div>
      </div>
    </PhoneFrame>
  );
}
