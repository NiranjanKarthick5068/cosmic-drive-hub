import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/dl/AppShell";
import { fadeUp, stagger } from "@/components/dl/PageTransition";
import { EmptyState, SkeletonRow } from "@/components/dl/EmptyState";
import { RippleButton } from "@/components/dl/RippleButton";
import { useSession } from "@/hooks/use-session";
import { listMyRides } from "@/lib/rides.functions";
import { MapPin, ClipboardList } from "lucide-react";

export const Route = createFileRoute("/bookings")({ component: Bookings });

const FILTERS = ["All", "Completed", "Cancelled", "Active"] as const;

function Bookings() {
  const nav = useNavigate();
  const { user } = useSession();
  const list = useServerFn(listMyRides);
  const q = useQuery({
    queryKey: ["my-rides", user?.id],
    queryFn: () => list(),
    enabled: !!user,
  });
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const all = q.data?.rides ?? [];
  const rides = all.filter((r) => {
    if (filter === "All") return true;
    if (filter === "Completed") return r.status === "completed";
    if (filter === "Cancelled") return r.status === "cancelled";
    return ["searching", "accepted", "arriving", "started"].includes(r.status);
  });

  return (
    <AppShell>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="px-5 pt-2 pb-8 space-y-4"
      >
        <motion.h1 variants={fadeUp} className="font-display font-bold text-2xl">
          Your trips
        </motion.h1>

        <motion.div variants={fadeUp} className="flex gap-2 overflow-x-auto scrollbar-hide">
          {FILTERS.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`shrink-0 px-4 h-9 rounded-full text-xs font-semibold ${
                t === filter
                  ? "bg-violet text-white"
                  : "bg-surface ring-1 ring-border text-text-secondary"
              }`}
            >
              {t}
            </button>
          ))}
        </motion.div>

        {q.isLoading ? (
          <div className="space-y-3">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        ) : rides.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No trips here"
            body="Book your first ride to start your trip history."
            action={
              <RippleButton size="md" onClick={() => nav({ to: "/book" })}>
                Book a ride
              </RippleButton>
            }
          />
        ) : (
          <div className="space-y-3">
            {rides.map((r) => (
              <motion.div
                key={r.id}
                variants={fadeUp}
                className="p-4 rounded-2xl bg-surface ring-1 ring-border"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-text-secondary">
                    {new Date(r.created_at).toLocaleString()}
                  </span>
                  <span className="font-mono font-semibold">
                    ₹{r.fare_final ?? r.fare_estimate ?? 0}
                  </span>
                </div>
                <div className="flex gap-3">
                  <div className="flex flex-col items-center pt-1">
                    <div className="w-2 h-2 rounded-full bg-violet" />
                    <div className="w-px h-6 bg-border my-1" />
                    <div className="w-2 h-2 rounded-sm bg-lime" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{r.pickup}</p>
                    <div className="h-5" />
                    <p className="text-sm font-medium truncate">{r.drop_loc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                  <MapPin className="w-3 h-3 text-text-secondary" />
                  <span className="text-xs flex-1 capitalize text-text-secondary">
                    {r.status} {r.car_type ? `· ${r.car_type}` : ""}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </AppShell>
  );
}
