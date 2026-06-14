import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneFrame, StatusBar } from "@/components/dl/PhoneFrame";
import { RippleButton } from "@/components/dl/RippleButton";
import { LiveMap, type LatLng } from "@/components/dl/LiveMap";
import { mockDrivers } from "@/lib/mock";
import { supabase } from "@/integrations/supabase/client";
import { Phone, ShieldAlert, AlertTriangle, X, Navigation } from "lucide-react";

export const Route = createFileRoute("/tracking")({ component: Tracking });

// Connaught Place → IGI T3 (demo coords)
const PICKUP: LatLng = { lat: 28.6315, lng: 77.2167 };
const DROP: LatLng = { lat: 28.5562, lng: 77.0999 };

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function Tracking() {
  const nav = useNavigate();
  const d = mockDrivers[0];
  const [eta, setEta] = useState(d.etaMin * 60);
  const [anomaly, setAnomaly] = useState(false);
  const [driverPos, setDriverPos] = useState<LatLng>(PICKUP);
  const [usingReal, setUsingReal] = useState(false);

  // Realtime: subscribe to live driver_locations updates (any driver)
  useEffect(() => {
    const ch = supabase
      .channel("driver_locations_live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "driver_locations" },
        (payload) => {
          const row = payload.new as { lat: number; lng: number } | null;
          if (row?.lat && row?.lng) {
            setUsingReal(true);
            setDriverPos({ lat: row.lat, lng: row.lng });
          }
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  // Fallback simulation when no real driver is broadcasting
  useEffect(() => {
    if (usingReal) return;
    let progress = 0;
    const i = setInterval(() => {
      progress = Math.min(1, progress + 0.04);
      setDriverPos({
        lat: lerp(PICKUP.lat, DROP.lat, progress),
        lng: lerp(PICKUP.lng, DROP.lng, progress),
      });
      setEta((e) => Math.max(0, e - 5));
      if (progress >= 1) clearInterval(i);
    }, 800);
    return () => clearInterval(i);
  }, [usingReal]);

  useEffect(() => {
    const a = setTimeout(() => setAnomaly(true), 5500);
    return () => clearTimeout(a);
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
        <LiveMap
          pickup={PICKUP}
          drop={DROP}
          driver={driverPos}
          className="absolute inset-0"
        />

        {usingReal && (
          <div className="absolute top-16 left-5 z-30 px-2 py-1 rounded-md bg-lime/20 ring-1 ring-lime/40 text-[10px] font-bold uppercase tracking-wider text-lime">
            ● Live
          </div>
        )}

        <button className="absolute top-16 right-5 z-30 w-12 h-12 rounded-full bg-danger text-white shadow-[var(--shadow-glow-danger)] flex items-center justify-center ring-2 ring-danger/40">
          <ShieldAlert className="w-5 h-5" />
        </button>

        <AnimatePresence>
          {anomaly && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100 }}
              className="absolute top-28 left-5 right-20 z-30 p-3 rounded-2xl bg-danger/20 ring-1 ring-danger/50 backdrop-blur-md flex items-center gap-2"
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

        <motion.div
          initial={{ y: 200 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 28, delay: 0.2 }}
          className="relative mt-auto glass rounded-t-[2rem] p-5 pb-8 z-20"
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
