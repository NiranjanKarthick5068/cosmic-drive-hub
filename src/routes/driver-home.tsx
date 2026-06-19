import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/dl/AppShell";
import { fadeUp, stagger } from "@/components/dl/PageTransition";
import { RippleButton } from "@/components/dl/RippleButton";
import { CountUp } from "@/components/dl/CountUp";
import { EmptyState, SkeletonRow } from "@/components/dl/EmptyState";
import {
  upsertDriverLocation,
  goOffline,
  listOpenRides,
  getDriverEarnings,
  acceptRide,
} from "@/lib/rides.functions";
import { setCurrentRideId } from "@/lib/current-ride";
import { supabase } from "@/integrations/supabase/client";
import { Power, Zap, TrendingUp, MapPin, IndianRupee } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/driver-home")({ component: DriverHome });

function DriverHome() {
  const nav = useNavigate();
  const [online, setOnline] = useState(false);
  const upsert = useServerFn(upsertDriverLocation);
  const offline = useServerFn(goOffline);
  const list = useServerFn(listOpenRides);
  const earn = useServerFn(getDriverEarnings);
  const accept = useServerFn(acceptRide);
  const watchRef = useRef<number | null>(null);

  const earnings = useQuery({
    queryKey: ["driver-earnings"],
    queryFn: () => earn(),
    refetchInterval: 15_000,
  });

  const open = useQuery({
    queryKey: ["open-rides"],
    queryFn: () => list(),
    enabled: online,
    refetchInterval: 4_000,
  });

  // realtime: refresh open rides on inserts
  useEffect(() => {
    if (!online) return;
    const ch = supabase
      .channel("open-rides-stream")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rides" },
        () => open.refetch(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [online, open]);

  useEffect(() => {
    if (!online) {
      if (watchRef.current != null && "geolocation" in navigator) {
        navigator.geolocation.clearWatch(watchRef.current);
        watchRef.current = null;
      }
      offline().catch(() => {});
      return;
    }
    if (!("geolocation" in navigator)) {
      toast.error("Geolocation unavailable");
      setOnline(false);
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
      { enableHighAccuracy: true, maximumAge: 3000 },
    );
    return () => {
      if (watchRef.current != null)
        navigator.geolocation.clearWatch(watchRef.current);
    };
  }, [online, upsert, offline]);

  const pickRide = async (rideId: string) => {
    try {
      await accept({ data: { rideId } });
      setCurrentRideId(rideId);
      nav({ to: "/tracking" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not accept");
      open.refetch();
    }
  };

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
            <h1 className="font-display font-bold text-2xl">Hello, driver</h1>
          </div>
          <button
            onClick={() => nav({ to: "/home" })}
            className="text-xs text-violet-light font-semibold"
          >
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
              ? "Sharing your live location · receiving ride requests"
              : "Tap to start receiving rides"}
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
          <Stat Icon={Zap} label="Today ₹" value={earnings.data?.today ?? 0} color="text-lime" />
          <Stat Icon={TrendingUp} label="Week ₹" value={earnings.data?.week ?? 0} color="text-violet-light" />
          <Stat Icon={IndianRupee} label="Trips" value={earnings.data?.trips ?? 0} color="text-warning" />
        </motion.div>

        <motion.div variants={fadeUp}>
          <p className="font-display font-bold mb-3">Nearby ride requests</p>
          {!online ? (
            <EmptyState
              icon={Power}
              title="You're offline"
              body="Go online to see live ride requests near you."
            />
          ) : open.isLoading ? (
            <div className="space-y-2">
              <SkeletonRow />
              <SkeletonRow />
            </div>
          ) : (open.data?.rides ?? []).length === 0 ? (
            <EmptyState
              icon={MapPin}
              title="No requests yet"
              body="Waiting for nearby riders to book…"
            />
          ) : (
            <div className="space-y-2">
              {(open.data?.rides ?? []).map((r) => (
                <button
                  key={r.id}
                  onClick={() => pickRide(r.id)}
                  className="w-full text-left p-4 rounded-2xl bg-gradient-to-br from-violet/15 to-surface ring-1 ring-violet/30 active:scale-[0.99] transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-violet/20 text-violet-light text-[10px] font-bold uppercase tracking-wider">
                      New
                    </span>
                    <span className="font-display font-bold text-xl tabular-nums">
                      ₹{r.fare_estimate ?? 0}
                    </span>
                  </div>
                  <p className="text-sm font-medium truncate">{r.pickup}</p>
                  <p className="text-xs text-text-secondary truncate">→ {r.drop_loc}</p>
                  <p className="text-[11px] text-lime mt-2 font-semibold">
                    Tap to accept
                  </p>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AppShell>
  );
}

function Stat({
  Icon,
  label,
  value,
  color,
}: {
  Icon: typeof Zap;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="p-3 rounded-2xl bg-surface ring-1 ring-border">
      <Icon className={`w-4 h-4 mb-2 ${color}`} />
      <p className="font-display font-bold text-base tabular-nums">
        <CountUp to={value} />
      </p>
      <p className="text-[10px] text-text-secondary">{label}</p>
    </div>
  );
}
