import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PhoneFrame, StatusBar } from "@/components/dl/PhoneFrame";
import { RippleButton } from "@/components/dl/RippleButton";
import { MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/incoming-ride")({ component: Incoming });

function Incoming() {
  const nav = useNavigate();
  const [t, setT] = useState(15);
  useEffect(() => {
    if (t === 0) {
      nav({ to: "/driver-home" });
      return;
    }
    const x = setTimeout(() => setT(t - 1), 1000);
    return () => clearTimeout(x);
  }, [t, nav]);

  return (
    <PhoneFrame>
      <StatusBar />
      <div className="flex-1 flex flex-col px-5 pt-2 pb-6">
        <motion.div
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="mt-auto p-5 rounded-3xl bg-gradient-to-br from-violet/20 via-surface to-base ring-1 ring-violet/40 shadow-[var(--shadow-glow-violet)]"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="px-3 py-1 rounded-full bg-violet/20 text-violet-light text-[10px] font-bold uppercase tracking-wider">
              New ride request
            </span>
            <span className="font-mono text-sm flex items-center gap-1 text-warning">
              <Clock className="w-3.5 h-3.5" /> {t}s
            </span>
          </div>

          <p className="font-display font-bold text-4xl tabular-nums">₹445</p>
          <p className="text-text-secondary text-sm mb-4">8.2 km · ~24 min ride</p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface">
              <div className="w-2.5 h-2.5 rounded-full bg-violet" />
              <div className="flex-1">
                <p className="text-[10px] uppercase text-text-secondary tracking-wider">
                  Pickup · 1.2 km away
                </p>
                <p className="text-sm font-medium">Connaught Place</p>
              </div>
              <MapPin className="w-4 h-4 text-violet-light" />
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface">
              <div className="w-2.5 h-2.5 rounded-sm bg-lime" />
              <div className="flex-1">
                <p className="text-[10px] uppercase text-text-secondary tracking-wider">
                  Drop · 8.2 km
                </p>
                <p className="text-sm font-medium">IGI Airport Terminal 3</p>
              </div>
            </div>
          </div>

          {/* timer bar */}
          <div className="h-1.5 rounded-full bg-surface-high overflow-hidden mb-4">
            <motion.div
              animate={{ width: `${(t / 15) * 100}%` }}
              transition={{ duration: 0.9, ease: "linear" }}
              className={`h-full ${t < 5 ? "bg-danger" : "bg-lime"}`}
            />
          </div>

          <div className="flex gap-3">
            <RippleButton variant="danger" size="lg" block onClick={() => nav({ to: "/driver-home" })}>
              Decline
            </RippleButton>
            <RippleButton variant="lime" size="lg" block onClick={() => nav({ to: "/driver-home" })}>
              Accept
            </RippleButton>
          </div>
        </motion.div>
      </div>
    </PhoneFrame>
  );
}
