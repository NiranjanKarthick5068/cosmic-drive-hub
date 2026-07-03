import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PhoneFrame, StatusBar } from "@/components/dl/PhoneFrame";
import { SearchPulse } from "@/components/dl/SearchPulse";
import { RippleButton } from "@/components/dl/RippleButton";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { cancelRide } from "@/lib/rides.functions";
import { getCurrentRideId, clearCurrentRideId } from "@/lib/current-ride";
import { toast } from "sonner";

export const Route = createFileRoute("/searching")({
  head: () => ({
    meta: [
      { title: "Finding a driver — DriverLink Pro" },
      { name: "description", content: "We're matching you with the nearest verified DriverLink Pro driver." },
      { property: "og:title", content: "Finding a driver — DriverLink Pro" },
      { property: "og:description", content: "We're matching you with the nearest verified DriverLink Pro driver." },
      { property: "og:url", content: "https://cosmic-drive-hub.lovable.app/searching" },
    ],
    links: [{ rel: "canonical", href: "https://cosmic-drive-hub.lovable.app/searching" }],
  }),
  component: Searching,
});

function Searching() {
  const nav = useNavigate();
  const rideId = getCurrentRideId();
  const cancel = useServerFn(cancelRide);
  const [phase, setPhase] = useState("Broadcasting your request…");

  useEffect(() => {
    if (!rideId) {
      nav({ to: "/book" });
      return;
    }
    const ch = supabase
      .channel(`ride:${rideId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "rides", filter: `id=eq.${rideId}` },
        (payload) => {
          const next = payload.new as { status: string };
          if (next.status === "accepted") {
            setPhase("Driver found! Loading…");
            setTimeout(() => nav({ to: "/driver-found" }), 600);
          } else if (next.status === "cancelled") {
            clearCurrentRideId();
            nav({ to: "/book" });
          }
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [rideId, nav]);

  const onCancel = async () => {
    if (!rideId) {
      nav({ to: "/book" });
      return;
    }
    try {
      await cancel({ data: { rideId, reason: "owner_cancel" } });
      clearCurrentRideId();
      nav({ to: "/book" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not cancel");
    }
  };

  return (
    <PhoneFrame>
      <StatusBar />
      <div className="relative flex-1 flex flex-col overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="oklch(0.22 0.04 282)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="relative flex-1 flex flex-col items-center justify-center">
          <SearchPulse />
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center"
          >
            <p className="font-display font-bold text-lg">{phase}</p>
            <p className="text-xs text-text-secondary mt-2">
              Notifying nearby online drivers
            </p>
          </motion.div>
        </div>
        <div className="relative p-5">
          <RippleButton variant="outline" size="lg" block onClick={onCancel}>
            Cancel search
          </RippleButton>
        </div>
      </div>
    </PhoneFrame>
  );
}
