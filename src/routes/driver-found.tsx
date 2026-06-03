import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneFrame, StatusBar } from "@/components/dl/PhoneFrame";
import { RippleButton } from "@/components/dl/RippleButton";
import { TrustGauge } from "@/components/dl/TrustGauge";
import { mockDrivers } from "@/lib/mock";
import { Star, Clock, Car, ArrowLeft, RotateCw, Award, Activity } from "lucide-react";

export const Route = createFileRoute("/driver-found")({ component: DriverFound });

function DriverFound() {
  const nav = useNavigate();
  const d = mockDrivers[0];
  const [flipped, setFlipped] = useState(false);

  return (
    <PhoneFrame>
      <StatusBar />
      <div className="flex-1 flex flex-col px-5 pt-2 pb-6">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => nav({ to: "/searching" })}
            className="w-10 h-10 rounded-full bg-surface ring-1 ring-border flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="px-3 py-1.5 rounded-full bg-lime/15 ring-1 ring-lime/40 text-lime text-xs font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-lime pulse-dot" />
            Best match
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-2"
        >
          <p className="text-text-secondary text-sm">Your driver is</p>
          <h1 className="font-display font-bold text-2xl mt-1">{d.name}</h1>
        </motion.div>

        {/* Flip card */}
        <div
          className="relative w-full h-[340px] mt-6"
          style={{ perspective: 1200 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={flipped ? "back" : "front"}
              initial={{ rotateY: flipped ? -90 : 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: flipped ? 90 : -90, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
              className="absolute inset-0 p-6 rounded-3xl bg-gradient-to-br from-surface to-base ring-1 ring-violet/30 shadow-[var(--shadow-glow-violet)] flex flex-col items-center"
            >
              {!flipped ? (
                <>
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-violet to-violet-light flex items-center justify-center font-display font-bold text-3xl ring-4 ring-violet/30 shadow-[var(--shadow-glow-violet)]">
                    {d.photo}
                  </div>
                  <div className="flex items-center gap-1.5 mt-3">
                    <Star className="w-4 h-4 text-warning fill-warning" />
                    <span className="font-mono font-semibold">{d.rating}</span>
                    <span className="text-text-secondary text-sm">
                      · {d.trips} trips
                    </span>
                  </div>
                  <div className="mt-5">
                    <TrustGauge score={d.trustScore} size={150} />
                  </div>
                  <div className="grid grid-cols-3 gap-3 w-full mt-5">
                    <Stat label="ETA" value={`${d.etaMin} min`} Icon={Clock} />
                    <Stat label="Distance" value={`${d.distanceKm} km`} Icon={Car} />
                    <Stat label="Active" value={`${d.yearsActive}y`} Icon={Award} />
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-display font-bold text-lg mb-3">
                    Behavior analysis
                  </h3>
                  <div className="w-full space-y-3">
                    {[
                      { label: "Smooth braking", v: 96 },
                      { label: "Lane discipline", v: 91 },
                      { label: "Avg. speed compliance", v: 88 },
                      { label: "On-time arrivals", v: 94 },
                      { label: "Cancellation rate", v: 12, invert: true },
                    ].map((m) => (
                      <div key={m.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-text-secondary">{m.label}</span>
                          <span className="font-mono font-semibold">{m.v}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-surface-high overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${m.v}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${
                              m.invert ? "bg-warning" : "bg-lime"
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center gap-2 text-xs text-text-secondary pt-3">
                    <Activity className="w-3.5 h-3.5 text-violet-light" />
                    ML model · last updated 2h ago
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={() => setFlipped(!flipped)}
          className="mt-3 mx-auto flex items-center gap-1.5 text-xs text-violet-light"
        >
          <RotateCw className="w-3.5 h-3.5" />
          {flipped ? "Show driver" : "View behavior details"}
        </button>

        {/* Vehicle */}
        <div className="mt-5 p-3 rounded-2xl bg-surface ring-1 ring-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet/15 text-violet-light flex items-center justify-center">
            <Car className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">{d.vehicle}</p>
            <p className="text-xs text-text-secondary font-mono">{d.plate}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <RippleButton variant="outline" size="lg" block onClick={() => nav({ to: "/searching" })}>
            Decline
          </RippleButton>
          <RippleButton variant="lime" size="lg" block onClick={() => nav({ to: "/tracking" })}>
            Accept
          </RippleButton>
        </div>
      </div>
    </PhoneFrame>
  );
}

function Stat({
  label,
  value,
  Icon,
}: {
  label: string;
  value: string;
  Icon: typeof Star;
}) {
  return (
    <div className="text-center">
      <Icon className="w-4 h-4 mx-auto text-violet-light mb-1" />
      <p className="font-mono font-semibold text-sm">{value}</p>
      <p className="text-[10px] text-text-secondary uppercase tracking-wider">{label}</p>
    </div>
  );
}
