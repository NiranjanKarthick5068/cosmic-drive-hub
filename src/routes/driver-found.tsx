import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PhoneFrame, StatusBar } from "@/components/dl/PhoneFrame";
import { RippleButton } from "@/components/dl/RippleButton";
import { EmptyState } from "@/components/dl/EmptyState";
import { getRide } from "@/lib/rides.functions";
import { getCurrentRideId } from "@/lib/current-ride";
import { Star, Car, ArrowLeft, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/driver-found")({ component: DriverFound });

function DriverFound() {
  const nav = useNavigate();
  const rideId = getCurrentRideId();
  const get = useServerFn(getRide);
  const q = useQuery({
    queryKey: ["ride", rideId],
    queryFn: () => get({ data: { rideId: rideId! } }),
    enabled: !!rideId,
  });

  if (!rideId) {
    return (
      <PhoneFrame>
        <StatusBar />
        <div className="flex-1 flex items-center justify-center px-5">
          <EmptyState
            icon={AlertCircle}
            title="No active ride"
            body="Book a ride first."
            action={<RippleButton onClick={() => nav({ to: "/book" })}>Book</RippleButton>}
          />
        </div>
      </PhoneFrame>
    );
  }

  const d = q.data?.driver;
  const r = q.data?.ride;
  const initial = (d?.name?.[0] ?? "?").toUpperCase();

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
            Matched
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-2"
        >
          <p className="text-text-secondary text-sm">Your driver is</p>
          <h1 className="font-display font-bold text-2xl mt-1">
            {q.isLoading ? "Loading…" : (d?.name ?? "Unknown driver")}
          </h1>
        </motion.div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-violet to-violet-light flex items-center justify-center font-display font-bold text-3xl ring-4 ring-violet/30 shadow-[var(--shadow-glow-violet)]">
            {initial}
          </div>
          <div className="flex items-center gap-1.5 mt-3">
            <Star className="w-4 h-4 text-warning fill-warning" />
            <span className="font-mono font-semibold">
              {(d?.rating ?? 5).toFixed(1)}
            </span>
            <span className="text-text-secondary text-sm">
              · {d?.total_trips ?? 0} trips
            </span>
          </div>
        </div>

        {(d?.vehicle || d?.plate) && (
          <div className="mt-5 p-3 rounded-2xl bg-surface ring-1 ring-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet/15 text-violet-light flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{d?.vehicle ?? "—"}</p>
              <p className="text-xs text-text-secondary font-mono">
                {d?.plate ?? "—"}
              </p>
            </div>
            <span className="font-mono font-semibold text-sm">
              ₹{r?.fare_estimate ?? 0}
            </span>
          </div>
        )}

        <div className="flex gap-3 mt-5">
          <RippleButton variant="lime" size="lg" block onClick={() => nav({ to: "/tracking" })}>
            Track driver
          </RippleButton>
        </div>
      </div>
    </PhoneFrame>
  );
}
