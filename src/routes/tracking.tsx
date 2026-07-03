import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PhoneFrame, StatusBar } from "@/components/dl/PhoneFrame";
import { RippleButton } from "@/components/dl/RippleButton";
import { LiveMap, type LatLng } from "@/components/dl/LiveMap";
import { EmptyState } from "@/components/dl/EmptyState";
import { supabase } from "@/integrations/supabase/client";
import { getRide, cancelRide, triggerSos } from "@/lib/rides.functions";
import { getCurrentRideId, clearCurrentRideId } from "@/lib/current-ride";
import { Phone, ShieldAlert, Navigation, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/tracking")({
  head: () => ({
    meta: [
      { title: "Live tracking — DriverLink Pro" },
      { name: "description", content: "Follow your driver in real time on the map with live ETA updates." },
      { property: "og:title", content: "Live tracking — DriverLink Pro" },
      { property: "og:description", content: "Follow your driver in real time on the map with live ETA updates." },
      { property: "og:url", content: "https://cosmic-drive-hub.lovable.app/tracking" },
    ],
    links: [{ rel: "canonical", href: "https://cosmic-drive-hub.lovable.app/tracking" }],
  }),
  component: Tracking,
});

function Tracking() {
  const nav = useNavigate();
  const rideId = getCurrentRideId();
  const get = useServerFn(getRide);
  const cancel = useServerFn(cancelRide);
  const sos = useServerFn(triggerSos);

  const q = useQuery({
    queryKey: ["ride", rideId],
    queryFn: () => get({ data: { rideId: rideId! } }),
    enabled: !!rideId,
    refetchInterval: 4_000,
  });

  const [driverPos, setDriverPos] = useState<LatLng | null>(null);

  // subscribe to driver_locations for THIS driver
  const driverId = q.data?.ride?.driver_id;
  useEffect(() => {
    if (!driverId) return;
    const ch = supabase
      .channel(`drv:${driverId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "driver_locations",
          filter: `driver_id=eq.${driverId}`,
        },
        (payload) => {
          const row = payload.new as { lat: number; lng: number } | null;
          if (row?.lat && row?.lng) setDriverPos({ lat: row.lat, lng: row.lng });
        },
      )
      .subscribe();
    // also fetch initial location
    supabase
      .from("driver_locations")
      .select("lat, lng")
      .eq("driver_id", driverId)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.lat && data?.lng) setDriverPos({ lat: data.lat, lng: data.lng });
      });
    return () => {
      supabase.removeChannel(ch);
    };
  }, [driverId]);

  // auto-navigate on completion
  useEffect(() => {
    if (q.data?.ride?.status === "completed") {
      const t = setTimeout(() => nav({ to: "/ride-complete" }), 800);
      return () => clearTimeout(t);
    }
  }, [q.data?.ride?.status, nav]);

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

  const ride = q.data?.ride;
  const driver = q.data?.driver;
  const initial = (driver?.name?.[0] ?? "?").toUpperCase();

  const pickup: LatLng | null =
    ride?.pickup_lat && ride?.pickup_lng
      ? { lat: ride.pickup_lat, lng: ride.pickup_lng }
      : null;
  const drop: LatLng | null =
    ride?.drop_lat && ride?.drop_lng
      ? { lat: ride.drop_lat, lng: ride.drop_lng }
      : null;

  const onCancel = async () => {
    try {
      await cancel({ data: { rideId } });
      clearCurrentRideId();
      nav({ to: "/home" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not cancel");
    }
  };

  const onSos = async () => {
    if (!driverPos && !pickup) {
      toast.error("No location yet");
      return;
    }
    const loc = driverPos ?? pickup!;
    try {
      await sos({ data: { rideId, lat: loc.lat, lng: loc.lng } });
      toast.success("Emergency alert sent");
    } catch {
      toast.error("Could not send alert");
    }
  };

  return (
    <PhoneFrame>
      <StatusBar />
      <div className="relative flex-1 flex flex-col overflow-hidden">
        {pickup && drop ? (
          <LiveMap pickup={pickup} drop={drop} driver={driverPos} className="absolute inset-0" />
        ) : (
          <div className="absolute inset-0 bg-surface" />
        )}

        {driverPos && (
          <div className="absolute top-16 left-5 z-30 px-2 py-1 rounded-md bg-lime/20 ring-1 ring-lime/40 text-[10px] font-bold uppercase tracking-wider text-lime">
            ● Live
          </div>
        )}

        <button
          onClick={onSos}
          className="absolute top-16 right-5 z-30 w-12 h-12 rounded-full bg-danger text-white shadow-[var(--shadow-glow-danger)] flex items-center justify-center ring-2 ring-danger/40"
        >
          <ShieldAlert className="w-5 h-5" />
        </button>

        <motion.div
          initial={{ y: 200 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 28, delay: 0.2 }}
          className="relative mt-auto glass rounded-t-[2rem] p-5 pb-8 z-20"
        >
          <div className="w-12 h-1.5 rounded-full bg-border mx-auto mb-4" />
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet to-violet-light flex items-center justify-center font-display font-bold text-lg ring-2 ring-violet/40">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold">{driver?.name ?? "Driver"}</p>
              <p className="text-xs text-text-secondary font-mono">
                {driver?.vehicle ?? "—"} · {driver?.plate ?? "—"}
              </p>
            </div>
            <a
              href={driver?.id ? `tel:${driver.id}` : "#"}
              className="w-11 h-11 rounded-full bg-lime text-base flex items-center justify-center"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-surface ring-1 ring-border">
              <p className="text-[10px] uppercase tracking-wider text-text-secondary">
                Fare
              </p>
              <p className="font-display font-bold text-2xl tabular-nums mt-1">
                ₹{ride?.fare_estimate ?? 0}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-surface ring-1 ring-border">
              <p className="text-[10px] uppercase tracking-wider text-text-secondary">
                Status
              </p>
              <p className="font-display font-bold text-base mt-1 flex items-center gap-1.5 capitalize">
                <Navigation className="w-4 h-4 text-violet-light" />
                {ride?.status ?? "—"}
              </p>
            </div>
          </div>

          {ride?.status !== "completed" && (
            <RippleButton
              variant="outline"
              size="md"
              block
              className="mt-4"
              onClick={onCancel}
            >
              Cancel ride
            </RippleButton>
          )}
        </motion.div>
      </div>
    </PhoneFrame>
  );
}
