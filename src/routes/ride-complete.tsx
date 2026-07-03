import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PhoneFrame, StatusBar } from "@/components/dl/PhoneFrame";
import { RippleButton } from "@/components/dl/RippleButton";
import { CountUp } from "@/components/dl/CountUp";
import { getRide } from "@/lib/rides.functions";
import { getCurrentRideId, clearCurrentRideId } from "@/lib/current-ride";
import { Check, Star } from "lucide-react";

export const Route = createFileRoute("/ride-complete")({
  head: () => ({
    meta: [
      { title: "Ride complete — DriverLink Pro" },
      { name: "description", content: "Rate your driver and view the trip summary for your DriverLink Pro ride." },
      { property: "og:title", content: "Ride complete — DriverLink Pro" },
      { property: "og:description", content: "Rate your driver and view the trip summary for your DriverLink Pro ride." },
      { property: "og:url", content: "https://cosmic-drive-hub.lovable.app/ride-complete" },
    ],
    links: [{ rel: "canonical", href: "https://cosmic-drive-hub.lovable.app/ride-complete" }],
  }),
  component: RideComplete,
});

function RideComplete() {
  const nav = useNavigate();
  const rideId = getCurrentRideId();
  const get = useServerFn(getRide);
  const q = useQuery({
    queryKey: ["ride", rideId],
    queryFn: () => get({ data: { rideId: rideId! } }),
    enabled: !!rideId,
  });
  const [rating, setRating] = useState(0);
  const [confetti, setConfetti] = useState<{ x: number; y: number; c: string; r: number }[]>([]);

  useEffect(() => {
    const colors = ["#7C3AED", "#A3E635", "#FF9900", "#9F67FF"];
    setConfetti(
      Array.from({ length: 60 }, () => ({
        x: Math.random() * 100,
        y: -10 - Math.random() * 30,
        c: colors[Math.floor(Math.random() * colors.length)],
        r: Math.random() * 360,
      })),
    );
  }, []);

  const ride = q.data?.ride;
  const driver = q.data?.driver;
  const fare = ride?.fare_final ?? ride?.fare_estimate ?? 0;

  const finish = () => {
    clearCurrentRideId();
    nav({ to: "/home" });
  };

  return (
    <PhoneFrame>
      <StatusBar />
      <div className="relative flex-1 flex flex-col px-5 pt-2 pb-6 overflow-hidden">
        {confetti.map((c, i) => (
          <motion.div
            key={i}
            initial={{ y: `${c.y}vh`, x: `${c.x}vw`, opacity: 1, rotate: 0 }}
            animate={{ y: "110vh", rotate: c.r + 720 }}
            transition={{ duration: 2.4 + Math.random() * 1.5, ease: "easeIn" }}
            className="absolute w-2 h-3 rounded-sm pointer-events-none"
            style={{ backgroundColor: c.c }}
          />
        ))}

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.1 }}
          className="mx-auto mt-6 w-24 h-24 rounded-full bg-lime flex items-center justify-center shadow-[var(--shadow-glow-lime)]"
        >
          <Check className="w-12 h-12 text-base" strokeWidth={3.5} />
        </motion.div>

        <div className="text-center mt-5">
          <h1 className="font-display font-bold text-2xl">Ride complete</h1>
          <p className="font-display font-bold text-5xl mt-2 tabular-nums">
            ₹<CountUp to={fare} duration={1.2} />
          </p>
          <p className="text-text-secondary text-sm mt-1">
            {ride?.distance_km ? `${ride.distance_km.toFixed(1)} km` : ""}
            {ride?.duration_min ? ` · ${Math.round(ride.duration_min)} min` : ""}
            {driver?.name ? ` · ${driver.name}` : ""}
          </p>
        </div>

        <div className="mt-8">
          <p className="text-center text-sm text-text-secondary mb-3">
            How was your ride?
          </p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setRating(n)} className="p-1">
                <Star
                  className={`w-9 h-9 transition-all ${
                    n <= rating
                      ? "text-warning fill-warning drop-shadow-[0_0_8px_oklch(0.78_0.18_65)]"
                      : "text-border"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <RippleButton size="lg" block className="mt-auto" onClick={finish}>
          Done
        </RippleButton>
      </div>
    </PhoneFrame>
  );
}
